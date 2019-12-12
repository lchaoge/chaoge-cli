# chaoge-cli 贡献指南

Hi! 首先感谢你使用 chaoge-cli。

chaoge-cli 是一套为开发者准备的开源模板，旨在快速搭建页面。它基于 nuxt+typescript+vue+elementui 开发。

chaoge-cli 的成长离不开大家的支持，如果你愿意为 chaoge-cli 贡献代码或提供建议，请阅读以下内容。

有关nuxt工作原理的详细说明，请查看 [Nuxt.js docs](https://nuxtjs.org).

## Issue 规范
- issue 仅用于提交 Bug 或 Feature 以及设计相关的内容，其它内容可能会被直接关闭。如果你在使用时产生了疑问，请到 [Issues](https://github.com/lchaoge/nuxt_vue_ts/issues) 里咨询。

## 开发环境搭建
首先你需要 Node.js 8+，yarn 和 npm 6+。注意：我们使用 yarn 进行依赖版本的锁定，所以请不要使用 `npm install` 安装依赖。
```shell
# 安装依赖项
yarn install

# 在本地主机上进行热重新加载 localhost:8080
yarn dev

# open http://127.0.0.1:8080
```
> **提示**：修改 `package.json` 文件下config.nuxt可修改IP和端口号。

打包代码：

```shell
yarn build
```

## 组件开发规范
- 通过 `make new` 创建组件目录结构，包含测试代码、入口文件、文档
- 如果包含父子组件，需要更改目录结构，参考 `Button`
- 组件内如果依赖了其他组件，需要在当前组件内引入，参考 `Select`

## 代码规范
遵循饿了么前端的 [ESLint](https://github.com/ElemeFE/eslint-config-elemefe) 即可



## 代码规范
```
1. css 名称用中划线断开（.tab-box)
2. 图片命名用下划线断开（order_all.png)
3. 文件用到多张图片请建立 images 文件夹并在统一的 index.ts 中导出，方便后续修改
4. 页面文件夹用驼峰命名，组件命名用中划线断开，命名都尽量用两个及以上字段，不用单字段
```

# nuxt配置less
```
1.安装 style-resources：
$ yarn add @nuxtjs/style-resources

2.根据需要安装：
SASS: $ yarn add sass-loader node-sass
LESS: $ yarn add less-loader less
Stylus: $ yarn add stylus-loader stylus

3.修改 nuxt.config.js:
export default {
  modules: [
    '@nuxtjs/style-resources',
  ],
  styleResources: {
    scss: './assets/variables.scss',
    less: './assets/**/*.less',
    // sass: ...
  }
}
⚠️您不能在此处使用路径别名(~ 和 @
⚠️ You cannot use path aliases here (~ and @)，你需要使用相对或绝对路径。
```
