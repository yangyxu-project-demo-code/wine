zn.define(function () {

    var model = zn.db.common.model;

    return zn.Model("zn_hcredwine_merchant_product_stock_batch_detail", {
        mixins: [
            model.Base
        ],
        properties: {
            batchId: {
                value: null,
                type: ['int', 10],
                default: '0'
            },
            productId: {
                value: null,
                type: ['int', 10],
                default: '0'
            },
            productTypeId: {
                value: null,
                type: ['int', 10],
                default: '0'
            },
            price: {
                value: null,
                type: ['float', 4],
                default: '0.0'
            },
            count: {
                value: null,
                type: ['int', 10],
                default: '0'
            },
            totalPrice: {
                value: null,
                type: ['float', 4],
                default: '0.0'
            }
        }
    });

})
