/*
* 包含接口函数模块
* */
import ajax from './ajax'
import jsonp from 'jsonp'
import { message } from 'antd'
// export  function login(user, pass) {
//     return ajax('/login',{user, pass}, 'POST')
// }

// 登录
export const reqLogin = (username, password) => ajax('/login', {username, password}, 'POST');

// 添加用户
export const reqAddUser = (data) => ajax('/login', data, 'POST');

// 获取分类
export const reqCategorys = (parentId) => ajax('manage/category/list', {parentId});
// 添加分类
export const reqAddCategorys = ({parentId, categoryName}) => ajax('manage/category/add', {parentId, categoryName}, 'POST');
// 更新分类
export const reqUpdateCategorys = ({categoryId, categoryName}) => ajax('manage/category/update', {categoryId, categoryName}, 'POST');

// 获取商品分页列表
export const reqProducts = (pageNum, pageSize) => ajax('manage/product/list', {pageNum, pageSize});

/*搜索商品分页列表(根据商品名称/ 商品描述)
searchType：搜索类型，productName/ productDesc
将参数的值作为属性名，将参数用[]包起来
*/
export const reqSearchProducts = ({pageNum, pageSize, searchName, searchType}) => ajax('manage/product/search', {
    pageNum,
    pageSize,
    [searchType]: searchName
});

/*
* jsonp请求
* 天气
* */

export const reqWeather = (city) => {
    return new Promise((resolve, reject) => {
        const url = `http://api.map.baidu.com/telematics/v3/weather?location=${city}&output=json&ak=3p49MVra6urFRGOT9s8UBWr2`;
        jsonp(url, {}, (err, data) => {
            if (!err || data.status === 'success') {
                const {dayPictureUrl, weather} = data.results[0].weather_data[0];
                resolve({dayPictureUrl, weather})
            } else {
                message.error('获取天气参数失败')
            }
        })
    })
};

