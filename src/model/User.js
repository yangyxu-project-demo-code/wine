zn.define(function () {

    var model = zn.db.common.model;

    return zn.Model("zn_hcredwine_user", {
        mixins: [
            model.Base
        ],
        properties: {
            openId: {
                value: null,
                type: ['varchar', 100],
                default: ''
            },
            openid: {
                value: null,
                type: ['varchar', 100],
                default: ''
            },
            unionid: {
                value: null,
                type: ['varchar', 100],
                default: ''
            },
            access_token: {
                value: null,
                type: ['varchar', 500],
                default: ''
            },
            expires_in: {
                value: null,
                type: ['varchar', 100],
                default: ''
            },
            refresh_token: {
                value: null,
                type: ['varchar', 500],
                default: ''
            },
            scope: {
                value: null,
                type: ['varchar', 50],
                default: ''
            },
            nickname: {
                value: null,
                type: ['varchar', 100],
                default: ''
            },
            name: {
                value: null,
                type: ['varchar', 100],
                default: ''
            },
            password: {
                value: null,
                type: ['varchar', 100],
                default: ''
            },
            gesturePassword: {
                value: null,
                type: ['varchar', 50],
                default: ''
            },
            status: {
                value: null,
                type: ['int', 10],
                default: 21
            },
            province: {
                value: null,
                type: ['varchar', 50],
                default: ''
            },
            city: {
                value: null,
                type: ['varchar', 50],
                default: ''
            },
            country: {
                value: null,
                type: ['varchar', 50],
                default: ''
            },
            address: {
                value: null,
                type: ['varchar', 100],
                default: ''
            },
            headimgurl: {
                value: null,
                type: ['varchar', 200],
                default: ''
            },
            privilege: {
                value: null,
                type: ['varchar', 200],
                default: ''
            },
            age: {
                value: null,
                type: ['int', 10],
                default: '0'
            },
            sex: {
                value: null,
                type: ['varchar', 4],
                default: ''
            },
            phone: {
                value: null,
                type: ['varchar', 15],
                default: ''
            },
            email: {
                value: null,
                type: ['varchar', 50],
                default: ''
            },
            avatarImage: {
                value: null,
                type: ['varchar', 50],
                default: ''
            },
            role: {
                value: null,
                type: ['varchar', 50],
                default: ''
            }
        }
    });

})
