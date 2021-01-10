zn.define(function () {

    var model = zn.db.common.model;

    return zn.Model("zn_hcredwine_courier", {
        mixins: [
            model.Base
        ],
        properties: {
            openId: {
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
                default: 0
            },
            province: {
                value: null,
                type: ['int', 10],
                convert: 'zn_convert_var({})',
                default: 0
            },
            city: {
                value: null,
                type: ['int', 10],
                convert: 'zn_convert_var({})',
                default: 0
            },
            area: {
                value: null,
                type: ['int', 10],
                convert: 'zn_convert_var({})',
                default: 0
            },
            address: {
                value: null,
                type: ['varchar', 50],
                default: ''
            },
            lng: {
                value: null,
                type: ['varchar', 50],
                default: ''
            },
            lat: {
                value: null,
                type: ['varchar', 50],
                default: ''
            },
            alias: {
                value: null,
                type: ['varchar', 100],
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
                default: '男'
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
            IDNumber: {
                value: null,
                type: ['varchar', 100],
                default: ''
            },
            IDImgs: {
                value: null,
                type: ['varchar', 1000],
                default: ','
            },
            deposit: {
                value: null,
                type: ['float', 4],
                default: '0.0'
            },
            salary: {
                value: null,
                type: ['float', 10],
                default: '0.0'
            },
            avatarImage: {
                value: null,
                type: ['varchar', 50],
                default: ''
            }
        }
    });

})
