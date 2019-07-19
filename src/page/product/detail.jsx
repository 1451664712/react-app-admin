import React, {Component} from 'react'
import {Card, Select, Input, Button, Table, Icon, List} from 'antd'
const Item = List.Item
// 默认子路由
export default class ProductDetail extends Component {
    render() {
        const title = (
            <span>asdf</span>
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
                        <span>联想</span>
                    </Item>
                    <Item>
                        <span className='left'>商品描述:</span>
                        <span>联想</span>
                    </Item>
                    <Item>
                        <span className='left'>商品价格:</span>
                        <span>联想</span>
                    </Item>
                    <Item>
                        <span className='left'>所属分类:</span>
                        <span>电脑-笔记本</span>
                    </Item>
                    <Item>
                        <span className='left'>商品详情:</span>
                        <span>
                            <img className='product_img' src="https://cdn.docschina.org/img/assets/img/qr/publicaccount-989987.jpg" alt=""/>
                            <img className='product_img' src="https://cdn.docschina.org/img/assets/img/qr/publicaccount-989987.jpg" alt=""/>
                        </span>
                    </Item>
                    <Item>
                        <span className='left'>商品详情:</span>
                        <span dangerouslySetInnerHTML={{__html: '<p style="color: #002140">sdfsdf</p>'}}></span>
                    </Item>
                </List>
            </Card>
        )
    }
}
