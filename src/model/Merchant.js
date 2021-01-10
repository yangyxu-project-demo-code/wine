zn.define(function () {

    var model = zn.db.common.model;

    return zn.Model("zn_hcredwine_merchant", {
        mixins: [
            model.Base,
            model.Tag,
            model.Tree
        ],
        properties: {
            openId: {
                value: null,
                type: ['varchar', 100],
                default: ""
            },
            code: {
                value: null,
                type: ['varchar', 100],
                default: function (){
                    return 'HCMC' + (new Date()).getTime();
                }
            },
            alise: {
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
            star: {
                value: null,
                type: ['float', 4],
                default: '0'
            },
            type: {
                value: null,
                type: ['int', 10],
                convert: 'zn_convert_var({})',
                default: 0
            },
            isTop: {
                value: null,
                type: ['int', 10],
                default: 0
            },
            status: {
                value: null,
                type: ['int', 10],
                convert: 'zn_convert_var({})',
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
            contact: {
                value: null,
                type: ['varchar', 15],
                default: ''
            },
            email: {
                value: null,
                type: ['varchar', 20],
                default: ''
            },
            phone: {
                value: null,
                type: ['varchar', 50],
                default: ''
            },
            businessLicense: {
                value: null,
                type: ['varchar', 100],
                default: ''
            },
            commentCount: {
                value: null,
                type: ['int', 10],
                default: '0'
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
            imgs: {
                value: null,
                type: ['varchar', 1000],
                default: ','
            },
            avatarImage: {
                value: null,
                type: ['varchar', 50],
                default: ''
            },
            description: {
                value: null,
                type: ['longtext'],
                default: ''
            },
            settlementAmount: {
                value: null,
                type: ['float', 20],
                default: 0
            }
        }
    });

})
