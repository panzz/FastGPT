// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import Cookie from 'cookie';
import type { NextApiRequest, NextApiResponse } from 'next';
import { jsonRes } from '/common/service/common/response';
import { authCert } from '/common/service/support/permission/auth/common';
import { connectToDatabase, initRootUser } from '@/service/mongo';
import { getUserDetail } from '@/service/support/user/controller';
import { MongoUser } from '/common/service/support/user/schema';
import { createJWT, setCookie } from '/common/service/support/permission/controller';
import { authJWT } from '/common/service/support/permission/controller';
import { globalConfig } from '@/constants/config';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    await connectToDatabase();
    console.debug('devforumTokenLogin> start...');
    // const { tmbId, email } = await authCert({ req, authToken: true });
    // console.debug('devforumTokenLogin>  tmbId:%o, email:%o', tmbId, email);
    const { cookie } = (req.headers || {}) as any;
    const cookies = Cookie.parse(cookie || '');
    console.debug('devforumTokenLogin>  cookies:%o', cookies);
    const devforumToken = cookies[globalConfig.tokenName] || '';
    console.debug('devforumTokenLogin>  devforumToken:%o', devforumToken);
    const { email } = await authJWT(devforumToken);
    console.debug('devforumTokenLogin>  email:%o', email);

    // let user;
    const isBrowser = typeof window !== 'undefined';
    console.debug('tokenLogin> isBrowser:%o', isBrowser);
    let userDetail;
    if (!isBrowser && email?.length) {
      try {
        // const users = await User.find({ username: email });
        const userData = await MongoUser.findOne({
          username: email
        });
        console.debug('tokenLogin> userData:%o', userData);
        console.debug('tokenLogin> email:%o', email);
        // 如果没有用户则创建用户
        if (!userData && email?.length) {
          // const nuser = await User.create({
          //   username: email,
          //   password: createHashPassword(`${userId}-${new Date().getTime()}`),
          //   balance: 2 * PRICE_SCALE
          // });
          userDetail = await initRootUser(email);
          console.debug('tokenLogin:initRootUser> userDetail:%o', userDetail);
        } else {
          userDetail = await getUserDetail({ userId: userData._id });
          console.debug('tokenLogin:> userDetail:%o', userDetail);
        }
      } catch (e: any) {
        console.error('tokenLogin> error:%o', e?.message);
      }
    }
    // let user = {
    //   _id: String(userDetail._id),
    //   team: {
    //     teamId: String(userDetail.team.teamId),
    //     tmbId: String(userDetail.team.tmbId)
    //   }
    // }
    console.debug('tokenLogin> userDetail:%o', userDetail);
    const token = createJWT(userDetail);
    console.debug('tokenLogin> token:%o', token);
    setCookie(res, token);

    jsonRes(res, {
      data: userDetail
    });
  } catch (err) {
    jsonRes(res, {
      code: 500,
      error: err
    });
  }
}
