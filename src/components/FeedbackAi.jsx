import PropTypes from 'prop-types';
import { useState } from 'react';
import useApiRequest from '../hook/useApiRequest.js';
import './FeedbackAi.css';
import ThankYouScreen from './ThankYouScreen.js';

const FeedbackAI = ({ conversation_id }) => {
  const [showConfirmButton, setShowConfirmButton] = useState(false);
  const [correctAnswer, setCorrectAnswer] = useState('');
  const [correctQuestion, setCorrectQuestion] = useState('');
  const { loading, saveFeedback } = useApiRequest();
  const [showThankYou, setShowThankYou] = useState(true);

  const handleRightAnswer = (text) => {
    setCorrectAnswer(text);
    if (text.length > 0) {
      setShowConfirmButton(true);
    } else {
      setShowConfirmButton(false);
    }
  };
  const handleRightQuestion = (text) => {
    setCorrectQuestion(text);
  };
  const handleSubmitServer = async () => {
    // Create the feedbackData object with necessary data
    const feedbackData = {
      conversation_id: conversation_id,
      user_id: 0, // Default user ID, adjust as needed
      prompt: correctQuestion, // Original question from user input
      generation: '', // AI-generated answer text
      correct_bool: false,
      correct_question: correctQuestion || '',
      correct_answer: correctAnswer || '',
      chat_rating: 0,
      translations: [],
    };

    console.log('Feedback Data:', feedbackData); // Log the feedback data

    //TODO - Add language selection
    const result = await saveFeedback(feedbackData, 'en'); // Send feedback to the API

    if (result.success) {
      setShowThankYou(true);
      console.log('Saved:', result.success);
    } else {
      console.log(
        'Error Saved:',
        result.error || 'Failed to submit feedback. Please try again.'
      );
    }
    //setLoading(false);
  };

  return (
    <div className='feedbackai-container'>
      <div className='feedbackai-text'>
        {showThankYou ? (
          <ThankYouScreen language={'en'} />
        ) : (
          <>
            <textarea
              className='correct-question'
              type='text'
              value={correctQuestion}
              onChange={(e) => handleRightQuestion(e.target.value)}
              placeholder={'▼ Add correct question...'}
            />
            <textarea
              className='correct-answer'
              rows='6'
              type='text'
              value={correctAnswer}
              onChange={(e) => handleRightAnswer(e.target.value)}
              placeholder={'▲ Add correct answer...'}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleSubmitServer();
                }
              }}
            />

            {showConfirmButton && (
              <div className='confirm-button-container'>
                <button
                  onClick={handleSubmitServer}
                  className='confirm-button'
                  disabled={loading}
                >
                  {loading ? 'Loading...' : 'Confirm'}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

FeedbackAI.propTypes = {
  lastMessage: PropTypes.string.isRequired,
  conversation_id: PropTypes.number.isRequired,
};
export default FeedbackAI;
