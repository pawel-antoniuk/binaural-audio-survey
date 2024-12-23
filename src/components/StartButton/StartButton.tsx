import React from "react";
import TextButton from "../TextButton/TextButton";
import { Play } from "lucide-react";

type StartButtonProps = {
  onStart: () => void;
  isEnabled: boolean;
  siteKey: string;
};

const StartButton: React.FC<StartButtonProps> = ({
  onStart,
  isEnabled,
}) => {

  return (
    <div>
      <TextButton
        text={"Start the test"}
        startIcon={<Play />}
        onClick={onStart}
        isEnabled={isEnabled}
        isPrimary={true}
      />
    </div>
  );
};

export default StartButton;