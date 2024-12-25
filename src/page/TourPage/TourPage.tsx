import React from "react";
import SurveyPage from "../SurveyPage/SurveyPage";
import Tour from "../../components/Tour/Tour";
import { useTranslation } from "react-i18next";

type TourPageProps = {
  onEnd: () => void;
};

const TourPage: React.FC<TourPageProps> = ({ onEnd }) => {
  useTranslation();
  
  return (
    <div>
      <Tour onEnd={onEnd} />
      <SurveyPage
        onComment={() => { }}
        onConfirm={() => { }}
        onFinish={() => { }}
      />
    </div>
  );
};

export default TourPage;