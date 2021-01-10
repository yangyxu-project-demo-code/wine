zn.define(function () {

    return zn.Controller('batch',{
        methods: {
            pagingBatch: {
                method: 'GET/POST',
                argv: {
                    merchantId: null
                },
                value: function (request, response, chain){
                    var _data = request.getValue();
                    this.paging({
                        table: 'zn_hcredwine_merchant_product_stock_batch',
                        fields: [
                            '*'
                        ],
                        where: {
                            'merchantId': _data.merchantId
                        },
                        order: _data.order,
                        pageIndex: (_data.pageIndex||1),
                        pageSize: (_data.pageSize||10)
                    }).then(function(data){
                        response.success(data);
                    }, function (data){
                        response.error(data);
                    });
                }
            },
            addBatch: {
                method: 'GET/POST',
                argv: {
                    merchantId: null,
                    data: null
                },
                value: function (request, response, chain){
                    var _data = request.getValue('data'),
                        _merchantId = request.getValue('merchantId'),
                        _products = _data.products,
                        _total = 0,
                        _count = 0,
                        _tempTotal = 0,
                        _productSql = '',
                        _stock = {},
                        _existStock = {};
                    _products.forEach(function (product, index){
                        _tempTotal = (+product.price)*(+product.count);
                        _total += _tempTotal;
                        _count += +product.count;
                        _productSql += "insert zn_hcredwine_merchant_product_stock_batch_detail (batchId, productId, productTypeId, price, count, totalPrice) values ({0},{1},{2},{3},{4},{5});".format('{0}', product.productId, product.productTypeId, product.price, product.count, _tempTotal);
                        _productSql += zn.sql.select({
                            table: 'zn_hcredwine_merchant_product_stock',
                            fields: 'id, merchantId, productId, count',
                            where: {
                                merchantId: _merchantId,
                                productId: product.productId
                            }
                        });
                        _stock[_merchantId + '&' + product.productId] = +product.count;
                    });
                    this.beginTransaction()
                        .query('Insert Stock', function (){
                            return zn.sql.insert({
                                table: 'zn_hcredwine_merchant_product_stock_batch',
                                values: {
                                    merchantId: _merchantId,
                                    batchCode: (_data.batchCode||"MCBC"+(new Date()).getTime()),
                                    totalPrice: _total,
                                    totalNumber: _count
                                }
                            });
                        })
                        .query('Insert Stock Detail', function (sql, rows){
                            return _productSql.format(rows.insertId);
                        })
                        .query('Update Product Stock', function (sql, data){
                            var _item = null,
                                _sql = '';
                            for(var i = 1, _len = data.length; i<_len; ){
                                _item = data[i];
                                if(_item.length){
                                    _existStock[_item[0].merchantId + '&' + _item[0].productId] = _item[0].id;
                                }
                                i = i + 2;
                            }
                            for(var key in _stock){
                                var _count = _stock[key],
                                    _keys = key.split('&');
                                if(_existStock[key]){
                                    _sql += 'update zn_hcredwine_merchant_product_stock set count=count+{0} where id={1};'.format(_count, _existStock[key]);
                                }else {
                                    _sql += 'insert zn_hcredwine_merchant_product_stock (merchantId, productId, count) values ({0}, {1}, {2});'.format(_merchantId, _keys[1], _count);
                                }
                            }
                            return _sql;
                        }, function (error, rows){
                            response.success('入库成功');
                        }).commit();
                }
            }
        }
    });
});
