import { type FC } from 'react';
import { Trans } from 'react-i18next';
import styles from './CreditsPage.module.css';
import TextButton from '../../components/TextButton/TextButton';

type Props = {
  onReturn: () => void;
};

const CreditsPage: FC<Props> = ({ onReturn }) => {
  // Credits data - kept separate from translations as these are proper nouns
  const credits = [
    { title: "All The Gin Is Gone", artist: "Maurizio Pagnutti Sextet", link: "http://www.cambridge-mt.com/ms-mtk.htm" },
    { title: "Alone With You", artist: "Justin Myles", link: "http://www.cambridge-mt.com/ms-mtk.htm" },
    { title: "A Place For Us", artist: "Carlos Gonzalez", link: "http://www.cambridge-mt.com/ms-mtk.htm" },
    { title: "Back From The Start", artist: "Fergessen", link: "http://www.cambridge-mt.com/ms-mtk.htm" },
    { title: "Directions", artist: "Tom McKenzie", link: "http://www.cambridge-mt.com/ms-mtk.htm" },
    { title: "The Marsh Marigold's Song", artist: "Don Camillo Choir", link: "http://www.cambridge-mt.com/ms-mtk.htm" },
    { title: "Downtempo", artist: "Bravestar", link: "http://www.cambridge-mt.com/ms-mtk.htm" },
    { title: "FlecheDOr", artist: "Swing Bazar: Pompamine (Album Selection)", link: "http://www.cambridge-mt.com/ms-mtk.htm" },
    { title: "Fly High", artist: "Aron Jaeger", link: "http://www.cambridge-mt.com/ms-mtk.htm" },
    { title: "Set Me Free", artist: "Ghostly Beard", link: "http://www.cambridge-mt.com/ms-mtk.htm" },
    { title: "Good Time", artist: "Louis Cressy Band", link: "http://www.cambridge-mt.com/ms-mtk.htm" },
    { title: "Happy Blues", artist: "Tommy Marcinek", link: "http://www.cambridge-mt.com/ms-mtk.htm" },
    { title: "I'm Alright", artist: "Angels In Amplifiers", link: "http://www.cambridge-mt.com/ms-mtk.htm" },
    { 
      text: "Patynen, Pulkki, Lokki, Anechoic Recording System for Symphony Orchestra, Acta Acustica united with Acustica, 2008",
      type: "citation"
    },
    { title: "My Own", artist: "Little Chicago's Finest", link: "http://www.cambridge-mt.com/ms-mtk.htm" },
    { title: "New Day Dawning", artist: "G-Bass Project", link: "http://www.cambridge-mt.com/ms-mtk.htm" },
    { title: "Ode to Bregovic", artist: "Bella's Bartok", link: "https://www.telefunken-elektroakustik.com/multitracks" },
    { title: "Passing Ships", artist: "The Travelling Band", link: "http://www.cambridge-mt.com/ms-mtk.htm" },
    { title: "Place 2 Be", artist: "Funky Dawgz Brass Band", link: "https://www.telefunken-elektroakustik.com/multitracks" },
    { title: "Pray For The Rain", artist: "Nerve 9", link: "http://www.cambridge-mt.com/ms-mtk.htm" },
    { title: "Progresivo 1, El Vuelo", artist: "Pablo Martin", link: "http://www.cambridge-mt.com/ms-mtk.htm" },
    { title: "Rachel", artist: "Anna Blanton", link: "http://www.cambridge-mt.com/ms-mtk.htm" },
    { title: "Rumba Chonta", artist: "Alejo Granados", link: "http://www.cambridge-mt.com/ms-mtk.htm" },
    { title: "Scar", artist: "The Lonely Wild", link: "http://www.cambridge-mt.com/ms-mtk.htm" },
    { title: "Schoolboy Fascination", artist: "Al James", link: "http://www.cambridge-mt.com/ms-mtk.htm" },
    { title: "Shore", artist: "Motor Tapes", link: "http://www.cambridge-mt.com/ms-mtk.htm" },
    { title: "64 Bristol", artist: "Wess Meets West", link: "http://www.cambridge-mt.com/ms-mtk.htm" },
    { title: "Slow Down", artist: "Jessica Childress", link: "http://www.cambridge-mt.com/ms-mtk.htm" },
    { title: "Talk To Me Baby", artist: "Zane Carney & Friends", link: "http://www.cambridge-mt.com/ms-mtk.htm" },
    { title: "Tears In The Rain", artist: "Rod Alexander", link: "http://www.cambridge-mt.com/ms-mtk.htm" },
    { title: "That's Entertainment", artist: "Öjebokören", link: "http://www.cambridge-mt.com/ms-mtk.htm" },
    { title: "The Blues Is A Lady", artist: "Peter White", link: "http://www.cambridge-mt.com/ms-mtk.htm" },
    { title: "Back Home To Blue", artist: "The Long Wait", link: "http://www.cambridge-mt.com/ms-mtk.htm" },
    { title: "Through My Eyes", artist: "Jay Menon", link: "http://www.cambridge-mt.com/ms-mtk.htm" },
    { title: "Too Bright", artist: "μ", link: "http://www.cambridge-mt.com/ms-mtk.htm" },
    { title: "Trude The Bumblebee", artist: "Don Camillo Choir: Kasimir's Adventure", link: "http://www.cambridge-mt.com/ms-mtk.htm" },
    {
      text: "D'Orazio et al. (2016) Recordings of Italian Opera orchestra and soloists in a silent room",
      link: "http://acustica.ing.unibo.it/opera/",
      type: "citation"
    },
    { title: "Widow", artist: "Triviul feat. The Fiend", link: "http://www.cambridge-mt.com/ms-mtk.htm" },
    { title: "Lament", artist: "Wolf's Head & Vixen Morris Band", link: "http://www.cambridge-mt.com/ms-mtk.htm" },
    { title: "Word Gets Around", artist: "St Vitus", link: "http://www.cambridge-mt.com/ms-mtk.htm" }
  ];

  return (
    <div className={styles.container}>
      <h2>
        <Trans i18nKey="credits.title">Credits</Trans>
      </h2>
      <div>
        <ul>
          {credits.map((credit, index) => (
            <li key={index}>
              {credit.type === 'citation' ? (
                credit.link ? (
                  <a href={credit.link}>{credit.text}</a>
                ) : (
                  credit.text
                )
              ) : (
                <a href={credit.link}>{`"${credit.title}" by ${credit.artist}`}</a>
              )}
            </li>
          ))}
        </ul>
      </div>
      <TextButton onClick={onReturn}>
        <Trans i18nKey="credits.buttons.back">Back</Trans>
      </TextButton>
    </div>
  );
};

export default CreditsPage;