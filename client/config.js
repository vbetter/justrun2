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

        // 测试的信道服务地址
        tunnelUrl: `${host}/weapp/tunnel`,
        // 上传个人数据地址
        uploadUserDataUrl: `${host}/weapp/uploadUserData`,
        // 更新个人数据地址
        downloadUserDataUrl: `${host}/weapp/demo`,
        testDelete: `${host}/weapp/testDelete`,
        testAdd: `${host}/weapp/testAdd`,
        testSet: `${host}/weapp/testSet`,
        testGet: `${host}/weapp/testGet`,
        //创建跑团
        createGroup: `${host}/weapp/createGroup`,
        //打卡
        punch: `${host}/weapp/punch`,
        // 拉取跑团信息
        getMyGroupInfo: `${host}/weapp/getMyGroupInfo`,
        // 上传图片接口
        uploadUrl: `${host}/weapp/upload`
    }
};

module.exports = config;
