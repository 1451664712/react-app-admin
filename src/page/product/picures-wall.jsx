import React from 'react'
import PropTypes from 'prop-types'
import {Upload, Icon, Modal, message} from 'antd';
import {reqDeleteImg} from "../../api";
import {BASE_IMG_URL} from "../../utils/constants";

/*
* 用于图片上传
* */
function getBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
}

export default class PicturesWall extends React.Component {
    static propTypes = {
        imgs: PropTypes.array
    }
    constructor (props) {
        super(props)
        let fileList = []
        const {imgs} = this.props
        if (imgs && imgs.length > 0) {
            imgs.map((item, index) => ({
                uid: -index,
                name: item,
                status: 'done',
                url: BASE_IMG_URL + item
            }))
        }
        this.state = {
            previewVisible: false, // 是否显示预览modal
            previewImage: '',
            fileList: fileList // 所有已上传的图片数组
        }
    }
    getImgs = () => {
        return this.state.fileList.map(item => item.name)
    }
    handleCancel = () => this.setState({previewVisible: false});

    handlePreview = async file => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj);
        }

        this.setState({
            previewImage: file.url || file.preview,
            previewVisible: true,
        });
    };

    handleChange = async ({file, fileList}) => {
        if (file.status === 'done') {
            const result = file.response
            if (result.status === 0) {
                message.success('上传成功')
                const {name, url} = result.data
                file = fileList[fileList.length - 1]
                file.name = name
                file.url = url
                console.log(file, 111)
            } else {
                message.error('上传失败')
            }
        } else if (file.status === 'removed') {
            const result = await reqDeleteImg(file.name)
            if (result.status === 0) {
                message.success('删除成功')
            } else {
                message.error('删除失败')
            }
        }
        this.setState({fileList})
    }

    render() {
        const {previewVisible, previewImage, fileList} = this.state;
        const uploadButton = (
            <div>
                <Icon type="plus"/>
                <div>Upload</div>
            </div>
        );
        return (
            <div>
                <Upload
                    action="/manage/img/upload" // 上传图片的接口地址
                    accept="image/*" // 直接收图片格式
                    listType="picture-card" // 卡片样式
                    name="image" // 请求参数名
                    fileList={fileList} // 所有已上传图片文件的对象的数组
                    onPreview={this.handlePreview}
                    onChange={this.handleChange}
                >
                    {fileList.length >= 3 ? null : uploadButton}
                </Upload>
                <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
                    <img alt="example" style={{width: '100%'}} src={previewImage}/>
                </Modal>
            </div>
        );
    }
}
