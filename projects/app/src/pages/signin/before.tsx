import { useEffect } from 'react';
import cookies from 'js-cookie';

// import type { NextPage, GetStaticProps, InferGetStaticPropsType } from 'next';
// import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useRouter } from 'next/router';
import { serviceSideProps } from '@/web/common/utils/i18n';

import { globalConfig } from '@/constants/config';

type Props = {
  // Add custom props here
};

const signinBefore = (router: any) => {
  const { host } = window.location;
  console.debug('signinBefore> host: %o', host);
  // 判断是否为本地开发环境
  if (host.includes('localhost')) {
    console.debug('signinBefore> localhost detect');
    // return;
  }
  const loginFrom = router.query?.from || '/';
  console.debug('signinBefore> loginFrom:%o', loginFrom);
  console.debug('signinBefore> router:%o', router);
  const token = cookies.get(globalConfig.tokenName);
  console.debug('signinBefore> token(%o):%o', globalConfig.tokenName, token);
  // 根据当前环境判断要跳转的地址
  const isDev =
    host.includes('earth.xpaas') || host.includes('localhost') ? 'development' : 'production';
  console.debug('signinBefore> isDev:%o', isDev);
  const targetUrl = globalConfig.loginPortal[isDev];
  console.debug('signinBefore> targetUrl:%o', targetUrl);
  const jumpLoginFrom = `${window.location.origin}${globalConfig.basePath}/signin/after`;
  console.debug('signinBefore> jumpLoginFrom:%o', jumpLoginFrom);
  const urlstr = `${targetUrl}/before?passthrough=1&loginFrom=${encodeURIComponent(jumpLoginFrom)}`; // `https://stscn.lenovo.com/adfs/ls/IdpInitiatedSignOn.aspx?loginToRp=${ settings.adfsSpId[isDev] }`
  console.debug('signinBefore> urlstr:%o', urlstr);
  // 读取重试次数
  const retryCnt = cookies.get(globalConfig.retryCnt) || '0';
  console.debug('signinBefore> retryCnt:%o', retryCnt);
  if (parseInt(retryCnt, 10) <= 3) {
    // 保存loginFrom
    cookies.set(globalConfig.loginFrom, loginFrom);
    // 保存重试次数
    console.debug(
      'signinBefore> set loginFrom:%o, retryCnt:%o',
      loginFrom,
      (parseInt(retryCnt, 10) + 1).toString()
    );
    cookies.set(globalConfig.retryCnt, (parseInt(retryCnt, 10) + 1).toString());
    console.info('signinBefore> ready jump to ADFS Server: %o', urlstr);
    window.location.assign(urlstr);
  } else {
    const errMsg = 'The number of logins exceeds the limit, please try again later!';
    console.error('signinBefore> %o', errMsg);
  }
};

// const SigninBeforePage: NextPage = () => {
// const SigninBeforePage: NextPage = (_props: InferGetStaticPropsType<typeof getStaticProps>) => {
const SigninBeforePage = () => {
  const router = useRouter();
  useEffect(() => {
    signinBefore(router);
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

export default SigninBeforePage;
