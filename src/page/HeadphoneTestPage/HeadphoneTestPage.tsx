import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipBack, SkipForward, Headphones } from 'lucide-react';
import styles from './HeadphoneTestPage.module.css';
import leftAudio from '../../assets/test_left.wav';
import rightAudio from '../../assets/test_right.wav';
import TextButton from '../../components/TextButton/TextButton';
import { Trans, useTranslation } from 'react-i18next';

interface AudioButtonProps {
  onClick: () => void;
  isPlaying: boolean;
  channel: 'left' | 'right';
}

const AudioButton: React.FC<AudioButtonProps> = ({ onClick, isPlaying, channel }) => {
  const { t } = useTranslation();
  return (
    <button
      onClick={onClick}
      className={`${styles.audioButton} ${isPlaying ? styles.playing : ''}`}
      aria-label={t('headphoneTest.buttons.ariaLabel', {
        action: isPlaying ? t('headphoneTest.buttons.pause') : t('headphoneTest.buttons.play'),
        channel: t(`headphoneTest.channels.${channel}`)
      })}
    >
      {isPlaying ? <Pause /> : <Play />}
    </button>
  );
};

interface HeadphoneTestPageProps {
  onNext: () => void;
  onPrevious: () => void;
}

const HeadphoneTestPage: React.FC<HeadphoneTestPageProps> = ({ onNext, onPrevious }) => {
  const { t } = useTranslation();
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
      leftAudioRef.current.play().catch(error =>
        console.error(t('headphoneTest.errors.audioPlayback'), error)
      );
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
      rightAudioRef.current.play().catch(error =>
        console.error(t('headphoneTest.errors.audioPlayback'), error)
      );
      setRightPlaying(true);
    }
  };

  return (
    <div className={styles.container}>
      <h1>
        <Trans i18nKey="headphoneTest.title">
          Now, put your headphones on…
        </Trans>
      </h1>

      <main className={styles.mainContent}>
        <p className={styles.instructions}>
          <Trans i18nKey="headphoneTest.instructions.main">
            This survey examines how humans perceive the position and width
            of musical ensembles in <a href={t("headphoneTest.instructions.binauralLink")} target="_blank">binaural</a>
            recordings. Please put on headphones and use the buttons below
            to play the audio clips.
          </Trans>
        </p>
        <p className={styles.instructions}>
          <Trans i18nKey="headphoneTest.instructions.setup">
            Ensure that any custom equalizer,
            spatial audio or sound enhancement features are disabled.
            Set the volume to a comfortable level, starting from minimum loudness. 
            Ensure your headphones are working properly and positioned correctly!
          </Trans>
        </p>

        <div className={styles.channelsContainer}>
          <div className={styles.channelSection}>
            <AudioButton
              onClick={toggleLeftChannel}
              isPlaying={leftPlaying}
              channel="left"
            />
            <span className={styles.channelLabel}>
              <Trans i18nKey="headphoneTest.channels.leftChannel">
                Left channel
              </Trans>
            </span>
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
            <span className={styles.channelLabel}>
              <Trans i18nKey="headphoneTest.channels.rightChannel">
                Right channel
              </Trans>
            </span>
          </div>
        </div>

        <p className={styles.instructions}>
          <Trans i18nKey="headphoneTest.instructions.reminder">
            Please keep your headphones on during all the tests.
            Adjust the volume at any time so that the clips are
            played back at a comfortable level.
          </Trans>
        </p>

        <div className={styles.alert}>
          <Trans i18nKey="headphoneTest.alert">
            If you encounter problems with the audio playback,
            check your audio settings on your device, and refresh this page.
          </Trans>
        </div>
      </main>

      <div className={styles.navigation}>
        <TextButton
          onClick={onPrevious}
          startIcon={<SkipBack />}
        >
          <Trans i18nKey="headphoneTest.navigation.previous">Previous</Trans>
        </TextButton>
        <TextButton
          onClick={onNext}
          isPrimary={true}
          endIcon={<SkipForward />}
        >
          <Trans i18nKey="headphoneTest.navigation.next">Next</Trans>
        </TextButton>
      </div>
    </div>
  );
};

export default HeadphoneTestPage;