zn.define(function () {

    var model = zn.db.common.model;

    return zn.Model("zn_hcredwine_restaurant_settlement", {
        mixins: [
            model.Base
        ],
        properties: {
            openId: {
                value: null,
                type: ['varchar', 100],
                default: ''
            },
            status: {
                value: null,
                type: ['int', 10],
                default: 0
            },
            type: {
                value: null,
                type: ['int', 10],
                default: 1  //1: 是收入, -1: 取现
            },
            value: {
                value: null,
                type: ['float', 20],
                default: 0
            },
            balance: {
                value: null,
                type: ['float', 20],
                default: 0
            },
            orderId: {
                value: null,
                type: ['int', 10],
                default: 0
            },
            orderCode: {
                value: null,
                type: ['varchar', 100],
                default: ''
            }
        }
    });

})
