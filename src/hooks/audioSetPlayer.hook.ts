import { useState, useEffect, useCallback, useRef } from 'react';

interface AudioHookState {
  isLoading: boolean;
  loadingProgress: number;
  error: Error | null;
  currentlyPlaying: number | null;
  isPlaying: boolean;
  isLooping: boolean;
}

interface CachedAudio {
  buffer: AudioBuffer;
  lastUsed: number;
}

interface UseAudioPlayerReturn extends AudioHookState {
  play: (index: number) => void;
  pause: () => void;
  stop: () => void;
  toggleLoop: () => void;
}

const MAX_DECODED_FILES = 3;
const BATCH_SIZE = 3;

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
  const audioBufferCacheRef = useRef<Map<number, CachedAudio>>(new Map());
  const audioDataRef = useRef<Map<number, ArrayBuffer>>(new Map());
  const startTimeRef = useRef<number>(0);
  const pausedAtRef = useRef<number | null>(null);
  const playedDurationRef = useRef<number>(0);
  const unmountingRef = useRef(false);
  const currentBufferDurationRef = useRef<number>(0);

  const loadBatch = useCallback(async (urls: string[], startIndex: number) => {
    const batchPromises = urls.map(async (url, index) => {
      try {
        const response = await fetch(url);
        const arrayBuffer = await response.arrayBuffer();
        audioDataRef.current.set(startIndex + index, arrayBuffer);
        return true;
      } catch (error) {
        console.error(`Error loading file ${startIndex + index}:`, error);
        return false;
      }
    });

    return Promise.all(batchPromises);
  }, []);

  const preloadAudioFiles = useCallback(async () => {
    const urls = getUrls();
    if (urls.length === 0) return;

    setState(prev => ({ ...prev, isLoading: true }));
    
    try {
      const totalBatches = Math.ceil(urls.length / BATCH_SIZE);
      let loadedFiles = 0;

      for (let batchIndex = 0; batchIndex < totalBatches; batchIndex++) {
        const startIndex = batchIndex * BATCH_SIZE;
        const batchUrls = urls.slice(startIndex, startIndex + BATCH_SIZE);
        
        const batchResults = await loadBatch(batchUrls, startIndex);
        loadedFiles += batchResults.filter(Boolean).length;
        
        setState(prev => ({
          ...prev,
          loadingProgress: (loadedFiles / urls.length) * 100
        }));
      }

      setState(prev => ({ ...prev, isLoading: false }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error : new Error('Failed to load audio'),
        isLoading: false
      }));
    }
  }, [getUrls, loadBatch]);

  const ensureAudioContext = useCallback(async () => {
    if (!audioContextRef.current || audioContextRef.current.state === 'closed') {
      audioContextRef.current = new AudioContext();
    }
    if (audioContextRef.current.state === 'suspended') {
      await audioContextRef.current.resume();
    }
    return audioContextRef.current;
  }, []);

  const removeOldestCache = useCallback(() => {
    if (audioBufferCacheRef.current.size < MAX_DECODED_FILES) return;

    let oldestTime = Infinity;
    let oldestIndex = -1;

    audioBufferCacheRef.current.forEach((cache, index) => {
      if (cache.lastUsed < oldestTime && index !== state.currentlyPlaying) {
        oldestTime = cache.lastUsed;
        oldestIndex = index;
      }
    });

    if (oldestIndex !== -1) {
      audioBufferCacheRef.current.delete(oldestIndex);
    }
  }, [state.currentlyPlaying]);

  const getAudioBuffer = useCallback(async (index: number) => {
    const context = await ensureAudioContext();

    const cachedAudio = audioBufferCacheRef.current.get(index);
    if (cachedAudio) {
      cachedAudio.lastUsed = Date.now();
      return cachedAudio.buffer;
    }

    const arrayBuffer = audioDataRef.current.get(index);
    if (!arrayBuffer) {
      throw new Error(`No audio data found for index ${index}`);
    }

    removeOldestCache();
    
    const buffer = await context.decodeAudioData(arrayBuffer.slice(0));
    audioBufferCacheRef.current.set(index, {
      buffer,
      lastUsed: Date.now()
    });

    return buffer;
  }, [ensureAudioContext, removeOldestCache]);

  const calculateLoopAdjustedTime = useCallback((rawTime: number, bufferDuration: number) => {
    return state.isLooping ? rawTime % bufferDuration : rawTime;
  }, [state.isLooping]);

  const play = useCallback(async (index: number) => {
    try {
      const buffer = await getAudioBuffer(index);
      const context = await ensureAudioContext();
      
      if (!buffer || context.state === 'closed') return;

      const isResuming = state.currentlyPlaying === index && pausedAtRef.current !== null;

      if (state.currentlyPlaying !== null && sourceNodesRef.current[state.currentlyPlaying]) {
        sourceNodesRef.current[state.currentlyPlaying].stop();
        gainNodesRef.current[state.currentlyPlaying].disconnect();
      }

      const sourceNode = context.createBufferSource();
      const gainNode = context.createGain();

      sourceNode.buffer = buffer;
      sourceNode.loop = state.isLooping;

      sourceNode.connect(gainNode);
      gainNode.connect(context.destination);

      currentBufferDurationRef.current = buffer.duration;

      if (state.isLooping) {
        sourceNode.loopEnd = buffer.duration - crossfadeDuration;
      }

      sourceNodesRef.current[index] = sourceNode;
      gainNodesRef.current[index] = gainNode;

      const now = context.currentTime;
      gainNode.gain.setValueAtTime(0, now);
      gainNode.gain.linearRampToValueAtTime(1, now + crossfadeDuration);

      let startOffset = 0;
      if (isResuming && pausedAtRef.current !== null) {
        startOffset = calculateLoopAdjustedTime(pausedAtRef.current, buffer.duration);
      }

      startTimeRef.current = now - startOffset;
      sourceNode.start(0, startOffset);

      setState(prev => ({
        ...prev,
        currentlyPlaying: index,
        isPlaying: true
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error : new Error('Failed to play audio')
      }));
    }
  }, [state.isLooping, ensureAudioContext, getAudioBuffer, calculateLoopAdjustedTime]);

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
    preloadAudioFiles();
    return () => {
      unmountingRef.current = true;
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, [preloadAudioFiles]);

  return {
    ...state,
    play,
    pause,
    stop,
    toggleLoop,
  };
};