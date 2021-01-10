zn.define(function () {

    var model = zn.db.common.model;

    var getTime = function (){
        var _value = (new Date()).getTime().toString().split('');
        var _a1 = [], _a2 = [], _a3 = [];
        for(var i = 0, _len = _value.length; i < _len; i++){
            switch (i%3) {
                case 0:
                    _a1.push(_value[i]);
                    break;
                case 1:
                    _a2.push(_value[i]);
                    break;
                case 2:
                    _a3.push(_value[i]);
                    break;
            }
        }

        return [_a1, _a2, _a3];
    }

    return zn.Model("zn_hcredwine_user_order", {
        mixins: [
            model.Base
        ],
        properties: {
            userId: {
                value: null,
                type: ['int', 10],
                default: '0'
            },
            userOpenId: {
                value: null,
                type: ['varchar', 100],
                default: ''
            },
            courierId: {
                value: null,
                type: ['int', 10],
                default: '0'
            },
            courierOpenId: {
                value: null,
                type: ['varchar', 100],
                default: ''
            },
            merchantId: {
                value: null,
                type: ['int', 10],
                default: '0'
            },
            merchantOpenId: {
                value: null,
                type: ['varchar', 100],
                default: ''
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
            couponIds: {
                value: null,
                type: ['varchar', 250],
                default: ','
            },
            couponPrice: {
                value: null,
                type: ['float', 10],
                default: 0
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
            expressPrice: {
                value: null,
                type: ['float', 4],
                default: '0.0'
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
