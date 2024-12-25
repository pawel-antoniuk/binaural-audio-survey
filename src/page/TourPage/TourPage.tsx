import React from "react";
import SurveyPage from "../SurveyPage/SurveyPage";
import Tour from "../../components/Tour/Tour";

type TourPageProps = {
  onEnd: () => void;
};

const TourPage: React.FC<TourPageProps> = ({ onEnd }) => {
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