# react-native-webview-richeditor

ios和android通用的富文本编辑器，基于RN原生的webview实现，安卓4.4一下版本因为postMessage无效所以无法使用，如需兼容android 4.4以下版本请使用react-native-webview-bridge代替RN原生的webview

## 安装

这版编辑器包含插入图片功能，依赖了react-native-image-picker

```
npm install react-native-webview-richeditor --save
or
yarn add react-native-webview-richeditor

```



因为编辑器工具栏依赖一些字体图标，所以需要安装字体文件
将assets目录拷贝到目标工程的根目录下
在package.json中添加如下配置

```
"rnpm": {
"assets": [
"assets/fonts"
]
},
```
之后运行
```
react-native link
```
一些用户会遇到类似于键盘遮挡等问题，可以安装react-native-keyboard-spacer
安卓最好在AndroidManifest.xml中添加如下配置来屏蔽原生键盘压缩布局的问题

```
...
<activity
android:windowSoftInputMode="stateHidden|adjustPan"
...
```
### 关于安卓打包release版后无法运行的问题，
找到node_modules/react-native-webview-richeditor/richeditor.html，复制到android/app/src/main/assets/html/ 路径下（没有就手动创建）

另外image-picker需要配置一些权限
```
<uses-permission android:name="android.permission.CAMERA" />
<uses-permission android:name="android.permission.READ_PHONE_STATE" />
<uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" />
<uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" />
<uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
```
## 使用

```
import RichEditor from 'react-native-webview-richeditor';
...
<RichEditor />
```







