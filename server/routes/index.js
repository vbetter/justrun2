/**
 * ajax 服务路由集合
 */
const router = require('koa-router')({
    prefix: '/weapp'
})
const controllers = require('../controllers')

// 从 sdk 中取出中间件
// 这里展示如何使用 Koa 中间件完成登录态的颁发与验证
const { auth: { authorizationMiddleware, validationMiddleware } } = require('../qcloud')

// --- 登录与授权 Demo --- //
// 登录接口
router.get('/login', authorizationMiddleware, controllers.login)
// 用户信息接口（可以用来验证登录态）
router.get('/user', validationMiddleware, controllers.user)

// --- 图片上传 Demo --- //
// 图片上传接口，小程序端可以直接将 url 填入 wx.uploadFile 中
router.post('/upload', controllers.upload)

// --- 信道服务接口 Demo --- //
// GET  用来响应请求信道地址的
router.get('/tunnel', controllers.tunnel.get)
// POST 用来处理信道传递过来的消息
router.post('/tunnel', controllers.tunnel.post)

// --- 客服消息接口 Demo --- //
// GET  用来响应小程序后台配置时发送的验证请求
router.get('/message', controllers.message.get)
// POST 用来处理微信转发过来的客服消息
router.post('/message', controllers.message.post)
// --- 客服消息接口 业务逻辑 --- //
//创建跑团
router.get('/createTeam', controllers.group.createTeam)
//离开跑团
router.get('/leaveTeam', controllers.group.leaveTeam)
//加入跑团
router.get('/joinTeam', controllers.group.joinTeam)
//修改跑团数据
router.get('/reviseTeam', controllers.group.reviseTeam)
//拉取跑团信息
router.get('/findTeam', controllers.group.findTeam)
//打卡
router.get('/punch', controllers.userinfo.punch)
//修改我的分组信息
router.get('/reviseTeamIndex', controllers.userinfo.reviseTeamIndex)

//test测试helloworld
router.get('/testDelete',controllers.demo.testDelete)
router.get('/testAdd', controllers.demo.testAdd)
router.get('/testSet', controllers.demo.testSet)
router.get('/testGet', controllers.demo.testGet)
//test测试helloworld
//router.get('/userinfo', controllers.demo)

module.exports = router
