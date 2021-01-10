zn.define(function () {

    var model = zn.db.common.model;

    return zn.Model("zn_hcredwine_merchant_product_stock_batch", {
        mixins: [
            model.Base
        ],
        properties: {
            batchCode: {
                value: null,
                type: ['varchar', 100],
                default: function (){
                    return 'HCU'+ zn.uuid();
                }
            },
            merchantId: {
                value: null,
                type: ['int', 10],
                default: 0
            },
            productId: {
                value: null,
                type: ['int', 10],
                default: 0
            },
            batchPrice: {
                value: null,
                type: ['float', 4],
                default: '0.0'
            },
            totalPrice: {
                value: null,
                type: ['float', 4],
                default: '0.0'
            },
            totalDiscountPrice: {
                value: null,
                type: ['float', 4],
                default: '0.0'
            },
            totalNumber: {
                value: null,
                type: ['int', 10],
                default: 0
            },
            remainNumber: {
                value: null,
                type: ['int', 10],
                default: 0
            }
        }
    });

})
