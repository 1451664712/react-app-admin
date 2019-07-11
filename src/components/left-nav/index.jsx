import React, {Component} from 'react'
import {Link} from 'react-router-dom'
import {Menu, Icon} from 'antd';

// 左侧导航
import './index.css'
import logo from '../../assets/images/player.gif'

const {SubMenu} = Menu;

export default class LeftNav extends Component {
    render() {
        return (
            <div className="left_nav">
                <Link to="/" className="left_nav_header">
                    <img src={logo} alt=""/>
                    <h1>React后台</h1>
                </Link>
                <Menu
                    defaultSelectedKeys={['1']}
                    defaultOpenKeys={['sub1']}
                    mode="inline"
                    theme="dark"
                >
                    <Menu.Item key="/home">
                        <Link to="/home">
                            <Icon type="pie-chart"/>
                            <span>首页</span>
                        </Link>
                    </Menu.Item>
                    <SubMenu
                        key="sub2"
                        title={
                        <span>
                            <Icon type="appstore"/>
                            <span>商品</span>
                        </span>
                        }>
                        <Menu.Item key="/category">
                            <Link to="/category">
                                <Icon type="pie-chart"/>
                                <span>品类管理</span>
                            </Link>
                        </Menu.Item>
                        <Menu.Item key="/product">
                            <Link to="/product">
                                <Icon type="pie-chart"/>
                                <span>商品管理</span>
                            </Link>
                        </Menu.Item>
                    </SubMenu>
                    <Menu.Item key="/user">
                        <Link to="/user">
                            <Icon type="pie-chart"/>
                            <span>用户管理</span>
                        </Link>
                    </Menu.Item>
                    <Menu.Item key="/role">
                        <Link to="/role">
                            <Icon type="pie-chart"/>
                            <span>角色管理</span>
                        </Link>
                    </Menu.Item>
                </Menu>
            </div>
        )
    }
}
