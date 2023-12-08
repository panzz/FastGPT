import type { AppTTSConfigType } from '/common/global/core/module/type.d';

export type GetChatSpeechProps = {
  ttsConfig: AppTTSConfigType;
  input: string;
  shareId?: string;
};
