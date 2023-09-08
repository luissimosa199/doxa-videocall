import { prop, getModelForClass, modelOptions } from '@typegoose/typegoose';

@modelOptions({ schemaOptions: { collection: 'chatMessages' } })
class ChatMessage {
  @prop({ required: true })
  username!: string;

  @prop({ required: true })
  message!: string;

  @prop({ default: Date.now })
  timestamp!: Date;

  @prop({ required: true })
  room!: string;
}

const ChatMessageModel = getModelForClass(ChatMessage);

export default ChatMessageModel;