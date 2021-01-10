zn.define(function () {

    var model = zn.db.common.model;

    return zn.Model("zn_hcredwine_setting", {
        mixins: [
            model.Base
        ],
        properties: {
            isDefault: {
                value: null,
                type: ['int', 10],
                default: '0'
            },
            host: {
                value: null,
                type: ['varchar', 50],
                default: ''
            },
            port: {
                value: null,
                type: ['varchar', 10],
                default: ''
            },
            status: {
                value: null,
                type: ['int', 10],
                default: '0'
            },
            version: {
                value: null,
                type: ['longtext']
            },
            protocol: {
                value: null,
                type: ['longtext']
            },
            gongGao: {
                value: null,
                type: ['longtext']
            },
            xuZhi: {
                value: null,
                type: ['longtext']
            },
            bangZhu: {
                value: null,
                type: ['longtext']
            },
            hotPhone: {
                value: null,
                type: ['varchar', 20],
                default: ''
            }
        }
    });

})
