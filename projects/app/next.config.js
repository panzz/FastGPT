/** @type {import('next').NextConfig} */
const { i18n } = require('./next-i18next.config');
const path = require('path');
const fs = require('fs');


const resolve = (dir) => {
  return path.resolve(__dirname, dir);
}
fs.writeFileSync(resolve('./build/build.ts'), `export default '${new Date().toISOString()}'\n`);

console.info(
  'nextConfig> NODE_ENV:%o, BASE_PATH :%o, NEXT_PUBLIC_PAPI_URL:%O',
  process.env.NODE_ENV,
  process.env.BASE_PATH,
  process.env.NEXT_PUBLIC_PAPI_URL
);

const nextConfig = {
  basePath: process.env.BASE_PATH || '',
  i18n,
  output: 'standalone',
  reactStrictMode: process.env.NODE_ENV === 'development' ? false : true,
  compress: true,
  async rewrites() {
    return [
      // {
      //   source: '/cms/:path*',
      //   destination: `${process.env.NEXT_PUBLIC_STRAPI_URL}/:path*`,
      // },
      {
        source: '/papi/:path*',
        destination: `${process.env.NEXT_PUBLIC_PAPI_URL}/:path*`,
      },
    ];
  },
  env: {
    BASE_PATH: `${process.env.BASE_PATH}`,
  },
  webpack(config, { isServer }) {
    if (!isServer) {
      config.resolve = {
        ...config.resolve,
        fallback: {
          ...config.resolve.fallback,
          fs: false
        }
      };
    }
    Object.assign(config.resolve.alias, {
      '@mongodb-js/zstd': false,
      '@aws-sdk/credential-providers': false,
      snappy: false,
      aws4: false,
      'mongodb-client-encryption': false,
      kerberos: false,
      'supports-color': false,
      'bson-ext': false,
      'pg-native': false
    });
    config.module = {
      ...config.module,
      rules: config.module.rules.concat([
        {
          test: /\.svg$/i,
          issuer: /\.[jt]sx?$/,
          use: ['@svgr/webpack']
        }
      ]),
      exprContextCritical: false,
      unknownContextCritical: false
    };

    return config;
  },
  transpilePackages: ['@fastgpt/*'],
  experimental: {
    serverComponentsExternalPackages: ['mongoose', 'winston', 'winston-mongodb', 'pg'],
    outputFileTracingRoot: path.join(__dirname, '../../')
  },
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: true,
  }
};

module.exports = nextConfig;
