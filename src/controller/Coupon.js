zn.define([ 'node:request' ], function (node_request) {

    return zn.Controller('coupon',{
        methods: {
            selectUserCoupons: {
                method: 'GET/POST',
                argv: {
                    openId: null
                },
                value: function (request, response, chain){
                    var _openId = request.getValue('openId');

                    this.beginTransaction()
                        .query('SELECT COUPON TYPE', function (){
                            var _sql = "select * from zn_hcredwine_user_coupon where status=0 and toUserOpenId='{0}' and UNIX_TIMESTAMP(beginTime)<UNIX_TIMESTAMP(now()) and UNIX_TIMESTAMP(endTime)>UNIX_TIMESTAMP(now());".format(_openId);
                            return _sql;
                        }, function (error, data){
                            if(error){
                                response.error(error);
                            }else {
                                response.success(data);
                            }
                        }).commit();
                }
            },
            create: {
                method: 'GET/POST',
                argv: {
                    code: null,
                    fromUserOpenId: null,
                    couponId: 1
                },
                value: function (request, response, chain){
                    var _code = request.getValue('code'),
                        _fromUserOpenId = request.getValue('fromUserOpenId'),
                        _toUserOpenId = null,
                        _couponId = request.getValue('couponId'),
                        _djqCode = 'DJQ' + (new Date()).getTime(),
                        _type = null;
                    zn.error('Argv: ', request.getValue());
                    this.beginTransaction()
                        .query('SELECT COUPON TYPE', function (){
                            var _sql = 'select * from zn_hcredwine_coupon where id={0};'.format(_couponId);
                            _sql += "select * from zn_hcredwine_user_coupon where wxUserCode='{0}' and fromUserOpenId='{1}' and couponId={2};".format(_code, _fromUserOpenId, _couponId);
                            _sql += "select * from zn_hcredwine_user_wxcode where code='{0}';".format(_code);
                            return _sql;
                        })
                        .query('UPDATE STATUS', function (sql, rows){
                            var _couponType = rows[0][0],
                                _coupon = rows[1][0],
                                _wxcode = rows[2][0],
                                _number = _couponType.number;
                            _type = _couponType;
                            zn.error('fromUserOpenId: ', _fromUserOpenId, rows);
                            if(!_wxcode){
                                return response.error('无效链接：分享代码不存在'), false;
                            }
                            _toUserOpenId = _wxcode.userOpenId;
                            if(_fromUserOpenId == _toUserOpenId){
                                return response.error('无效链接：自己的分享代码不能使用'), false;
                            }
                            if(!_couponType){
                                return response.error('代金券类型不存在'), false;
                            }
                            if(_coupon){
                                return response.error('您已经领取过了, 机会给其他人吧'), false;
                            }
                            if((_couponType.usedPrice+_couponType.price)>_couponType.totalPrice){
                                return response.error('优惠券已经被领完了'), false;
                            }

                            var _keys = [
                                'wxUserCode',
                                'fromUserOpenId',
                                'toUserOpenId',
                                'code',
                                'price',
                                'beginTime',
                                'endTime',
                                'couponId'
                            ],
                            _values = [
                                "'"+_code+"'",
                                "'"+_fromUserOpenId+"'",
                                "'"+_toUserOpenId+"'",
                                "'"+_djqCode+"'",
                                _couponType.price,
                                "'"+_couponType.beginTime+"'",
                                "'"+_couponType.endTime+"'",
                                _couponType.id
                            ];
                            var _sql = "insert into zn_hcredwine_user_coupon ({0}) values ({1});".format(_keys.join(','), _values.join(','));
                            _sql += "update zn_hcredwine_coupon set usedPrice=usedPrice+{0}, usedCount=usedCount+1 where id={1};".format(_couponType.price, _couponType.id);
                            return _sql;
                        }, function (){
                            response.success('恭喜您，成功领取代金券！');
                            zn.wx.accessTokenRequest('template.send', {
                                touser: _toUserOpenId,
                                template_id: "SjT2Uq44y44ECrdh-d9weLF5f4gCgh7XO-rbmhYi9Cs",
                                url: 'http://wine.hu-chun.com/',
                                topcolor: "#FF0000",
                                data: {
                                    first: {
                                        value: "您已成功获得代金券",
                                        color: "#173177"
                                    },
                                    keyword1: {
                                        value: "红酒代金券",
                                        color: "#173177"
                                    },
                                    keyword2: {
                                        value: _djqCode,
                                        color: "#173177"
                                    },
                                    keyword3: {
                                        value: _type.beginTime + ' ~ ' + _type.endTime,
                                        color: "#173177"
                                    },
                                    remark: {
                                        value: '感谢您的分享与参与, 祝您购物愉快。',
                                        color: "#173177"
                                    }
                                }
                            });
                        }).commit();
                }
            },
            createBySelf: {
                method: 'GET/POST',
                argv: {
                    toUserOpenId: null,
                    couponId: 1
                },
                value: function (request, response, chain){
                    var _toUserOpenId = request.getValue('toUserOpenId'),
                        _couponId = request.getValue('couponId'),
                        _type = null,
                        _number = 0;
                    this.beginTransaction()
                        .query('SELECT COUPON TYPE', function (){
                            return 'select * from zn_hcredwine_coupon where id={0};'.format(_couponId);
                        })
                        .query('UPDATE STATUS', function (sql, rows){
                            _type = rows[0];
                            _number = _type.number;
                            if(!_type){
                                return response.error('代金券类型不存在'), false;
                            }
                            if((_type.usedPrice+_type.price)>_type.totalPrice){
                                return response.error('优惠券已经被领完了'), false;
                            }

                            var _keys = [
                                'toUserOpenId',
                                'code',
                                'price',
                                'beginTime',
                                'endTime',
                                'couponId'
                            ],
                            _values = [
                                "'"+_toUserOpenId+"'",
                                "'{0}'",
                                _type.price,
                                "'"+_type.beginTime+"'",
                                "'"+_type.endTime+"'",
                                _type.id
                            ];

                            var _sql = '';
                            for(var i = 0; i < _number;i++){
                                _sql += "insert into zn_hcredwine_user_coupon ({0}) values ({1});".format(_keys.join(','), _values.join(',').format('DJQ' + (new Date()).getTime() + (i).toString()));
                            }
                            _sql += "update zn_hcredwine_coupon set usedPrice=usedPrice+{0}, usedCount=usedCount+{2} where id={1};".format(_type.price, _type.id, _number);
                            return _sql;
                        }, function (){
                            response.success('恭喜您，成功领取'+_number+'张代金券！');
                            zn.wx.accessTokenRequest('template.send', {
                                touser: _toUserOpenId,
                                template_id: "SjT2Uq44y44ECrdh-d9weLF5f4gCgh7XO-rbmhYi9Cs",
                                url: 'http://wine.hu-chun.com/',
                                topcolor: "#FF0000",
                                data: {
                                    first: {
                                        value: "您已成功获得"+_number+"张代金券",
                                        color: "#173177"
                                    },
                                    keyword1: {
                                        value: "红酒代金券",
                                        color: "#173177"
                                    },
                                    keyword2: {
                                        value: "点击“我的代金券”查看更多详情",
                                        color: "#173177"
                                    },
                                    keyword3: {
                                        value: _type.beginTime + ' ~ ' + _type.endTime,
                                        color: "#173177"
                                    },
                                    remark: {
                                        value: '感谢您的分享与参与, 祝您购物愉快。',
                                        color: "#173177"
                                    }
                                }
                            });
                        }).commit();
                }
            }
        }
    });
});
