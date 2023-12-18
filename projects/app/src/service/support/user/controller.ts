import { ERROR_ENUM } from '/common/global/common/error/errorCode';
import { MongoUser } from '/common/service/support/user/schema';
import { UserType } from '/common/global/support/user/type';
import {
  getTeamInfoByTmbId,
  getUserDefaultTeam
} from '/common/service/support/user/team/controller';

export async function getUserDetail({
  tmbId,
  userId
}: {
  tmbId?: string;
  userId?: string;
}): Promise<UserType> {
  const team = await (async () => {
    if (tmbId) {
      return getTeamInfoByTmbId({ tmbId });
    }
    if (userId) {
      return getUserDefaultTeam({ userId });
    }
    return Promise.reject(ERROR_ENUM.unAuthorization);
  })();
  const user = await MongoUser.findById(team.userId);

  if (!user) {
    return Promise.reject(ERROR_ENUM.unAuthorization);
  }

  return {
    _id: user._id,
    username: user.username,
    avatar: user.avatar,
    balance: user.balance,
    timezone: user.timezone,
    promotionRate: user.promotionRate,
    openaiAccount: user.openaiAccount,
    team
  };
}