import React, {Component} from 'react'
import {BASE_IMG_URL} from "../../utils/constants";
import {Card, Select, Input, Button, Table, Icon, List} from 'antd'
import {reqCategory} from "../../api";

const Item = List.Item
// 默认子路由
export default class ProductDetail extends Component {
    state = {
        cName1: '',
        cName2: ''
    };
    async componentDidMount () {
        const {categoryId, pCategoryId} = this.props.location.state;
        console.log(this.props.location.state)
        const results = await Promise.all([reqCategory(categoryId), reqCategory(pCategoryId)]);
        console.log(results)
        const cName1 = results[0].data.name;
        const cName2 = results[1].data.name;
        this.setState({
            cName1,
            cName2
        })
    }
    render() {
        const {desc, detail, name, price, imgs} = this.props.location.state;
        const title = (
            <span>
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
                <span style={{verticalAlign: 'middle'}}>商品详情</span>
            </span>
        )
        const extra = (
            <Button type='primary'>
                <Icon type='plus'></Icon>
                添加商品
            </Button>
        )
        return (
            <Card title={title} extra={extra} bordered={false} className='product_detail'>
                <List>
                    <Item>
                        <span className='left'>商品名称:</span>
                        <span>{name}</span>
                    </Item>
                    <Item>
                        <span className='left'>商品描述:</span>
                        <span>{desc}</span>
                    </Item>
                    <Item>
                        <span className='left'>商品价格:</span>
                        <span>{price}元</span>
                    </Item>
                    <Item>
                        <span className='left'>所属分类:</span>
                        <span>电脑-笔记本</span>
                    </Item>
                    <Item>
                        <span className='left'>商品详情:</span>
                        <span>
                            {
                                imgs.map(item => (
                                        <img
                                            className='product_img'
                                            src={BASE_IMG_URL + item}
                                            key={item}
                                            alt="aaa"
                                        />
                                    )
                                )
                            }
                        </span>
                    </Item>
                    <Item>
                        <span className='left'>商品详情:</span>
                        <span dangerouslySetInnerHTML={{__html: detail}}></span>
                    </Item>
                </List>
            </Card>
        )
    }
}
