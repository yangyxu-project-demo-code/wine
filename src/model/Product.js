zn.define(function () {

    var model = zn.db.common.model;

    return zn.Model("zn_hcredwine_product", {
        mixins: [
            model.Base
        ],
        properties: {
            alias: {
                value: null,
                type: ['varchar', 100],
                default: ','
            },
            masterId: {
                value: null,
                type: ['int', 10],
                default: '0'
            },
            typeId: {
                value: null,
                type: ['int', 10],
                convert: 'zn_convert_product_type({})',
                default: '0'
            },
            types: {
                value: null,
                type: ['varchar', 500],
                default: ','
            },
            price: {
                value: null,
                type: ['float', 4],
                default: '0.0'
            },
            proxyPrice: {
                value: null,
                type: ['float', 4],
                default: '0.0'
            },
            discountPrice: {
                value: null,
                type: ['float', 4],
                default: '0.0'
            },
            unit: {
                value: null,
                type: ['varchar', 10],
                default: '瓶'
            },
            logo: {
                value: null,
                type: ['varchar', 500],
                default: ''
            },
            imgs: {
                value: null,
                type: ['varchar', 5000],
                default: ','
            },
            videos: {
                value: null,
                type: ['varchar', 5000],
                default: ','
            },
            status: {
                value: null,
                type: ['int', 10],
                default: '0'
            },
            payMethod: {
                value: null,
                type: ['int', 10],
                default: '0'
            },
            buyCount: {
                value: null,
                type: ['int', 10],
                default: '0'
            },
            detail: {
                value: null,
                type: ['LONGTEXT'],
                default: ''
            },
            vars: {
                value: null,
                type: ['varchar', 200],
                default: ','
            }
        }
    });

})
