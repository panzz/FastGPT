import type { UserTypee } from '/common/global/support/user/type.d';
import type { PromotionRecordSchema } from '/common/global/support/activity/type.d';
export interface ResLogin {
  user: UserType;
  token: string;
}

export interface PromotionRecordType {
  _id: PromotionRecordSchema['_id'];
  type: PromotionRecordSchema['type'];
  createTime: PromotionRecordSchema['createTime'];
  amount: PromotionRecordSchema['amount'];
}
