zn.define(function () {

    return zn.Controller('my', {
        methods: {
            pagingOrder: {
                method: 'GET/POST',
                argv: {
                    userId: null,
                    status: 0
                },
                value: function (request, response, chain){
                    var _obj = {}, _data = [], _orders = [];
                    var _values = request.getValue(),
                        _ids = [];
                    var _where = 'userId={0}'.format(_values.userId);
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
            },
            pagingShoppingCart: {
                method: 'GET/POST',
                argv: {
                    userId: null
                },
                value: function (request, response, chain){
                    this.paging(zn.extend({
                        table: 'zn_hcredwine_user_shopping_cart left join zn_hcredwine_product on zn_hcredwine_user_shopping_cart.productId=zn_hcredwine_product.id',
                        fields: [
                            'zn_hcredwine_user_shopping_cart.*',
                            'zn_hcredwine_product.id as productId',
                            'zn_hcredwine_product.title as productTitle',
                            'zn_hcredwine_product.logo as productLogo',
                            'zn_hcredwine_product.price as productPrice'
                        ],
                        where: 'zn_hcredwine_user_shopping_cart.userId={0}'.format(request.getInt('userId'))
                    }, request.getValue())).then(function(data){
                        response.success(data);
                    }, function (data){
                        response.error(data);
                    });
                }
            },
            addToShoppingCart: {
                method: 'GET/POST',
                argv: {
                    userId: null,
                    productId: null
                },
                value: function (request, response, chain){
                    var _userId = request.getValue('userId'),
                        _productId = request.getValue('productId');
                    this.query('select * from zn_hcredwine_user_shopping_cart where userId={0} and productId={1};'.format(_userId, _productId))
                        .then(function(data){
                            if(data.length){
                                response.success('添加成功');
                            }else {
                                this.query('insert into zn_hcredwine_user_shopping_cart (userId, productId) values ();'.format(_userId, _productId))
                            }
                        }.bind(this), function (data){
                            response.error(data);
                        });
                }
            }
        }
    });
});
