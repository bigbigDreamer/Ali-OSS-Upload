# Ali-OSS-Img-Upload

Author： Eric Wang

Date： 2020.5.26

## 安装

```bash
$ npm i ali-img-upload --save
```

## Description

本组件接入了阿里云OSS SDK，配合antd Upload上传组件，进行分片上传图片至阿里云OSS对象存储。

## How To Use？

```jsx

import React from 'react';
import { AliUpload } from 'ali-img-upload';
import { Form } from 'antd';

export default function Demo() {

    // antd form 实例
     const [form] = Form.useForm();

    return (
        <AliUpload
            ossConfig={{
                 region: '',
                 accessKeyId: '',
                 accessKeySecret: '',
                 bucket: ''
            }}
            baseURL={""}
            form={form}
        />
    )
}

```

## LICENSE MIT

## 项目接入方案（以`create-react-app`创建的项目为例）

采坑记：`create-react-app`内部配置的babel是不支持的编译`node_modules`的jsx语法与less的，所以借助`cra`配置。

- 第一步：安装`customize-cra`与`react-app-rewired`
- 修改package.json

```json
{
 "scripts": {
     "start": "react-app-rewired start",
     "build": "react-app-rewired build",
     "test": "react-app-rewired test"
  }
}
```
- 创建`config-overrides.js`
```js
const { override, addWebpackAlias, addWebpackModuleRule, babelInclude, addLessLoader } = require('customize-cra');
const path = require('path');
const resolve = dir => path.resolve(__dirname, dir);

module.exports = {
    webpack: override(

        addLessLoader({
            javascriptEnabled: true,
            // modifyVars: { '@primary-color': '#1DA57A' },
        }),
        addWebpackAlias({
            "@": resolve("src")
        }),
        // addBabelPreset({
        //     test: ["./node_modules/ali-img-upload"],
        //     presets: ["@babel/preset-react"]
        // })
        addWebpackModuleRule({
            test: /\.less$/,
            include: resolve('node_modules'),
            use: ['style-loader', 'css-loader', 'less-loader'],
        }),
        babelInclude([
            resolve('src'),
            resolve('node_modules')
        ])
    )
}
```
## Note

- 注意在重写babel配置的时候，对于less处理的loader顺序。loader编译的顺序始终是从下往上的,也即从左往右。
- include部分应始终包含node_modules和src两部分。



