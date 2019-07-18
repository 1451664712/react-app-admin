// 添加模块组件
import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {Form, Select, Input,} from 'antd'

const Item = Form.Item;
const Option = Select.Option

class AddForm extends Component {
    static propTypes = {
        categorys: PropTypes.array.isRequired, //一级分类数组
        parentId: PropTypes.string.isRequired, // 父分类ID
        setForm: PropTypes.func.isRequired
    }
    componentWillMount () {
        this.props.setForm(this.props.form)
    }
    render() {
        const {getFieldDecorator} = this.props.form
        const {categorys, parentId} = this.props
        return (
            <Form>
                <Item>
                    {
                        getFieldDecorator('parentId', {
                            initialValue: parentId
                        })(
                            <Select>
                                <Option value='0'>一级分类</Option>
                                {
                                    categorys.map(item => (
                                        <Option value={item._id}>{item.name}</Option>
                                    ))
                                }
                            </Select>
                        )
                    }
                </Item>
                <Item>
                    {
                        getFieldDecorator('categoryName', {
                            initialValue: '',
                            rules: [{
                                required: true, message: '分类名称不能为空'
                            }]
                        })(
                            <Input placeholder="请输入分类名称"/>
                        )
                    }
                </Item>
            </Form>
        )
    }
}

export default Form.create()(AddForm)
