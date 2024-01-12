// pages/api/fetchContent.ts
import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';
import https from 'https';
import puppeteer from 'puppeteer';
import { JSDOM } from 'jsdom';
import { Readability } from '@mozilla/readability';
import { jsonRes } from '/common/service/common/response';
import { authCert } from '/common/service/support/permission/auth/common';
import type { FetchResultItem } from '/common/global/common/plugin/types/pluginRes.d';
import { simpleText } from '/common/global/common/string/tools';
import { connectToDatabase } from '@/service/mongo';

export type UrlFetchResponse = FetchResultItem[];
// 将已经渲染过的页面，缓存在内存中
const RENDER_CACHE = new Map();
const ENABLE_RENDER_CACHE = false;

const fetchContent = async (req: NextApiRequest, res: NextApiResponse) => {
  let browser: any = null;
  let page: any = null;
  let isPupetFetch: boolean = false;
  let hearder: any = {};

  try {
    await connectToDatabase();
    let {
      urlList = [],
      headerList = [],
      fetchType = 'axios'
    } = req.body as { urlList: string[]; headerList?: string[]; fetchType?: string };

    if (!urlList || urlList.length === 0) {
      throw new Error('urlList is empty');
    }

    await authCert({ req, authToken: true });

    urlList = urlList.filter((url) => /^(http|https):\/\/[^ "]+$/.test(url));
    isPupetFetch = (fetchType && fetchType === 'pupet') || false;

    if (isPupetFetch) {
      // 启动浏览器 , true不启用，false启用
      const puptOpt = {
        //使用无头模式，默认为有头( 'new'为无界面模式, false为有界面模式)
        headless: false,
        //设置打开页面在浏览器中的宽高
        defaultViewport: {
          width: 1280,
          height: 800
        },
        timeout: 0
        // devtools: true,
      };
      browser = await puppeteer.launch(puptOpt);
      if (headerList && headerList.length) {
        headerList.forEach((h: any) => {
          let hlist = h.split(':');
          if (hlist && hlist.length > 1) {
            hearder[hlist[0]] = hlist[1];
          }
        });
      }
    }

    const response = (
      await Promise.allSettled(
        urlList.map(async (url) => {
          let article = null;
          try {
            if (isPupetFetch) {
              if (RENDER_CACHE.has(url) && ENABLE_RENDER_CACHE) {
                article = RENDER_CACHE.get(url);
              } else {
                // 创建一个新页面
                page = await browser.newPage();
                await page.setExtraHTTPHeaders(hearder);
                const start = Date.now();
                // 访问页面地址直到页面网络状态为 idle
                try {
                  await page.goto(url, {
                    waitUntil: 'networkidle0'
                  });
                } catch (error) {
                  // console.warn('fetchContent> warning %o', error?.message);
                }
                const body = await page.evaluate(() => {
                  // return document.querySelector("body").innerHTML;
                  const bodyElement = document.querySelector('body');
                  return bodyElement ? bodyElement.innerHTML : '';
                });
                const { document } = new JSDOM(body).window;
                article = new Readability(document).parse();
                // 进行缓存存储
                ENABLE_RENDER_CACHE && RENDER_CACHE.set(url, article);
                const ttRenderMs = Date.now() - start;
                console.debug(`fetchContent> Headless rendered page in: ${ttRenderMs}ms`);
              }
            } else {
              const fetchRes = await axios.get(url, {
                timeout: 30000
              });
              const dom = new JSDOM(fetchRes.data, {
                url,
                contentType: 'text/html'
              });
              const reader = new Readability(dom.window.document);
              article = reader.parse();
            }
            const content = article?.textContent || '';
            return {
              url,
              content: simpleText(`${article?.title}\n${content}`)
            };
          } catch (error) {
            console.error('fetchContent > (%o)ERROR: %s', url, error?.message);
            return {
              url,
              content: ''
            };
          }
        })
      )
    )
      .filter((item) => item.status === 'fulfilled')
      .map((item: any) => item.value)
      .filter((item) => item.content);

    if (isPupetFetch) {
      // 关闭浏览器
      await browser.close();
    }
    jsonRes<UrlFetchResponse>(res, {
      data: response
    });
  } catch (error: any) {
    if (isPupetFetch) {
      // 关闭浏览器
      await browser.close();
    }
    console.error('ERROR:%s', error?.message);
    jsonRes(res, {
      code: 500,
      error: error
    });
  }
};

export default fetchContent;
