/**
 * 站点配置
 * @author lipan
 */
export interface GlobalCfgType {
  tokenName: string;
  loginFrom: string;
  retryCnt: string;
  loginPortal: {
    development: string;
    production: string;
  };
  ajaxHeadersTokenKey: string;
  ajaxResponseNoVerifyUrl: string[];
  basePath: string;
}

export const globalConfig: GlobalCfgType = {
  tokenName: 'developerForumToken', // "jwt",
  loginFrom: 'loginFrom',
  retryCnt: 'retryCnt',
  loginPortal: {
    development: 'https://devforum.earth.xpaas.lenovo.com/signin',
    production: 'https://developerforum.lenovo.com/signin'
  },
  ajaxHeadersTokenKey: 'x-token',
  ajaxResponseNoVerifyUrl: [
    '/user/login', // 用户登录
    '/user/info', // 获取用户信息
    'papi/signin/status' // 获取用户登陆状态
  ],
  basePath: process.env.BASE_PATH as string
};
