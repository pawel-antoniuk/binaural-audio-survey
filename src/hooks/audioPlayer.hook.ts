import { useState, useEffect, useRef, useCallback } from 'react';

interface AudioPlayerState {
  isLoading: boolean;
  isPlaying: boolean;
  error: string | null;
  duration: number;
  currentTime: number;
  isLooping: boolean;
}

interface AudioPlayerControls {
  play: (offset?: number | null) => Promise<void>;
  pause: () => void;
  seek: (time: number) => void;
  setLooping: (loop: boolean) => void;
}

interface AudioPlayerHookReturn extends AudioPlayerState, AudioPlayerControls { }

class AudioError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'AudioError';
  }
}

const FADE_DURATION = 0.1;

const useAudioPlayer = (audioUrl: string | null): AudioPlayerHookReturn => {
  const audioContextRef = useRef<AudioContext | null>(null);
  const sourceNodeRef = useRef<AudioBufferSourceNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const audioBufferRef = useRef<AudioBuffer | null>(null);
  const startTimeRef = useRef<number>(0);
  const startOffsetRef = useRef<number>(0);
  const scheduledStopTimeRef = useRef<number | null>(null);

  const [state, setState] = useState<AudioPlayerState>({
    isLoading: true,
    isPlaying: false,
    error: null,
    duration: 0,
    currentTime: 0,
    isLooping: true
  });

  const setPartialState = useCallback((partial: Partial<AudioPlayerState>) => {
    setState(prev => ({ ...prev, ...partial }));
  }, []);

  // Initialize audio context and gain node
  useEffect(() => {
    try {
      const AudioContextClass = (window.AudioContext || 
        (window as any).webkitAudioContext) as typeof AudioContext;      
      audioContextRef.current = new AudioContextClass();
      gainNodeRef.current = audioContextRef.current.createGain();
      gainNodeRef.current.connect(audioContextRef.current.destination);
      gainNodeRef.current.gain.value = 0; // Start with volume at 0
    } catch (err) {
      setPartialState({
        error: 'Web Audio API is not supported in this browser.',
        isLoading: false
      });
    }

    return () => {
      if (audioContextRef.current?.state !== 'closed') {
        audioContextRef.current?.close();
      }
    };
  }, [setPartialState]);

  // Load audio file
  useEffect(() => {
    const loadAudio = async () => {
      if (!audioUrl || !audioContextRef.current) return;

      try {
        setPartialState({ isLoading: true, error: null });

        const response = await fetch(audioUrl);
        if (!response.ok) {
          throw new AudioError(`HTTP error! status: ${response.status}`);
        }

        const arrayBuffer = await response.arrayBuffer();
        const audioBuffer = await audioContextRef.current.decodeAudioData(arrayBuffer);

        audioBufferRef.current = audioBuffer;
        setPartialState({
          isLoading: false,
          duration: audioBuffer.duration
        });
      } catch (err) {
        setPartialState({
          error: err instanceof Error ? err.message : 'Failed to load audio',
          isLoading: false
        });
      }
    };

    loadAudio();

    return () => {
      audioBufferRef.current = null;
      startOffsetRef.current = 0;
      setPartialState({ currentTime: 0 });
    };
  }, [audioUrl, setPartialState]);

  // Update current time
  useEffect(() => {
    let animationFrame: number;

    const updateCurrentTime = () => {
      if (!state.isPlaying || !audioContextRef.current) return;

      const ctx = audioContextRef.current;

      if (scheduledStopTimeRef.current && ctx.currentTime >= scheduledStopTimeRef.current) {
        setPartialState({ currentTime: startOffsetRef.current });
        return;
      }

      const current = startOffsetRef.current + (ctx.currentTime - startTimeRef.current);
      setPartialState({ currentTime: current });

      animationFrame = requestAnimationFrame(updateCurrentTime);
    };

    if (state.isPlaying) {
      animationFrame = requestAnimationFrame(updateCurrentTime);
    }

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [state.isPlaying, setPartialState]);

  const fadeIn = useCallback((startTime: number) => {
    if (!gainNodeRef.current) return;

    const gain = gainNodeRef.current.gain;
    gain.cancelScheduledValues(startTime);
    gain.setValueAtTime(0, startTime);
    
    gain.setTargetAtTime(1, startTime, FADE_DURATION / 3);
  }, []);

  const fadeOut = useCallback((startTime: number) => {
    if (!gainNodeRef.current) return;

    const gain = gainNodeRef.current.gain;
    gain.cancelScheduledValues(startTime);
    gain.setTargetAtTime(0, startTime, FADE_DURATION / 3);
  }, []);

  const play = useCallback(async (offset: number | null = null) => {
    const ctx = audioContextRef.current;
    const buffer = audioBufferRef.current;
    const gainNode = gainNodeRef.current;

    if (!ctx || !buffer || !gainNode) {
      throw new AudioError('Audio context, buffer, or gain node not initialized');
    }

    if (ctx.state === 'suspended') {
      await ctx.resume();
    }

    if (sourceNodeRef.current) {
      sourceNodeRef.current.stop();
      sourceNodeRef.current.disconnect();
    }

    const source = ctx.createBufferSource();
    source.buffer = buffer;
    source.loop = state.isLooping;
    source.connect(gainNode);

    source.onended = () => {
      if (scheduledStopTimeRef.current) {
        scheduledStopTimeRef.current = null;
      } else if (!state.isLooping) {
        startOffsetRef.current = 0;
        setPartialState({ currentTime: 0, isPlaying: false });
      }
      sourceNodeRef.current = null;
    };

    const playOffset = (offset !== null ? offset : startOffsetRef.current) % buffer.duration;
    startTimeRef.current = ctx.currentTime;
    startOffsetRef.current = playOffset;
    
    // Start playback and fade in
    source.start(0, playOffset);
    fadeIn(ctx.currentTime);

    sourceNodeRef.current = source;
    scheduledStopTimeRef.current = null;
    setPartialState({ isPlaying: true });
  }, [state.isLooping, setPartialState, fadeIn]);

  const pause = useCallback(() => {
    if (!sourceNodeRef.current || !audioContextRef.current) return;

    const ctx = audioContextRef.current;
    const stopTime = ctx.currentTime + FADE_DURATION;

    fadeOut(ctx.currentTime);

    sourceNodeRef.current.stop(stopTime);
    startOffsetRef.current += stopTime - startTimeRef.current;
    scheduledStopTimeRef.current = stopTime;

    setPartialState({ isPlaying: false });
  }, [setPartialState, fadeOut]);

  const seek = useCallback((time: number) => {
    const wasPlaying = state.isPlaying;
    if (wasPlaying) {
      pause();
    }

    startOffsetRef.current = Math.max(0, Math.min(time, state.duration));
    setPartialState({ currentTime: startOffsetRef.current });

    if (wasPlaying) {
      play(startOffsetRef.current).catch(err => {
        setPartialState({ error: err.message });
      });
    }
  }, [state.isPlaying, state.duration, play, pause, setPartialState]);

  const setLooping = useCallback((loop: boolean) => {
    setPartialState({ isLooping: loop });
    if (sourceNodeRef.current) {
      sourceNodeRef.current.loop = loop;
    }
  }, [setPartialState]);

  return {
    ...state,
    play,
    pause,
    seek,
    setLooping
  };
};

export default useAudioPlayer;