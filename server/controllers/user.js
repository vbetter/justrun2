const { mysql } = require('../qcloud')

module.exports = async (ctx, next) => {
    // 通过 Koa 中间件进行登录态校验之后
    // 登录信息会被存储到 ctx.state.$wxInfo
    // 具体查看：
    if (ctx.state.$wxInfo.loginState === 1) {
        // loginState 为 1，登录态校验成功
        ctx.state.data = ctx.state.$wxInfo.userinfo
        //先查询数据库
        //var res = await mysql("MyData").where({ id }).first()
    } else {
        ctx.state.code = -1
    }
}
