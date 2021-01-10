zn.define(function () {

    var model = zn.db.common.model;

    return zn.Model("zn_hcredwine_message", {
        mixins: [
            model.Base
        ],
        properties: {
            link: {
                value: null,
                type: ['varchar', 100],
                default: ''
            },
            content: {
                value: null,
                type: ['varchar', 200],
                default: ''
            },
            type: {
                value: null,
                type: ['varchar', 100],
                default: 'warning'
            },
            openId: {
                value: null,
                type: ['varchar', 100],
                default: ''
            },
            hasRead: {
                value: null,
                type: ['int', 4],
                default: 0
            }
        }
    });

})
