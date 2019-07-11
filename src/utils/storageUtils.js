/*
* 本地存储模块
* */
// export default {
//     //保存user
//     saveUser (user) {
//         localStorage.setItem(USER_KEY, JSON.stringify(user))
//     },
//     //读取user
//     getUser () {
//       return JSON.parse(localStorage.getItem(USER_KEY) || '{}')
//     },
//     //移除user
//     removeUser () {
//         localStorage.removeItem(USER_KEY)
//     }
// }

/*使用store库*/

import store from 'store'
const USER_KEY = 'user_key';

export default {
    //保存user
    saveUser(user) {
        store.set(USER_KEY, user)
    },
    //读取user
    getUser() {
        return store.get(USER_KEY) || {}
    },
    //移除user
    removeUser() {
        store.remove(USER_KEY)
    }
}
