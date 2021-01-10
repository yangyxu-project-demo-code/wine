zn.define(function () {

    var model = zn.db.common.model;

    return zn.Model("zn_hcredwine_user_collection", {
        mixins: [
            model.Base
        ],
        properties: {
            userId: {
                value: null,
                type: ['int', 10],
                default: 0
            },
            productId: {
                value: null,
                type: ['int', 10],
                default: 0
            },
            remindTime: {
                value: null,
                type: ['datetime'],
                default: null
            }
        }
    });

})
