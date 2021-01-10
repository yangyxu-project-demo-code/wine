zn.define({
    host: '0.0.0.0',
    catalog: '/',
    port: 6969,
    mode: 'release',     //release, debug, view,
    indexs: ['index.html', 'index.htm', 'default.html', 'default.htm'],
    //node_paths: ['../../zn/'],
    node_modules: ['zn-plugin-admin', 'zn-plugin-wechat'],
    databases: {
        'mysql': {
            default: true,
            type: 'mysql',
            host: '47.92.75.128',
            user: 'root',
            password: 'HUCHUN2017',
            database:'zn_hcredwine',
            port: 3306
        }
    },
    wx: {
        ID: 'gh_87884e7d895a',
        AppID: 'wx30e5bdf40c2d4b27',
        AppSecret: '11d8d32837df1814bb095757ac9d5e28',
        CallBackUrl: 'http://wx.hu-chun.com/znwechat/wx/validate',
        Token: 'fxdfql1489109652',
        EncodingAESKey: 'gJSpOKavKcWTEAnqIrzdFtQHkbDsnkOuTHJIrJdbMZV'
    }
});
