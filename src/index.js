/*
* 入口js
* */
import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import 'antd/dist/antd.less';


import storageUtils from './utils/storageUtils'
import memoryUtils from './utils/memoryUtils'
// 读取local中的user保存到内存中
const user = storageUtils.getUser();
memoryUtils.user = user

ReactDOM.render(<App></App>, document.getElementById('root'));
