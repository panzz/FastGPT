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
      return initRootUser('root');
    }
  });
}

export async function initRootUser(username: string) {
  try {
    if (!username || !username.length) throw new Error('Error: username is empty!');

    const rootUser = await MongoUser.findOne({
      username: username
    });
    console.debug('initRootUser> rootUser:%o', rootUser);
    const psw = process.env.DEFAULT_ROOT_PSW || '123456';

    let rootId = rootUser?._id || '';
    let teamId;
    // init root user
    if (rootUser) {
      await MongoUser.findOneAndUpdate(
        { username: username },
        {
          password: hashStr(psw)
        }
      );
      const tmb = await getUserDefaultTeam({ tmb: rootId });
      console.debug('initRootUser> tmb:%o', rootUser);
      teamId = String(tmb.teamId);
    } else {
      const { _id } = await MongoUser.create({
        username: username,
        password: hashStr(psw)
      });
      console.debug('initRootUser> _id:%o', _id);
      rootId = _id;
      // init root team
      teamId = await createDefaultTeam({ userId: rootId, maxSize: 1, balance: 9 * PRICE_SCALE });
      console.debug('initRootUser> teamId:%o', teamId);
    }
    const resData = {
      userId: rootId.toString(),
      username: username,
      teamId: teamId.toString()
    };

    console.debug('initRootUser> resData:%o', resData);
    return resData;
  } catch (error) {
    console.error('initRootUser> error:%o', error);
    exit(1);
  }
}
