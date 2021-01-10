zn.define(function () {

    var model = zn.db.common.model;

    return zn.Model("zn_hcredwine_user_coupon", {
        mixins: [
            model.Base
        ],
        properties: {
            status: {
                value: null,
                type: ['int', 11],
                default: 0
            },
            couponId: {
                value: null,
                type: ['int', 10],
                default: '0'
            },
            code: {
                value: null,
                type: ['varchar', 100],
                default: ''
            },
            fromUserOpenId: {
                value: null,
                type: ['varchar', 100],
                default: ''
            },
            toUserOpenId: {
                value: null,
                type: ['varchar', 100],
                default: ''
            },
            price: {
                value: null,
                type: ['float', 4],
                default: '0.0'
            },
            minOrderPrice: {
                value: null,
                type: ['float', 4],
                default: '0.0'
            },
            discount: {
                value: null,
                type: ['float', 4],
                default: '0.0'
            },
            content: {
                value: null,
                type: ['varchar', 2000],
                default: ''
            },
            beginTime: {
                value: null,
                type: ['datetime'],
                default: null
            },
            endTime: {
                value: null,
                type: ['datetime'],
                default: null
            }
        }
    });
})
