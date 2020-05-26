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



