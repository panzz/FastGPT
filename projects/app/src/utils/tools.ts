import dayjs from 'dayjs';
import build from '@/../build/build';
const pkg = require('@/../package.json');

/**
 * 对象转成 query 字符串
 */
export const Obj2Query = (obj: Record<string, string | number>) => {
  const queryParams = new URLSearchParams();
  for (const key in obj) {
    queryParams.append(key, `${obj[key]}`);
  }
  return queryParams.toString();
};

/**
 * parse string to query object
 */
export const parseQueryString = (str: string) => {
  const queryObject: Record<string, any> = {};

  const splitStr = str.split('?');

  str = splitStr[1] || splitStr[0];

  // 将字符串按照 '&' 分割成键值对数组
  const keyValuePairs = str.split('&');

  // 遍历键值对数组，将每个键值对解析为对象的属性和值
  keyValuePairs.forEach(function (keyValuePair) {
    const pair = keyValuePair.split('=');
    const key = decodeURIComponent(pair[0]);
    const value = decodeURIComponent(pair[1] || '');

    // 如果对象中已经存在该属性，则将值转换为数组
    if (queryObject.hasOwnProperty(key)) {
      if (!Array.isArray(queryObject[key])) {
        queryObject[key] = [queryObject[key]];
      }
      queryObject[key].push(value);
    } else {
      queryObject[key] = value;
    }
  });

  return queryObject;
};

/**
 * 格式化时间成聊天格式
 */
export const formatTimeToChatTime = (time: Date) => {
  const now = dayjs();
  const target = dayjs(time);

  // 如果传入时间小于60秒，返回刚刚
  if (now.diff(target, 'second') < 60) {
    return '刚刚';
  }

  // 如果时间是今天，展示几时:几秒
  if (now.isSame(target, 'day')) {
    return target.format('HH:mm');
  }

  // 如果是昨天，展示昨天
  if (now.subtract(1, 'day').isSame(target, 'day')) {
    return '昨天';
  }

  // 如果是前天，展示前天
  if (now.subtract(2, 'day').isSame(target, 'day')) {
    return '前天';
  }

  // 如果是今年，展示某月某日
  if (now.isSame(target, 'year')) {
    return target.format('M月D日');
  }

  // 如果是更久之前，展示某年某月某日
  return target.format('YYYY/M/D');
};

export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 B';

  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export const hasVoiceApi = typeof window !== 'undefined' && 'speechSynthesis' in window;
/**
 * voice broadcast
 */
export const voiceBroadcast = ({ text }: { text: string }) => {
  window.speechSynthesis?.cancel();
  const msg = new SpeechSynthesisUtterance(text);
  const voices = window.speechSynthesis?.getVoices?.(); // 获取语言包
  const voice = voices.find((item) => {
    return item.name === 'Microsoft Yaoyao - Chinese (Simplified, PRC)';
  });
  if (voice) {
    msg.voice = voice;
  }

  window.speechSynthesis?.speak(msg);

  msg.onerror = (e) => {
    console.log(e);
  };

  return {
    cancel: () => window.speechSynthesis?.cancel()
  };
};
export const cancelBroadcast = () => {
  window.speechSynthesis?.cancel();
};

export const getErrText = (err: any, def = '') => {
  const msg: string = typeof err === 'string' ? err : err?.message || def || '';
  msg && console.log('error =>', msg);
  return msg;
};

export const delay = (ms: number) =>
  new Promise((resolve) => {
    setTimeout(() => {
      resolve('');
    }, ms);
  });

/**
 * 彩色打印信息样式
 * @param postion left or right, 选择在左边还是右边
 * @param backaground 背景色
 * @returns 返回格式化后的样式
 * @author LIPan
 */
export const getConsoleStyle = (postion: string, backaground: string): string => {
  let style = ['color: #ffffff', `background: ${backaground}`, 'padding: 0.1em 1em'];
  if (postion === 'left') {
    const left = ['border-top-left-radius: 0.5em', 'border-bottom-left-radius: 0.5em'];
    style = style.concat(left);
  } else {
    const right = ['border-top-right-radius: 0.5em', 'border-bottom-right-radius: 0.5em'];
    style = style.concat(right);
  }
  return style.join(';');
};

/**
 * 打印版本信息
 * @param
 * @returns
 * @author lipan5@lenovo.com
 */
export const showVersion = () => {
  const console = (window.console = window.console || {});
  if (process.env.NODE_ENV === 'production') {
    // console.info('%c%s%c%s', getConsoleStyle('left', '#616161'), 'Environment', getConsoleStyle('right', '#68bc48'), 'production')
    console.info(
      '%c%s%c%s',
      getConsoleStyle('left', '#616161'),
      pkg.name,
      getConsoleStyle('right', '#3475ad'),
      pkg.version
    );
    console.info(
      '%c%s%c%s',
      getConsoleStyle('left', '#616161'),
      'Build',
      getConsoleStyle('right', '#3475ad'),
      build
    );
    // read debug switch
    const debug = localStorage.getItem('debug');
    // disable debug if debug switch close
    if (!debug || (debug && debug !== 'true')) {
      console.info('debug is %o', debug);
      // eslint-disable-next-line no-empty-function
      const noop = function () {
        /* disable console debug and info */
      };
      console.debug = noop;
      console.info = noop;
    }
  } else {
    console.info(
      '%c%s%c%s',
      getConsoleStyle('left', '#616161'),
      'Environment',
      getConsoleStyle('right', '#ff9900'),
      process.env.NODE_ENV
    );
    console.info(
      '%c%s%c%s',
      getConsoleStyle('left', '#616161'),
      'Platform',
      getConsoleStyle('right', '#3475ad'),
      pkg.name
    );
    console.info(
      '%c%s%c%s',
      getConsoleStyle('left', '#616161'),
      'Version',
      getConsoleStyle('right', '#3475ad'),
      pkg.version
    );
    console.info(
      '%c%s%c%s',
      getConsoleStyle('left', '#616161'),
      'Build',
      getConsoleStyle('right', '#3475ad'),
      build
    );
  }
};
