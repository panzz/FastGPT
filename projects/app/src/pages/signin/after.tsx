import { useEffect } from 'react';
import cookies from 'js-cookie';
// import type { NextPage, GetStaticProps, InferGetStaticPropsType } from 'next';
// import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useRouter } from 'next/router';
import { serviceSideProps } from '@/web/common/utils/i18n';
// import globalConfig from '@/configs/global';
import { globalConfig } from '@/constants/config';
// import request from '@/common/axios/request';
// import { httpReq } from '@/api/request';
import axios from 'axios';
// import { useLogin } from '@/common/recoil/user';
// import { useUserStore } from '@/store/user';

type Props = {
  // Add custom props here
};

const reqDecodeToken = async (token: string) => {
  console.debug('reqDecodeToken> token:%o', token);
  try {
    // const res: any = await httpReq('/papi/signin/decode-token', { token }, {}, 'POST');
    const res: any = await axios.post(
      `${process.env.BASE_PATH}/papi/signin/decode-token`,
      { token },
      { headers: { 'Content-Type': 'application/json' } }
    );

    console.debug('reqDecodeToken> res:%o, res.data:%o', res, res.data);
    if (res.data && !+res.data.code && res.data.data) {
      return res.data.data;
    }
    return res.data;
  } catch (error: any) {
    console.error('reqDecodeToken> error', error.message);
  }
  return false;
};

const reqSigninStatus = async (token: string) => {
  console.debug('reqSigninStatus> token:%o', token);
  try {
    // const res: any = await httpReq('/papi/signin/status', { token }, {}, 'GET');
    const res: any = await axios.get(`${process.env.BASE_PATH}/papi/signin/status`, {
      params: { token },
      timeout: 8000
    });
    console.debug('reqSigninStatus> res:%o, res.data:%o', res, res.data);
    if (res && !+res.data.code && res.data.data) {
      const { host } = window.location;
      console.debug('reqSigninStatus> reqDecodeToken host:%o', host);
      let domain = '';
      if (host.includes('localhost')) {
        domain = 'localhost';
      } else {
        let domainArr = host.split('.');
        domainArr[0] = '';
        domain = domainArr.join('.');
        console.debug('reqSigninStatus> reqDecodeToken domain:%o', domain);
      }
      cookies.set(globalConfig.tokenName, token, {
        expires: 7,
        domain /*, secure:false, httpOnly: false, overwrite: true*/
      });
      const cookieToken = cookies.get(globalConfig.tokenName);
      console.debug('signinAfter> cookie cookieToken(%o):%o', globalConfig.tokenName, cookieToken);
      return res.data.data;
    }
    return res.data;
  } catch (error: any) {
    console.error('reqSigninStatus> error', error.message);
  }
  return false;
};

// const reqCMSLogin = async () => {
//   try {
//     const params = {
//       identifier: 'identifier@developerforum.lenovo.com',
//       password: 'password@developerforum.lenovo.com'
//     };
//     console.debug('reqCMSLogin> params:%o', params);
//     const res: any = await request(
//       '/cms/api/auth/local/',
//       params,
//       {},
//       'POST'
//     );
//     console.debug('reqCMSLogin> res:%o', res);
//     if (res?.jwt && res.user?.id) {
//       const user = {
//         id: res.user.id,
//         username: res.user.username,
//         email: res.user.email
//       };
//       handleLogin(user, res.jwt);
//       return res;
//     }
//   } catch (error: any) {
//     console.error('reqCMSLogin> error', error.message);
//   }
//   return false;
// };

const signinAfter = async (router: any) => {
  const queryToken = router.query?.token || '';
  console.debug(
    'signinAfter> queryToken(%o):%o',
    queryToken && queryToken.length && queryToken.split('.').length === 3,
    queryToken
  );
  if (queryToken && queryToken.length && queryToken.split('.').length === 3) {
    const retryCnt = cookies.get(globalConfig.retryCnt); // this.$cookies.cookies.loginFrom
    const loginFrom = cookies.get(globalConfig.loginFrom) || '/'; // this.$cookies.cookies.loginFrom
    console.debug('signinAfter> read retryCnt:%o, loginFrom:%o', retryCnt, loginFrom);
    // 清除 tokenName & retryCnt & loginFrom
    cookies.remove(globalConfig.tokenName);
    cookies.remove(globalConfig.retryCnt);
    cookies.remove(globalConfig.loginFrom);
    let res = await reqDecodeToken(queryToken);
    console.debug('signinAfter> reqDecodeToken res.token:%o', res.token);
    if (!res || !res.token || !res.token.length) {
      console.error('signinAfter> reqDecodeToken failed, try to redo signin process. res:%o', res);
      router.replace('/signin/before');
    }
    const token = res.token;
    res = await reqSigninStatus(token);
    console.debug('signinAfter> reqSigninStatus res:%o', res);
    if (!res) {
      console.error('signinAfter> reqSigninStatus failed, try to redo signin process. res:%o', res);
      router.replace('/signin/before');
    }
    // res = await initUserInfo();
    // res = await reqCMSLogin();
    // console.debug('signinAfter> initUserInfo res:%o', res);
    // if (!res) {
    //   console.error('signinAfter> reqCMSLogin failed, try to redo signin process. res:%o', res);
    //   router.replace('/signin/before');
    // }
    // 跳转回申请页面
    const loginFromUrl = decodeURI(loginFrom);
    console.debug('signinAfter> ready jump to %o', loginFromUrl);
    // location.assign(encodeURI(loginFromUrl));
    router.replace('/');
    // window.location.assign('/');
  } else {
    // 如果失败，则跳回至重新申请token页面
    console.warn('signinAfter> queryToken(%o) is empty, try to redo signin process', queryToken);
    // router.replace('/signin/before');
    window.location.assign('/signin/before');
  }
};

// const SigninAfterPage: NextPage = () => {
// const SigninAfterPage: NextPage = (_props: InferGetStaticPropsType<typeof getStaticProps>) => {
// const SigninAfterPage = () => {
//   // const { handleLogin } = useLogin();
//   useEffect(() => {
//     const router = useRouter();
//     signinAfter(router);
//   }, [router]);

//   return <div />;
// };

const SigninAfterPage = () => {
  const router = useRouter();
  // const { initUserInfo } = useUserStore();
  useEffect(() => {
    signinAfter(router);
  }, [router]);

  return <div />;
};

// export const getStaticProps: GetStaticProps<Props> = async ({ locale }) => ({
//   props: {
//     ...(await serverSideTranslations(locale ?? 'en', ['common']))
//   }
// });

export async function getServerSideProps(context: any) {
  return {
    props: { ...(await serviceSideProps(context)) }
  };
}

export default SigninAfterPage;
