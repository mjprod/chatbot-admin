import React from "react";
import PropTypes from "prop-types";
import "./ThankYouScreen.css";

const messages = {
  en: {
    thankYou: "Thank you for your feedback!",
    seeYouSoon: "We hope to see you again soon.",
  },
  "ms-MY": {
    thankYou: "Terima kasih atas maklum balas anda!",
    seeYouSoon: "Kami berharap dapat melihat anda lagi.",
  },
  cn: {
    thankYou: "感謝您的反饋！",
    seeYouSoon: "希望很快再見到您。",
  },
};

const ThankYouScreen = ({ language }) => {
  const { thankYou, seeYouSoon } = messages[language] || messages["en"];

  return (
    <div className="thankyou-container">
      <div className="thankyou-card">
        <h3 className="thankyou-heading">{thankYou}</h3>
        <p className="thankyou-text">{seeYouSoon}</p>
        <button className="thankyou-button" onClick={() => window.location.reload()}>↻ Reload</button>
      </div>
    </div>
  );
};


ThankYouScreen.propTypes = {
  language: PropTypes.string.isRequired,
};

export default ThankYouScreen;
