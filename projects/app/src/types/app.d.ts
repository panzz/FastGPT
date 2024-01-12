import { FlowNodeTypeEnum } from '/common/global/core/module/node/constant';
import { ModuleDataTypeEnum } from '/common/global/core/module/constants';
import { XYPosition } from 'reactflow';
import { AppModuleItemTypeEnum, ModulesInputItemTypeEnum } from '../constants/app';
import { AppTypeEnum } from '/common/global/core/app/constants';
import type {
  FlowNodeInputItemType,
  FlowNodeOutputItemType,
  FlowNodeOutputTargetItemType
} from '/common/global/core/module/node/type.d';
import type { FlowModuleTemplateType, ModuleItemType } from '/common/global/core/module/type.d';
import type { ChatSchema } from '/common/global/core/chat/type';
import type { AppSchema } from '/common/global/core/app/type';
import { ChatModelType } from '@/constants/model';

export interface ShareAppItem {
  _id: string;
  avatar: string;
  name: string;
  intro: string;
  userId: string;
  share: AppSchema['share'];
  isCollection: boolean;
}

/* app module */
export type AppItemType = {
  id: string;
  name: string;
  modules: ModuleItemType[];
};

export type RunningModuleItemType = {
  name: ModuleItemType['name'];
  moduleId: ModuleItemType['moduleId'];
  flowType: ModuleItemType['flowType'];
  showStatus?: ModuleItemType['showStatus'];
} & {
  inputs: {
    key: string;
    value?: any;
  }[];
  outputs: {
    key: string;
    answer?: boolean;
    response?: boolean;
    value?: any;
    targets: {
      moduleId: string;
      key: string;
    }[];
  }[];
};

export type AppLogsListItemType = {
  _id: string;
  id: string;
  source: ChatSchema['source'];
  time: Date;
  title: string;
  messageCount: number;
  feedbackCount: number;
  markCount: number;
};
