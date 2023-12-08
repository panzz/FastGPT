import { authOutLinkLimit } from '@/service/support/outLink/auth';
import { AuthLinkChatProps } from '/common/global/support/outLink/api.d';
import { AuthUserTypeEnum } from '/common/global/support/permission/constant';
import { getUserAndAuthBalance } from './user';
import { authOutLinkValid } from '/common/service/support/permission/auth/outLink';

export async function authOutLinkChat({
  shareId,
  ip,
  authToken,
  question
}: AuthLinkChatProps & {
  shareId: string;
}) {
  // get outLink
  const { shareChat, app } = await authOutLinkValid({ shareId });

  const [user] = await Promise.all([
    getUserAndAuthBalance({ tmbId: shareChat.tmbId, minBalance: 0 }),
    global.feConfigs?.isPlus
      ? authOutLinkLimit({ outLink: shareChat, ip, authToken, question })
      : undefined
  ]);

  return {
    authType: AuthUserTypeEnum.token,
    responseDetail: shareChat.responseDetail,
    user,
    app
  };
}
