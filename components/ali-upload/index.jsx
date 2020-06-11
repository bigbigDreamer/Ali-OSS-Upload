import React, { useState, Fragment } from 'react';
import OSS from 'ali-oss';
import PropTypes from 'prop-types';
import { Spin, Upload } from 'antd';
import { PlusOutlined } from '@ant-design/icons';


import './index.less';

function UploadButton({ uploadBtnText }) {
    return (
            <Fragment>
                <PlusOutlined />
                <div className="ant-upload-text"> { uploadBtnText } </div>
            </Fragment>
    )
}

export default function AliUpload({ ossConfig = {
    region: '',
    accessKeyId: '',
    accessKeySecret: '',
    bucket: ''
}, baseURL = '', form, defaultImgUrl = '', serverDirName = 'ali-upload', uploadBtnText = 'Upload'  }) {

    // 获取OSS config
    const AliClient = new OSS({...ossConfig});

    // 上一个组件传来的修改资源URL的函数，可用于展示远程的资源
    // 控制loading
    const [show, changeShow] = useState(false);

    const [imgUrl, setImgUrl] = useState(null);


    const fileList = [];

    /**
     * @desc format url path
     * @param path
     * @param file
     * @returns {string}
     */
    const uploadPath = (path, file) => {
        return `${path}/${file.name.split('.')[0]}-${file.uid}.${file.type.split('/')[1]}`;
    };

    /**
     * @desc Upload上传方法
     * @param _self FileReader this对象
     * @param path 上传路径
     * @param file 上传文件对象
     * @returns {Promise<unknown>}
     * @constructor
     */
    const UploadToOss = (_self, path, file) => {
        // 文件名格式化，采用路径名
        const fileName = uploadPath(path, file);

        return new Promise((resolve, reject) => {
            // 阿里分片上传技术
            // 详情参照：https://github.com/ali-sdk/ali-oss
            AliClient
                    .multipartUpload(fileName, file)
                    .then(data => {
                        resolve(data);
                    })
                    .catch(error => {
                        reject(error);
                    });
        });
    };

    const beforeUpload = file => {
        changeShow(true);
        // 创建FileReader对象
        let reader = new FileReader();
        reader.readAsDataURL(file);
        // 读取文件已经加载完毕
        reader.onloadend = () => {
            UploadToOss(this, serverDirName, file)
                    .then(data => {
                        changeShow(false);
                        return data;
                    })
                    .then(data => {
                        const avatarUrl = `${baseURL}${data.name}`;
                        setImgUrl(avatarUrl);
                        form && form.setFieldsValue({avatar: avatarUrl});
                    });
        };

        return false;
    };

    const uploadProps = {
        beforeUpload: beforeUpload,
        fileList: fileList,
        accept: '*',
        listType: 'picture-card',
        className: 'ali-uploader'
    };

    return (
            <div className="ali-upload-container">
                {show === true ? (
                        <Spin />
                ) : (
                        <Upload {...uploadProps}>
                            {(imgUrl || defaultImgUrl)
                                    ? <div className="img-box">
                                        <img src={imgUrl || defaultImgUrl} alt="upload-img" className="upload-img" />
                                    </div>
                                    : <UploadButton uploadBtnText={uploadBtnText}/>}
                        </Upload>
                )}
            </div>
    )
}

AliUpload.propTypes = {
    ossConfig: PropTypes.shape({
        // 可到阿里云OSS控制台，bucket概览里查看EndPoint
        // 例如：'oss-cn-beijing'
        region: PropTypes.string.isRequired,
        //云账号AccessKey有所有API访问权限，建议遵循阿里云安全最佳实践，部署在服务端使用RAM子账号或STS，部署在客户端使用STS。
        accessKeyId: PropTypes.string.isRequired,
        accessKeySecret: PropTypes.string.isRequired,
        // bucket名称，每一个bucket独立
        bucket: PropTypes.string.isRequired
    }),
    // oss 默认阿里云文件路径前缀
    // 组成部分可为：https://bucket.region.aliyuncs.com/
    // 例如：https://h5-chatroom.oss-cn-beijing.aliyuncs.com/
    baseURL: PropTypes.string.isRequired,
    form: PropTypes.object.isRequired,
    // 用于已有数据的数据回显
    defaultImgUrl: PropTypes.string,
    // OSS bucket内部文件夹名
    serverDirName: PropTypes.string,
    // 上传按钮的文本
    uploadBtnText: PropTypes.string,
}