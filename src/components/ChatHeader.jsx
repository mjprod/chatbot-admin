import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { languages } from '../data/arrays';
import { calculateTimeDifferences } from '../utils/timestamp';
import './ChatHeader.css';
import { ReactComponent as IconTotalTime } from '../assets/iconTotalTime.svg';
import { ReactComponent as IconGlobeLanguage} from '../assets/iconGlobeLanguage.svg';

const ChatHeader = ({
  conversation,
}) => {

  const {t} = useTranslation();

  const { totalTime, lastTime } = calculateTimeDifferences(
    conversation.messages
  );

  const getLanguageLabel = (code) => {
    const language = languages.find((lang) => lang.code === code);
    return language ? language.label : "###";
  };
  return (
    <div className="chat-header">
      <div className="user-info">
        <div className="user-avatar">{conversation.user[0].toUpperCase()}</div>
        <div className="user-name-container">
        <div className="user-name">{conversation.user.charAt(0).toUpperCase() + conversation.user.slice(1)}
      </div>
      <div className="conversation-id">{t('conversation_id', { id: conversation.id })}</div>
      </div>
    </div>
      <div className="conversation-details">
        <div className="conversation-id">{t('conversation_id', { id: conversation.id })}</div>
        <div className="time-details">
          <span><IconTotalTime className="icon-total-time"/> {t('total')}  {totalTime !== null ? `${totalTime}` : "N/A"}</span>
          <span> | {t('last_reply')} {lastTime !== null ? `${lastTime}` : "N/A"}</span>
        </div>
        <div className="language">
        <IconGlobeLanguage className="icon-globe-language"/>  {t('language')}
          <span>
            {conversation.messages.length > 1 && conversation.messages[1].language
              ? getLanguageLabel(conversation.messages[1].language)
              : "###"
            }
          </span>
        </div>
      </div>
    </div>
  );
};
ChatHeader.propTypes = {
  userName: PropTypes.string.isRequired,
  conversationId: PropTypes.string.isRequired,
  totalTime: PropTypes.string.isRequired,
  lastReplyTime: PropTypes.string.isRequired,
  language: PropTypes.string.isRequired,
};

export default ChatHeader;
