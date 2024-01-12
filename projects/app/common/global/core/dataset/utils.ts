import { DatasetCollectionTypeEnum, DatasetDataIndexTypeEnum } from './constant';
import { getFileIcon } from '../../common/file/icon';
import { strIsLink } from '../../common/string/tools';

export function getCollectionIcon(
  type: `${DatasetCollectionTypeEnum}` = DatasetCollectionTypeEnum.file,
  name = ''
) {
  if (type === DatasetCollectionTypeEnum.folder) {
    return `${process.env.BASE_PATH}/imgs/files/folder.svg`;
  }
  if (type === DatasetCollectionTypeEnum.link) {
    return `${process.env.BASE_PATH}/imgs/files/link.svg`;
  }
  if (type === DatasetCollectionTypeEnum.virtual) {
    if (name === '手动录入') {
      return `${process.env.BASE_PATH}/imgs/files/manual.svg`;
    } else if (name === '手动标注') {
      return `${process.env.BASE_PATH}/imgs/files/mark.svg`;
    }
    return `${process.env.BASE_PATH}/imgs/files/collection.svg`;
  }
  return getFileIcon(name);
}
export function getSourceNameIcon({
  sourceName,
  sourceId
}: {
  sourceName: string;
  sourceId?: string;
}) {
  if (strIsLink(sourceId)) {
    return `${process.env.BASE_PATH}/imgs/files/link.svg`;
  }
  const fileIcon = getFileIcon(sourceName, '');
  if (fileIcon) {
    return fileIcon;
  }

  if (sourceName === '手动录入') {
    return `${process.env.BASE_PATH}/imgs/files/manual.svg`;
  } else if (sourceName === '手动标注') {
    return `${process.env.BASE_PATH}/imgs/files/mark.svg`;
  }
  return `${process.env.BASE_PATH}/imgs/files/collection.svg`;
}

export function getDefaultIndex(props?: { q?: string; a?: string; dataId?: string }) {
  const { q = '', a, dataId } = props || {};
  const qaStr = `${q}\n${a}`.trim();
  return {
    defaultIndex: true,
    type: a ? DatasetDataIndexTypeEnum.qa : DatasetDataIndexTypeEnum.chunk,
    text: a ? qaStr : q,
    dataId
  };
}
