import type { NextApiRequest, NextApiResponse } from 'next';
import { jsonRes } from '/common/service/common/response';
import { connectToDatabase } from '@/service/mongo';
import { MongoDatasetTraining } from '/common/service/core/dataset/training/schema';
import { findCollectionAndChild } from '/common/service/core/dataset/collection/utils';
import { delDataByCollectionId } from '@/service/core/dataset/data/controller';
import { MongoDatasetCollection } from '/common/service/core/dataset/collection/schema';
import { authDatasetCollection } from '/common/service/support/permission/auth/dataset';
import { delFileById } from '/common/service/common/file/gridfs/controller';
import { BucketNameEnum } from '/common/global/common/file/constants';

export default async function handler(req: NextApiRequest, res: NextApiResponse<any>) {
  try {
    await connectToDatabase();

    const { collectionId } = req.query as { collectionId: string };

    if (!collectionId) {
      throw new Error('CollectionIdId is required');
    }

    const { teamId } = await authDatasetCollection({
      req,
      authToken: true,
      collectionId,
      per: 'w'
    });

    // find all delete id
    const collections = await findCollectionAndChild(collectionId, '_id metadata');
    const delIdList = collections.map((item) => item._id);

    // delete training data
    await MongoDatasetTraining.deleteMany({
      collectionId: { $in: delIdList },
      teamId
    });

    // delete pg data
    await delDataByCollectionId({ collectionIds: delIdList });

    // delete file
    await Promise.all(
      collections.map((collection) => {
        if (!collection.metadata?.fileId) return;
        return delFileById({
          bucketName: BucketNameEnum.dataset,
          fileId: collection.metadata.fileId
        });
      })
    );

    // delete collection
    await MongoDatasetCollection.deleteMany({
      _id: { $in: delIdList }
    });

    jsonRes(res);
  } catch (err) {
    jsonRes(res, {
      code: 500,
      error: err
    });
  }
}
