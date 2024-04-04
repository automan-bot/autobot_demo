import { IGesture } from "android-bot";
import * as cheerio from "cheerio";
/**
 * 防抖动
 *
 * @export
 * @param {*} fn 方法
 * @param {*} wait 多少毫秒不调用后执行一次
 * @returns
 */
export function debounce(func: Function, wait: number) {
  let timeout: any;
  return function () {
    const context: any = this as any;
    const args = [...arguments];
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => {
      func.apply(context, args);
    }, wait);
  };
}
/**
 * 节流
 *
 * @export
 * @param {*} func 方法
 * @param {*} wait 每隔多少毫秒执行一次
 * @returns
 */
export function throttle(func: Function, wait: number) {
  var timer: any = null;
  return function () {
    var context = this;
    var args = arguments;
    if (!timer) {
      timer = setTimeout(function () {
        func.apply(context, args);
        timer = null;
      }, wait);
    }
  };
}

export function timeout(time: number) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(null);
    }, time);
  });
}
export async function timeout2(startTime: number, endTime: number) {
  let time = Math.floor(Math.random() * (endTime - startTime) + startTime);
  await timeout(time * 1000);
}

export function shuffle(arr: any[]) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}
type IItem = {
  bounds: {
    mx: number;
    my: number;
    x1: number;
    y1: number;
    x2: number;
    y2: number;
  };
  text: string;
};

export function getScreenDocument(xmlString: string) {
  let doc = cheerio.load(xmlString, {
    xmlMode: true,
  });
  return doc;
}
export function querySelectorAll(xmlString: string, selector: string): IItem[] {
  let startTime = Date.now();
  const $ = getScreenDocument(xmlString);
  let nodes: any = [];
  try {
    nodes = $(`${selector}`);
  } catch (e) {
    console.error(`查找出错：${selector}`);
    return;
  }
  let result = [];
  for (let i = 0; i < nodes.length; i++) {
    let item = nodes[i];
    let bounds: any = $(item).attr("bound");
    let text = $(item).attr("text");
    bounds = bounds.split(",").map((item) => {
      let wz = parseInt(item);
      return isNaN(wz) ? 0 : wz;
    });
    let [x1, y1, x2, y2] = bounds;

    let itemObj: IItem = {
      bounds: { mx: 0, my: 0, x1: 0, y1: 0, x2: 0, y2: 0 },
      text: "",
    };
    let mx = Math.round(x1 + (x2 - x1) / 2);
    let my = Math.round(y1 + (y2 - y1) / 2);
    itemObj.bounds = {
      mx,
      my,
      x1,
      y1,
      x2,
      y2,
    };
    itemObj.text = text;
    result.push(itemObj);
  }
  let endTime = Date.now();
  let execTime = endTime - startTime;
  console.log(
    `用时${execTime}ms,选择器${selector},查找到的元素个数${result.length}`
  );
  return result;
}

//这里为了适配autojs PC版的生成的代码，和autox.js参数保持一致
export function convertGesturePara(...args: any): IGesture {
  if (args.length < 2) throw new Error("gesture函数至少需要2个参数");
  let para: IGesture = {
    duration: 0,
    points: [],
  };
  if (typeof args[0] != "number") {
    throw new Error("gesture函数第一个参数必须为number类型");
  }
  para.duration = args[0];
  for (let i = 1; i < args.length; i++) {
    let point = args[i];
    if (point.length != 2) {
      throw new Error("point必须同时包含x，y");
    }
    para.points.push({
      x: point[0],
      y: point[1],
    });
  }
  return para;
}
//这里为了适配autojs PC版的生成的代码，和autox.js参数保持一致
export function convertGesturesPara(...args: any): IGesture[] {
  if (!arguments.length) throw new Error("gestures函数至少需要1个参数");
  const resultPara: IGesture[] = [];
  for (let gesture of args) {
    let para = {
      delay: 0,
      duration: 0,
      points: [],
    };
    let startIndex = 2;
    if (typeof gesture[1] == "number") {
      para.delay = gesture[0];
      para.duration = gesture[1];
      startIndex = 2;
    } else {
      para.duration = gesture[0];
      startIndex = 1;
    }
    for (let i = startIndex; i < gesture.length; i++) {
      let point = gesture[i];
      if (point.length != 2) {
        throw new Error("point必须同时包含x，y");
      }
      para.points.push({
        x: point[0],
        y: point[1],
      });
    }
    resultPara.push(para);
  }
  return resultPara;
}
