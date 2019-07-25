import React, {Component} from 'react'
import {Card, Form, Input, Button, Icon, Cascader, message} from 'antd'
import LinkButton from "../../components/link-button";
import RichTextEditor from "./rich-text-editor"
import PicturesWall from "./picures-wall"
import {reqCategorys, reqAddOrUpdateProduct} from "../../api";

const {TextArea} = Input
const {Item} = Form

// 默认子路由
class ProductAddUpdate extends Component {
    state = {
        options: []
    }

    constructor(props) {
        super(props)
        this.pw = React.createRef()
        this.editor = React.createRef()
    }

    initOptions = async categorys => {
        // 根据categorys生成options数组
        const options = categorys.map(c => ({
            value: c._id,
            label: c.name,
            isLeaf: false, // 不是叶子
        }))
        // 如果是一个二级分类商品的更新
        const {isUpdate, product} = this
        const {categoryId} = product
        if (isUpdate && categoryId !== '0') {
            // 获取对应的二级分类列表
            const subCategorys = await this.getCategorys(categoryId)
            console.log(subCategorys)
            // 生成二级下拉列表的options
            const childOptions = subCategorys.map(c => ({
                value: c._id,
                label: c.name,
                isLeaf: true
            }))

            // 找到当前商品对应的一级option对象
            const targetOption = options.find(option => option.value === categoryId)

            // 关联对应的一级option上
            targetOption.children = childOptions
        }


        // 更新options状态
        this.setState({
            options
        })
    }
    // initOptions = async (categorys) => {
    //     const options = categorys.map(item => ({
    //         value: item._id,
    //         label: item.name,
    //         isLeaf: false
    //     }));
    //     const {isUpdate, product} = this
    //     const {pCategoryId, categoryId} = product;
    //     if (isUpdate && pCategoryId !== '0') {
    //         const subCategorys = await this.getCategorys(pCategoryId)
    //         console.log( 'subCategorys', subCategorys)
    //         const childOptions = subCategorys.map(c => ({
    //             value: c._id,
    //             label: c.name,
    //             isLeaf: true
    //         }))
    //         // 找到当前商品对应的一级option对象
    //         const targetOption = options.find(option => option.value===pCategoryId)
    //
    //         // 关联对应的一级option上
    //         targetOption.children = childOptions
    //     }
    //     this.setState({options})
    // }
    submit = () => {
        this.props.form.validateFields(async (err, values) => {
            if (!err) {
                // 收集数据
                const {name, desc, price, Ids} = values
                let categoryId, pCategoryId
                if (Ids.length === 1) {
                    categoryId = '0'
                    pCategoryId = Ids[0]
                } else {
                    categoryId = Ids[0]
                    pCategoryId = Ids[1]
                }
                const imgs = this.pw.current.getImgs()
                const detail = this.editor.current.getDetail()
                const product = {name, desc, price, imgs, detail, categoryId, pCategoryId}
                if (this.isUpdate) {
                    product._id = this.product._id
                }
                // 请求接口添加/更新
                const result = await reqAddOrUpdateProduct(product)
                if (result.status === 0) {
                    if (this.isUpdate) {
                        message.success('更新成功')
                    } else {
                        message.success('添加成功')
                    }
                    this.props.history.goBack()
                } else {
                    if (this.isUpdate) {
                        message.success('更新失败')
                    } else {
                        message.success('添加失败')
                    }
                }

            }
        })
    };
    // 获取一级列表
    getCategorys = async (parentId) => {
        const result = await reqCategorys(parentId)
        if (result.status === 0) {
            const categorys = result.data
            if (parentId === '0') {
                this.initOptions(categorys)
            } else {
                return categorys
            }
        }
    };

    // 加载下一级列表的回调函数
    loadData = async selectedOptions => {

        const targetOption = selectedOptions[selectedOptions.length - 1];
        targetOption.loading = true;

        // 根据选中的分类，请求获取二级分类列表
        const subCategorys = await this.getCategorys(targetOption.value);
        targetOption.loading = false;
        if (subCategorys && subCategorys.length > 0) {
            const childOptions = subCategorys.map(item => ({
                value: item._id,
                label: item.name,
                isLeaf: true
            }))
            targetOption.children = childOptions
            this.setState({
                options: [...this.state.options],
            });
        }
    };
    // 验证价格函数
    validatePrice = (rule, value, callback) => {
        if (value * 1 > 0) {
            callback()
        } else {
            callback('价格必须大于0')
        }
    };

    // 获取分类
    componentDidMount() {
        this.getCategorys('0')
    }

    componentWillMount() {
        const product = this.props.location.state
        this.isUpdate = !!product
        this.product = product || {}
    }

    render() {
        const {isUpdate, product} = this
        const {pCategoryId, categoryId, imgs, detail} = product;
        const Ids = []
        if (pCategoryId === '0') {
            Ids.push(categoryId)
        } else {
            Ids.push(categoryId)
            Ids.push(pCategoryId)
        }
        const formItemLayout = {
            labelCol: {span: 2},
            wrapperCol: {span: 8}
        };
        const title = (
            <span>
                <LinkButton>
                    <Icon type="left-circle"
                          style={{
                              color: '#399',
                              fontSize: 20,
                              verticalAlign: 'middle',
                              marginRight: 10,
                              cursor: 'pointer'
                          }}
                          onClick={() => {
                              this.props.history.goBack()
                          }}
                    />
                    <span style={{verticalAlign: 'middle', color: '#666'}}>
                        {
                            isUpdate ? '修改商品' : '添加商品'
                        }
                    </span>
                </LinkButton>
            </span>
        )
        const {getFieldDecorator} = this.props.form
        return (
            <Card title={title} bordered={false}>
                <Form {...formItemLayout}>
                    <Item label="商品名称">
                        {
                            getFieldDecorator('name', {
                                initialValue: product.name,
                                rules: [
                                    {required: true, message: '必须输入商品名称'}
                                ]
                            })(<Input placeholder="请输入商品名称"/>)
                        }
                    </Item>
                    <Item label="商品描述">
                        {
                            getFieldDecorator('desc', {
                                initialValue: product.desc,
                                rules: [
                                    {required: true, message: '必须输入商品描述'}
                                ]
                            })(<TextArea placeholder="请输入商品描述" autosize={{minRows: 2, maxRows: 6}}/>)
                        }
                    </Item>
                    <Item label="商品价格">
                        {
                            getFieldDecorator('price', {
                                initialValue: product.price,
                                rules: [
                                    {required: true, message: '必须输入商品价格'},
                                    {validator: this.validatePrice}
                                ]
                            })(<Input type="number" placeholder="请输入商品价格" addonAfter="元"/>)
                        }
                    </Item>
                    <Item label="商品分类">
                        {
                            getFieldDecorator('Ids', {
                                initialValue: Ids,
                                rules: [
                                    {required: true, message: '必须输入'}
                                ]
                            })(<Cascader
                                options={this.state.options}
                                loadData={this.loadData}
                                changeOnSelect
                            />)
                        }
                    </Item>
                    <Item label="商品图片">
                        <PicturesWall ref={this.pw} imgs={imgs}/>
                    </Item>
                    <Item label="商品详情" labelCol={{span: 2}} wrapperCol={{span: 20}}>
                        <RichTextEditor ref={this.editor} detail={detail}/>
                    </Item>
                    <Item>
                        <Button type="primary" onClick={this.submit}>提交</Button>
                    </Item>

                </Form>
            </Card>
        )
    }
}

export default Form.create()(ProductAddUpdate)
