import React, { useEffect, useState } from "react";
import Rating from "./Rating.js";
import "./Feedback.css";
import ThankYouScreen from "./ThankYouScreen.js";
//import useApiRequest from "../hook/useApiRequest.js";

const Feedback = ({
  onLike,
  onDislike,
  onClearThumbs,
  lastMessage,
  aiAnswer,
  language,
  chatBodyRef,
  conversation_id,
}) => {
  const [isLiked, setIsLiked] = useState(false);
  const [isDisliked, setIsDisliked] = useState(false);
  const [rating, setRating] = useState(undefined);
  const [showConfirmButton, setShowConfirmButton] = useState(false);
  const [correctAnswer, setCorrectAnswer] = useState("");
  const [showThankYou, setShowThankYou] = useState(false);
  //const { loading, saveFeedback } = useApiRequest();

  const handleScrollToBottom = () => {
    if (chatBodyRef && chatBodyRef.current) {
      chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    handleScrollToBottom(); // Automatically scroll to the bottom when needed
  }, [showConfirmButton, showThankYou]);

  // Handles "like" button click
  const handleLike = () => {
    if (isLiked) {
      setIsLiked(false);
      onClearThumbs();
    } else {
      setIsLiked(true); // Sets the "liked" state
      setIsDisliked(false);
      onLike(); // Calls the onLike function passed as a prop
      setCorrectAnswer("");
    }
  };

  const handleDislike = () => {
    if (isDisliked) {
      setIsDisliked(false);
      onClearThumbs();
    } else {
      setIsDisliked(true);
      setIsLiked(false);
      onDislike();
      setRating(0);
      setShowConfirmButton(false);
      setCorrectAnswer("");
    }
  };

  // Handles changes in the rating value
  const handleRatingChange = (newRating) => {
    console.log("New Rating:", newRating); // Logs the new rating for debugging
    setRating(newRating); // Updates the rating state
    if (newRating <= 3) {
      setShowConfirmButton(false);
    } else {
      setShowConfirmButton(true);
      setCorrectAnswer("");
    }
  };

  const handleRightAnswer = (text) => {
    setCorrectAnswer(text);
    if (text.length > 0) {
      setShowConfirmButton(true);
    } else {
      setShowConfirmButton(false);
    }
  };

  const handleSubmitServer = async () => {
    // Create the feedbackData object with necessary data
    const feedbackData = {
      conversation_id: conversation_id,
      user_id: 0, // Default user ID, adjust as needed
      prompt: lastMessage, // Original question from user input
      cleaned_prompt: aiAnswer.cleaned_prompt, // Processed question (if available)
      generation: aiAnswer.generation, // AI-generated answer text
      correct_bool: isLiked ? true : isDisliked ? false : null,
      correct_answer: correctAnswer || "", // Only add if disliked
      chat_rating: rating,
      translations: [
        { language: "en", text: aiAnswer.translations[0].text }, // English translation
        { language: "ms-MY", text: aiAnswer.translations[1].text }, // Placeholder for Malay text
        { language: "cn", text: aiAnswer.translations[2].text }, // Placeholder for Chinese text
      ],
    };

    console.log("Feedback Data:", feedbackData); // Log the feedback data

    /*const result = await saveFeedback(feedbackData);

    if (result.success) {
      setShowThankYou(true);
      console.log("Saved:", result.success);
    } else {
      console.log(
        "Error Saved:",
        result.error || "Failed to submit feedback. Please try again."
      );
    }*/
    //setLoading(false);
  };

  return (
    <div className="feedback">
      <div className="feedback-buttons">
        {/* Like button with conditional 'liked' class */}
        <button
          onClick={handleLike}
          className={`thumb ${isLiked ? "liked" : ""}`}
        >
          👍
        </button>
        {/* Dislike button */}
        <button
          onClick={handleDislike}
          className={`thumb ${isDisliked ? "disliked" : ""}`}
        >
          👎
        </button>
      </div>

      {isLiked && (
        <div className="rating">
          {/* Rating component with a maximum rating of 6 */}
          <Rating
            maxRating={6}
            initialRating={rating}
            onRatingChange={handleRatingChange}
          />
        </div>
      )}

      {(isDisliked || rating <= 3) && (
        <div className="rating-text">
          <textarea
            rows="6"
            type="text"
            value={correctAnswer}
            onChange={(e) => handleRightAnswer(e.target.value)}
            placeholder={"Add correct answer..."}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleSubmitServer();
              }
            }}
          />
        </div>
      )}

      {showConfirmButton && (
        <button
          onClick={handleSubmitServer}
          className="confirm-button"
          //disabled={loading}
        >
          {/*loading ? "Loading..." : "Confirm"*/}
        </button>
      )}

      {showThankYou && <ThankYouScreen language={language} />}
    </div>
  );
};

export default Feedback;
