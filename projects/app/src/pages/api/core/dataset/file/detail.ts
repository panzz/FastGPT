import type { NextApiRequest, NextApiResponse } from 'next';
import { jsonRes } from '/common/service/common/response';
import { connectToDatabase } from '@/service/mongo';
import { authDatasetFile } from '/common/service/support/permission/auth/dataset';
import { DatasetFileSchema } from '/common/global/core/dataset/type.d';

export default async function handler(req: NextApiRequest, res: NextApiResponse<any>) {
  try {
    await connectToDatabase();

    const { fileId } = req.query as { fileId: string };
    // 凭证校验
    const { file } = await authDatasetFile({ req, authToken: true, fileId, per: 'r' });

    jsonRes<DatasetFileSchema>(res, {
      data: file
    });
  } catch (err) {
    jsonRes(res, {
      code: 500,
      error: err
    });
  }
}
