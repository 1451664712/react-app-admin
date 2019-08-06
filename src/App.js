import React, {Component} from 'react'
import {BrowserRouter, Route, Switch} from 'react-router-dom'
import Login from './page/login/login.jsx'
import Admin from './page/admin/admin.jsx'

export default class App extends Component {
    render() {
        return (
            <BrowserRouter>
                {/*匹配其中的一个*/}
                <Switch>
                    <Route path="/login" component={Login}></Route>
                    <Route path="/" component={Admin}></Route>
                </Switch>
            </BrowserRouter>
        )
    }
}

