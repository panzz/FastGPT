// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { jsonRes } from '/common/service/common/response';
import { authCert } from '/common/service/support/permission/auth/common';
import { connectToDatabase, initRootUser } from '@/service/mongo';
import { getUserDetail } from '@/service/support/user/controller';
import { MongoUser } from '/common/service/support/user/schema';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    await connectToDatabase();
    console.debug('tokenLogin> start...');
    const { tmbId, email } = await authCert({ req, authToken: true });
    console.debug('tokenLogin>  tmbId:%o, email:%o', tmbId, email);

    let user;
    const isBrowser = typeof window !== 'undefined';
    console.debug('tokenLogin> isBrowser:%o', isBrowser);
    let data;
    if (tmbId) {
      data = await getUserDetail({ tmbId });
      console.debug('tokenLogin:getUserDetail> data:%o', data);
    } else if (!isBrowser && !tmbId?.length && email?.length) {
      try {
        // const users = await User.find({ username: email });
        const users = await MongoUser.findOne({
          username: email
        });
        console.debug('tokenLogin> users:%o', users);
        console.debug('tokenLogin> email:%o', email);
        // 如果没有用户则创建用户
        if ((!users || !users.length) && email?.length) {
          // const nuser = await User.create({
          //   username: email,
          //   password: createHashPassword(`${userId}-${new Date().getTime()}`),
          //   balance: 2 * PRICE_SCALE
          // });
          data = await initRootUser(email);
          console.debug('tokenLogin:initRootUser> data:%o', data);
        } else {
          data = users[0];
          console.debug('tokenLogin:users[0]> data:%o', data);
        }
      } catch (e: any) {
        console.error('tokenLogin> error:%o', e?.message);
      }
    }
    console.debug('tokenLogin> data:%o', data);
    jsonRes(res, {
      data: data
    });
  } catch (err) {
    jsonRes(res, {
      code: 500,
      error: err
    });
  }
}
