import type { NextApiRequest, NextApiResponse } from 'next';
import { jsonRes } from '/common/service/common/response';
import { connectToDatabase } from '@/service/mongo';
import { MongoOutLink } from '/common/service/support/outLink/schema';
import type { OutLinkEditType } from '/common/global/support/outLink/type.d';
import { authOutLinkCrud } from '/common/service/support/permission/auth/outLink';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    await connectToDatabase();

    const { _id, name, responseDetail, limit } = req.body as OutLinkEditType & {};

    if (!_id) {
      throw new Error('_id is required');
    }

    await authOutLinkCrud({ req, outLinkId: _id, authToken: true, per: 'owner' });

    await MongoOutLink.findByIdAndUpdate(_id, {
      name,
      responseDetail,
      limit
    });

    jsonRes(res);
  } catch (err) {
    jsonRes(res, {
      code: 500,
      error: err
    });
  }
}
