import { useState, useEffect, useCallback, useRef } from 'react';

interface AudioHookState {
  isLoading: boolean;
  loadingProgress: number;
  error: Error | null;
  currentlyPlaying: number | null;
  isPlaying: boolean;
  isLooping: boolean;
}

interface UseAudioPlayerReturn extends AudioHookState {
  play: (index: number) => void;
  pause: () => void;
  stop: () => void;
  toggleLoop: () => void;
}

export const useAudioSetPlayer = (
  getUrls: () => string[],
  crossfadeDuration: number = 0.1
): UseAudioPlayerReturn => {
  const [state, setState] = useState<AudioHookState>({
    isLoading: true,
    loadingProgress: 0,
    error: null,
    currentlyPlaying: null,
    isPlaying: false,
    isLooping: true
  });

  const audioContextRef = useRef<AudioContext | null>(null);
  const sourceNodesRef = useRef<AudioBufferSourceNode[]>([]);
  const gainNodesRef = useRef<GainNode[]>([]);
  const audioBuffersRef = useRef<AudioBuffer[]>([]);
  const audioDataRef = useRef<ArrayBuffer[]>([]);
  const startTimeRef = useRef<number>(0);
  const pausedAtRef = useRef<number | null>(null);
  const playedDurationRef = useRef<number>(0);
  const unmountingRef = useRef(false);
  const currentBufferDurationRef = useRef<number>(0);

  // Separate function to fetch audio files
  const preloadAudioFiles = useCallback(async () => {
    const urls = getUrls();
    setState(prev => ({ ...prev, isLoading: true }));
    
    try {
      const totalFiles = urls.length;
      let loadedFiles = 0;

      const fetchPromises = urls.map(async (url) => {
        const response = await fetch(url);
        const arrayBuffer = await response.arrayBuffer();
        loadedFiles++;
        setState(prev => ({
          ...prev,
          loadingProgress: (loadedFiles / totalFiles) * 100
        }));
        return arrayBuffer;
      });

      audioDataRef.current = await Promise.all(fetchPromises);
      setState(prev => ({ ...prev, isLoading: false }));
    } catch (error) {
      console.error('Error preloading audio files:', error);
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error : new Error('Failed to load audio'),
        isLoading: false
      }));
    }
  }, [getUrls]);

  // Start preloading immediately
  useEffect(() => {
    preloadAudioFiles();
  }, [preloadAudioFiles]);

  const ensureAudioContext = useCallback(async () => {
    if (!audioContextRef.current || audioContextRef.current.state === 'closed') {
      audioContextRef.current = new AudioContext();
    }

    if (audioContextRef.current.state === 'suspended') {
      try {
        await audioContextRef.current.resume();
      } catch (error) {
        console.error('Failed to resume AudioContext:', error);
      }
    }

    return audioContextRef.current;
  }, []);

  const decodeAudioData = useCallback(async () => {
    const context = await ensureAudioContext();
    
    if (audioBuffersRef.current.length === 0 && audioDataRef.current.length > 0) {
      try {
        const bufferPromises = audioDataRef.current.map(data => 
          context.decodeAudioData(data.slice(0))
        );
        audioBuffersRef.current = await Promise.all(bufferPromises);
      } catch (error) {
        console.error('Error decoding audio data:', error);
        setState(prev => ({
          ...prev,
          error: error instanceof Error ? error : new Error('Failed to decode audio')
        }));
      }
    }
  }, [ensureAudioContext]);

  const calculateLoopAdjustedTime = useCallback((rawTime: number, bufferDuration: number) => {
    if (!state.isLooping) return rawTime;
    return rawTime % bufferDuration;
  }, [state.isLooping]);

  const createSourceNode = useCallback((buffer: AudioBuffer, isLooping: boolean) => {
    if (!audioContextRef.current || audioContextRef.current.state === 'closed') return null;

    const sourceNode = audioContextRef.current.createBufferSource();
    const gainNode = audioContextRef.current.createGain();

    sourceNode.buffer = buffer;
    sourceNode.loop = isLooping;

    sourceNode.connect(gainNode);
    gainNode.connect(audioContextRef.current.destination);

    currentBufferDurationRef.current = buffer.duration;

    if (isLooping) {
      sourceNode.loopEnd = buffer.duration - crossfadeDuration;
      sourceNode.addEventListener('ended', () => {
        if (audioContextRef.current?.state !== 'closed') {
          gainNode.gain.setValueCurveAtTime(
            new Float32Array([1, 0]),
            audioContextRef.current!.currentTime + buffer.duration - crossfadeDuration,
            crossfadeDuration
          );
        }
      });
    }

    return { sourceNode, gainNode };
  }, [crossfadeDuration]);

  const play = useCallback(async (index: number) => {
    try {
      await decodeAudioData();
      
      if (!audioBuffersRef.current[index] || 
          !audioContextRef.current || 
          audioContextRef.current.state === 'closed') return;

      const isResuming = state.currentlyPlaying === index && pausedAtRef.current !== null;

      if (state.currentlyPlaying !== null && sourceNodesRef.current[state.currentlyPlaying]) {
        sourceNodesRef.current[state.currentlyPlaying].stop();
        gainNodesRef.current[state.currentlyPlaying].disconnect();
      }

      const nodes = createSourceNode(audioBuffersRef.current[index], state.isLooping);
      if (!nodes) return;

      const { sourceNode, gainNode } = nodes;
      sourceNodesRef.current[index] = sourceNode;
      gainNodesRef.current[index] = gainNode;

      const now = audioContextRef.current.currentTime;
      gainNode.gain.setValueAtTime(0, now);
      gainNode.gain.linearRampToValueAtTime(1, now + crossfadeDuration);

      let startOffset = 0;
      if (isResuming && pausedAtRef.current !== null) {
        startOffset = calculateLoopAdjustedTime(pausedAtRef.current, currentBufferDurationRef.current);
      }

      startTimeRef.current = now - startOffset;
      sourceNode.start(0, startOffset);

      setState(prev => ({
        ...prev,
        currentlyPlaying: index,
        isPlaying: true
      }));
    } catch (error) {
      console.error('Error playing audio:', error);
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error : new Error('Failed to play audio')
      }));
    }
  }, [state.currentlyPlaying, state.isLooping, createSourceNode, decodeAudioData, calculateLoopAdjustedTime]);

  // Rest of the functions remain the same...
  const pause = useCallback(() => {
    if (!audioContextRef.current || 
        audioContextRef.current.state === 'closed' ||
        state.currentlyPlaying === null || 
        !sourceNodesRef.current[state.currentlyPlaying]) return;

    const now = audioContextRef.current.currentTime;
    const elapsedTime = now - startTimeRef.current;
    
    const adjustedElapsedTime = calculateLoopAdjustedTime(
      elapsedTime, 
      currentBufferDurationRef.current
    );
    
    playedDurationRef.current = adjustedElapsedTime;
    pausedAtRef.current = adjustedElapsedTime;

    const gainNode = gainNodesRef.current[state.currentlyPlaying];
    gainNode.gain.setValueAtTime(gainNode.gain.value, now);
    gainNode.gain.linearRampToValueAtTime(0, now + crossfadeDuration);

    const currentPlayingIndex = state.currentlyPlaying;
    setTimeout(() => {
      if (currentPlayingIndex !== null && 
          sourceNodesRef.current[currentPlayingIndex] && 
          audioContextRef.current?.state !== 'closed') {
        sourceNodesRef.current[currentPlayingIndex].stop();
        setState(prev => ({ ...prev, isPlaying: false }));
      }
    }, crossfadeDuration * 1000);
  }, [state.currentlyPlaying, calculateLoopAdjustedTime]);

  const stop = useCallback(() => {
    if (state.currentlyPlaying === null || 
        !sourceNodesRef.current[state.currentlyPlaying] ||
        !audioContextRef.current ||
        audioContextRef.current.state === 'closed') return;

    const now = audioContextRef.current.currentTime;
    const gainNode = gainNodesRef.current[state.currentlyPlaying];
    
    gainNode.gain.setValueAtTime(gainNode.gain.value, now);
    gainNode.gain.linearRampToValueAtTime(0, now + crossfadeDuration);

    const currentPlayingIndex = state.currentlyPlaying;
    setTimeout(() => {
      if (currentPlayingIndex !== null && 
          sourceNodesRef.current[currentPlayingIndex] &&
          audioContextRef.current?.state !== 'closed') {
        sourceNodesRef.current[currentPlayingIndex].stop();
        gainNode.disconnect();
      }
      pausedAtRef.current = null;
      playedDurationRef.current = 0;
      setState(prev => ({
        ...prev,
        currentlyPlaying: null,
        isPlaying: false
      }));
    }, crossfadeDuration * 1000);
  }, [state.currentlyPlaying]);

  const toggleLoop = useCallback(() => {
    setState(prev => ({ ...prev, isLooping: !prev.isLooping }));
  }, []);

  useEffect(() => {
    unmountingRef.current = false;
    
    return () => {
      unmountingRef.current = true;
      if (audioContextRef.current && unmountingRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  return {
    ...state,
    play,
    pause,
    stop,
    toggleLoop,
  };
};