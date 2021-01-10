zn.define([
    'node:nodemailer',
    '../SwiftpassPayment'
], function (nodemailer, SwiftpassPayment) {

    var _transport = nodemailer.createTransport({
        service: 'QQ',
        secureConnection: true, // use SSL
        port: 465, // port
        auth: {
            user: 'jimxyy@foxmail.com',
            pass: 'hbrrxcgtelocbfgc'
        }
    });

    return zn.Controller('merchant',{
        methods: {
            init: function (){
                zn.swiftpass = new SwiftpassPayment();
            },
            withdraw: {
                method: 'GET/POST',
                argv: {
                    openId: null,
                    value: null
                },
                value: function (request, response, chain){
                    var _value = request.getValue();
                    this.beginTransaction()
                        .query("insert into zn_hcredwine_merchant_settlement (openId, status, type, value) values ('{0}', 0, -1, {1});".format(_value.openId, _value.value), function (){

                        }, function (){
                            response.success('申请已经收到, 请耐心等待系统消息！');
                        }).commit();
                }
            },
            confirmWithdraw: {
                method: 'GET/POST',
                argv: {
                    id: null
                },
                value: function (request, response, chain){
                    var _value = request.getValue();
                    this.beginTransaction()
                        .query('select settlement', function (){
                            return "select * from zn_hcredwine_merchant_settlement where id={0};".format(_value.id);
                        })
                        .query('update order', function (sql, rows){
                            var _settlement = rows[0];
                            if(_settlement){
                                var _temp = "update zn_hcredwine_merchant_settlement set status=1 where id={0};".format(_value.id);
                                _temp += "update zn_hcredwine_merchant settlementAmount=settlementAmount-{0} where openId='{1}';".format(_settlement.value, _settlement.openId);
                                return _temp;
                            }else {
                                return response.error('提交出错'), false;
                            }
                        }, function (){
                            response.success('确认成功');
                        }).commit();
                }
            },
            pay: {
                method: 'GET/POST',
                value: function (request, response, chain){
                    zn.swiftpass.submitOrderInfo({
                        out_trade_no: '141903606228',
                        sub_openid: 'ovLYIwGSFVUjq7Rfw1j9PsgIxcrE',
                        body: '购买一瓶喝酒',
                        total_fee: 120000,
                        notify_url: 'http://wx.hu-chun.com/hcredwine/',
                    }).then(function (data){
                        response.redirect('https://pay.swiftpass.cn/pay/jspay?token_id='+data.xml.token_id+'&showwxtitle=1');
                    }, function (error){
                        response.error(error);
                    });
                }
            },
            pagingHomeMerchantStock: {
                method: 'GET/POST',
                argv: {
                    merchantId: null
                },
                value: function (request, response, chain){
                    var _data = request.getValue();
                    this.beginTransaction()
                        .query(zn.sql.paging({
                            table: 'zn_hcredwine_product left join zn_hcredwine_merchant_product_stock on zn_hcredwine_product.id = zn_hcredwine_merchant_product_stock.productId',
                            fields: [
                                'zn_hcredwine_merchant_product_stock.*',
                                'zn_hcredwine_product.logo as productLogo',
                                'zn_hcredwine_product.title as productTitle',
                                'zn_hcredwine_product.alias as productAlias',
                                'zn_hcredwine_product.price as productPrice',
                                'zn_hcredwine_product.unit as productUnit'
                            ],
                            where: {
                                'zn_hcredwine_merchant_product_stock.merchantId': _data.merchantId,
                                '0&<': 'zn_hcredwine_merchant_product_stock.count'
                            },
                            order: _data.order,
                            pageIndex: (_data.pageIndex||1),
                            pageSize: (_data.pageSize||10)
                        }))
                        .query('', function (){

                        });
                }
            },
            getLoginURL: {
                method: 'GET/POST',
                value: function (request, response, chain){
                    var _path = request.getValue('path'),
                        _state = request.getValue('state') || 1,
                        _url = 'http://wine.hu-chun.com/';
                    if(_path){
                        _url += unescape(_path);
                    }
                    response.success(zn.wx.getAuthorizeURL(_url, _state, 'snsapi_userinfo'));
                }
            },
            getMerchantAuthorizeURL: {
                method: 'GET/POST',
                value: function (request, response, chain){
                    this.query('select id, title from zn_hcredwine_merchant').then(function (data){
                        data = data.map(function (item){
                            item.link = zn.wx.getAuthorizeURL('http://wine.hu-chun.com/', item.id, 'snsapi_userinfo');
                            return item;
                        });
                        response.success(data);
                    });
                }
            },
            join: {
                method: 'GET/POST',
                argv: {
                    data: null
                },
                value: function (request, response, chain){
                    var _value = request.getValue(),
                        _data = _value.data||{},
                        _keys = [],
                        _values = [],
                        _openId = _data.openId,
                        _role = _data.role;
                    _data.role = null;
                    delete _data.role;
                    for(var key in _data){
                        _keys.push(key);
                        _values.push("'"+_data[key]+"'");
                    }
                    _keys.push('code');
                    _values.push("'HCBC"+(new Date()).getTime()+"'");
                    var _sql = 'insert into zn_hcredwine_{0} ({1}) values ({2});'.format(_role, _keys.join(','), _values.join(','));
                    _sql += "update zn_hcredwine_user set role='{0}' where openid='{1}';".format(_role, _openId);
                    this.query(_sql).then(function (data){
                        _transport.sendMail({
                            from: 'jimxyy@foxmail.com',
                            to: _data.email,
                            subject: '沪春集团 申请已经收到',
                            html: _data.name + ' 您好 , <br><br>您的申请我们已经收到，请耐心等待审核消息。<br><br>上海沪春集团'
                        });
                        response.success('发送成功');
                    }.bind(this), function (error){
                        response.error(error.message);
                    });
                }
            },
            pagingStock: {
                method: 'GET/POST',
                argv: {
                    merchantId: null
                },
                value: function (request, response, chain){
                    var _data = request.getValue();
                    this.query(zn.sql.paging({
                        table: 'zn_hcredwine_product left join zn_hcredwine_merchant_product_stock on zn_hcredwine_product.id = zn_hcredwine_merchant_product_stock.productId',
                        fields: [
                            'zn_hcredwine_merchant_product_stock.*',
                            'zn_hcredwine_product.logo as productLogo',
                            'zn_hcredwine_product.title as productTitle',
                            'zn_hcredwine_product.alias as productAlias',
                            'zn_hcredwine_product.price as productPrice',
                            'zn_hcredwine_product.proxyPrice as productProxyPrice',
                            'zn_hcredwine_product.unit as productUnit'
                        ],
                        where: {
                            'zn_hcredwine_merchant_product_stock.merchantId': _data.merchantId,
                            '0&<': 'zn_hcredwine_merchant_product_stock.count',
                            'zn_hcredwine_product.status': '1'
                        },
                        order: 'zn_hcredwine_product.createTime asc',
                        pageIndex: _data.pageIndex,
                        pageSize: _data.pageSize
                    })).then(function(data){
                        response.success(data);
                    }, function (data){
                        response.error(data);
                    });
                }
            },
            pagingSettlement: {
                method: 'GET/POST',
                argv: {
                    openId: null,
                    type: null
                },
                value: function (request, response, chain){
                    var _data = request.getValue();
                    this.query(zn.sql.paging({
                        table: 'zn_hcredwine_merchant_settlement',
                        fields: [
                            '*'
                        ],
                        where: {
                            'openId': _data.openId,
                            'type': _data.type
                        },
                        order: 'createTime desc',
                        pageIndex: _data.pageIndex,
                        pageSize: _data.pageSize
                    })).then(function(data){
                        response.success(data);
                    }, function (data){
                        response.error(data);
                    });
                }
            },
            pagingInStockOrder: {
                method: 'GET/POST',
                argv: {
                    merchantId: null,
                    status: 0
                },
                value: function (request, response, chain){
                    var _obj = {}, _data = [], _orders = [];
                    var _values = request.getValue(),
                        _ids = [];
                    var _where = 'merchantId={0}'.format(_values.merchantId);
                    if(_values.status!=undefined){
                        _where += ' and status={0}'.format(_values.status);
                    }

                    this.beginTransaction()
                        .query(zn.sql.paging({
                            table: 'zn_hcredwine_merchant_order',
                            fields: [
                                '*'
                            ],
                            pageSize: _values.pageSize,
                            pageIndex: _values.pageIndex,
                            order: 'createTime desc',
                            where: _where,
                        }))
                        .query('select order detail', function (sql, rows, fields, tran){
                            _orders = rows;
                            var _rows = rows[0];
                            if(_rows.length){
                                _ids = _rows.map(function (row){
                                    row.products = [];
                                    _obj[row.id] = row;
                                    return row.id;
                                });
                                return "select zn_hcredwine_merchant_order_detail.orderId as orderId, zn_hcredwine_merchant_order_detail.totalPrice as totalPrice, zn_hcredwine_merchant_order_detail.price as price, zn_hcredwine_merchant_order_detail.count as count, zn_hcredwine_product.id as productId, zn_hcredwine_product.title as productTitle, zn_hcredwine_product.logo as productLogo, zn_hcredwine_product.price as productPrice from zn_hcredwine_merchant_order_detail left join zn_hcredwine_product on zn_hcredwine_merchant_order_detail.productId = zn_hcredwine_product.id where zn_hcredwine_merchant_order_detail.orderId in ({0});".format(_ids.join(','));
                            }else {
                                return response.success(_orders), false;
                            }
                        }, function (error, rows){
                            rows.forEach(function (row){
                                _obj[row.orderId].products.push(row);
                            });
                            _ids.map(function (key){
                                _data.push(_obj[key]);
                            });
                            _orders[0] = _data;
                            response.success(_orders);
                        }).commit();
                }
            },
            pagingOutStockOrder: {
                method: 'GET/POST',
                argv: {
                    merchantId: null,
                    status: 0
                },
                value: function (request, response, chain){
                    var _obj = {}, _data = [], _orders = [], _ids = [];
                    var _values = request.getValue();
                    var _where = 'merchantId={0}'.format(_values.merchantId);
                    if(_values.status!=undefined){
                        _where += ' and status={0}'.format(_values.status);
                    }

                    this.beginTransaction()
                        .query(zn.sql.paging({
                            table: 'zn_hcredwine_user_order',
                            fields: [
                                '*'
                            ],
                            pageSize: _values.pageSize,
                            pageIndex: _values.pageIndex,
                            order: 'createTime desc',
                            where: _where
                        }))
                        .query('select order detail', function (sql, rows, fields, tran){
                            _orders = rows;
                            var _rows = rows[0];
                            if(_rows.length){
                                _ids = _rows.map(function (row){
                                    row.products = [];
                                    _obj[row.id] = row;
                                    return row.id;
                                });
                                return "select zn_hcredwine_user_order_detail.orderId as orderId, zn_hcredwine_user_order_detail.totalPrice as totalPrice, zn_hcredwine_user_order_detail.price as price, zn_hcredwine_user_order_detail.count as count, zn_hcredwine_product.id as productId, zn_hcredwine_product.title as productTitle, zn_hcredwine_product.logo as productLogo, zn_hcredwine_product.price as productPrice from zn_hcredwine_user_order_detail left join zn_hcredwine_product on zn_hcredwine_user_order_detail.productId = zn_hcredwine_product.id where zn_hcredwine_user_order_detail.orderId in ({0});".format(_ids.join(','));
                            }else {
                                return response.success(_orders), false;
                            }
                        }, function (error, rows){
                            rows.forEach(function (row){
                                _obj[row.orderId].products.push(row);
                            });
                            _ids.map(function (key, index){
                                _data.push(_obj[key]);
                            });
                            _orders[0] = _data;
                            response.success(_orders);
                        }).commit();
                }
            },
            getOrderInfoByCode: {
                method: 'GET/POST',
                argv: {
                    code: null
                },
                value: function (request, response, chain){
                    var _table = 'zn_hcredwine_merchant_order left join zn_hcredwine_merchant on zn_hcredwine_merchant_order.merchantOpenId = zn_hcredwine_merchant.openId',
                        _fields = [
                            'zn_hcredwine_merchant_order.*',
                            'zn_hcredwine_merchant.contact as addressContact',
                            'zn_hcredwine_merchant.phone as addressPhone',
                            'zn_convert_var(zn_hcredwine_merchant.province) as addressProvince',
                            'zn_convert_var(zn_hcredwine_merchant.city) as addressCity',
                            'zn_convert_var(zn_hcredwine_merchant.area) as addressArea',
                            'zn_hcredwine_merchant.address as addressValue'
                        ],
                        _order = {};
                    zn.debug('code', request.getValue('code'));
                    this.beginTransaction()
                        .query("select {0} from {1} where orderCode='{2}';".format(_fields.join(','), _table, request.getValue('code')))
                        .query('select order detail', function (sql, rows, fields, tran){
                            if(rows.length){
                                _order = rows[0];
                                var _keys = [
                                    'zn_hcredwine_merchant_order_detail.count as count',
                                    'zn_hcredwine_merchant_order_detail.price as price',
                                    'zn_hcredwine_merchant_order_detail.totalPrice as totalPrice',
                                    'zn_hcredwine_product.logo as productLogo',
                                    'zn_hcredwine_product.title as productTitle'
                                ];
                                return "select {0} from zn_hcredwine_merchant_order_detail left join zn_hcredwine_product on zn_hcredwine_product.id = zn_hcredwine_merchant_order_detail.productId where zn_hcredwine_merchant_order_detail.orderId={1};".format(_keys.join(','), _order.id);
                            }else {
                                return response.error('未查到该订单详情'), false;
                            }
                        }, function (error, rows){
                            _order.products = rows;
                            response.success(_order);
                        }).commit();
                }
            },
            createOrder: {
                method: 'GET/POST',
                argv: {
                    merchantId: null,
                    products: null
                },
                value: function (request, response, chain){
                    var _merchantId = request.getValue('merchantId'),
                        _products = request.getValue('products'),
                        _total = 0,
                        _count = 0,
                        _tempTotal = 0,
                        _productSql = '',
                        _orderCode = 'HCM'+((new Date()).getTime()).toString();
                    _products.forEach(function (product, index){
                        _tempTotal = (+product.price)*(+product.count);
                        _total += _tempTotal;
                        _count += +product.count;
                        _productSql += "insert zn_hcredwine_merchant_order_detail (orderId, productId, price, count, totalPrice) values ({0},{1},{2},{3},{4});".format('{0}', product.productId, product.price, product.count, _tempTotal);
                    });

                    this.beginTransaction()
                        .query('select openId from zn_hcredwine_merchant where id={0};'.format(_merchantId))
                        .query('Create Order', function (sql, rows){
                            var _mopenid = rows[0].openId;
                            return zn.sql.insert({
                                table: 'zn_hcredwine_merchant_order',
                                values: {
                                    orderCode: _orderCode,
                                    merchantOpenId: _mopenid,
                                    merchantId: _merchantId,
                                    productTotalCount: _count,
                                    price: _total
                                }
                            });
                        }).query('Insert order detail', function (sql, rows){
                            return _productSql.format(rows.insertId);
                        }, function (error, rows){
                            response.success(_orderCode);
                        }).commit();
                }
            },
            payOrder: {
                method: 'GET/POST',
                argv: {
                    orderCode: null
                },
                value: function (request, response, chain){
                    this.query("select * from zn_hcredwine_merchant_order where orderCode='{0}';".format(request.getValue('orderCode')))
                        .then(function (data){
                            if(data.length){
                                var _order = data[0];
                                zn.swiftpass.submitOrderInfo({
                                    out_trade_no: _order.orderCode,
                                    sub_openid: _order.merchantOpenId,
                                    body: "代理商进货订单",
                                    total_fee: (+((_order.price)*100).toFixed(2)),
                                    callback_url: 'http://wine.hu-chun.com/#/merchant/orderinfo?oc=' + _order.orderCode+'&callback=1',
                                    notify_url: 'http://wx.hu-chun.com/hcredwine/merchant/payNotify?oc=' + _order.orderCode,
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
                    if(_value.oc){
                        var _sql = "select * from zn_hcredwine_merchant_order where orderCode='{0}';".format(_value.oc);
                        var _order = null;

                        this.beginTransaction()
                            .query(_sql)
                            .query('UPDATE STATUS', function (sql, rows){
                                _order = rows[0];
                                if(!_order){
                                    return response.error('订单不存在'), false;
                                }

                                if(_order.status>0){
                                    return response.error('订单已经处理'), false;
                                }else {
                                    var _temp = "select * from zn_hcredwine_merchant_order_detail where orderId={0};".format(_order.id);
                                    return _temp + "update zn_hcredwine_merchant_order set status=1 where orderCode='{0}';".format(_value.oc);
                                }
                            })
                            .query('UPDATE STOCK', function (sql, data){
                                var _details = data[0],
                                    _sql = '';
                                _details.forEach(function (detail){
                                    _sql += "update zn_hcredwine_merchant_product_stock set count=count-{0}, lockedCount=lockedCount-{0} where merchantId=1 and productId={1};".format(detail.count, detail.productId);
                                });

                                return _sql;
                            }, function (error){
                                if(error){
                                    response.error(error);
                                }else {
                                    response.success('支付成功');
                                }
                            }).commit();
                    }else {
                        response.success('支付成功');
                    }
                }
            }
        }
    });
});
