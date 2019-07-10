import React, { Component } from 'react'
import {BrowserRouter, Route, Switch} from 'react-router-dom'
import Login from './page/login/login.jsx'
export  default  class App extends Component {
    render() {
        return (
           <BrowserRouter>
               {/*匹配其中的一个*/}
               <Switch>
                   <Route path="/" component={Login}></Route>
               </Switch>
           </BrowserRouter>
        )
    }
}

