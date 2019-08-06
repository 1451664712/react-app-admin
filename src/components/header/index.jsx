import React, {Component} from 'react'
import {withRouter} from 'react-router-dom'
import {Modal, message } from 'antd';
import './index.less'
import {formateDate} from '../../utils/dateUtils'
import {reqWeather} from '../../api'

import menuList from '../../config/menuConfig'
// 内存存储
import memoryUtils from '../../utils/memoryUtils'
// 本地 存储
import storageUtils from '../../utils/storageUtils'
import LinkButton from '../../components/link-button'
class Header extends Component {
    state = {
        currentTime: formateDate(Date.now()),
        dayPictureUrl: '',  //天气图片
        weather: '' //天气文本
    };

    // 实时获取时间
    getTime() {
        this.intervalId = setInterval(() => {
            const currentTime = formateDate(Date.now())
            this.setState({currentTime})
        }, 1000) //每隔一秒刷新一次
    }

    // 获取天气
    getWeather = async () => {
        // 调用接口请求异步获取数据
        const {dayPictureUrl, weather} = await reqWeather('成都')
        // 更新状态
        this.setState({dayPictureUrl, weather})
    };
    // 获取title
    getTitle() {
        const path = this.props.location.pathname;
        let title = null;
        menuList.forEach((item) => {
            if (path === item.key) {
                title = item.title
            }
            if (item.children) {
                const cItem = item.children.find((cItem) => {
                    return path.indexOf(cItem.key) !== -1
                });
                if (cItem) {
                    title = cItem.title
                }
            }
        });
        return title
    }
    //退出登录
    logout = () => {
        Modal.confirm({
            content: '确定退出吗？',
            okText: '确认',
            cancelText: '取消',
            onOk: () => {
                memoryUtils.user = {};
                storageUtils.removeUser();
                message.success('系统已退出！')
                this.props.history.replace('/login')
            }
        });
    }

    componentDidMount() {
        this.getTime();
        this.getWeather()
    }
    // 组件卸载前调用
    componentWillUnmount () {
        clearInterval(this.intervalId)
    }
    render() {
        const {currentTime, dayPictureUrl, weather} = this.state;
        const {username} = memoryUtils.user
        const title = this.getTitle()
        return (
            <div className="header_nav">
                <div className="header_top">
                    <span>欢迎，{username}</span>
                    <LinkButton onClick={this.logout}>退出</LinkButton>

                </div>
                <div className="header_bottom">
                    <div className="header_bottom_left">
                        <span>{title}</span>
                    </div>
                    <div className="header_bottom_right">
                        <span>{currentTime}</span>
                        <img src={dayPictureUrl} alt=""/>
                        <span>{weather}</span>
                    </div>
                </div>
            </div>
        )
    }
}

export default withRouter(Header)
