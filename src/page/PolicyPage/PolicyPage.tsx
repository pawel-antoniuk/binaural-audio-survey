import type { FC } from 'react';
import styles from './PolicyPage.module.css';
import TextButton from '../../components/TextButton/TextButton';

type PolicyProps = {
    onReturn: () => void;
};

const PolicyPage: FC<PolicyProps> = ({ onReturn }) => {
    return (
        <div className={styles.container}>
            <p>
                The test was prepared according to the best academic practice. It is the responsibility of the participants to control the playback loudness at safe and comfortable level. We are not liable for any hearing losses or damage sustained as a result of the test.
            </p>
            <p>
                We collect information including participants' IP adresses and the names of their operating systems. This information is used to detect false responses. Cookies are used only for session management to detect the moment when the test has started or finished.
            </p>
            <p>
                All the data gathered throughout the test will be processed anonymously. It is collected solely for academic research purposes and will not be passed to any third party.
            </p>
            <TextButton 
                onClick={onReturn}
                text="Return"
            />
        </div>
    );
};

export default PolicyPage;