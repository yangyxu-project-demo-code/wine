zn.define(function () {

    var model = zn.db.common.model;

    return zn.Model("zn_hcredwine_restaurant_code", {
        mixins: [
            model.Base
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
                default: ''
            },
            status: {
                value: null,
                type: ['int', 10],
                convert: 'zn_convert_var({})',
                default: 0
            }
        }
    });

})
