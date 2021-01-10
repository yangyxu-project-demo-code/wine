zn.define(function () {

    var model = zn.db.common.model;
    return zn.Model("zn_hcredwine_product_type", {
        mixins: [
            model.Base,
            model.Tag,
            model.Tree
        ],
        properties: {
            typeId: {
                value: null,
                type: ['int', 10],
                default: '0'
            },
            href: {
                value: null,
                type: ['varchar', 50],
                default: ''
            },
            alias: {
                value: null,
                type: ['varchar', 200],
                default: ''
            },
            descript: {
                value: null,
                type: ['varchar', 500],
                default: ''
            },
            img: {
                value: null,
                type: ['varchar', 300],
                default: ''
            },
            imgs: {
                value: null,
                type: ['varchar', 3000],
                default: ','
            },
            icon: {
                value: null,
                type: ['varchar', 300],
                default: ''
            },
            tags: {
                value: null,
                type: ['varchar', 500],
                default: ','
            },
            vars: {
                value: null,
                type: ['varchar', 500],
                default: ','
            },
            status: {
                value: null,
                type: ['int', 10],
                default: '0'
            }
        }
    });

})
