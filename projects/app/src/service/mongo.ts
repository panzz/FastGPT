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
      const tmb = await getUserDefaultTeam({ userId: rootId });
      teamId = String(tmb.teamId);
    } else {
      const { _id } = await MongoUser.create({
        username: username,
        password: hashStr(psw)
      });
      rootId = _id;
      // init root team
      teamId = await createDefaultTeam({ userId: rootId, maxSize: 1, balance: 9 * PRICE_SCALE });
    }
    const resData = {
      userId: rootId.toString(),
      username: username,
      teamId: teamId.toString()
    };

    console.log('root user init resData:%o', resData);
    return resData;
  } catch (error) {
    console.log('init root user error', error);
    exit(1);
  }
}
