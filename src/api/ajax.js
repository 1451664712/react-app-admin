import axios from 'axios'
import {message} from 'antd'

export default function ajax(url, data = {}, type = 'GET') {
    return new Promise((resolve, reject) => {
        let promise;
        // 执行异步ajax请求
        if (type === 'GET') { //发GET请求
            promise = axios.get(url, {
                params: data
            })
        } else { // 发POST请求
            promise = axios.post(url, data)
        }

        promise.then(response => {
            resolve(response.data)
        }).catch(error => {
            message.error('请求出错' + error)
        })

    })

}
