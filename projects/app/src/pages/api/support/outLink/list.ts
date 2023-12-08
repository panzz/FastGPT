import type { NextApiRequest, NextApiResponse } from 'next';
import { jsonRes } from '/common/service/common/response';
import { connectToDatabase } from '@/service/mongo';
import { MongoOutLink } from '/common/service/support/outLink/schema';
import { authApp } from '/common/service/support/permission/auth/app';

/* get shareChat list by appId */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    await connectToDatabase();

    const { appId } = req.query as {
      appId: string;
    };

    const { teamId, tmbId, isOwner } = await authApp({ req, authToken: true, appId, per: 'w' });

    const data = await MongoOutLink.find({
      appId,
      ...(isOwner ? { teamId } : { tmbId })
    }).sort({
      _id: -1
    });

    jsonRes(res, { data });
  } catch (err) {
    jsonRes(res, {
      code: 500,
      error: err
    });
  }
}
