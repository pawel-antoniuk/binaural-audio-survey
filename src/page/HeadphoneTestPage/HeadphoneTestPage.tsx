import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipBack, SkipForward, Headphones } from 'lucide-react';
import styles from './HeadphoneTestPage.module.css';
import leftAudio from '../../assets/test_left.wav';
import rightAudio from '../../assets/test_right.wav';
import TextButton from '../../components/TextButton/TextButton';

interface AudioButtonProps {
  onClick: () => void;
  isPlaying: boolean;
  channel: 'left' | 'right';
}

const AudioButton: React.FC<AudioButtonProps> = ({ onClick, isPlaying, channel }) => (
  <button
    onClick={onClick}
    className={`${styles.audioButton} ${isPlaying ? styles.playing : ''}`}
    aria-label={`${isPlaying ? 'Pause' : 'Play'} ${channel} channel`}
  >
    {isPlaying ? <Pause /> : <Play />}
  </button>
);

interface HeadphoneTestPageProps {
  onNext: () => void;
  onPrevious: () => void;
}

const HeadphoneTestPage: React.FC<HeadphoneTestPageProps> = ({ onNext, onPrevious }) => {
  const [leftPlaying, setLeftPlaying] = useState<boolean>(false);
  const [rightPlaying, setRightPlaying] = useState<boolean>(false);

  const leftAudioRef = useRef<HTMLAudioElement>(new Audio(leftAudio));
  const rightAudioRef = useRef<HTMLAudioElement>(new Audio(rightAudio));

  useEffect(() => {
    leftAudioRef.current.loop = true;
    rightAudioRef.current.loop = true;

    return () => {
      leftAudioRef.current.pause();
      rightAudioRef.current.pause();
    };
  }, []);

  const toggleLeftChannel = (): void => {
    if (leftPlaying) {
      leftAudioRef.current.pause();
      setLeftPlaying(false);
    } else {
      if (rightPlaying) {
        rightAudioRef.current.pause();
        setRightPlaying(false);
      }
      leftAudioRef.current.play().catch(error => console.error('Error playing audio:', error));
      setLeftPlaying(true);
    }
  };

  const toggleRightChannel = (): void => {
    if (rightPlaying) {
      rightAudioRef.current.pause();
      setRightPlaying(false);
    } else {
      if (leftPlaying) {
        leftAudioRef.current.pause();
        setLeftPlaying(false);
      }
      rightAudioRef.current.play().catch(error => console.error('Error playing audio:', error));
      setRightPlaying(true);
    }
  };

  return (
    <div className={styles.container}>
      <h1>
        Now, put your headphones on…
      </h1>

      <main className={styles.mainContent}>
        <p className={styles.instructions}>
          This survey examines how humans perceive the position and width
          of musical ensembles in <a href="https://en.wikipedia.org/wiki/Binaural_recording" target="_blank"> binaural </a>
          recordings. Please put on headphones and use the buttons below
          to play the audio clips.
        </p>
        <p className={styles.instructions}>
          Ensure that any custom equalizer,
          spatial audio or sound enhancement features are disabled.
          Set the volume to a comfortable level, and ensure your
          headphones are working properly and positioned correctly.
        </p>

        <div className={styles.channelsContainer}>
          <div className={styles.channelSection}>
            <AudioButton
              onClick={toggleLeftChannel}
              isPlaying={leftPlaying}
              channel="left"
            />
            <span className={styles.channelLabel}>Left channel</span>
          </div>

          <div className={styles.headphoneIcon}>
            <Headphones />
          </div>

          <div className={styles.channelSection}>
            <AudioButton
              onClick={toggleRightChannel}
              isPlaying={rightPlaying}
              channel="right"
            />
            <span className={styles.channelLabel}>Right channel</span>
          </div>
        </div>

        <p className={styles.instructions}>
          Please keep your headphones on during all the tests.
          Adjust the volume at any time so that the clips are
          played back at a comfortable level.
        </p>

        <div className={styles.alert}>
          If you encounter problems with the audio playback,
          check your audio settings on your device, and refresh this page.
        </div>
      </main>

      <div className={styles.navigation}>
        <TextButton onClick={onPrevious} text="Previous" startIcon={<SkipBack />} />
        <TextButton onClick={onNext} text="Next" isPrimary={true} endIcon={<SkipForward />} />
      </div>
    </div>
  );
};

export default HeadphoneTestPage;