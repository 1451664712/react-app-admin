import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {Form, Select, Input} from 'antd'

const Item = Form.Item;
const Option = Select.Option

class AddForm extends Component {
    static propTypes = {
        setForm: PropTypes.func.isRequired,
        roles: PropTypes.array.isRequired,
        type: PropTypes.number.isRequired,
        user: PropTypes.object.isRequired
    }

    componentWillMount() {
        this.props.setForm(this.props.form)
    }

    render() {
        const formItemLayout = {
            labelCol: {span: 5},
            wrapperCol: {span: 15}
        };
        const {getFieldDecorator} = this.props.form
        const {roles, type, user} = this.props
        return (
            <Form {...formItemLayout}>
                <Item label="用户名">
                    {
                        getFieldDecorator('username', {
                            initialValue: type === 0 ? '' : user.username,
                            rules: [
                                {required: true, message: '必须输入用户名'}
                            ]
                        })(<Input placeholder="请输入用户名"/>)
                    }
                </Item>
                <Item label="密码">
                    {
                        getFieldDecorator('password', {
                            initialValue: type === 0 ? '' : user.password,
                            rules: [
                                {required: true, message: '必须输入密码'}
                            ]
                        })(<Input type="password" placeholder="请输入密码"/>)
                    }
                </Item>
                <Item label="手机号">
                    {
                        getFieldDecorator('phone', {
                            initialValue: type === 0 ? '' : user.phone,
                            rules: [
                                {required: true, message: '必须输入手机号'}
                            ]
                        })(<Input addonBefore="+86" placeholder="请输入手机号"/>)
                    }
                </Item>
                <Item label="邮箱">
                    {
                        getFieldDecorator('email', {
                            initialValue: type === 0 ? '' : user.email,
                            rules: [
                                {required: true, message: '必须输入邮箱'},
                                {
                                    type: 'email',
                                    message: '请输入正确的邮箱格式！',
                                },
                            ]
                        })(<Input type="email" placeholder="请输入邮箱"/>)
                    }
                </Item>
                <Item label="角色">
                    {
                        getFieldDecorator('role_id', {
                            initialValue: user.role_id,
                            rules: [{
                                required: true, message: '角色不能为空'
                            }]
                        })(
                            <Select>
                                {
                                    roles.map((item, index) => (
                                        <Option key={index} value={item._id}>{item.name}</Option>
                                    ))
                                }
                            </Select>
                        )
                    }
                </Item>
            </Form>
        )
    }
}

export default Form.create()(AddForm)
