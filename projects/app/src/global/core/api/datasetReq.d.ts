import { DatasetCollectionTypeEnum, DatasetTypeEnum } from '/common/global/core/dataset/constant';
import type { RequestPaging } from '@/types';
import { TrainingModeEnum } from '/common/global/core/dataset/constant';
import type { SearchTestItemType } from '@/types/core/dataset';
import { UploadChunkItemType } from '/common/global/core/dataset/type';
import { DatasetCollectionSchemaType } from '/common/global/core/dataset/type';
import { PermissionTypeEnum } from '/common/global/support/permission/constant';
import type { LLMModelItemType } from '/common/global/core/ai/model.d';

/* ===== dataset ===== */
export type DatasetUpdateParams = {
  id: string;
  parentId?: string;
  tags?: string[];
  name?: string;
  avatar?: string;
  permission?: `${PermissionTypeEnum}`;
  agentModel?: LLMModelItemType;
};

/* ======= collections =========== */
export type GetDatasetCollectionsProps = RequestPaging & {
  datasetId: string;
  parentId?: string;
  searchText?: string;
  simple?: boolean;
  selectFolder?: boolean;
};
export type CreateDatasetCollectionParams = {
  datasetId: string;
  parentId?: string;
  name: string;
  type: `${DatasetCollectionTypeEnum}`;
  metadata?: DatasetCollectionSchemaType['metadata'];
  updateTime?: string;
};
export type UpdateDatasetCollectionParams = {
  id: string;
  parentId?: string;
  name?: string;
  metadata?: DatasetCollectionSchemaType['metadata'];
};

/* ==== data ===== */
export type GetDatasetDataListProps = RequestPaging & {
  searchText?: string;
  collectionId: string;
};
