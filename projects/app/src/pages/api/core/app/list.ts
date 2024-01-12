import type { NextApiRequest, NextApiResponse } from 'next';
import { jsonRes } from '/common/service/common/response';
import { connectToDatabase } from '@/service/mongo';
import { MongoApp } from '/common/service/core/app/schema';
import { mongoRPermission } from '/common/global/support/permission/utils';
import { AppListItemType } from '/common/global/core/app/type';
import { authUserRole } from '/common/service/support/permission/auth/user';

export default async function handler(req: NextApiRequest, res: NextApiResponse<any>) {
  try {
    await connectToDatabase();
    // 凭证校验
    const { teamId, tmbId, teamOwner, role } = await authUserRole({ req, authToken: true });

    // 根据 userId 获取模型信息
    const myApps = await MongoApp.find(
      { ...mongoRPermission({ teamId, tmbId, role }) },
      '_id avatar name intro tmbId permission'
    ).sort({
      updateTime: -1
    });
    jsonRes<AppListItemType[]>(res, {
      data: myApps.map((app) => ({
        _id: app._id,
        avatar: app.avatar,
        name: app.name,
        intro: app.intro,
        isOwner: teamOwner || String(app.tmbId) === tmbId,
        permission: app.permission
      }))
    });
  } catch (err) {
    jsonRes(res, {
      code: 500,
      error: err
    });
  }
}
