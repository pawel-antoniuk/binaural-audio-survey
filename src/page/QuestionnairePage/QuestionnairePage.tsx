import React, { useState } from 'react';
import styles from './QuestionnairePage.module.css';
import TextButton from '../../components/TextButton/TextButton';
import Questionnaire from '../../models/Questionnaire';
import { SkipBack, SkipForward } from 'lucide-react';
import { Trans, useTranslation } from 'react-i18next';

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
  const { t } = useTranslation();
  const [model, setModel] = useState<QuestionnaireModel>({});
  const [showError, setShowError] = useState(false);
  const [ageError, setAgeError] = useState(false);

  const ages: Age[] = [
    { value: 'Under 18', viewValue: t('questionnaire.ageRanges.under18') },
    { value: '18-24', viewValue: t('questionnaire.ageRanges.18-24') },
    { value: '25-34', viewValue: t('questionnaire.ageRanges.25-34') },
    { value: '35-44', viewValue: t('questionnaire.ageRanges.35-44') },
    { value: '45-54', viewValue: t('questionnaire.ageRanges.45-54') },
    { value: 'Above 54', viewValue: t('questionnaire.ageRanges.above54') }
  ];

  const handleAgeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedAge = e.target.value;
    setModel({ ...model, age: selectedAge });
    setAgeError(selectedAge === 'Under 18');
    if (showError) {
      setShowError(false);
    }
  };

  const getMissingFields = () => {
    const missing: string[] = [];
    if (!model.age) missing.push(t('questionnaire.fields.age'));
    if (!model.hearingDifficulties) missing.push(t('questionnaire.fields.hearingDifficulties'));
    if (!model.listeningTestParticipation) missing.push(t('questionnaire.fields.listeningTest'));
    return missing;
  };

  const formValid = getMissingFields().length === 0 && !ageError;

  const handleOnContinue = () => {
    if (model.age === 'Under 18') {
      setAgeError(true);
      setShowError(true);
      return;
    }

    if (!formValid) {
      setShowError(true);
      return;
    }

    if (!model.age
      || !model.hearingDifficulties
      || !model.listeningTestParticipation) {
      throw new Error(t('questionnaire.errors.missingFields'));
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
        <Trans i18nKey="questionnaire.title">
          First, we need to ask you a few questions
        </Trans>
      </h1>
      <div className={styles.card}>
        <div className={styles.formGrid}>
          {/* Age Question */}
          <div className={styles.formRow}>
            <label className={styles.question}>
              <Trans i18nKey="questionnaire.questions.age">
                What is your age?
              </Trans>*
              {showError && !model.age && (
                <span className={styles.fieldError}>
                  <Trans i18nKey="questionnaire.errors.required">Required</Trans>
                </span>
              )}
            </label>
            <div className={styles.answer}>
              <select
                value={model.age || ''}
                onChange={handleAgeChange}
                className={`${styles.select} ${(showError && !model.age) || ageError ? styles.inputError : ''}`}
              >
                <option value="" disabled>{t('questionnaire.placeholders.selectAge')}</option>
                {ages.map((age) => (
                  <option key={age.value} value={age.value}>
                    {age.viewValue}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Rest of the form fields remain the same */}
          {/* Hearing Difficulties Question */}
          <div className={styles.formRow}>
            <label className={styles.question}>
              <Trans i18nKey="questionnaire.questions.hearing">
                Do you have difficulties with your hearing?
              </Trans>*
              {showError && !model.hearingDifficulties && (
                <span className={styles.fieldError}>
                  <Trans i18nKey="questionnaire.errors.required">Required</Trans>
                </span>
              )}
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
                  <span><Trans i18nKey="questionnaire.answers.yes">Yes</Trans></span>
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
                  <span><Trans i18nKey="questionnaire.answers.no">No</Trans></span>
                </label>
              </div>
            </div>
          </div>

          {/* Listening Test Question */}
          <div className={styles.formRow}>
            <label className={styles.question}>
              <Trans i18nKey="questionnaire.questions.listeningTest">
                Have you ever participated in a listening test?
              </Trans>*
              {showError && !model.listeningTestParticipation && (
                <span className={styles.fieldError}>
                  <Trans i18nKey="questionnaire.errors.required">Required</Trans>
                </span>
              )}
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
                  <span><Trans i18nKey="questionnaire.answers.yes">Yes</Trans></span>
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
                  <span><Trans i18nKey="questionnaire.answers.no">No</Trans></span>
                </label>
              </div>
            </div>
          </div>

          {/* Headphones Question */}
          <div className={`${styles.formRow} ${styles.fullWidth}`}>
            <label className={styles.question}>
              <Trans i18nKey="questionnaire.questions.headphones">
                What is the make and model of your headphones?
              </Trans>
            </label>
            <div className={`${styles.answer} ${styles.textareaWrapper}`}>
              <textarea
                value={model.headphonesMakeAndModel || ''}
                onChange={(e) => setModel({ ...model, headphonesMakeAndModel: e.target.value })}
                placeholder={t('questionnaire.placeholders.typeHere')}
                className={styles.textarea}
              />
            </div>
          </div>

          {/* Identifier Question */}
          <div className={styles.formRow}>
            <label className={styles.question}>
              <Trans i18nKey="questionnaire.questions.identifier">
                Identifier (optional)
              </Trans>
              <div className={styles.hint}>
                <p>
                  <Trans i18nKey="questionnaire.hints.identifier1">
                    Create a unique identifier to look up your results later.
                  </Trans>
                </p>
                <p>
                  <Trans i18nKey="questionnaire.hints.identifier2">
                    Please avoid using personal information like your real name.
                  </Trans>
                </p>
              </div>
            </label>
            <div className={styles.answer}>
              <input
                type="text"
                value={model.identifier || ''}
                onChange={(e) => setModel({ ...model, identifier: e.target.value })}
                placeholder={t('questionnaire.placeholders.identifier')}
                className={styles.textInput}
              />
            </div>
          </div>
        </div>
      </div>

      {showError && (
        <div className={styles.formError}>
          {ageError ? (
            <Trans i18nKey="questionnaire.errors.ageRestriction">
              You must be 18 or older to participate in this study.
            </Trans>
          ) : (
            !formValid && t('questionnaire.errors.fillRequired', {
              fields: getMissingFields().join(', ')
            })
          )}
        </div>
      )}

      <div className={styles.navigation}>
        <TextButton
          onClick={onReturn}
          startIcon={<SkipBack />}
        >
          <Trans i18nKey="questionnaire.navigation.previous">Previous</Trans>
        </TextButton>
        <TextButton
          onClick={handleOnContinue}
          isEnabled={formValid}
          isPrimary={true}
          endIcon={<SkipForward />}
        >
          <Trans i18nKey="questionnaire.navigation.next">Next</Trans>
        </TextButton>
      </div>
    </div>
  );
};

export default QuestionnairePage;