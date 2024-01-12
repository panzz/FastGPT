import type {
  ChatModelItemType,
  FunctionModelItemType,
  LLMModelItemType,
  VectorModelItemType,
  AudioSpeechModels,
  WhisperModelType,
  ReRankModelItemType
} from '/common/global/core/ai/model.d';

import type { FeConfigsType } from '/common/global/common/system/types/index.d';
import { AppSimpleEditConfigTemplateType } from '/common/global/core/app/type';

export type ConfigFileType = {
  FeConfig: FeConfigsType;
  SystemParams: SystemEnvType;
  ChatModels: ChatModelItemType[];
  QAModels: LLMModelItemType[];
  CQModels: FunctionModelItemType[];
  ExtractModels: FunctionModelItemType[];
  QGModels: LLMModelItemType[];
  VectorModels: VectorModelItemType[];
  ReRankModels: ReRankModelItemType[];
  AudioSpeechModels: AudioSpeechModelType[];
  WhisperModel: WhisperModelType;
};
export type InitDateResponse = {
  chatModels: ChatModelItemType[];
  qaModels: LLMModelItemType[];
  cqModels: FunctionModelItemType[];
  extractModels: FunctionModelItemType[];
  vectorModels: VectorModelItemType[];
  audioSpeechModels: AudioSpeechModels[];
  reRankModels: ReRankModelItemType[];
  feConfigs: FeConfigsType;
  priceMd: string;
  systemVersion: string;
  simpleModeTemplates: AppSimpleEditConfigTemplateType[];
};
