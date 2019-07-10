import React, {Component} from 'react'
import {Form, Icon, Input, Button} from 'antd';
import 'antd/dist/antd.less';
import './login.css'
import logo from './images/player.gif'
/*
* 登录路由组件
* */
class Login extends Component {
    handleSubmit = (event) => {
        event.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                console.log('Received values of form: ', values);
            }
        });
    };
    validatePwd = (rule, value, callback) => {
        if (!value) {
            callback('请输入密码')
        }else if (value.length < 4) {
            callback('密码长度不能小于4')
        }else if (value.length > 12) {
            callback('密码不能大于12位')
        }else if(!/^[0-9a-zA-Z]+$/.test(value)) {
            callback('必须是英文')
        }else {
            callback()
        }
    }
    render() {
        const { getFieldDecorator } = this.props.form;
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
                                    rules: [{ required: true, message: 'Please input your username!' }],
                                })(
                                    <Input
                                        prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                        placeholder="Username"
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
                                        prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                        placeholder="Password"
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
