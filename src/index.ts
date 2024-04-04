import {
  timeout,
  timeout2,
  shuffle,
  getScreenDocument,
  querySelectorAll,
  debounce,
  throttle,
} from "./utils";

import { Device, NodeWebSocket } from "android-bot";
import FormData from "form-data";
import { writeFile } from "fs/promises";
import path from "path";
const resolve = (p) => path.resolve(__dirname, p);
async function main() {
  const device = new Device("192.168.250.103:18080");
  //   获取设备的所有ip
  const ips = await device.getIp();
  console.log(`ips is:${ips}`);
  //获取屏幕信息
  const screenInfo = await device.screenInfo();
  console.log(`screenInfo is:${screenInfo}`);
  //获取系统信息
  const systemInfo = await device.getSystemInfo();
  console.log(`systemInfo is:${systemInfo}`);
  //获取屏幕截图并保存
  const screenShot = await device.screenShot();
  console.log(screenShot);
  await writeFile(resolve());
}
main();
