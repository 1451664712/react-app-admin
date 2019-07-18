import React, {Component} from 'react'
import {Card, Icon, Button, Table, message, Breadcrumb, Modal} from 'antd';
import LinkButton from "../../components/link-button";
import {reqCategorys, reqAddCategorys, reqUpdateCategorys} from '../../api'
// 路由组件
import AddForm from './AddForm/add-form'
import UpdateForm from './AddForm/update-form'

export default class Category extends Component {
    state = {
        loading: false, // 加载状态
        categorys: [], // 一级分类列表
        subCategorys: [], // 二级分类列表
        parentId: '0', // 当前需要显示的分类列表的父分类id
        parentName: '', // 当前需要显示的分类列表的父分类名称
        showStatus: 0 // 是否显示模态框，0都不显示 1显示 2显示更新
    };
    // 初始化table列数组
    initColumns = () => {
        this.columns = [
            {
                title: '分类名称',
                dataIndex: 'name',
            },
            {
                title: "操作",
                width: 300,
                render: (category) => (
                    <span>
                        <LinkButton onClick={() => this.showUpdate(category)}>修改分类</LinkButton>&nbsp;&nbsp;
                        {/*如何向事件回调函数传递参数： 先定义一个匿名函数，在函数调用处理的函数并传入数据*/}
                        {
                            this.state.parentId === '0' ?
                                (<LinkButton onClick={() => {
                                    this.showSubCategorys(category)
                                }}>查看子分类</LinkButton>) : (null)
                        }
                    </span>
                )
            }
        ];
    };

    // 获取一级分类列表
    getCategorys = async (parentId) => {
        this.setState({loading: true});
        parentId = parentId || this.state.parentId;
        const result = await reqCategorys(parentId);
        this.setState({loading: false});
        if (result.status === 0) {
            // 取出分类数组（可能是一级 或 二级）
            const categorys = result.data;
            // 更新一级分类状态
            if (parentId === '0') {
                this.setState({categorys: categorys})
            } else {
                this.setState({subCategorys: categorys})
            }
        } else {
            message.error('获取信息失败！')
        }
    };

    // 显示指定一级分类的二级列表
    showSubCategorys = (category) => {
        // 更新状态
        this.setState({
            parentId: category._id,
            parentName: category.name
        }, () => { // 状态更新后，重新render
            this.getCategorys()
        })
    };

    // 显示一级列表
    showCategorys = () => {
        // 更新成一级列表
        this.setState({
            parentId: '0',
            parentName: '',
            subCategorys: []
        })
    };

    // 显示添加模态框
    showAdd = () => {
        this.setState({
            showStatus: 1
        })
    };

    // 添加确认
    addCategory = () => {
        this.form.validateFields(async (err, value) => {
            if (!err) {
                // 隐藏确认框
                this.setState({
                    showStatus: 0
                })
                // 发请求更新分类
                const {parentId, categoryName} = value;
                this.form.resetFields();
                const result = await reqAddCategorys({parentId, categoryName});
                if (result.status === 0) {
                    if (parentId === this.state.parentId) {
                        // 重新显示列表
                        this.getCategorys()
                    } else if (parentId === '0') {
                        this.getCategorys('0')
                    }
                } else {
                    message.error('获取信息失败！')
                }
            }
        })
    };

    // 显示修改分类模态框
    showUpdate = (category) => {
        this.category = category;
        this.setState({
            showStatus: 2
        })
    };
    // 修改分类确定
    updateCategory = () => {
        this.form.validateFields(async (err, value) => {
            if (!err) {
                // 隐藏模态框
                this.setState({
                    showStatus: 0
                });
                // 发请求更新分类
                const categoryId = this.category._id;
                const categoryName = value;
                this.form.resetFields();
                const result = await reqUpdateCategorys({categoryId, categoryName});
                if (result.status === 0) {
                    // 重新显示列表
                    this.getCategorys()
                } else {
                    message.error('获取信息失败！')
                }
            }
        })
    };

    // 隐藏模态框
    handleCancel = () => {
        this.form.resetFields();
        this.setState({
            showStatus: 0
        })
    };

    // 发异步ajax请求
    componentDidMount() {
        this.getCategorys()
    }

    // 初始化列表
    componentWillMount() {
        this.initColumns()
    }

    render() {
        const {parentId, categorys, subCategorys, loading, parentName} = this.state;

        // 读取指定分类
        const category = this.category || {}; // 如果么有就为空对象

        const title = parentId === '0' ? (
            <span>
                <Breadcrumb onClick={this.showCategorys}>
                    <Breadcrumb.Item>
                        <LinkButton>一级分类</LinkButton>
                    </Breadcrumb.Item>
                </Breadcrumb>
            </span>
        ) : (
            <span>
                <Breadcrumb>
                    <Breadcrumb.Item>
                        <LinkButton onClick={this.showCategorys}>一级分类</LinkButton>
                    </Breadcrumb.Item>
                    <Breadcrumb.Item>{parentName}</Breadcrumb.Item>
                </Breadcrumb>
            </span>
        );
        const extra = (
            <Button type="primary" onClick={this.showAdd}>
                <Icon type="plus"></Icon>
                添加
            </Button>
        );

        return (
            <Card title={title} extra={extra} style={{width: '100%'}} bordered={false}>
                <Table
                    bordered
                    rowKey="_id"
                    loading={loading}
                    dataSource={parentId === '0' ? categorys : subCategorys}
                    columns={this.columns}
                    pagination={{
                        defaultPageSize: 5,
                        showQuickJumper: true
                    }}
                />
                <Modal
                    title="添加分类"
                    visible={this.state.showStatus === 1}
                    onOk={this.addCategory}
                    onCancel={this.handleCancel}
                >
                    <AddForm
                        categorys={categorys}
                        parentId={parentId}
                        setForm={(form) => {
                            this.form = form
                        }}
                    />
                </Modal>
                <Modal
                    title="修改分类"
                    visible={this.state.showStatus === 2}
                    onOk={this.updateCategory}
                    onCancel={this.handleCancel}
                >
                    <UpdateForm
                        categoryName={category.name}
                        setForm={(form) => {
                            this.form = form
                        }}
                    />
                </Modal>
            </Card>
        )
    }
}
