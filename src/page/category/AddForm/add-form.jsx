import React, {Component} from 'react'
import {Form, Select, Input,} from 'antd'

const Item = Form.Item;
const Option = Select.Option

class AddForm extends Component {
    render() {
        const {getFieldDecorator} = this.props.form
        return (
            <Form>
                <Item>
                    {
                        getFieldDecorator('parentId', {
                            initialValue: '0'
                        })(
                            <Select>
                                <Option value="0">一级分类</Option>
                                <Option value="1">图书</Option>
                                <Option value="2">电脑</Option>
                            </Select>
                        )
                    }
                </Item>
                <Item>
                    {
                        getFieldDecorator('categoryName', {
                            initialValue: ''
                        })(
                            <Input placeholder="请输入"/>
                        )
                    }
                </Item>
            </Form>
        )
    }
}

export default Form.create()(AddForm)
