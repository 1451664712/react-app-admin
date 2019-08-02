import React, {Component} from 'react'
import {Link, withRouter} from 'react-router-dom'
import {Menu, Icon} from 'antd';

// 左侧导航
import './index.css'
import logo from '../../assets/images/player.gif'
import menuList from '../../config/menuConfig'

const {SubMenu} = Menu;

class LeftNav extends Component {
    // 使用map + 递归调用
    // getMenuNodes(menuList) {
    //     return menuList.map(item => {
    //         if (!item.children) {
    //             return (
    //                 <Menu.Item key={item.key}>
    //                     <Link to={item.key}>
    //                         <Icon type={item.icon}/>
    //                         <span>{item.title}</span>
    //                     </Link>
    //                 </Menu.Item>
    //             )
    //         } else {
    //             return (
    //                 <SubMenu
    //                     key={item.key}
    //                     title={
    //                         <Link to={item.key}>
    //                             <Icon type={item.icon}/>
    //                             <span>{item.title}</span>
    //                         </Link>
    //                     }
    //                 >
    //                     {
    //                         this.getMenuNodes(item.children)
    //                     }
    //                 </SubMenu>
    //             )
    //         }
    //     })
    // }
    getMenuNode(menuList) {
        // 得到当前请求的路由路径
        const path = this.props.location.pathname;
        return menuList.reduce((pre, item) => {
            if (!item.children) {
                pre.push((
                    <Menu.Item key={item.key}>
                        <Link to={item.key}>
                            <Icon type={item.icon}/>
                            <span>{item.title}</span>
                        </Link>
                    </Menu.Item>
                ))
            } else {
                const cItem = item.children.find(cItem => {
                    return path.indexOf(cItem.key) === 0  // 当前请求的是商品或其子路由界面
                });
                if (cItem) {
                    this.openKey = item.key
                }
                pre.push((
                    <SubMenu
                        key={item.key}
                        title={
                            <span to={item.key}>
                                <Icon type={item.icon}/>
                                <span>{item.title}</span>
                            </span>
                        }
                    >
                        {
                            // this.getMenuNodes(item.children)
                            this.getMenuNode(item.children)
                        }
                    </SubMenu>
                ))
            }
            return pre
        }, [])
    }
    componentWillMount () {
        this.menuNodes = this.getMenuNode(menuList)
    }
    render() {
        let path = this.props.location.pathname;
        if (path.indexOf('/product') === 0) {
            path = '/product'
        }
        const openKey = this.openKey
        return (
            <div className="left_nav">
                <Link to="/" className="left_nav_header">
                    <img src={logo} alt=""/>
                    <h1>恒盛云平</h1>
                </Link>
                <Menu
                    // defaultSelectedKeys={[path]}
                    selectedKeys={[path]} //动态更新当前组件
                    defaultOpenKeys={[openKey]}
                    mode="inline"
                    theme="dark"
                >
                    {
                        // this.getMenuNode(menuList)
                        this.menuNodes
                    }
                </Menu>
            </div>
        )
    }
}
// withRouter 包装非路由组件，返回一个新组件，
// 新组建向非路由组件传递三个属性
export default withRouter(LeftNav)
