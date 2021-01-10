zn.define(function () {

    var model = zn.db.common.model;

    return zn.Model("zn_hcredwine_user_wxcode", {
        mixins: [
            model.Base
        ],
        properties: {
            status: {
                value: null,
                type: ['int', 11],
                default: 0
            },
            code: {
                value: null,
                type: ['varchar', 100],
                default: ''
            },
            userOpenId: {
                value: null,
                type: ['varchar', 100],
                default: ''
            }
        }
    });
})
