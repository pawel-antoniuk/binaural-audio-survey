import React, { useState, useEffect } from "react";
import Joyride, { CallBackProps, STATUS, Step } from 'react-joyride';
import { Trans, useTranslation } from 'react-i18next';
import styles from './Tour.module.css';
import { LuSpace } from "react-icons/lu";
import guideImage from '../../assets/guide.gif';

type TourProps = {
  onEnd: () => void;
  steps?: number[];
};

const commonStyles = {
  options: {
    width: 600
  }
};

const Tour: React.FC<TourProps> = ({ onEnd, steps }) => {
  const { t } = useTranslation();
  const [runTour, setRunTour] = useState(false);
  const [selectedSteps, setSelectedSteps] = useState<Step[]>([]);

  // Define steps with translations
  const getAllSteps = (): Step[] => [
    {
      title: <Trans i18nKey="tour.welcome.title">Welcome!</Trans>,
      content: <Trans i18nKey="tour.welcome.content">
        This tutorial will familiarize you with the interface and the task.
      </Trans>,
      placement: 'center',
      target: 'body',
      floaterProps: {
        disableAnimation: true
      },
      styles: commonStyles,
      disableBeacon: true,
    },
    {
      title: <Trans i18nKey="tour.playPause.title">Play/Pause Button</Trans>,
      content: (
        <div>
          <Trans i18nKey="tour.playPause.autoLoop">
            The recording loops automatically during each test step.
          </Trans>
          <Trans i18nKey="tour.playPause.pauseResume">
            You can pause and resume playback using this button.
          </Trans>
          <Trans i18nKey="tour.playPause.spaceKey">
            You can also pause and resume using the <LuSpace style={{ display: 'inline-block' }} /> (Space) key.
          </Trans>
        </div>
      ),
      target: '.step-play',
      placement: 'bottom',
      styles: commonStyles,
      disableBeacon: true,
    },
    {
      title: <Trans i18nKey="tour.boundaries.title">Marking Boundaries</Trans>,
      content: <Trans i18nKey="tour.boundaries.content">
        Your task is to identify the spatial boundaries of the musical ensemble.
        Use the markers to indicate the leftmost and rightmost points where you perceive
        the locations of sound sources within the ensemble.
      </Trans>,
      target: '.step-stage',
      placement: 'bottom',
      styles: commonStyles,
      disableBeacon: true,
    },
    {
      title: <Trans i18nKey="tour.markingGuide.title">Marking Boundaries</Trans>,
      content: (
        <div>
          <Trans i18nKey="tour.markingGuide.content">
            Mark where you perceive the musical ensemble in the recording by
            placing the left marker at the leftmost boundary of the ensemble
            and the right marker at the rightmost boundary.
          </Trans>
          <img src={guideImage} alt={t('tour.markingGuide.imageAlt')} />
        </div>
      ),
      target: '.step-stage',
      placement: 'center',
      styles: commonStyles,
      disableBeacon: true,
    },
    {
      title: <Trans i18nKey="tour.widthMeasurement.title">Ensemble Width</Trans>,
      content: (
        <div>
          <Trans i18nKey="tour.widthMeasurement.content">
            Here you will see the current ensemble width, which corresponds to the boundaries you marked in the previous step.
          </Trans>
        </div>
      ),
      target: '.step-ensemble-width',
      placement: 'top',
      styles: commonStyles,
      disableBeacon: true,
    },
    {
      title: <Trans i18nKey="tour.confirm.title">Confirmation Button</Trans>,
      content: (
        <div>
          <Trans i18nKey="tour.confirm.content">
            Confirm your answer by clicking this button. You can use it only after listening to a recording. <span className={styles.warning}>
              You cannot change your answer after confirmation.
            </span>
          </Trans>
        </div>
      ),
      target: '.step-confirm',
      placement: 'left',
      styles: commonStyles,
      disableBeacon: true,
    },
    {
      title: <Trans i18nKey="tour.comment.title">Comment Button</Trans>,
      content: <Trans i18nKey="tour.comment.content">
        Use this button to share feedback about what you see or hear.
        You can also leave feedback after completing the test.
      </Trans>,
      target: '.step-comment',
      placement: 'top',
      styles: commonStyles,
      disableBeacon: true,
    },
    {
      title: <Trans i18nKey="tour.tryIt.title">Try it yourself</Trans>,
      content: <Trans i18nKey="tour.tryIt.content">
        Take a moment to explore and test the interface. Click around and make sure
        everything works as expected. When you're done testing, click the Finish button
        to complete the tour.
      </Trans>,
      target: '.step-end',
      placement: 'bottom',
      styles: commonStyles,
      disableBeacon: true,
      disableOverlayClose: true,
      disableOverlay: true,
    }
  ];

  useEffect(() => {
    const timer = setTimeout(() => {
      setRunTour(true);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const allSteps = getAllSteps();
    if (steps) {
      setSelectedSteps(allSteps.filter((_, index) => steps.includes(index)));
    } else {
      setSelectedSteps(allSteps);
    }
  }, [steps, t]);

  const handleJoyrideCallback = (data: CallBackProps) => {
    const { status } = data;

    if (status === STATUS.FINISHED) {
      setRunTour(false);
      onEnd();
    }
  };

  return (
    <Joyride
      steps={selectedSteps}
      run={runTour}
      continuous={true}
      showProgress={true}
      callback={handleJoyrideCallback}
      locale={{
        back: <Trans i18nKey="tour.navigation.back">Back</Trans>,
        close: <Trans i18nKey="tour.navigation.close">Close</Trans>,
        last: <Trans i18nKey="tour.navigation.last">Finish</Trans>,
        next: <Trans i18nKey="tour.navigation.next">Next</Trans>,
        nextLabelWithProgress: t("tour.navigation.nextWithProgress"),
        open: <Trans i18nKey="tour.navigation.open">Open the dialog</Trans>,
        skip: <Trans i18nKey="tour.navigation.skip">Skip</Trans>
      }}
      styles={{
        buttonClose: {
          display: 'none',
        },
        options: {
          primaryColor: '#027bff',
        }
      }}
    />
  );
};

export default Tour;