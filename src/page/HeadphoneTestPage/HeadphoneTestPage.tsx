import React from 'react';
import { SkipBack, SkipForward, Headphones } from 'lucide-react';
import styles from './HeadphoneTestPage.module.css';
import leftAudio from '../../assets/test_left.wav';
import rightAudio from '../../assets/test_right.wav';
import TextButton from '../../components/TextButton/TextButton';
import { Trans, useTranslation } from 'react-i18next';
import AudioButton from '../../components/AudioButton/AudioButton';
import useAudioPlayer2 from '../../hooks/audioPlayer.hook';

interface HeadphoneTestPageProps {
  onNext: () => void;
  onPrevious: () => void;
}

const HeadphoneTestPage: React.FC<HeadphoneTestPageProps> = ({ onNext, onPrevious }) => {
  const { t } = useTranslation();
  const { play: playLeft, pause: pauseLeft, isPlaying: isPlayingLeft, currentTime: currentTimeLeft } = useAudioPlayer2(leftAudio);
  const { play: playRight, pause: pauseRight, isPlaying: isPlayingRight, currentTime: currentTimeRight } = useAudioPlayer2(rightAudio);

  const toggleLeftChannel = () => {
    if (isPlayingRight) {
      pauseRight();
      console.log(currentTimeRight);
      playLeft(currentTimeRight);
    } else if (isPlayingLeft) {
      pauseLeft();
    } else {
      playLeft(currentTimeLeft);
    }
  };

  const toggleRightChannel = () => {
    if (isPlayingLeft) {
      pauseLeft();
      console.log(currentTimeLeft);
      playRight(currentTimeLeft);
    } else if (isPlayingRight) {
      pauseRight();
    } else {
      playRight(currentTimeRight);
    }
  };

  return (
    <div className="page-container">
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
              isPlaying={isPlayingLeft}
              channel="left"
            />
            <span className={styles.channelLabel}>
              <Trans i18nKey="headphoneTest.channels.leftChannel">
                Left side
              </Trans>
            </span>
          </div>

          <div className={styles.headphoneIcon}>
            <Headphones />
          </div>

          <div className={styles.channelSection}>
            <AudioButton
              onClick={toggleRightChannel}
              isPlaying={isPlayingRight}
              channel="right"
            />
            <span className={styles.channelLabel}>
              <Trans i18nKey="headphoneTest.channels.rightChannel">
                Right side
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