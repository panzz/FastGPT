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

const fetchContent = async (req: NextApiRequest, res: NextApiResponse) => {
  let browser: any = null;
  let page: any = null;
  let isPupetFetch: boolean = false;

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
        //使用无头模式，默认为有头(true为无界面模式)
        headless: false,
        //设置打开页面在浏览器中的宽高
        defaultViewport: {
          width: 1280,
          height: 800
        },
        timeout: 0
        // devtools: true
      };
      browser = await puppeteer.launch(puptOpt);
      // 创建一个新页面
      page = await browser.newPage();
      // await page.setViewport({width: 1080, height: 1024});
      // const hearder = {
      //   'Accept-Language': 'en-US,en;q=0.9,zh-CN;q=0.8,zh;q=0.7',
      //   'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.101 Safari/537.36',
      //   'Cookie': 'developerForumToken=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiJsaXBhbjUiLCJ0YWciOiJsZSIsImdyb3VwcyI6WyJhZG1pbiIsIkNJTyJdLCJ1c2VyTmFtZSI6IlBldGVycGFuIFBhbjUgTGkgfCDmnY7mlIAiLCJzdWIiOnsiSVRjb2RlIjoibGlwYW41IiwiaXRjb2RlIjoibGlwYW41In0sImlhdCI6MTcwNDM2MTAyMywiZXhwIjoxNzA0OTY1ODIzfQ.kwNlstuYGfnYIQ7oJL1z3FBIZHQRlDo0SsihebJBn5c;',
      //   'Authorization': 'Bearer eyJhbGciOiJIUzUxMiJ9.eyJpc3MiOiJsZW5vdm8iLCJzdWIiOiJsaXBhbjUiLCJpZCI6NTEsInR5cGUiOiJzaXRlLXVzZXIiLCJleHAiOjE3MzU4OTcwMjMsImlhdCI6MTcwNDM2MTAyM30.TkrQZtRlSrWa08tXlOSOs_85BoqZDzc6LCF7R8eNsKKoT12k8l48BlRKTOpq8GBAo7sJ-XsljZCatWcDiJBl8A'
      // }
      let hearder: any = {};
      if (headerList && headerList.length) {
        headerList.forEach((h: any) => {
          let hlist = h.split(':');
          if (hlist && hlist.length > 1) {
            hearder[hlist[0]] = hlist[1];
          }
        });
      }
      await page.setExtraHTTPHeaders(hearder);
    }

    const response = (
      await Promise.allSettled(
        urlList.map(async (url) => {
          let article = null;
          try {
            if (isPupetFetch) {
              // 访问一个网址
              await page.goto(url);
              const body = await page.evaluate(() => {
                // return document.querySelector("body").innerHTML;
                const bodyElement = document.querySelector('body');
                return bodyElement ? bodyElement.innerHTML : '';
              });
              const { document } = new JSDOM(body).window;
              article = new Readability(document).parse();
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
            console.error('fetchContent > ERROR: %s', error?.message);
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
