import React, {Component} from 'react'
import './index.less'
import {formateDate} from '../../utils/dateUtils'
import memoryUtils from '../../utils/memoryUtils'
import {reqWeather} from '../../api'

export default class Header extends Component {
    state = {
        currentTime: formateDate(Date.now()),
        dayPictureUrl: '',  //天气图片
        weather: '' //天气文本
    };

    // 实时获取时间
    getTime() {
        setInterval(() => {
            const currentTime = formateDate(Date.now())
            this.setState({currentTime})
        }, 1000) //每隔一秒刷新一次
    }

    // 获取天气
    // async getWeather() {
    //     const result = await reqWeather('成都')
    //     this.setState({
    //         dayPictureUrl: result.dayPictureUrl,  //天气图片
    //         weather: result.weather //天气文本
    //     })
    // }
     getWeather = async () => {
        const {dayPictureUrl,weather} = await reqWeather('成都');
        this.setState({dayPictureUrl,weather})
    }

    componentDidMount() {
        this.getTime()
        this.getWeather()
    }

    render() {
        const {currentTime, dayPictureUrl, weather} = this.state;
        const {username} = memoryUtils.user
        return (
            <div className="header_nav">
                <div className="header_top">
                    <span>欢迎，{username}</span>
                    <a href="www.baidu.com">退出</a>
                </div>
                <div className="header_bottom">
                    <div className="header_bottom_left">
                        <span>首页</span>
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
