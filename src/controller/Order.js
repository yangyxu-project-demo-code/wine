zn.define('../service/Order.js', function (OrderService) {

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

    return zn.Controller('order',{
        methods: {
            init: function (){
                this._orderService = new OrderService();
            },
            sendTemplate: {
                method: 'GET/POST',
                value: function (request, response, chain){
                    zn.wx.accessTokenRequest('template.send', {
                        touser: 'ovLYIwGSFVUjq7Rfw1j9PsgIxcrE',
                        template_id: "2z-H2qpu4zDdolLvDl3whOcReCrGprry-2t0NhcNqnw",
                        url: 'http://wine.hu-chun.com/hcredwine',
                        topcolor: "#FF0000",
                        data: {
                            first: {
                                value: "恭喜你购买成功！",
                                color: "#173177"
                            },
                            orderMoneySum: {
                                value: "78.00元",
                                color: "#173177"
                            },
                            orderProductName: {
                                value: "拉博天鹅堡干红葡萄酒",
                                color: "#173177"
                            },
                            Remark: {
                                value: "欢迎再次购买！",
                                color: "#173177"
                            }
                        }
                    }).then(function (data){
                        response.success(data);
                    });
                }
            },
            payOrder: {
                method: 'GET/POST',
                argv: {
                    orderCode: null
                },
                value: function (request, response, chain){
                    this.query("select * from zn_hcredwine_user_order where orderCode='{0}';".format(request.getValue('orderCode')))
                        .then(function (data){
                            if(data.length){
                                var _order = data[0];
                                zn.swiftpass.submitOrderInfo({
                                    out_trade_no: _order.orderCode,
                                    sub_openid: _order.userOpenId,
                                    body: "消费订单",
                                    total_fee: (+((_order.discountPrice)*100).toFixed(2)),
                                    callback_url: 'http://wine.hu-chun.com/#/order/info?oc=' + _order.orderCode+'&callback=1',
                                    notify_url: 'http://wx.hu-chun.com/hcredwine/order/payNotify?oc=' + _order.orderCode,
                                }).then(function (data){
                                    zn.debug(data.xml);
                                    response.success(data.xml);
                                }, function (error){
                                    response.error(error);
                                });
                            }
                        }, function (error){
                            response.error(error);
                        });
                }
            },
            payNotify: {
                method: 'GET/POST',
                value: function (request, response, chain){
                    var _value = request.getValue();
                    var _self = this;
                    zn.debug('PayNotify: OrderCode ', _value.oc);
                    if(_value.oc){
                        var _keys = [
                            'zn_hcredwine_user_order.*',
                            'zn_hcredwine_user_address.province',
                            'zn_hcredwine_user_address.city',
                            'zn_hcredwine_user_address.area',
                            'zn_hcredwine_user_address.name as addressName',
                            'zn_hcredwine_user_address.phone as addressPhone',
                            'zn_hcredwine_user_address.address as addressValue',
                            'zn_convert_var(zn_hcredwine_user_address.province) as province_convert',
                            'zn_convert_var(zn_hcredwine_user_address.city) as city_convert',
                            'zn_convert_var(zn_hcredwine_user_address.area) as area_convert'
                        ];
                        var _sql = "select {0} from zn_hcredwine_user_order left join zn_hcredwine_user_address on zn_hcredwine_user_order.userAddressId=zn_hcredwine_user_address.id where zn_hcredwine_user_order.orderCode='{1}';".format(_keys.join(','), _value.oc);
                        var _order = null,
                            _couriers = [];
                        this.beginTransaction()
                            .query(_sql)
                            .query('UPDATE STATUS', function (sql, rows){
                                _order = rows[0];
                                if(!_order){
                                    return response.success('未查到该订单详情!'), false;
                                }
                                if(_order.status>0){
                                    return response.success('The order has notify!'), false;
                                }else {
                                    var _temp = 'select openId from zn_hcredwine_courier where status=2 and province={0} and city={1} and area={2};'.format(_order.province, _order.city, _order.area);
                                    _temp += "select * from zn_hcredwine_user_order_detail where orderId={0};".format(_order.id);
                                    return _temp + "update zn_hcredwine_user_order set status=1 where orderCode='{0}';".format(_value.oc);
                                }
                            })
                            .query('Insert Message:', function (sql, data){
                                zn.debug('DATA: ', data);
                                var _temp = '',
                                    _link = 'http://wine.hu-chun.com/#/order/info?oc=' + _order.orderCode + '&role=courier',
                                    _keys = ['openId', 'type','link', 'content'].join(','),
                                    _values = [
                                        "'{0}'",
                                        "'派送订单'",
                                        "'" + _link + "'",
                                        "'" + JSON.stringify(_order) + "'"
                                    ].join(',');
                                _couriers = data[0];
                                _couriers.forEach(function (courier, index){
                                    _temp += 'insert into zn_hcredwine_message ({0}) values ({1});'.format(_keys, _values.format(courier.openId));
                                });

                                var _details = data[1];
                                _details.forEach(function (detail){
                                    _temp += "update zn_hcredwine_merchant_product_stock set count=count-{0}, lockedCount=lockedCount-{0} where merchantId={1} and productId={2};".format(detail.count, _order.merchantId, detail.productId);
                                });

                                if(_order.restaurantId&&_order.restaurantOpenId){
                                    _temp += "insert into zn_hcredwine_restaurant_settlement (openId, type, value, orderId, orderCode) values ('{0}', 1, {1}, {2}, '{3}');".format(_order.restaurantOpenId, _order.restaurantPrice, _order.id, _order.orderCode);
                                }

                                return _temp;
                            }, function (error, data){
                                if(error){
                                    response.error(error);
                                }else {
                                    response.success('支付成功');
                                    _self._orderService.doUserNotify(_order, _couriers);
                                }
                            }).commit();
                    }else {
                        response.error('The order code is required!');
                    }
                }
            },
            getPreOrderInfo: {
                method: 'GET/POST',
                argv: {
                    userId: null,
                    productId: null
                },
                value: function (request, response, chain){
                    var _userId = request.getValue("userId"),
                        _productId = request.getValue("productId");
                    var _sql = 'select id, name, phone, zn_convert_var(province) as province, zn_convert_var(city) as city, zn_convert_var(area) as area, postcode, address from zn_hcredwine_user_address where userId={0} and isDefault=1;'.format(_userId);
                    _sql += "select id, logo, unit, imgs, detail, title, price, alias from zn_hcredwine_product where id={0} and status=1;".format(_productId);
                    this.query(_sql)
                        .then(function (data){
                            if(!data[1].length){
                                response.error('商品已经过期，请看其他商品吧');
                            }else {
                                data[0] = data[0][0];
                                data[1] = data[1][0];
                                response.success(data);
                            }
                        }.bind(this), function (error){
                            response.error(error.message);
                        });
                }
            },
            create: {
                method: 'GET/POST',
                argv: {
                    addressId: null,
                    userId: null,
                    products: null,
                    merchantId: 1,
                    restaurantId: 0,
                    coupons: '',
                    couponPrice: 0
                },
                value: function (request, response, chain){
                    var user, merchant, restaurant;
                    var _value = request.getValue(),
                        _ary = getTime(),
                        _products = {},
                        _orderDetailSql = [],
                        _lockStockSql = [],
                        _expressPrice = 5;
                        _orderCode = 'HC'+ _ary[2].join('') + _value.userId + _ary[1].join('') + _value.merchantId + _ary[0].join('');

                    var _pids = _value.products.map(function (item){
                        _products[item.id||item.productId] = item;
                        _expressPrice += 1;
                        return item.id||item.productId;
                    }).join(',');
                    var _sql = "select zn_hcredwine_merchant_product_stock.count as count, zn_hcredwine_product.price as price, zn_hcredwine_product.id as id from zn_hcredwine_merchant_product_stock left join zn_hcredwine_product on zn_hcredwine_merchant_product_stock.productId = zn_hcredwine_product.id where zn_hcredwine_merchant_product_stock.count>0 and zn_hcredwine_merchant_product_stock.productId in ({0}) and zn_hcredwine_merchant_product_stock.merchantId={1};".format(_pids, _value.merchantId);
                    _sql += "select id, openid from zn_hcredwine_user where id={0};".format(_value.userId||0);
                    _sql += "select id, openId from zn_hcredwine_merchant where id={0};".format(_value.merchantId||1);
                    _sql += "select id, openId from zn_hcredwine_restaurant where id={0};".format(_value.restaurantId||0);
                    this.beginTransaction()
                        .query(_sql)
                        .query('create order', function (sql, data, fields, tran){
                            var rows = data[0];
                            user = data[1][0]||{ id: 0, openid: '' };
                            merchant = data[2][0]||{ id: 0, openId: 'ovLYIwH-My9ZUYpi7WWZrDIXcXmo' };
                            restaurant = data[3][0]||{ id: 0, openId: '' };
                            if(rows.length){
                                var _rows = {},
                                    _row = null,
                                    _product = null,
                                    _count = 0,
                                    _total = 0;
                                rows.forEach(function (item){
                                    _rows[item.id] = item;
                                });

                                for(var key in _products){
                                    _row = _rows[key];
                                    _product = _products[key];
                                    if(_row){
                                        if(_row.count < _product.count){
                                            return response.error('商品库存不够, 系统正在补货中'), false;
                                        }else {
                                            _row.total = _product.count * _row.price;
                                            _count = _count + _product.count;
                                            _total = _total + _row.total;
                                            _orderDetailSql.push('insert into zn_hcredwine_user_order_detail (orderId, productId, price, count, totalPrice) values ({0});'.format([
                                                '{0}', key, _row.price, _product.count, _row.total
                                            ].join(',')));
                                            //_lockStockSql.push('update ');
                                        }
                                    }else {
                                        return response.error('商品库存不够, 系统正在补货中'), false;
                                    }
                                }
                                var _keys = [
                                    'orderCode',
                                    'couponIds',
                                    'couponPrice',
                                    'expressPrice',
                                    'userOpenId',
                                    'merchantOpenId',
                                    'restaurantOpenId',
                                    'userId',
                                    'merchantId',
                                    'restaurantId',
                                    'userAddressId',
                                    'price',
                                    'discountPrice',
                                    'restaurantPrice',
                                    'productTotalCount',
                                    'note'
                                ], _values = [
                                    "'"+_orderCode+"'",
                                    "'"+_value.coupons+"'",
                                    _value.couponPrice,
                                    _expressPrice,
                                    "'"+user.openid+"'",
                                    "'"+merchant.openId+"'",
                                    "'"+restaurant.openId+"'",
                                    user.id,
                                    merchant.id,
                                    restaurant.id,
                                    _value.addressId,
                                    _total,
                                    (_total - _value.couponPrice),
                                    ((_total/10).toFixed(2)),
                                    _count,
                                    "'" + (request.getValue('note')||'') + "'"
                                ];

                                return "insert into zn_hcredwine_user_order ({0}) values ({1});".format(_keys.join(','), _values.join(','));
                            }else {
                                return response.error('商品库存不够, 系统正在补货中'), false;
                            }
                        })
                        .query('insert detail', function (sql, rows){
                            var _temp = _orderDetailSql.join('').format(rows.insertId);
                            if(_value.coupons){
                                _temp += "update zn_hcredwine_user_coupon set status=1, orderCode='{1}', usedTime=now() where id in ({0});".format(_value.coupons, _orderCode);
                            }
                            return _temp;
                        }, function (error, rows){
                            if(error){
                                response.error(error);
                            }else {
                                response.success(_orderCode);
                            }
                        }).commit();
                }
            },
            getOrderInfoByCode: {
                method: 'GET/POST',
                argv: {
                    code: null
                },
                value: function (request, response, chain){
                    var _table = 'zn_hcredwine_user_order left join zn_hcredwine_user_address on zn_hcredwine_user_order.userAddressId = zn_hcredwine_user_address.id',
                        _fields = [
                            'zn_hcredwine_user_order.*',
                            'zn_hcredwine_user_address.name as addressName',
                            'zn_hcredwine_user_address.phone as addressPhone',
                            'zn_convert_var(zn_hcredwine_user_address.province) as addressProvince',
                            'zn_convert_var(zn_hcredwine_user_address.city) as addressCity',
                            'zn_convert_var(zn_hcredwine_user_address.area) as addressArea',
                            'zn_hcredwine_user_address.address as addressValue',
                            'zn_hcredwine_user_address.postcode as addressPostCode',
                        ],
                        _order = {};
                    zn.debug('code', request.getValue('code'));
                    this.beginTransaction()
                        .query("select {0} from {1} where orderCode='{2}';".format(_fields.join(','), _table, request.getValue('code')))
                        .query('create order', function (sql, rows, fields, tran){
                            if(rows.length){
                                _order = rows[0];
                                var _keys = [
                                    'zn_hcredwine_user_order_detail.count as count',
                                    'zn_hcredwine_user_order_detail.price as price',
                                    'zn_hcredwine_user_order_detail.totalPrice as totalPrice',
                                    'zn_hcredwine_product.logo as productLogo',
                                    'zn_hcredwine_product.title as productTitle'
                                ];
                                var _temp = "select {0} from zn_hcredwine_user_order_detail left join zn_hcredwine_product on zn_hcredwine_product.id = zn_hcredwine_user_order_detail.productId where  zn_hcredwine_user_order_detail.orderId={1};".format(_keys.join(','), _order.id);
                                _temp += "select *, zn_convert_var(province) as province_convert, zn_convert_var(city) as city_convert, zn_convert_var(area) as area_convert from zn_hcredwine_courier where openId='{0}';".format(_order.courierOpenId);
                                return _temp + "select *, zn_convert_var(province) as province_convert, zn_convert_var(city) as city_convert, zn_convert_var(area) as area_convert from zn_hcredwine_merchant where openId='{0}';".format(_order.merchantOpenId);
                            }else {
                                return response.error('未查到该订单详情'), false;
                            }
                        }, function (error, rows){
                            _order.products = rows[0];
                            _order.courier = rows[1][0];
                            _order.merchant = rows[2][0];
                            response.success(_order);
                        }).commit();
                }
            },
            vieOrder: {
                method: 'GET/POST',
                argv: {
                    orderCode: null,
                    openId: null
                },
                value: function (request, response, chain){
                    var _oc = request.getValue('orderCode'),
                        _openId = request.getValue('openId');
                    var _self = this,
                        _order = null;
                    this.beginTransaction()
                        .query('SELECT ORDER', function (sql) {
                            var _temp = "select * from zn_hcredwine_user_order where orderCode='{0}';".format(_oc);
                            _temp += "select *, zn_convert_var(province) as province_convert, zn_convert_var(city) as city_convert, zn_convert_var(area) as area_convert from zn_hcredwine_courier where openId='{0}';".format(_openId);
                            return _temp;
                        }, function (error, data){
                            if(data[0].length){
                                _order = data[0][0];
                                if(_order.courierOpenId){
                                    return response.error('抢单失败, 该订单已经被预定.'), false;
                                }else {
                                    _order.courier = data[1][0];
                                    return _order;
                                }
                            }else {
                                return response.error('未查到订单详情'), false;
                            }
                        })
                        .query('UPDATE ORDER COURIER', function (sql){
                            return "update zn_hcredwine_user_order set courierOpenId='{0}', status=2 where orderCode='{1}';".format(_openId, _oc);
                        }, function (error, data){
                            if(error){
                                response.error(error);
                            }else {
                                response.success(data);
                            }
                            _self._orderService.doVieOrder(_order);
                        }).commit();
                }
            },
            signOrder: {
                method: 'GET/POST',
                argv: {
                    orderCode: null
                },
                value: function (request, response, chain){
                    var _oc = request.getValue('orderCode');
                    var _self = this,
                        _order = null;
                    this.beginTransaction()
                        .query('SELECT ORDER', function (sql) {
                            return "select * from zn_hcredwine_user_order where orderCode='{0}';".format(_oc);
                        }, function (error, data){
                            if(data.length){
                                _order = data[0];
                                if(_order.status==3){
                                    return response.error('确认失败, 该订单已经签收.'), false;
                                }
                            }else {
                                return response.error('未查到订单详情'), false;
                            }
                        })
                        .query('SELECT COURIER & MERCHANT', function (){
                            var _sql = "select * from zn_hcredwine_courier where openId='{0}';".format(_order.courierOpenId);
                            _sql += "select * from zn_hcredwine_merchant where openId='{0}';".format(_order.merchantOpenId);
                            return _sql;
                        })
                        .query('UPDATE ORDER & COURIER & MERCHANT', function (sql, rows){
                            var _courier = rows[0][0],
                                _merchant = rows[1][0];

                            var _sql = "update zn_hcredwine_user_order set status=3 where orderCode='{0}';".format(_oc);
                            _sql += "update zn_hcredwine_courier set salary=salary+{0} where id={1};".format(_order.expressPrice, _courier.id);
                            _sql += "insert into zn_hcredwine_courier_salary (orderId, orderCode, openId, status, type, value, balance) values ({0}, '{1}', '{2}', 1, 1, {3}, {4});".format(_order.id, _order.orderCode, _order.courierOpenId, _order.expressPrice, (_courier.salary + _order.expressPrice));

                            _sql += "update zn_hcredwine_merchant set settlementAmount=settlementAmount+{0} where id={1};".format(_order.discountPrice, _merchant.id);
                            _sql += "insert into zn_hcredwine_merchant_settlement (orderId, orderCode, openId, status, type, value, balance) values ({0}, '{1}', '{2}', 1, 1, {3}, {4});".format(_order.id, _order.orderCode, _order.merchantOpenId, _order.discountPrice, (_merchant.settlementAmount + _order.discountPrice));

                            if(_order.restaurantOpenId){
                                _sql += "update zn_hcredwine_restaurant_settlement set status=1 where openId='{0}' and orderId={1};".format(_order.restaurantOpenId, _order.id);
                                _sql += "update zn_hcredwine_restaurant set settlementAmount=settlementAmount+{0} where id={1};".format(_order.restaurantPrice, _order.restaurantId);
                            }

                            return _sql;
                        }, function (error, data){
                            if(error){
                                response.error(error);
                            }else {
                                response.success('签收成功');
                                _self._orderService.doSignOrder(_order);
                            }
                        }).commit();
                }
            },
            notifyOrder: {
                method: 'GET/POST',
                argv: {
                    orderCode: null
                },
                value: function (request, response, chain){
                    var _oc = request.getValue('orderCode');
                    var _self = this,
                        _order = null;
                    this.beginTransaction()
                        .query('SELECT ORDER', function (sql) {
                            return "select * from zn_hcredwine_user_order where orderCode='{0}';".format(_oc);
                        }, function (error, data){
                            if(data.length){
                                _order = data[0];
                                response.success('提醒成功');
                                _self._orderService.doNotifyOrder(_order);
                            }else {
                                return response.error('未查到订单详情'), false;
                            }
                        }).commit();
                }
            }
        }
    });
});
