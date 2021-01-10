zn.define(function () {

    var model = zn.db.common.model;

    return zn.Model("zn_hcredwine_merchant_product_stock", {
        mixins: [
            model.Base
        ],
        properties: {
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
            count: {
                value: null,
                type: ['int', 10],
                default: 0
            }
        }
    });

})
