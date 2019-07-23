import React, {Component} from 'react'
// import {} from 'react-router-dom'
import {Card, Select, Input, Button, Table, Icon, message} from 'antd'
// api
import {reqProducts, reqSearchProducts, reqUpdateStatus} from '../../api'
import {PAGE_SIZE} from "../../utils/constants";
// 组件
import LinkButton from "../../components/link-button";

const Option = Select.Option;


// 默认子路由
export default class ProductHome extends Component {
    state = {
        products: [],// 商品
        total: 0,
        loading: false,
        searchName: '', // 搜索关键字
        searchType: 'productName' // 搜索类型

    }
    // 初始化表格列数组
    initColumns = () => {
        this.columns = [
            {
                title: '商品名称',
                dataIndex: 'name',
            },
            {
                title: '商品描述',
                dataIndex: 'desc',
            },
            {
                title: '价格',
                dataIndex: 'price',
                render: (price) => '$' + price
            },
            {
                title: '状态',
                width: 100,
                // dataIndex: 'status',
                render: (product) => {
                    const {status, _id} = product
                    return (
                        <span>
                            <Button
                                type="primary"
                                onClick={() => {this.updateStatus(_id, status===1 ? 2 : 1)}}
                            >
                                {status===1 ? '上架' : '下架'}
                            </Button>
                            <span>{status===1 ? '在售' : '已下架'}</span>
                        </span>
                    )
                }
            },
            {
                title: "操作",
                width: 300,
                render: (product) => (
                    <span>
                        <LinkButton onClick={() => {this.props.history.push('/product/detail', product)}}>详情</LinkButton>&nbsp; &nbsp;
                        <LinkButton onClick={() => {this.props.history.push('/product/addupdate', product)}}>修改</LinkButton>
                    </span>
                )
            }
        ];
    };

    // 获取商品
    getProducts = async (pageNum) => {
        this.pageNum = pageNum
        let result
        this.setState({loading: true})
        const {searchName, searchType} = this.state
        if (searchName) {
            result = await reqSearchProducts({pageNum, pageSize: PAGE_SIZE, searchName, searchType})
        } else {
            result = await reqProducts(pageNum, PAGE_SIZE);
        }
        this.setState({loading: false})
        if (result.status === 0) {
            const {total, list} = result.data
            this.setState({
                total: total,
                products: list
            })
        }
    };

    // 更新指定商品的状态
    updateStatus = async (productId, status) => {
        const result = await reqUpdateStatus(productId, status)
        if (result.status === 0) {
            message.success('更新成功')
            this.getProducts(this.pageNum)
        } else {
            message.error('更新失败')
        }
    }

    componentWillMount() {
        this.initColumns()
    }
    componentDidMount () {
        this.getProducts (1)
    }
    render() {
        const {products, loading, total, searchName, searchType} = this.state
        const title = (
            <span>
                <Select
                    style={{width: 150}}
                    value={searchType}
                    onChange={value => this.setState({searchType: value})}
                >
                    <Option value="productName">按名称搜索</Option>
                    <Option value="productDesc">按描述搜索</Option>
                </Select>
                <Input
                    placeholder="关键字"
                    style={{width: 150, margin: '0 10px'}}
                    value={searchName}
                    onChange={event => this.setState({searchName: event.target.value})}
                />
                <Button type='primary' onClick={() => {this.getProducts(1)}}>搜索</Button>
            </span>
        )
        const extra = (
            <Button type='primary' onClick={() => {this.props.history.push('/product/addupdate')}}>
                <Icon type='plus'></Icon>
                添加商品
            </Button>
        )
        return (
            <Card title={title} extra={extra} style={{width: '100%'}} bordered={false}>
                <Table
                    bordered
                    rowKey="_id"
                    loading={loading}
                    dataSource={products}
                    columns={this.columns}
                    pagination={{
                        total: total,
                        defaultPageSize:PAGE_SIZE,
                        showQuickJumper: true,
                        onChange: (pageNum) => {
                            this.getProducts(pageNum)
                        }
                    }}/>
            </Card>
        )
    }
}
