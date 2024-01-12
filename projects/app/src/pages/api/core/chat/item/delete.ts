import type { NextApiRequest, NextApiResponse } from 'next';
import { jsonRes } from '/common/service/common/response';
import { connectToDatabase } from '@/service/mongo';
import { MongoChatItem } from '/common/service/core/chat/chatItemSchema';
import { authChat } from '/common/service/support/permission/auth/chat';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    await connectToDatabase();
    const { chatId, contentId } = req.query as { chatId: string; contentId: string };

    await authChat({ req, authToken: true, chatId, per: 'w' });

    await MongoChatItem.deleteOne({
      dataId: contentId,
      chatId
    });

    jsonRes(res);
  } catch (err) {
    jsonRes(res, {
      code: 500,
      error: err
    });
  }
}
