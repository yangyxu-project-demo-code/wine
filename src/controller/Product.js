zn.define(function () {

    return zn.Controller('product',{
        methods: {
            searchProduct: {
                method: 'GET/POST',
                argv: {
                    searchString: '',
                    category: ''
                },
                value: function (request, response, chain){
                    var _data = request.getValue();
                    var _values = (request.getValue('searchString')||'').split(' ');
                    var _typeId = request.getValue('category');
                    var _orders = [
                        'beginTime asc',
                        'createTime desc'
                    ];
                    if(_data.order){
                        _orders = [_data.order];
                    }
                    var _where = 'status<>0 and UNIX_TIMESTAMP(endTime)>UNIX_TIMESTAMP(now())',
                        _like = [];
                    _values.forEach(function (value, index){
                        if(value){
                            _like.push("title like '%"+value+"%'");
                        }
                    });
                    if(_data.vars){
                        _where += " and locate(',{0},', vars)<>0".format(_data.vars);
                    }
                    if(_data.city){
                        _where += " and city=" + _data.city;
                    }
                    if(_like.length){
                        _where += ' and (' + _like.join(' and ')+')';
                    }
                    if(_typeId){
                        _where += ' and typeId=' + _typeId;
                    }
                    this.query(zn.sql.paging({
                        table: 'zn_auction_product',
                        fields: [
                            '*'
                        ],
                        where: _where,
                        order: _orders.join(','),
                        pageIndex: _data.pageIndex,
                        pageSize: _data.pageSize
                    })).then(function(data){
                        response.success(data);
                    }, function (data){
                        response.error(data);
                    });
                }
            },
            notify: {
                method: 'GET/POST',
                argv: {
                    cancle: 0,
                    userId: null,
                    productId: null
                },
                value: function (request, response, chain){
                    var _data = "notifyCount=notifyCount+1, notifyUsers=concat(notifyUsers, '"+request.getValue('userId')+",')";
                    if(request.getInt('cancle')==1){
                        _data = "notifyCount=notifyCount-1, notifyUsers=replace(notifyUsers, ',"+request.getValue('userId')+",', ',')";
                    }
                    var _sql = "update zn_auction_product set {0} where id={1}".format(_data, request.getValue('productId'));
                    this.query(_sql).then(function (data){
                        response.success(data);
                    }.bind(this), function (error){
                        response.error(error.message);
                    });
                }
            },
            collect: {
                method: 'GET/POST',
                argv: {
                    cancle: 0,
                    userId: null,
                    productId: null
                },
                value: function (request, response, chain){
                    var _data = "collectCount=collectCount+1, collectUsers=concat(collectUsers, '"+request.getValue('userId')+",')";
                    if(request.getInt('cancle')==1){
                        _data = "collectCount=collectCount-1, collectUsers=replace(collectUsers, ',"+request.getValue('userId')+",', ',')";
                    }
                    var _sql = "update zn_auction_product set {0} where id={1}".format(_data, request.getValue('productId'));
                    this.query(_sql).then(function (data){
                        response.success(data);
                    }.bind(this), function (error){
                        response.error(error.message);
                    });
                }
            },
            watch: {
                method: 'GET/POST',
                argv: {
                    productId: null
                },
                value: function (request, response, chain){
                    var _sql = "select * from zn_auction_product where id={0} and status=1;";
                    _sql += "update zn_auction_product set watchCount=watchCount+1 where id={0} and status=1;";
                    this.query(_sql.format(request.getValue('productId')))
                        .then(function (data){
                            response.success(data);
                        }.bind(this), function (error){
                            response.error(error.message);
                        });
                }
            },
            getAllTypes: {
                method: 'GET/POST',
                value: function (request, response, chain){
                    this.query("select id, title, createTime, img from zn_auction_product_type")
                        .then(function (data){
                            response.success(data);
                        }.bind(this), function (error){
                            response.error(error.message);
                        });
                }
            },
            getTypes: {
                method: 'GET/POST',
                argv: {
                    pid: null
                },
                value: function (request, response, chain){
                    var _sql = "select id, title, createTime, img, href from zn_auction_product_type where pid={0};".format(request.getValue('pid'));
                    _sql += "select * from zn_auction_session where status=1 and isAdv=1;";
                    this.query(_sql)
                        .then(function (data){
                            response.success(data);
                        }.bind(this), function (error){
                            response.error(error.message);
                        });
                }
            },
            pagingProductsByType: {
                method: 'GET/POST',
                argv: {
                    typeId: null
                },
                value: function (request, response, chain){
                    this.query(zn.sql.paging(zn.extend({
                        table: 'zn_auction_product',
                        fields: '*',
                        where: 'typeId={0} and status<>0 order by createTime desc, endTime desc, beginTime desc'.format(request.getInt('typeId'))
                    }), request.getValue())).then(function(data){
                        response.success(data);
                    }, function (data){
                        response.error(data);
                    });
                }
            },
            getProductsByType: {
                method: 'GET/POST',
                argv: {
                    typeId: null
                },
                value: function (request, response, chain){
                    this.query("select * from zn_auction_product where typeId={0} and status<>0 order by endTime desc, beginTime desc".format(request.getValue('typeId')))
                        .then(function (data){
                            response.success(data);
                        }.bind(this), function (error){
                            response.error(error.message);
                        });
                }
            }
        }
    });
});
