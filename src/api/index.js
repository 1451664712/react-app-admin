/*
* 包含接口函数模块
* */
import ajax from './ajax'
// export  function login(user, pass) {
//     return ajax('/login',{user, pass}, 'POST')
// }
// 登录
export const reqLogin = (username, password) => ajax('/login', {username, password}, 'POST')
//添加用户
export const reqAddUser = (data) => ajax('/login', data, 'POST')
