import React, { useState, useEffect, } from "react";
import Joyride, { CallBackProps, STATUS, Step } from 'react-joyride';
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

const allSteps: Step[] = [
  {
    title: 'Welcome!',
    content: 'You will listen to 20 short audio recordings, each presenting different audio source positions. The test has no time limit and will take about 10 minutes.',
    placement: 'center',
    target: 'body',
    floaterProps: {
      disableAnimation: true
    },
    styles: commonStyles,
    disableBeacon: true,
  },
  {
    title: 'Play/Pause Button',
    content: (<div>
      The recording loops automatically during each test step.
      You can pause and resume playback using this button.
      You can also pause and resume using the <LuSpace style={{ display: 'inline-block' }} /> (Space) key.
    </div>),
    target: '.step-play',
    placement: 'bottom',
    styles: commonStyles,
    disableBeacon: true,
  },
  {
    title: 'Marking Boundaries',
    content: "Your task is to identify the spatial boundaries of the musical ensemble. Use the markers to indicate the leftmost and rightmost points where you perceive the locations of sound sources within the ensemble.",
    target: '.step-stage',
    placement: 'bottom',
    styles: commonStyles,
    disableBeacon: true,
  },
  {
    title: 'Marking Boundaries',
    content: (<div>Mark where you perceive the musical ensemble in the recording by setting the left marker where you begin to hear it and the right marker where it ends.<img src={guideImage} alt="guide"></img></div>),
    target: '.step-stage',
    placement: 'center',
    styles: commonStyles,
    disableBeacon: true,
  },
  {
    title: 'Confirmation Button',
    content: (<div>
      Confirm your answer by clicking this button. You can use it only after listening to a recording.
      <span className={styles.warning}> You cannot change your answer after confirmation.</span>
    </div>),
    target: '.step-confirm',
    placement: 'left',
    styles: commonStyles,
    disableBeacon: true,
  },
  {
    title: 'Comment Button',
    content: 'Use this button to share feedback about what you see or hear. You can also leave feedback after completing the test.',
    target: '.step-comment',
    placement: 'top',
    styles: commonStyles,
    disableBeacon: true,
  },
  {
    title: 'Try it yourself',
    content: 'Take a moment to explore and test the interface. Click around and make sure everything works as expected. When you\'re done testing, click the Finish button to complete the tour.',
    target: '.step-end',
    placement: 'bottom',
    styles: commonStyles,
    disableBeacon: true,
    disableOverlayClose: true,
    disableOverlay: true,
  }
];

const Tour: React.FC<TourProps> = ({ onEnd, steps }) => {
  const [runTour, setRunTour] = useState(false);
  const [selectedSteps, setSelectedSteps] = useState<Step[]>([]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setRunTour(true);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (steps) {
      setSelectedSteps(allSteps.filter((_, index) => steps.includes(index)));
    } else {
      setSelectedSteps(allSteps);
    }
  }, [steps]);

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
        back: 'Back',
        close: 'Close',
        last: 'Finish',
        next: 'Next',
        nextLabelWithProgress: 'Next (Step {step} of {steps})',
        open: 'Open the dialog',
        skip: 'Skip'
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