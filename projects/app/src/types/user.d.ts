import { BillSourceEnum } from '/common/global/support/wallet/bill/constants';
import type { UserModelSchema } from '/common/global/support/user/type';
import { BillSchema } from '/common/global/support/wallet/bill/type.d';

export interface UserUpdateParams {
  balance?: number;
  avatar?: string;
  timezone?: string;
  openaiAccount?: UserModelSchema['openaiAccount'];
}
