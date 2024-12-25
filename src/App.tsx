import { ReactNode, useState } from 'react';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import './App.css';
import Introduction from './page/Introduction/Introduction';
import SurveyPage from './page/SurveyPage/SurveyPage';
import Tour from './page/TourPage/TourPage';
import PolicyPage from './page/PolicyPage/PolicyPage';
import QuestionnairePage from './page/QuestionnairePage/QuestionnairePage';
import PreparePage from './page/PreparePage/PreparePage';
import Questionnaire from './models/Questionnaire';
import { useUser } from './hooks/user.hook';
import { User } from './models/User';
import useLocalStorage from './hooks/localStorage.hook';
import { useComments } from './hooks/comment.hook';
import AngularAnswer from './models/AngularAnswer';
import { useAnswer } from './hooks/answer.hook';
import FinishPage from './page/FinishPage/FinishPage';
import CreditsPage from './page/CreditsPage/CreditsPage';
import { useMessages } from './hooks/message.hook';
import HeadphoneTestPage from './page/HeadphoneTestPage/HeadphoneTestPage';
import { useUserMetadata } from './hooks/metadata.hook';
import LoadingSpinner from './components/LoadingSpinner/LoadingSpinner';
import LanguageSwitcher from './components/LanguageSwitcher/LanguageSwitcher';

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
  const [user, storeUser] = useLocalStorage<User | null>('user', null);
  const { create: createUser } = useUser();
  const { create: createComment } = useComments();
  const { create: createMessage } = useMessages();
  const { sendAnswer } = useAnswer();
  const metadata = useUserMetadata();
  const [isTranslationLoading,] = useState(false);

  const getUserId = () => {
    if (!user) {
      throw new Error('User not set');
    }
    return user.id;
  };

  const handleQuestionnaireFilled = (questionnaire: Questionnaire) => {
    const user: User = {
      id: crypto.randomUUID(),
      questionnaire,
      metadata: JSON.stringify(metadata)
    };
    storeUser(user);
    createUser(user);
    navigate('/headphones');
  };

  const handleComment = (questionId: string, message: string) => {
    createComment({ questionId, userId: getUserId(), message });
  };

  const handleConfirm = (questionId: string, audioFilename: string, answer: AngularAnswer) => {
    sendAnswer('token', {
      userId: getUserId(),
      questionId: questionId,
      audioFilename: audioFilename,
      leftAngle: answer.leftAngle,
      rightAngle: answer.rightAngle,
      ensembleWidth: answer.ensembleWidth,
    });
  };
  
  const handleFinalComment = (message: string) => {
    createMessage({ userId: getUserId(), content: message });
  };

  return (
    <>
      <LoadingSpinner label='Loading translations...' isVisible={isTranslationLoading} />
      <LanguageSwitcher />
      <div className='app-container'>
        <Routes location={location} key={location.pathname}>
          <Route
            path="/"
            element={
              <PageWrapper>
                <Introduction
                  onStart={() => navigate('/policy')}
                />
              </PageWrapper>
            }
          />
          <Route
            path="/policy"
            element={
              <PageWrapper>
                <PolicyPage
                  onNext={() => navigate("/questionnaire")}
                  onPrevious={() => navigate("/")}
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
                <SurveyPage
                  onConfirm={handleConfirm}
                  onComment={handleComment}
                  onFinish={() => navigate("/finish")}
                  rememberProgress={true}
                />
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
    </>
  );
}

export default App;