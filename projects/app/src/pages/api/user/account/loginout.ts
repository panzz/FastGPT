// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { jsonRes } from '/common/service/common/response';
import { clearCookie } from '/common/service/support/permission/controller';

export default async function handler(req: NextApiRequest, res: NextApiResponse<any>) {
  try {
    clearCookie(res);
    jsonRes(res);
  } catch (err) {
    jsonRes(res, {
      code: 500,
      error: err
    });
  }
}
