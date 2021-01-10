zn.define([
    'node:request'
], function (node_request) {

    var CONFIG = {
        WECHAID: 'ovLYIwGSFVUjq7Rfw1j9PsgIxcrE',
        url: 'https://pay.swiftpass.cn/pay/gateway',
        mchId: '102510365910',
        key: '08ed3ceb6db4083c62a7a5b1b523530f',
        service: 'pay.weixin.jspay',
        version: '2.0'
    }

    return zn.Class({
        methods: {
            submitOrderInfo: function (argv){
                var _defer = zn.async.defer(),
                    _argv = zn.extend(argv,  {
                        service: CONFIG.service,
                        mch_id: CONFIG.mchId,
                        mch_create_ip: '127.0.0.1',
                        nonce_str: zn.wx.generateNonceStr()
                    });

                _argv.sign = zn.wx.getPaySign(_argv, CONFIG.key);
                node_request({
                    url: CONFIG.url,
                    method: 'POST',
                    body: zn.wx.xmlStringify(_argv)
                }, function (error, response, body) {
                    if (error) {
                        _defer.reject(error);
                    }
                    zn.wx.xmlParse(body, function (data){
                        _defer.resolve(data);
                    });
                });

                return _defer.promise;
            }
        }
    });
});
