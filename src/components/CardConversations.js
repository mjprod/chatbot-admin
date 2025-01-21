import { calculateTimeDifferences, timeToMinutes } from "../utils/timestamp";
import "./CardConversations.css";

const CardConversations = ({
  conversation,
  onSelectConversation,
  handleToggleConversation,
}) => {


  const maxMinutes = 1000;
  const mediumMinutes = 500;

  const isHoldOn = conversation.status === "HOLD ON";

  const { lastTime, formatted } = calculateTimeDifferences(
      conversation.messages|| []
    );

  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  const lastReplyMinutes = timeToMinutes(lastTime);
  const minutesDifference = currentMinutes - lastReplyMinutes;

    const cardTypeClass = isHoldOn
    ? minutesDifference > maxMinutes
      ? "card-onhold-danger"
      : "card-active"
    : minutesDifference > maxMinutes
    ? "card-danger"
    : minutesDifference > mediumMinutes
    ? "card-warning"
    : "card-normal";

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
      minutesDifference > maxMinutes
        ? "last-reply-danger"
        : minutesDifference > mediumMinutes
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
            className={`state-button ${
              isHoldOn ? "state-active" : cardTypeClass
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