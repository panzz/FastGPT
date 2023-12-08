import { ChatMessageItemType } from '/common/global/core/ai/type.d';

export type CreateQuestionGuideParams = {
  messages: ChatMessageItemType[];
  shareId?: string;
};
