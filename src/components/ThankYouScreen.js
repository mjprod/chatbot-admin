import React from 'react';
import PropTypes from 'prop-types';
import './ThankYouScreen.css';
import {ReactComponent as IconThankYouFeedback} from '../assets/iconThankyouFeedback.svg';

const messages = {
  en: {
    thankYou: 'Feedback Submitted!',
    seeYouSoon: 'Your feedback will be submitted for review.',
  },
  'ms-MY': {
    thankYou: 'Maklum Balas Dihantar!',
    seeYouSoon: 'Maklum balas anda akan diserahkan untuk semakan.',
  },
  cn: {
    thankYou: '反馈已提交！',
    seeYouSoon: '您的反馈将提交供审核',
  },
};

const ThankYouScreen = ({ language }) => {
  const { thankYou, seeYouSoon } = messages[language] || messages['en'];

  return (
    <div className='thankyou-container'>
      <div className="thankyou-card">
        <IconThankYouFeedback className="icon-thankyou-feedback" />
        <h3 className="thankyou-heading">{thankYou}</h3>
        <p className="thankyou-text">{seeYouSoon}</p>
        <button
          className="thankyou-button"
          onClick={() => window.location.reload()}
        >
          ↻ Reload
        </button>
      </div>
    </div>
  );
};

ThankYouScreen.propTypes = {
  language: PropTypes.string.isRequired,
};

export default ThankYouScreen;
