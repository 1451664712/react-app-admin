import React, {Component} from 'react'
import {Switch, Route, Redirect} from 'react-router-dom'
import './product.less'
// 子组件
import Home from './home'
import AddUpdate from './add-update'
import Detail from './detail'
export default class Product extends Component {
    render() {
        return (
            <Switch>
                <Route exact path='/product' component={Home} />
                <Route path='/product/addupdate' component={AddUpdate} />
                <Route path='/product/detail' component={Detail} />
                <Redirect to='/product'/>
            </Switch>
        )
    }
}
