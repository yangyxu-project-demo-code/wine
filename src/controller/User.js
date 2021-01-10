zn.define([ 'node:request' ], function (node_request) {

    return zn.Controller('user',{
        methods: {
            getUserInfo: {
                method: 'GET/POST',
                value: function (request, response, chain){
                    zn.wx.accessTokenRequest('user.info', {
                        openid: request.getValue('openid')||'oJ_xbwdXtcNmve1goO0HH_5Aouyg'
                    }).then(function (data){
                        response.success(data);
                    });
                }
            },
            getUserList: {
                method: 'GET/POST',
                value: function (request, response, chain){
                    zn.wx.request('user.getAllUsers', {
                        next_openid: request.getValue('next_openid')||null
                    }).then(function (data){
                        response.success(data);
                    });
                }
            },
            getLoginUserSession: {
                method: 'GET/POST',
                value: function (request, response, chain){
                    response.success(request.session.getItem('@WXUser'));
                }
            },
            getUserByOpenId: {
                method: 'GET/POST',
                argv: {
                    openId: null
                },
                value: function (request, response, chain){
                    var _sql = "select id, role, createTime, openid, nickname, province, city, country, sex, headimgurl from zn_hcredwine_user where openid='{0}';"
                    _sql += "select id as merchantId, status as merchantStatus from zn_hcredwine_merchant where openId='{0}';";
                    _sql += "select id as courierId, status as courierStatus from zn_hcredwine_courier where openId='{0}';";
                    _sql += "select id as restaurantId from zn_hcredwine_restaurant where openId='{0}' and status=1;";
                    this.query(_sql.format(request.getValue('openId')))
                        .then(function (data){
                            var _user = data[0][0];
                            zn.extend(_user, data[1][0]);
                            zn.extend(_user, data[2][0]);
                            zn.extend(_user, data[3][0]);
                            response.success(_user);
                        });
                }
            },
            loginByUserCode: {
                method: 'GET/POST',
                argv: {
                    code: null,
                    debug: 0
                },
                value: function (request, response, chain){
                    var _self = this,
                        _user = request.session.getItem('@WXUser'),
                        _debug = request.getValue('debug'),
                        _code = request.getValue('code'),
                        _session = {};

                    if(+_debug){
                        _user = {
                            id: 1,
                            createTime: "2017-04-07 18:49:02",
                            role: 'courier',
                            courierId: 1,
                            openid: "ovLYIwH-My9ZUYpi7WWZrDIXcXmo",
                            nickname: "笨笨洋",
                            province: "上海",
                            city: "徐汇",
                            country: "中国",
                            headimgurl: "http://wx.qlogo.cn/mmopen/PiajxSqBRaEIc0zqguM8hMNsgKia6yjJpfkJmLiaUqDHiatMumaTs5Ahmic9sQn1ASp172eaHTV9dMwvy1Ojtac3FYA/0",
                            age: 0,
                            sex: "1"
                        };
                        request.session.setItem('@WXUser', _user);
                        return response.success(_user), false;
                    }

                    if(_user){
                        return response.success(_user), false;
                    }

                    zn.wx.accessTokenRequest('sns.getUserOpenId', {
                        code: _code
                    }).then(function (data){
                        zn.overwrite(_session, data);
                        if(data.errcode){
                            return response.error(data), false;
                        }else {
                            var _sql = "select id, role, createTime, openid, nickname, province, city, country, sex, headimgurl from zn_hcredwine_user where openid='{0}';"
                            _sql += "select id as merchantId, status as merchantStatus from zn_hcredwine_merchant where openId='{0}';";
                            _sql += "select id as courierId, status as courierStatus from zn_hcredwine_courier where openId='{0}';";
                            _sql += "insert into zn_hcredwine_user_wxcode (code, userOpenId) values ('{0}', '{1}');".format(_code, _session.openid);
                            return _self.query(_sql.format(_session.openid));
                        }
                    }).then(function (data){
                        if(data[0].length){
                            _user = data[0][0];
                            if(_user.role=='merchant' && data[1] && data[1][0]){
                                zn.extend(_user, data[1][0]);
                            }else {
                                zn.extend(_user, data[2][0]);
                            }
                            request.session.setItem('@WXUser', _user);
                            return response.success(_user), false;
                        }else {
                            return zn.wx.request('sns.userInfo', {
                                access_token: _session.access_token,
                                openid: _session.openid
                            });
                        }
                    }).then(function (data){
                        zn.overwrite(_session, data);
                        var _key = [
                            'access_token', 'refresh_token', 'scope', 'openid', 'unionid',
                            'nickname', 'sex', 'province', 'city', 'country', 'headimgurl'
                        ], _value = [];
                        zn.debug('wxuser info: ', data);
                        _key.forEach(function (item, index){
                            _value.push("'" + (_session[item]||'')+"'");
                        });
                        _self.beginTransaction()
                            .query("insert into zn_hcredwine_user ({0}) values ({1});".format(_key.join(','), _value.join(',')))
                            .query('select user info', function (sql, rows, fields, tran){
                                return "select id, role, createTime, openid, nickname, province, city, country, sex from zn_hcredwine_user where openid='{0}';".format(_session.openid);
                            }, function(error, rows){
                                if(error){
                                    response.error(error);
                                }else {
                                    _user = rows[0];
                                    request.session.setItem('@WXUser', _user);
                                    response.success(_user);
                                }
                            }).commit();
                    });
                }
            }
        }
    });
});
