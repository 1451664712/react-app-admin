import React, {Component} from 'react'
import {Form, Icon, Input, Button, message} from 'antd';
import './login.css'
import logo from '../../assets/images/player.gif'

import {reqLogin} from '../../api'
// 内存 存储
import memoryUtils from '../../utils/memoryUtils'
// 本地 存储
import storageUtils from '../../utils/storageUtils'

import {Redirect} from  'react-router-dom'



/*
* 登录路由组件
* */
class Login extends Component {
    handleSubmit = (event) => {
        event.preventDefault();
        this.props.form.validateFields(async (err, values) => {
            if (!err) {
                const {username, password} = values;
                // promise对象

                // reqLogin(username, password)
                //     .then(response => {
                //         console.log(response)
                //     })

                // 不使用then()来指定成功/失败的回调
                const result = await reqLogin(username, password)
                if (result.status === 0) {
                    message.success('登陆成功');
                    const user = result.data
                    memoryUtils.user = user; //存入内存中
                    storageUtils.saveUser(user); //存入local中
                    // 跳转页面
                    this.props.history.replace('/admin')
                } else {
                    message.error(result.msg)
                }
            }
        });
    };
    validatePwd = (rule, value, callback) => {
        if (!value) {
            callback('请输入密码')
        } else if (value.length < 4) {
            callback('密码长度不能小于4')
        } else if (value.length > 12) {
            callback('密码不能大于12位')
        } else if (!/^[0-9a-zA-Z]+$/.test(value)) {
            callback('必须是英文')
        } else {
            callback()
        }
    }

    render() {
        // 判断用户是否登陆
        const user = memoryUtils.user;
        if (user && user._id) {
            return <Redirect to="/" />
        }
        const {getFieldDecorator} = this.props.form;
        return (
            <div className="login">
                <header className="login_header">
                    <img src={logo} alt=""/>
                    <h1>React: 后台管理系统</h1>
                </header>
                <section className="login_content">
                    <h2>用户登录</h2>
                    <div>
                        <Form onSubmit={this.handleSubmit} className="login-form">
                            <Form.Item>
                                {getFieldDecorator('username', {
                                    rules: [{required: true, message: '请输入用户名!'}],
                                })(
                                    <Input
                                        prefix={<Icon type="user" style={{color: 'rgba(0,0,0,.25)'}}/>}
                                        placeholder="用户名"
                                    />,
                                )}
                            </Form.Item>
                            <Form.Item>
                                {getFieldDecorator('password', {
                                    rules: [{
                                        validator: this.validatePwd
                                    }],
                                })(
                                    <Input
                                        prefix={<Icon type="lock" style={{color: 'rgba(0,0,0,.25)'}}/>}
                                        placeholder="密码"
                                        type="password"
                                    />,
                                )}
                            </Form.Item>
                            <Form.Item>
                                <Button type="primary" htmlType="submit" className="login-form-button">
                                    Log in
                                </Button>
                            </Form.Item>
                        </Form>
                    </div>
                </section>
            </div>
        )
    }
}

const WarpLogin = Form.create()(Login);
export default WarpLogin
