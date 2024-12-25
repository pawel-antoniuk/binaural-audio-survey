import { useTranslation } from 'react-i18next';
import styles from './AudioButton.module.css';
import { Pause, Play } from 'lucide-react';

interface AudioButtonProps {
  onClick: () => void;
  isPlaying: boolean;
  channel: 'left' | 'right';
}

const AudioButton: React.FC<AudioButtonProps> = ({ onClick, isPlaying, channel }) => {
  const { t } = useTranslation();
  return (
    <button
      onClick={onClick}
      className={`${styles.audioButton} ${isPlaying ? styles.playing : ''}`}
      aria-label={t('headphoneTest.buttons.ariaLabel', {
        action: isPlaying ? t('headphoneTest.buttons.pause') : t('headphoneTest.buttons.play'),
        channel: t(`headphoneTest.channels.${channel}`)
      })}
    >
      {isPlaying ? <Pause /> : <Play />}
    </button>
  );
};

export default AudioButton;
