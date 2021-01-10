zn.define(function () {

    var model = zn.db.common.model;

    return zn.Model("zn_hcredwine_coupon", {
        mixins: [
            model.Base
        ],
        properties: {
            status: {
                value: null,
                type: ['int', 4],
                default: 0
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
            totalPrice: {
                value: null,
                type: ['float', 4],
                default: '0.0'
            },
            totalCount: {
                value: null,
                type: ['int', 11],
                default: 0
            },
            leavePrice: {
                value: null,
                type: ['float', 4],
                default: '0.0'
            },
            leaveCount: {
                value: null,
                type: ['int', 11],
                default: 0
            },
            usedPrice: {
                value: null,
                type: ['float', 4],
                default: '0.0'
            },
            usedCount: {
                value: null,
                type: ['int', 11],
                default: 0
            },
            number: {
                value: null,
                type: ['int', 11],
                default: 0
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
