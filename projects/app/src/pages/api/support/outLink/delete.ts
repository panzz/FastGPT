import type { NextApiRequest, NextApiResponse } from 'next';
import { jsonRes } from '/common/service/common/response';
import { connectToDatabase } from '@/service/mongo';
import { MongoOutLink } from '/common/service/support/outLink/schema';
import { authOutLinkCrud } from '/common/service/support/permission/auth/outLink';

/* delete a shareChat by shareChatId */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    await connectToDatabase();

    const { id } = req.query as {
      id: string;
    };

    await authOutLinkCrud({ req, outLinkId: id, authToken: true, per: 'owner' });

    await MongoOutLink.findByIdAndRemove(id);

    jsonRes(res);
  } catch (err) {
    jsonRes(res, {
      code: 500,
      error: err
    });
  }
}
