import { useEffect, useState } from "react";
import { calculateTimeDifferences, timeToMinutes } from "../utils/timestamp";
import "./CardConversations.css";

const CardConversations = ({
  conversation,
  onSelectConversation,
  handleToggleConversation,
}) => {
  const maxMinutes = 2;
  const mediumMinutes = 1;

  const isHoldOn = conversation.status === "HOLD ON";

  const [lastTime, setLastTime] = useState(calculateTimeDifferences(conversation.messages || []).lastTime);
  const [formatted, setFormatted] = useState(calculateTimeDifferences(conversation.messages || []).formatted);

  const lastReplyMinutes = timeToMinutes(lastTime);

  useEffect(() => {
    const refreshTimes = () => {
      const { lastTime: newLastTime, formatted: newFormatted } = calculateTimeDifferences(conversation.messages || []);
      setLastTime(newLastTime);
      setFormatted(newFormatted);
    };
    const intervalId = setInterval(refreshTimes, 30000);
    return () => clearInterval(intervalId);
  }, [conversation.messages]);

  let cardTypeClass;
  if (isHoldOn) {
    cardTypeClass = lastReplyMinutes > maxMinutes
      ? "card-onhold-danger"
      : "card-active";
  } else {
    cardTypeClass = lastReplyMinutes > maxMinutes
      ? "card-danger"
      : lastReplyMinutes > mediumMinutes
        ? "card-warning"
        : "card-normal";
  }

  return (
    <div className={`overlay-card ${isHoldOn}`}>
      <li
        className={`conversation-card ${cardTypeClass}`}
        onClick={() => onSelectConversation(conversation.id)}
      >
        <div className="card-content">
          {/* Timestamp and Last Reply */}
          <div className="card-timestamp">
            <span>{formatted}</span>
            <span className="last-reply">
              Last Reply:{" "}
              <span
                className={
                  lastReplyMinutes > maxMinutes
                    ? "last-reply-danger"
                    : lastReplyMinutes > mediumMinutes
                      ? "last-reply-warning"
                      : isHoldOn
                        ? "last-reply-active"
                        : "last-reply-normal"
                }
              >
                {lastTime}
              </span>
            </span>
          </div>

          {/* User Info */}
          <div className="card-user">
            <div className="avatar">{conversation.user.charAt(0).toUpperCase()}</div>
            <div className="user-name">{conversation.user.charAt(0).toUpperCase() + conversation.user.slice(1)}</div>
          </div>
        <div className="horizontal-separator"><hr/></div>

          {/* Actions */}
          <div className="card-actions">
            <label className="toggle-switch">
              <input
                type="checkbox"
                checked={isHoldOn}
                onChange={(e) => {
                  e.stopPropagation();
                  handleToggleConversation(conversation.id);
                }}
              />
              <span className="slider"></span>
            </label>
            <button
              className={`state-button ${isHoldOn ? "state-active" : cardTypeClass
                }`}
            >
              {isHoldOn ? "You have taken control" : "Auto Pilot ON"}
            </button>
          </div>
        </div>
        </li>
        
    </div>
    
  );
};

export default CardConversations;