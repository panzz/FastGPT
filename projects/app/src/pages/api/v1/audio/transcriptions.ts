import type { NextApiRequest, NextApiResponse } from 'next';
import { jsonRes } from '/common/service/common/response';
import { authCert, authCertAndShareId } from '/common/service/support/permission/auth/common';
import { withNextCors } from '/common/service/common/middle/cors';
import { getUploadModel } from '/common/service/common/file/upload/multer';
import fs from 'fs';
import { getAIApi } from '/common/service/core/ai/config';
import { pushWhisperBill } from '@/service/support/wallet/bill/push';

const upload = getUploadModel({
  maxSize: 2
});

export default withNextCors(async function handler(req: NextApiRequest, res: NextApiResponse<any>) {
  try {
    const {
      files,
      metadata: { duration, shareId }
    } = await upload.doUpload<{ duration: number; shareId?: string }>(req, res);

    const { teamId, tmbId } = await authCert({ req, authToken: true });

    if (!global.whisperModel) {
      throw new Error('whisper model not found');
    }

    const file = files[0];

    if (!file) {
      throw new Error('file not found');
    }

    const ai = getAIApi();

    const result = await ai.audio.transcriptions.create({
      file: fs.createReadStream(file.path),
      model: global.whisperModel.model
    });

    pushWhisperBill({
      teamId,
      tmbId,
      duration
    });

    jsonRes(res, {
      data: result.text
    });
  } catch (err) {
    console.log(err);
    jsonRes(res, {
      code: 500,
      error: err
    });
  }
});

export const config = {
  api: {
    bodyParser: false
  }
};
