zn.define([ 'node:request' ], function (node_request) {

    return zn.Controller('courier',{
        methods: {
            withdraw: {
                method: 'GET/POST',
                argv: {
                    openId: null,
                    value: null
                },
                value: function (request, response, chain){
                    var _value = request.getValue();
                    this.beginTransaction()
                        .query("insert item", function (){
                            return "insert into zn_hcredwine_courier_salary (openId, status, type, value) values ('{0}', 0, -1, {1});".format(_value.openId, _value.value);
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
                            return "select * from zn_hcredwine_courier_salary where id={0};".format(_value.id);
                        })
                        .query('update order', function (sql, rows){
                            var _settlement = rows[0];
                            if(_settlement){
                                var _temp = "update zn_hcredwine_courier_salary set status=1 where id={0};".format(_value.id);
                                _temp += "update zn_hcredwine_courier salary=salary-{0} where openId='{1}';".format(_settlement.value, _settlement.openId);
                                return _temp;
                            }else {
                                return response.error('提交出错'), false;
                            }
                        }, function (){
                            response.success('确认成功');
                        }).commit();
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
                    this.paging({
                        table: 'zn_hcredwine_courier_salary',
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
                    }).then(function(data){
                        response.success(data);
                    }, function (data){
                        response.error(data);
                    });
                }
            },
            getMessage: {
                method: 'GET/POST',
                argv: {
                    courierId: null
                },
                value: function (request, response, chain){
                    this._store.query('').then(function (){

                    });
                }
            },
            payNotify: {
                method: 'GET/POST',
                value: function (request, response, chain){
                    var _oi = request.getValue('oi');
                    if(_oi){
                        var _sql = "select * from zn_hcredwine_courier where openId='{0}';".format(_oi);
                        var _user = null;
                        this.beginTransaction()
                            .query(_sql)
                            .query('UPDATE STATUS', function (sql, rows){
                                _user = rows[0];
                                if(_user.status>1){
                                    return response.success('notify success'), false;
                                }else {
                                    return "update zn_hcredwine_courier set status=2 where openId='{0}';".format(_oi);
                                }
                            }, function (){
                                response.success('notify success');
                            }).commit();
                    }else {
                        response.success('notify success');
                    }
                }
            },
            payAuth: {
                method: 'GET/POST',
                argv: {
                    openId: null
                },
                value: function (request, response, chain){
                    var _openId = request.getValue('openId');
                    this.query("select status from zn_hcredwine_courier where openId='{0}';".format(_openId)).then(function (data){
                        if(data.length){
                            var _user = data[0];
                            switch (_user.status) {
                                case 0:
                                    response.error('账户还未认证, 请先进行认证。');
                                    break;
                                case 1:
                                    var _debug = request.getValue('debug');
                                    var _orderCode = _openId,
                                        _price = 1000;
                                    if(_debug){
                                        _orderCode = 'HC'+((new Date()).getTime()/1000).toString();
                                        _price = 0.01;
                                    }
                                    zn.swiftpass.submitOrderInfo({
                                        out_trade_no: _orderCode,
                                        sub_openid: _openId,
                                        body: '派送员1000.00RMB押金',
                                        total_fee: _price * 100,
                                        callback_url: 'http://wine.hu-chun.com/#/courier/auth?callback=1',
                                        notify_url: 'http://wx.hu-chun.com/hcredwine/courier/payNotify?oi=' + _openId,
                                    }).then(function (data){
                                        response.success(data.xml);
                                    }, function (error){
                                        response.error(error);
                                    });
                                    break;
                                case 2:
                                    response.error('认证订单已经支付, 请勿重新支付。');
                                    break;
                            }
                        }else {
                            response.error('支付出错, 该用户不存在, 请核对后再试。');
                        }
                    });
                }
            },
            pagingOrder: {
                method: 'GET/POST',
                argv: {
                    courierOpenId: null,
                    status: 0
                },
                value: function (request, response, chain){
                    var _obj = {}, _data = [], _orders = [];
                    var _values = request.getValue();
                    var _ids = [];
                    var _where = "zn_hcredwine_user_order.courierOpenId='{0}'".format(_values.courierOpenId);
                    if(+_values.status){
                        _where += ' and zn_hcredwine_user_order.status={0}'.format(_values.status);
                    }

                    this.beginTransaction()
                        .query(zn.sql.paging({
                            table: 'zn_hcredwine_user_order left join zn_hcredwine_user_address on zn_hcredwine_user_order.userAddressId = zn_hcredwine_user_address.id',
                            fields: [
                                'zn_hcredwine_user_order.*',
                                'zn_hcredwine_user_address.name as addressName',
                                'zn_hcredwine_user_address.phone as addressPhone',
                                'zn_convert_var(zn_hcredwine_user_address.province) as addressProvince',
                                'zn_convert_var(zn_hcredwine_user_address.city) as addressCity',
                                'zn_convert_var(zn_hcredwine_user_address.area) as addressArea',
                                'zn_hcredwine_user_address.address as addressValue',
                                'zn_hcredwine_user_address.postcode as addressPostCode',
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
            }
        }
    });
});
