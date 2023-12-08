import type { NextApiRequest, NextApiResponse } from 'next';
import { jsonRes } from '/common/service/common/response';
import { connectToDatabase } from '@/service/mongo';
import { MongoChat } from '/common/service/core/chat/chatSchema';
import { MongoApp } from '/common/service/core/app/schema';
import { MongoOutLink } from '/common/service/support/outLink/schema';
import { authApp } from '/common/service/support/permission/auth/app';

/* 获取我的模型 */
export default async function handler(req: NextApiRequest, res: NextApiResponse<any>) {
  try {
    await connectToDatabase();
    const { appId } = req.query as { appId: string };

    if (!appId) {
      throw new Error('参数错误');
    }

    // 凭证校验
    await authApp({ req, authToken: true, appId, per: 'owner' });

    // 删除对应的聊天
    await MongoChat.deleteMany({
      appId
    });

    // 删除分享链接
    await MongoOutLink.deleteMany({
      appId
    });

    // 删除模型
    await MongoApp.deleteOne({
      _id: appId
    });

    jsonRes(res);
  } catch (err) {
    jsonRes(res, {
      code: 500,
      error: err
    });
  }
}
