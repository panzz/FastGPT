import type { NextApiRequest, NextApiResponse } from 'next';
import { jsonRes } from '/common/service/common/response';
import { connectToDatabase } from '@/service/mongo';
import { authCert } from '/common/service/support/permission/auth/common';
import { MongoPlugin } from '/common/service/core/plugin/schema';

export default async function handler(req: NextApiRequest, res: NextApiResponse<any>) {
  try {
    await connectToDatabase();
    const { teamId } = await authCert({ req, authToken: true });

    jsonRes(res, {
      data: await MongoPlugin.find({ teamId })
    });
  } catch (err) {
    jsonRes(res, {
      code: 500,
      error: err
    });
  }
}
