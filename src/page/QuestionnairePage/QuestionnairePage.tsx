import React, { useState } from 'react';
import styles from './QuestionnairePage.module.css';
import TextButton from '../../components/TextButton/TextButton';
import Questionnaire from '../../models/Questionnaire';
import { SkipBack, SkipForward } from 'lucide-react';

interface Age {
  value: string;
  viewValue: string;
}

interface QuestionnairePageProps {
  onReturn: () => void;
  onContinue: (questionnaire: Questionnaire) => void;
}

interface QuestionnaireModel {
  identifier?: string;
  age?: string;
  hearingDifficulties?: string;
  listeningTestParticipation?: string;
  headphonesMakeAndModel?: string;
}

const QuestionnairePage: React.FC<QuestionnairePageProps> = ({
  onReturn,
  onContinue
}) => {
  const [model, setModel] = useState<QuestionnaireModel>({});
  const [showError, setShowError] = useState(false);

  const ages: Age[] = [
    { value: 'Under 18', viewValue: 'Under 18' },
    { value: '18-24', viewValue: '18-24' },
    { value: '25-34', viewValue: '25-34' },
    { value: '35-44', viewValue: '35-44' },
    { value: '45-54', viewValue: '45-54' },
    { value: 'Above 54', viewValue: 'Above 54' }
  ];

  const getMissingFields = () => {
    const missing: string[] = [];
    if (!model.age) missing.push('Age');
    if (!model.hearingDifficulties) missing.push('Hearing difficulties');
    if (!model.listeningTestParticipation) missing.push('Listening test participation');
    return missing;
  };

  const formValid = getMissingFields().length === 0;

  const handleOnContinue = () => {
    if (!formValid) {
      setShowError(true);
      return;
    }
    if (!model.age
      || !model.hearingDifficulties
      || !model.listeningTestParticipation) {
      throw new Error('Missing required fields');
    }

    onContinue({
      age: model.age,
      hearingDifficulties: model.hearingDifficulties === '1',
      listeningTestParticipation: model.listeningTestParticipation === '1',
      headphonesMakeAndModel: model.headphonesMakeAndModel || '',
      identifier: model.identifier,
    });
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>
        First, we need to ask you a few questions
      </h1>
      <div className={styles.card}>
        <div className={styles.formGrid}>
          {/* Age Question */}
          <div className={styles.formRow}>
            <label className={styles.question}>
              What is your age?*
              {showError && !model.age && <span className={styles.fieldError}>Required</span>}
            </label>
            <div className={styles.answer}>
              <select
                value={model.age || ''}
                onChange={(e) => setModel({ ...model, age: e.target.value })}
                className={`${styles.select} ${showError && !model.age ? styles.inputError : ''}`}
              >
                <option value="" disabled>Please select</option>
                {ages.map((age) => (
                  <option key={age.value} value={age.value}>
                    {age.viewValue}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Hearing Difficulties Question */}
          <div className={styles.formRow}>
            <label className={styles.question}>
              Do you have difficulties with your hearing?*
              {showError && !model.hearingDifficulties &&
                <span className={styles.fieldError}>Required</span>}
            </label>
            <div className={styles.answer}>
              <div className={`${styles.radioGroup} ${showError && !model.hearingDifficulties ? styles.inputError : ''}`}>
                <label className={styles.radioLabel}>
                  <input
                    type="radio"
                    name="hearingDifficulties"
                    value="1"
                    checked={model.hearingDifficulties === "1"}
                    onChange={(e) => setModel({ ...model, hearingDifficulties: e.target.value })}
                    className={styles.radioInput}
                  />
                  <span>Yes</span>
                </label>
                <label className={styles.radioLabel}>
                  <input
                    type="radio"
                    name="hearingDifficulties"
                    value="0"
                    checked={model.hearingDifficulties === "0"}
                    onChange={(e) => setModel({ ...model, hearingDifficulties: e.target.value })}
                    className={styles.radioInput}
                  />
                  <span>No</span>
                </label>
              </div>
            </div>
          </div>

          {/* Listening Test Question */}
          <div className={styles.formRow}>
            <label className={styles.question}>
              Have you ever participated in a listening test?*
              {showError && !model.listeningTestParticipation &&
                <span className={styles.fieldError}>Required</span>}
            </label>
            <div className={styles.answer}>
              <div className={`${styles.radioGroup} ${showError && !model.listeningTestParticipation ? styles.inputError : ''}`}>
                <label className={styles.radioLabel}>
                  <input
                    type="radio"
                    name="listeningTest"
                    value="1"
                    checked={model.listeningTestParticipation === "1"}
                    onChange={(e) => setModel({ ...model, listeningTestParticipation: e.target.value })}
                    className={styles.radioInput}
                  />
                  <span>Yes</span>
                </label>
                <label className={styles.radioLabel}>
                  <input
                    type="radio"
                    name="listeningTest"
                    value="0"
                    checked={model.listeningTestParticipation === "0"}
                    onChange={(e) => setModel({ ...model, listeningTestParticipation: e.target.value })}
                    className={styles.radioInput}
                  />
                  <span>No</span>
                </label>
              </div>
            </div>
          </div>

          {/* Headphones Question */}
          <div className={`${styles.formRow} ${styles.fullWidth}`}>
            <label className={styles.question}>
              What is the make and model of your headphones?
            </label>
            <div className={`${styles.answer} ${styles.textareaWrapper}`}>
              <textarea
                value={model.headphonesMakeAndModel || ''}
                onChange={(e) => setModel({ ...model, headphonesMakeAndModel: e.target.value })}
                placeholder="Type in here"
                className={styles.textarea}
              />
            </div>
          </div>

          {/* Identifier Question */}
          <div className={styles.formRow}>
            <label className={styles.question}>
              Identifier (optional)
              <div className={styles.hint}>
                <p>Create a unique identifier to look up your results later.</p>
                <p>Please avoid using personal information like your real name.</p>
              </div>
            </label>
            <div className={styles.answer}>
              <input
                type="text"
                value={model.identifier || ''}
                onChange={(e) => setModel({ ...model, identifier: e.target.value })}
                placeholder="Enter identifier (optional)"
                className={styles.textInput}
              />
            </div>
          </div>
        </div>
      </div>

      {showError && !formValid && (
        <div className={styles.formError}>
          Please fill in all required fields: {getMissingFields().join(', ')}
        </div>
      )}

      <div className={styles.navigation}>
        <TextButton onClick={onReturn} text="Previous" startIcon={<SkipBack />} />
        <TextButton onClick={handleOnContinue} text="Next" isEnabled={formValid} isPrimary={true} endIcon={<SkipForward />} />
      </div>
    </div>
  );
};

export default QuestionnairePage;