zn.define(function () {

    return zn.Controller('merchantOrder',{
        methods: {
            confirmOrder: {
                method: 'GET/POST',
                argv: {
                    orderCode: null
                },
                value: function (request, response, chain){
                    var _orderCode = request.getValue('orderCode'),
                        _order = null;
                    this.beginTransaction()
                        .query("select * from zn_hcredwine_merchant_order where orderCode='{0}';".format(_orderCode))
                        .query("SELECT DETAIL", function (sql, data){
                            _order = data[0];
                            if(!_order){
                                return response.error('未查到该订单详情'), false;
                            }
                            if(_order.status!=2){
                                return response.error('非法订单编号'), false;
                            }
                            var _temp = "select productId, price, count from zn_hcredwine_merchant_order_detail where orderId={0};".format(_order.id);
                            _temp += "select id, productId, count from zn_hcredwine_merchant_product_stock where merchantId={0};".format(_order.merchantId);
                            return _temp;
                        })
                        .query('UPDATE STOCK', function (sql, data){
                            if(!_order){
                                return response.error('未查到该订单详情'), false;
                            }
                            var _details = data[0],
                                _stocks = data[1],
                                _existStock = {},
                                _sql = '',
                                _keys = ['merchantId', 'productId', 'count'].join(','),
                                _values = [_order.merchantId, '{0}', '{1}'].join(','),
                                _stock = null;

                            _stocks && _stocks.forEach(function (stock){
                                _existStock[stock.productId] = stock;
                            });
                            _details && _details.forEach(function (detail){
                                _stock = _existStock[detail.productId];
                                if(_stock){
                                    _sql += 'update zn_hcredwine_merchant_product_stock set count=count+{0} where id={1};'.format(detail.count, _stock.id);
                                }else {
                                    _sql += "insert into zn_hcredwine_merchant_product_stock ({0}) values ({1});".format(_keys, _values.format(detail.productId, detail.count));
                                }
                            });
                            _sql += 'update zn_hcredwine_merchant_order set status=3 where id={0};'.format(_order.id);
                            return _sql;
                        }, function (error, data){
                            if(error){
                                response.error(error);
                            }else {
                                response.success(data);
                            }
                        }).commit();
                }
            }
        }
    });
});
