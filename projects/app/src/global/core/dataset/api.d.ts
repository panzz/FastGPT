import { PushDatasetDataChunkProps } from '/common/global/core/dataset/api';
import { DatasetSearchModeEnum, TrainingModeEnum } from '/common/global/core/dataset/constant';
import {
  DatasetDataIndexItemType,
  SearchDataResponseItemType
} from '/common/global/core/dataset/type';

/* ================= dataset ===================== */
export type CreateDatasetParams = {
  parentId?: string;
  name: string;
  tags: string;
  avatar: string;
  vectorModel?: string;
  agentModel?: string;
  type: `${DatasetTypeEnum}`;
};

/* ================= collection ===================== */

/* ================= data ===================== */
export type InsertOneDatasetDataProps = PushDatasetDataChunkProps & {
  collectionId: string;
};
export type PushDatasetDataProps = {
  collectionId: string;
  data: PushDatasetDataChunkProps[];
  mode: `${TrainingModeEnum}`;
  prompt?: string;
  billId?: string;
};
export type UpdateDatasetDataProps = {
  id: string;
  q?: string; // embedding content
  a?: string; // bonus content
  indexes: (Omit<DatasetDataIndexItemType, 'dataId'> & {
    dataId?: string; // pg data id
  })[];
};

/* -------------- search ---------------- */
export type SearchTestProps = {
  datasetId: string;
  text: string;
  limit?: number;
  searchMode?: `${DatasetSearchModeEnum}`;
};
export type SearchTestResponse = {
  list: SearchDataResponseItemType[];
  duration: string;
};
