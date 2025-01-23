import { useTranslation } from 'react-i18next';
import { ReactComponent as NoChat } from '../assets/nochat.svg';

const ChatEmptyState = () => {
  const { t } = useTranslation();
  return (
    <div className='chat-detail__empty'>
      <NoChat className='no-chat' />
      <h6>{t('select_conversation_to_view')}</h6>
    </div>
  );
};

export default ChatEmptyState;