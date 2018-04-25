/**
 * 小程序配置文件
 */

// 此处主机域名修改成腾讯云解决方案分配的域名
var host = 'https://brijsa3a.qcloud.la';

var config = {

    // 下面的地址配合云端 Demo 工作
    service: {
        host,

        // 登录地址，用于建立会话
        loginUrl: `${host}/weapp/login`,

        // 测试的请求地址，用于测试会话
        requestUrl: `${host}/weapp/user`,
        //创建跑团
        createTeam: `${host}/weapp/createTeam`,
        //加入跑团
        joinTeam: `${host}/weapp/joinTeam`,
        //离开跑团
        leaveTeam: `${host}/weapp/leaveTeam`,
        //修改跑团数据
        reviseTeam: `${host}/weapp/reviseTeam`,
        // 拉取跑团信息
        findTeam: `${host}/weapp/findTeam`,
        //打卡
        punch: `${host}/weapp/punch`,
    }
};

module.exports = config;
