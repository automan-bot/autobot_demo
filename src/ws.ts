import { Device, KeyCode, NodeWebSocket } from "android-bot";
async function main() {
  const device = new Device("192.168.250.103:18080");
  device.setWebSocketClient(new NodeWebSocket());
  device.mScreenControl.addNotificationChangeListener(function (notification) {
    console.log("接收到新的通知：", notification);
  });
  device.mScreenControl.addClipTextChangeListener(function (clipText) {
    console.log("剪切板发生改变", clipText);
  });
  device.mScreenControl.addScreenOrentationChangeListener(function (
    width: number,
    height: number,
    rotation: number,
    isLandscape: boolean
  ) {
    console.log(
      `屏幕方向发生改变,改变后的屏幕宽高: ${width}x${height} 屏幕方向: ${rotation} 是否横屏: ${isLandscape}`
    );
  });
  /*   device.mScreenControl.addScreenChangeListener(function (img) {
    // console.log("接收到新的屏幕图像", img);
  });
  device.mScreenControl.startScreenStream(0.8, 100, 30); */
}
main();
