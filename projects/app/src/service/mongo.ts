import { startQueue } from './utils/tools';
import { PRICE_SCALE } from '/common/global/support/wallet/bill/constants';
import { initPg } from '/common/service/common/pg';
import { MongoUser } from '/common/service/support/user/schema';
import { connectMongo } from '/common/service/common/mongo/init';
import { hashStr } from '/common/global/common/string/tools';
import { getInitConfig } from '@/pages/api/system/getInitData';
import {
  createDefaultTeam,
  getUserDefaultTeam
} from '/common/service/support/user/team/controller';
import { exit } from 'process';
import { Types } from '/common/service/common/mongo';
import { getUserDetail } from '@/service/support/user/controller';

/**
 * connect MongoDB and init data
 */
export function connectToDatabase(): Promise<void> {
  return connectMongo({
    beforeHook: () => {
      getInitConfig();
    },
    afterHook: () => {
      initPg();
      // start queue
      startQueue();
      return; // initRootUser('root');
    }
  });
}

export async function initRootUser(username: string) {
  console.debug('initRootUser> username:%o', username);
  try {
    if (!username || !username.length) throw new Error('Error: username is empty!');

    const rootUser = await MongoUser.findOne({
      username: username
    });
    console.debug('initRootUser> rootUser:%o', rootUser);
    const psw = process.env.DEFAULT_ROOT_PSW || '123456';

    let rootId = rootUser?._id || '';
    let userDetail;
    // init root user
    if (rootUser) {
      // await MongoUser.findOneAndUpdate(
      //   { username: username },
      //   {
      //     password: hashStr(psw)
      //   }
      // );
      // console.debug('initRootUser> rootId:%o', String(rootId));
      // const tmb = await getUserDefaultTeam({ userId: rootId });
      // console.debug('initRootUser> tmb:%o', tmb);
      // teamId = String(tmb.teamId);
      // console.debug('initRootUser> teamId:%o', String(teamId));
      userDetail = await getUserDetail({ userId: rootId });
      console.debug('initRootUser> userDetail:%o', userDetail);
    } else {
      const { _id } = await MongoUser.create({
        username: username,
        password: hashStr(psw)
      });
      console.debug('initRootUser> _id:%o', _id);
      rootId = _id;
      // init root team
      let teamId = await createDefaultTeam({
        userId: rootId,
        maxSize: 1,
        balance: 9 * PRICE_SCALE
      });
      console.debug('initRootUser> 1 teamId:%o', teamId);
      // const tmb = await getUserDefaultTeam({ userId: rootId });
      // console.debug('initRootUser> 1 tmb:%o', tmb);
      userDetail = await getUserDetail({ userId: rootId });
      console.debug('initRootUser> userDetail:%o', userDetail);
    }
    // { _id?: string; team?: { teamId?: string; tmbId: string } }
    // const resData = {
    //   _id: String(rootId),
    //   username: username,
    //   team: {
    //     teamId: String(teamId),
    //     // tmbId:
    //   }
    // };

    console.debug('initRootUser> userDetail:%o', userDetail);
    return userDetail;
  } catch (error) {
    console.error('initRootUser> error:%o', error);
    exit(1);
  }
}
