import { type FC } from 'react';
import styles from './CreditsPage.module.css';
import TextButton from '../../components/TextButton/TextButton';

type Props = {
  onReturn: () => void;
};

const CreditsPage: FC<Props> = ({ onReturn }) => {
  return (
    <div className={styles.container}>
      <h2>
        Credits
      </h2>
      <div>
        <ul>
          <li>
            <a href="http://www.cambridge-mt.com/ms-mtk.htm">"All The Gin Is Gone" by Maurizio Pagnutti Sextet</a>
          </li>
          <li>
            <a href="http://www.cambridge-mt.com/ms-mtk.htm">"Alone With You" by Justin Myles</a>
          </li>
          <li>
            <a href="http://www.cambridge-mt.com/ms-mtk.htm">"A Place For Us" by Carlos Gonzalez</a>
          </li>
          <li>
            <a href="http://www.cambridge-mt.com/ms-mtk.htm">"Back From The Start" by Fergessen</a>
          </li>
          <li>
            <a href="http://www.cambridge-mt.com/ms-mtk.htm">"Directions" by Tom McKenzie</a>
          </li>
          <li>
            <a href="http://www.cambridge-mt.com/ms-mtk.htm">"The Marsh Marigold's Song" by Don Camillo Choir</a>
          </li>
          <li>
            <a href="http://www.cambridge-mt.com/ms-mtk.htm">"Downtempo" by Bravestar</a>
          </li>
          <li>
            <a href="http://www.cambridge-mt.com/ms-mtk.htm">"FlecheDOr" by Swing Bazar: Pompamine (Album Selection)</a>
          </li>
          <li>
            <a href="http://www.cambridge-mt.com/ms-mtk.htm">"Fly High" by Aron Jaeger</a>
          </li>
          <li>
            <a href="http://www.cambridge-mt.com/ms-mtk.htm">"Set Me Free" by Ghostly Beard</a>
          </li>
          <li>
            <a href="http://www.cambridge-mt.com/ms-mtk.htm">"Good Time" by Louis Cressy Band</a>
          </li>
          <li>
            <a href="http://www.cambridge-mt.com/ms-mtk.htm">"Happy Blues" by Tommy Marcinek</a>
          </li>
          <li>
            <a href="http://www.cambridge-mt.com/ms-mtk.htm">"I'm Alright" by Angels In Amplifiers</a>
          </li>
          <li>
            Patynen, Pulkki, Lokki, Anechoic Recording System for Symphony Orchestra, Acta Acustica united with Acustica, 2008
          </li>
          <li>
            <a href="http://www.cambridge-mt.com/ms-mtk.htm">"My Own" by Little Chicago's Finest</a>
          </li>
          <li>
            <a href="http://www.cambridge-mt.com/ms-mtk.htm">"New Day Dawning" by G-Bass Project</a>
          </li>
          <li>
            <a href="https://www.telefunken-elektroakustik.com/multitracks">"Ode to Bregovic" by Bella's Bartok</a>
          </li>
          <li>
            <a href="http://www.cambridge-mt.com/ms-mtk.htm">"Passing Ships" by The Travelling Band</a>
          </li>
          <li>
            <a href="https://www.telefunken-elektroakustik.com/multitracks">"Place 2 Be" by Funky Dawgz Brass Band</a>
          </li>
          <li>
            <a href="http://www.cambridge-mt.com/ms-mtk.htm">"Pray For The Rain" by Nerve 9</a>
          </li>
          <li>
            <a href="http://www.cambridge-mt.com/ms-mtk.htm">"Progresivo 1, El Vuelo" by Pablo Martin</a>
          </li>
          <li>
            <a href="http://www.cambridge-mt.com/ms-mtk.htm">"Rachel" by Anna Blanton</a>
          </li>
          <li>
            <a href="http://www.cambridge-mt.com/ms-mtk.htm">"Rumba Chonta" by Alejo Granados</a>
          </li>
          <li>
            <a href="http://www.cambridge-mt.com/ms-mtk.htm">"Scar" by The Lonely Wild</a>
          </li>
          <li>
            <a href="http://www.cambridge-mt.com/ms-mtk.htm">"Schoolboy Fascination" by Al James</a>
          </li>
          <li>
            <a href="http://www.cambridge-mt.com/ms-mtk.htm">"Shore" by Motor Tapes</a>
          </li>
          <li>
            <a href="http://www.cambridge-mt.com/ms-mtk.htm">"64 Bristol" by Wess Meets West</a>
          </li>
          <li>
            <a href="http://www.cambridge-mt.com/ms-mtk.htm">"Slow Down" by Jessica Childress</a>
          </li>
          <li>
            <a href="http://www.cambridge-mt.com/ms-mtk.htm">"Talk To Me Baby" by Zane Carney & Friends</a>
          </li>
          <li>
            <a href="http://www.cambridge-mt.com/ms-mtk.htm">"Tears In The Rain" by Rod Alexander</a>
          </li>
          <li>
            <a href="http://www.cambridge-mt.com/ms-mtk.htm">"That's Entertainment" by Öjebokören</a>
          </li>
          <li>
            <a href="http://www.cambridge-mt.com/ms-mtk.htm">"The Blues Is A Lady" by Peter White</a>
          </li>
          <li>
            <a href="http://www.cambridge-mt.com/ms-mtk.htm">"Back Home To Blue" by The Long Wait</a>
          </li>
          <li>
            <a href="http://www.cambridge-mt.com/ms-mtk.htm">"Through My Eyes" by Jay Menon</a>
          </li>
          <li>
            <a href="http://www.cambridge-mt.com/ms-mtk.htm">"Too Bright" by μ</a>
          </li>
          <li>
            <a href="http://www.cambridge-mt.com/ms-mtk.htm">"Trude The Bumblebee" by Don Camillo Choir: Kasimir's Adventure</a>
          </li>
          <li>
            <a href="http://acustica.ing.unibo.it/opera/">D’Orazio et al. (2016) Recordings of Italian Opera orchestra and soloists in a silent room</a>
          </li>
          <li>
            <a href="http://www.cambridge-mt.com/ms-mtk.htm">"Widow" by Triviul feat. The Fiend</a>
          </li>
          <li>
            <a href="http://www.cambridge-mt.com/ms-mtk.htm">"Lament" by Wolf's Head & Vixen Morris Band</a>
          </li>
          <li>
            <a href="http://www.cambridge-mt.com/ms-mtk.htm">"Word Gets Around" by St Vitus</a>
          </li>
        </ul>
      </div>
      <TextButton text='Back' onClick={onReturn} />
    </div>
  );
};

export default CreditsPage;