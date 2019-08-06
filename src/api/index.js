/*
* 包含接口函数模块
* */
import ajax from './ajax'
import jsonp from 'jsonp'
import { message } from 'antd'
const BASE = ''
// export  function login(user, pass) {
//     return ajax('/login',{user, pass}, 'POST')
// }

// 登录
export const reqLogin = (username, password) => ajax(BASE + '/login', {username, password}, 'POST');

// 添加用户
export const reqAddUser = (data) => ajax(BASE + '/login', data, 'POST');

// 获取分类
export const reqCategorys = (parentId) => ajax(BASE + '/manage/category/list', {parentId});
// 添加分类
export const reqAddCategorys = ({parentId, categoryName}) => ajax(BASE + '/manage/category/add', {parentId, categoryName}, 'POST');
// 更新分类
export const reqUpdateCategorys = ({categoryId, categoryName}) => ajax(BASE + '/manage/category/update', {categoryId, categoryName}, 'POST');

// 获取商品分页列表
export const reqProducts = (pageNum, pageSize) => ajax(BASE + '/manage/product/list', {pageNum, pageSize});

/*搜索商品分页列表(根据商品名称/ 商品描述)
searchType：搜索类型，productName/ productDesc
将参数的值作为属性名，将参数用[]包起来
*/
export const reqSearchProducts = ({pageNum, pageSize, searchName, searchType}) => ajax(BASE + '/manage/product/search', {
    pageNum,
    pageSize,
    [searchType]: searchName
});

// 获取一个分类
export const reqCategory = (categoryId) => ajax(BASE + '/manage/category/info', {categoryId});

// 商品上/下架
export const reqUpdateStatus = (productId, status) => ajax(BASE + '/manage/product/updateStatus', {productId, status}, 'POST')

// 删除图片
export const reqDeleteImg = (name) => ajax(BASE + '/manage/img/delete', {name}, 'POST')

// 添加商品 // 更新商品
export const reqAddOrUpdateProduct = (product) => ajax(BASE + '/manage/product/' + ( product._id?'update':'add'), product, 'POST')

// 获取所有角色列表
export const reqRoles = () => ajax(BASE + '/manage/role/list')

// 添加角色
export const reqAddRole = (roleName) => ajax(BASE + '/manage/role/add', {roleName}, 'POST')

// 更新角色
export const reqUpdateRole = (data) => ajax(BASE + '/manage/role/update', data, 'POST')

// 获取所有用户
export const reqUsers = () => ajax(BASE + '/manage/user/list')

// 添加用户/更新用户
export const reqAddOrUpdateUser = (user) => ajax(BASE + '/manage/user/' + (user._id ? 'update' : 'add'), user, 'POST')

// 删除用户
export const reqDeleteUser = (userId) => ajax(BASE + '/manage/user/delete', {userId}, 'POST')

// // 更新用户
// export const reqUpdateUser = (data) => ajax(BASE + '/manage/user/update', data, 'POST')
// // 更新商品
// export const reqUpdateProduct = (data) => ajax('manage/product/update', {data}, 'POST')
/*
* jsonp请求
* 天气
* */

export const reqWeather = (city) => {
    return new Promise((resolve, reject) => {
        const url = `http://api.map.baidu.com/telematics/v3/weather?location=${city}&output=json&ak=3p49MVra6urFRGOT9s8UBWr2`;
        jsonp(url, {}, (data) => {
            if (data) {
                const {dayPictureUrl, weather} = data.results[0].weather_data[0];
                resolve({dayPictureUrl, weather})
            } else {
                message.error('获取天气参数失败')
            }
        })
    })
};


