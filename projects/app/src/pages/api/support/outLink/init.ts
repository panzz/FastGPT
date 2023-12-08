import type { NextApiRequest, NextApiResponse } from 'next';
import { jsonRes } from '/common/service/common/response';
import { connectToDatabase } from '@/service/mongo';
import { MongoUser } from '/common/service/support/user/schema';
import type { InitShareChatResponse } from '/common/global/support/outLink/api.d';
import { HUMAN_ICON } from '/common/global/core/chat/constants';
import { getGuideModule } from '/common/global/core/module/utils';
import { authShareChatInit } from '@/service/support/outLink/auth';
import { getChatModelNameListByModules } from '@/service/core/app/module';
import { authOutLinkValid } from '/common/service/support/permission/auth/outLink';

/* init share chat window */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    await connectToDatabase();
    let { shareId, authToken } = req.query as {
      shareId: string;
      authToken?: string;
    };

    // get shareChat
    const { app, shareChat } = await authOutLinkValid({ shareId });

    // 校验使用权限
    const [user] = await Promise.all([
      MongoUser.findById(shareChat.userId, 'avatar'),
      authShareChatInit({
        authToken,
        tokenUrl: shareChat.limit?.hookUrl
      })
    ]);

    jsonRes<InitShareChatResponse>(res, {
      data: {
        userAvatar: user?.avatar || HUMAN_ICON,
        app: {
          userGuideModule: getGuideModule(app.modules),
          chatModels: getChatModelNameListByModules(app.modules),
          name: app.name,
          avatar: app.avatar,
          intro: app.intro
        }
      }
    });
  } catch (err) {
    jsonRes(res, {
      code: 500,
      error: err
    });
  }
}
