const {override, fixBabelImports, addLessLoader} = require('customize-cra');
module.exports = override(
    // 针对antd实现按需打包，根据import来打包（使用babel-plugin-import）
    fixBabelImports('import', {
        libraryName: 'antd',
        libraryDirectory: 'es',
        style: true,
    }),
    //  自定义主题颜色，对源码的变量重新赋值
    addLessLoader({
        javascriptEnabled: true,
        modifyVars: {'@primary-color': '#1DA57A'},
    }),
);
