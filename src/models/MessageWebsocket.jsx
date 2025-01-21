class MessageWebsocket {
  constructor({
    conversationId,
    text,
    sender,
    botId = '',
    user,
    type = 'message',
  }) {
    this.text = text;
    this.sender = sender;
    this.conversationId = conversationId;
    this.bot_id = botId;
    this.user = user;
    this.timestamp = MessageWebsocket.generateTimestamp();
    this.type = type;
  }

  // Static method to generate a timestamp
  static generateTimestamp() {
    return new Date().toISOString();
  }

  // Method to validate the message structure
  validate() {
    if (!this.text || !this.sender || !this.conversationId || !this.user) {
      throw new Error('Message is missing required fields');
    }
  }

  // Method to convert the message to JSON (e.g., for WebSocket transmission)
  toJSON() {
    return JSON.stringify({
      text: this.text,
      sender: this.sender,
      conversationId: this.conversationId,
      bot_id: this.bot_id,
      user: this.user,
      timestamp: this.timestamp,
      type: this.type,
    });
  }
}

export default MessageWebsocket;
