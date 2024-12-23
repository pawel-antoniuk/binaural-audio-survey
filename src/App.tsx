import { ReactNode, useState } from 'react';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import './App.css';
import Introduction from './page/Introduction/Introduction';
import Survey from './page/SurveyPage/SurveyPage';
import Tour from './page/TourPage/TourPage';
import PolicyPage from './page/PolicyPage/PolicyPage';
import QuestionnairePage from './page/QuestionnairePage/QuestionnairePage';
import PreparePage from './page/PreparePage/PreparePage';
import Questionnaire from './models/Questionnaire';
import { useUser } from './hooks/user.hook';
import { User } from './models/User';
import useLocalStorage from './hooks/localStorage.hook';
import { v4 as uuidv4 } from 'uuid';
import { useComments } from './hooks/comment.hook';
import AngularAnswer from './models/AngularAnswer';
import { useAnswer } from './hooks/answer.hook';
import FinishPage from './page/FinishPage/FinishPage';
import CreditsPage from './page/CreditsPage/CreditsPage';
import { useMessages } from './hooks/message.hook';
import HeadphoneTestPage from './page/HeadphoneTestPage/HeadphoneTestPage';
import { useUserMetadata } from './hooks/metadata.hook';
import LoadingSpinner from './components/LoadingSpinner/LoadingSpinner';

function PageWrapper({ children }: { children: ReactNode }) {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, x: 200 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -200 }}
        transition={{ duration: 0.2 }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}

function App() {
  const location = useLocation();
  const navigate = useNavigate();
  const [userId, setUserId] = useLocalStorage<string | null>('userId', null);
  const [, storeUser] = useLocalStorage<User | null>('user', null);
  const { create: createUser } = useUser();
  const { create: createComment } = useComments();
  const { create: createMessage } = useMessages();
  const { sendAnswer } = useAnswer();
  const metadata = useUserMetadata();
  const [isTranslationLoading, setIsTranslationLoading] = useState(false);

  const handleStart = () => {
    setUserId(uuidv4());
    storeUser(null);
    navigate('/questionnaire');
  };

  const handleQuestionnaireFilled = (questionnaire: Questionnaire) => {
    const user = {
      id: userId ?? '<UNKNOWN>',
      questionnaire,
      metadata: JSON.stringify(metadata)
    };
    storeUser(user);
    createUser(user);
    navigate('/headphones');
  };

  const handleComment = (questionId: string, message: string) => {
    createComment({ questionId, userId: userId || '', message });
  };

  const handleConfirm = (questionId: string, audioFilename: string, answer: AngularAnswer) => {
    sendAnswer('token', {
      userId: userId || '',
      questionId: questionId,
      audioFilename: audioFilename,
      leftAngle: answer.leftAngle,
      rightAngle: answer.rightAngle,
      ensembleWidth: answer.ensembleWidth,
    });
  };

  const handleFinishSurvey = () => {
    console.log('Survey finished');
    navigate('/finish');
  };

  const handleFinalComment = (message: string) => {
    createMessage({ userId: userId || '', content: message });
  };

  return (
    <div>
      <LoadingSpinner label='Loading translations...' isVisible={isTranslationLoading}/>
      <Routes location={location} key={location.pathname}>
        <Route
          path="/"
          element={
            <PageWrapper>
              <Introduction
                onStart={handleStart}
                onPolicy={() => navigate('/policy')}
              />
            </PageWrapper>
          }
        />
        <Route
          path="/questionnaire"
          element={
            <PageWrapper>
              <QuestionnairePage
                onContinue={handleQuestionnaireFilled}
                onReturn={() => navigate('/')}
              />
            </PageWrapper>
          }
        />
        <Route
          path="/headphones"
          element={
            <PageWrapper>
              <HeadphoneTestPage
                onPrevious={() => navigate('/questionnaire')}
                onNext={() => navigate('/tour')}
              />
            </PageWrapper>
          }
        />
        <Route
          path="/tour"
          element={
            <PageWrapper>
              <Tour onEnd={() => navigate("/prepare")} />
            </PageWrapper>
          }
        />
        <Route
          path="/prepare"
          element={
            <PageWrapper>
              <PreparePage
                onStart={() => navigate("/survey")}
                onReturn={() => navigate('/tour')}
              />
            </PageWrapper>
          }
        />
        <Route
          path="/survey"
          element={
            <PageWrapper>
              <Survey
                onConfirm={handleConfirm}
                onComment={handleComment}
                onFinish={handleFinishSurvey}
              />
            </PageWrapper>
          }
        />
        <Route
          path="/policy"
          element={
            <PageWrapper>
              <PolicyPage onReturn={() => navigate("/")} />
            </PageWrapper>
          }
        />
        <Route
          path="/finish"
          element={
            <PageWrapper>
              <FinishPage
                onComment={handleFinalComment}
                onCredits={() => navigate("/credits")}
              />
            </PageWrapper>
          }
        />
        <Route
          path="/credits"
          element={
            <PageWrapper>
              <CreditsPage onReturn={() => navigate("/finish")} />
            </PageWrapper>
          }
        />
      </Routes>
    </div>
  );
}

export default App;