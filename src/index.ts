import {
  timeout,
  timeout2,
  shuffle,
  getScreenDocument,
  querySelectorAll,
  debounce,
  throttle,
  convertGesturePara,
  convertGesturesPara,
} from "./utils";

import { Device, KeyCode, NodeWebSocket } from "android-bot";
import FormData from "form-data";
import { writeFile } from "fs/promises";
import path from "path";
const resolve = (p) => path.resolve(__dirname, p);
async function main() {
  const device = new Device("192.168.250.103:18080");
  //   获取设备的所有ip
  const ips = await device.getIp();
  console.log(`ips is:`, ips);
  //获取屏幕信息
  const screenInfo = await device.screenInfo();
  console.log(`screenInfo is:`, screenInfo);
  //获取系统信息
  const systemInfo = await device.getSystemInfo();
  console.log(`systemInfo is:`, systemInfo);
  //获取屏幕截图并保存
  const screenShot = await device.screenShot();
  await writeFile(resolve("../tmp/screen.jpg"), screenShot as any);
  //获取屏幕树并保存
  const screenJson = await device.screenJson();
  await writeFile(
    resolve("../tmp/screen.json"),
    JSON.stringify(screenJson, null, 2)
  );
  const screenXml = await device.screenXml();
  await writeFile(resolve("../tmp/screen.xml"), screenXml);
  //查询屏幕树的节点信息，并获取位置信息
  const nodes = await querySelectorAll(screenXml, `*[text*="设置"]`);
  if (nodes[0]) {
    const { mx, my } = nodes[0]?.bounds;
    console.log(`mx is:${mx},my is:${my}`);
    //这里可以调用 await device.click(mx, my);//来执行点击
  }
  //插入联系人
  await device.insertContact("张三", "13312341234");
  //查询联系人
  const contacts = await device.getAllContact("*"); //传号码获取对应的联系人
  console.log(`contacts is:`, contacts);
  //获取短信
  const sms = await device.getAllSms("*");
  console.log(`sms is:`, sms);
  /*   //模拟点击
  await device.click(mx, my); //使用绝对坐标，这里使用查找到设置的文本所在屏幕的位置上进行点击
  await device.click(0.5, 0.5); //使用百分比坐标，这里使用屏幕中间进行点击
  //模拟长按点击
  await device.longClick(0.5, 0.5);
  //执行对应毫秒的长按点击
  await device.press(0.5, 0.5, 3000);
  //执行滑动
  await device.swipe(200, 500, 700, 700, 3000);
  //模拟按键，返回
  await device.pressKeyCode(KeyCode.back); */
  //单指手势
  /* await device.gesture(
    convertGesturePara(
      265,
      [0.8111111111111111, 0.5076923076923077],
      [0.6944444444444444, 0.5076923076923077],
      [0.6305555555555555, 0.5102564102564102],
      [0.5305555555555556, 0.5115384615384615],
      [0.44722222222222224, 0.5128205128205128],
      [0.41388888888888886, 0.5128205128205128],
      [0.4083333333333333, 0.5128205128205128],
      [0.3194444444444444, 0.514102564102564],
      [0.2777777777777778, 0.5128205128205128],
      [0.18055555555555555, 0.5115384615384615],
      [0.18055555555555555, 0.5115384615384615]
    )
  ); */
  //模拟三指下滑，小米手机可以三指下滑截图
  /* await device.gestures(
    convertGesturesPara(
      [
        0,
        500,
        [0.25277777777777777, 0.16282051282051282],
        [0.24722222222222223, 0.1782051282051282],
        [0.24444444444444444, 0.23333333333333334],
        [0.2611111111111111, 0.3038461538461538],
        [0.24166666666666667, 0.37051282051282053],
        [0.23333333333333334, 0.441025641025641],
        [0.2222222222222222, 0.4782051282051282],
        [0.21666666666666667, 0.4846153846153846],
        [0.21666666666666667, 0.4846153846153846],
      ],
      [
        0,
        500,
        [0.4888888888888889, 0.14871794871794872],
        [0.48333333333333334, 0.16666666666666666],
        [0.48333333333333334, 0.2076923076923077],
        [0.4722222222222222, 0.26794871794871794],
        [0.46111111111111114, 0.3230769230769231],
        [0.44166666666666665, 0.3923076923076923],
        [0.4361111111111111, 0.4371794871794872],
        [0.4361111111111111, 0.4576923076923077],
        [0.4388888888888889, 0.46153846153846156],
      ],
      [
        0,
        500,
        [0.7305555555555555, 0.14487179487179488],
        [0.7333333333333333, 0.16923076923076924],
        [0.7472222222222222, 0.2141025641025641],
        [0.7444444444444445, 0.2512820512820513],
        [0.7416666666666667, 0.3128205128205128],
        [0.7361111111111112, 0.38846153846153847],
        [0.7305555555555555, 0.44487179487179485],
        [0.7277777777777777, 0.45897435897435895],
        [0.7305555555555555, 0.46153846153846156],
        [0.7305555555555555, 0.4653846153846154],
      ]
    )
  ); */
  /*   //输入文字
  await device.inputText("你好 hello 1234");
  //模拟按键方式输入
  await device.inputChar("nihao");
  //清除文本框数据,比如文本框获取焦点，才能被清空
  await device.clearText(); */
  //获取所有应用列表
  const pkgs = await device.getAllPackage();
  console.log(`pkgs is:`, pkgs);
  //启动一个应用,这里用android设置的包名
  await device.stopPackage("com.android.settings");
  await device.startPackage("com.android.settings");
  //息屏亮屏
  await device.turnScreenOff();
  await device.turnScreenOn();
  //执行autox.js代码,3秒后，调用接口，停止脚本
  const codeStr = `
  console.show(true);
  while(true){
    console.log("hello world");
    sleep(1000);
  }
  `;
  await device.execScript("run", "test", codeStr);
  await timeout(3000);
  await device.stopAllScript();
}
main();
