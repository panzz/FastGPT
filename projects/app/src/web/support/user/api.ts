import { GET, POST, PUT } from '@/web/common/api/request';
import { hashStr } from '/common/global/common/string/tools';
import type { ResLogin } from '@/global/support/api/userRes.d';
import { UserAuthTypeEnum } from '@/constants/common';
import { UserUpdateParams } from '@/types/user';
import { UserType } from '/common/global/support/user/type.d';
import type {
  FastLoginProps,
  OauthLoginProps,
  PostLoginProps
} from '/common/global/support/user/api.d';

export const sendAuthCode = (data: {
  username: string;
  type: `${UserAuthTypeEnum}`;
  googleToken: string;
}) => POST(`/plusApi/support/user/inform/sendAuthCode`, data);

export const getTokenLogin = () =>
  GET<UserType>('/user/account/tokenLogin', {}, { maxQuantity: 1 });
export const getDevforumTokenLogin = () =>
  GET<UserType>('/user/account/devforumTokenLogin', {}, { maxQuantity: 1 });
export const oauthLogin = (params: OauthLoginProps) =>
  POST<ResLogin>('/plusApi/support/user/account/login/oauth', params);
export const postFastLogin = (params: FastLoginProps) =>
  POST<ResLogin>('/plusApi/support/user/account/login/fastLogin', params);

export const postRegister = ({
  username,
  password,
  code,
  inviterId
}: {
  username: string;
  code: string;
  password: string;
  inviterId?: string;
}) =>
  POST<ResLogin>(`/plusApi/support/user/account/register/emailAndPhone`, {
    username,
    code,
    inviterId,
    password: hashStr(password)
  });

export const postFindPassword = ({
  username,
  code,
  password
}: {
  username: string;
  code: string;
  password: string;
}) =>
  POST<ResLogin>(`/plusApi/support/user/account/password/updateByCode`, {
    username,
    code,
    password: hashStr(password)
  });

export const updatePasswordByOld = ({ oldPsw, newPsw }: { oldPsw: string; newPsw: string }) =>
  POST('/user/account/updatePasswordByOld', {
    oldPsw: hashStr(oldPsw),
    newPsw: hashStr(newPsw)
  });

export const postLogin = ({ password, ...props }: PostLoginProps) =>
  POST<ResLogin>('/user/account/loginByPassword', {
    ...props,
    password: hashStr(password)
  });

export const loginOut = () => GET('/user/account/loginout');

export const putUserInfo = (data: UserUpdateParams) => PUT('/user/account/update', data);
