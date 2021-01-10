zn.define(function () {

    var model = zn.db.common.model;



    return zn.Model("zn_hcredwine_user_order", {
        mixins: [
            model.Base
        ],
        properties: {
            userOrderId: {
                value: null,
                type: ['int', 10],
                default: '0'
            },
            userId: {
                value: null,
                type: ['int', 10],
                default: '0'
            },
            courierId: {
                value: null,
                type: ['int', 10],
                default: '0'
            },
            merchantId: {
                value: null,
                type: ['int', 10],
                default: '0'
            },
            userAddressId: {
                value: null,
                type: ['int', 10],
                default: '0'
            },
            status: {
                value: null,
                type: ['int', 10],
                default: '0'
            },
            price: {
                value: null,
                type: ['float', 4],
                default: '0.0'
            },
            discountPrice: {
                value: null,
                type: ['float', 4],
                default: '0.0'
            },
            productTotalCount: {
                value: null,
                type: ['int', 10],
                default: '0'
            },
            completeTime: {
                value: null,
                type: ['datetime']
            },
            expressCode: {
                value: null,
                type: ['varchar', 100],
                default: ''
            },
            orderCode: {
                value: null,
                type: ['varchar', 100],
                default: function (){
                    var _ary = getTime();
                    return 'HCU'+ _ary[2].join('') + this._userId + _ary[1].join('') + this._productId + _ary[0].join('');
                }
            }
        }
    });

})
