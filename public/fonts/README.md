# 项目本地字体

以下字体下载自 Google Fonts 官方仓库：https://github.com/google/fonts/tree/main/ofl
每个子目录保留原始 TTF 文件与对应的 OFL.txt 许可证；再分发时请一并保留许可证。

| 编号 | 官方仓库子目录 | 字体 class            | 字重                |
| ---- | -------------- | --------------------- | ------------------- |
| C1   | zhimangxing    | font-zhi-mang-xing    | 400                 |
| C2   | liujianmaocao  | font-liu-jian-mao-cao | 400                 |
| C4   | mashanzheng    | font-ma-shan-zheng    | 400                 |
| E2   | allura         | font-allura           | 400                 |
| E3   | alexbrush      | font-alex-brush       | 400                 |
| E4   | dancingscript  | font-dancing-script   | 400–700（可变字体） |
| E6   | sacramento     | font-sacramento       | 400                 |

加载声明位于 src/styles/local-fonts.css，class 定义位于 src/styles/theme.css。
在元素的 class 中使用上述类名；字体试验台为 /font-test/。
单字重字体建议搭配 font-normal，避免浏览器合成加粗改变书写风格。
中文字体体积较大，仅在实际使用时加载；当前未预加载或全站替换。
