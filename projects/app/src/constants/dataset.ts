import { defaultQAModels, defaultVectorModels } from '/common/global/core/ai/model';
import type {
  DatasetCollectionItemType,
  DatasetItemType
} from '/common/global/core/dataset/type.d';

export const defaultDatasetDetail: DatasetItemType = {
  _id: '',
  parentId: '',
  userId: '',
  teamId: '',
  tmbId: '',
  updateTime: new Date(),
  type: 'dataset',
  avatar: `${process.env.BASE_PATH}/icon/logo.svg`,
  name: '',
  tags: [],
  permission: 'private',
  isOwner: false,
  canWrite: false,
  vectorModel: defaultVectorModels[0],
  agentModel: defaultQAModels[0]
};

export const defaultCollectionDetail: DatasetCollectionItemType = {
  _id: '',
  userId: '',
  teamId: '',
  tmbId: '',
  datasetId: {
    _id: '',
    parentId: '',
    userId: '',
    teamId: '',
    tmbId: '',
    updateTime: new Date(),
    type: 'dataset',
    avatar: `${process.env.BASE_PATH}/icon/logo.svg`,
    name: '',
    tags: [],
    permission: 'private',
    vectorModel: defaultVectorModels[0].model,
    agentModel: defaultQAModels[0].model
  },
  parentId: '',
  name: '',
  type: 'file',
  updateTime: new Date(),
  metadata: {},
  canWrite: false,
  sourceName: '',
  sourceId: ''
};
