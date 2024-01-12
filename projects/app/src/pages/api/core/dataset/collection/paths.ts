import type { NextApiRequest, NextApiResponse } from 'next';
import { jsonRes } from '/common/service/common/response';
import { connectToDatabase } from '@/service/mongo';
import type { ParentTreePathItemType } from '/common/global/common/parentFolder/type.d';
import { getDatasetCollectionPaths } from '/common/service/core/dataset/collection/utils';
import { authDatasetCollection } from '/common/service/support/permission/auth/dataset';

export default async function handler(req: NextApiRequest, res: NextApiResponse<any>) {
  try {
    await connectToDatabase();

    const { parentId } = req.query as { parentId: string };

    if (!parentId) {
      return jsonRes(res, {
        data: []
      });
    }

    await authDatasetCollection({ req, authToken: true, collectionId: parentId, per: 'r' });
    const paths = await getDatasetCollectionPaths({
      parentId
    });

    jsonRes<ParentTreePathItemType[]>(res, {
      data: paths
    });
  } catch (err) {
    jsonRes(res, {
      code: 500,
      error: err
    });
  }
}
