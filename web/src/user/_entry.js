require('../../../../../zn/zeanium-react-web/debug.js');
//require('zeanium-react-web');

zn.react.Application.create({
	debug: 0,
	state: 1,
	code: '',
	host: 'http://47.92.75.128:6969',
	home: '/main/home',
	routers: {
		'/join/index': './join/Index.js',
		'/join/merchant': './join/Merchant.js',
		'/join/courier': './join/Courier.js',
		'/main': {
			'/': './main/Main.js',
	        '/home': './main/Home.js',
			'/order': './main/Order.js',
			'/my': './my/My.js'
		},
		'/product/info': './product/Info.js',
		'/order/protocol': './order/Protocol.js',
		'/order/create': './order/Create.js',
		'/order/createhome': './order/CreateHome.js',
		'/order/info': './order/Info.js',
		'/my/coupon': './my/Coupon.js',
		'/my/address': './my/Address.js',
		'/my/apply': './my/Apply.js',
		'/my/infoedit': './my/InfoEdit.js',
		'/courier/auth': './courier/Auth.js',
		'/courier/order': './courier/Order.js',
		'/courier/message': './courier/Message.js',
		'/courier/settlement': './courier/Settlement.js',
		'/merchant/info': './merchant/Info.js',
		'/merchant/auth': './merchant/Auth.js',
		'/merchant/list': './merchant/List.js',
		'/merchant/stock': './merchant/Stock.js',
		'/merchant/settlement': './merchant/Settlement.js',
		'/merchant/orderinfo': './merchant/OrderInfo.js',
		'/merchant/instock': './merchant/InStock.js',
		'/merchant/outstock': './merchant/OutStock.js',
		'/merchant/createStockOrder': './merchant/CreateStockOrder.js',
		'/restaurant/settlement': './restaurant/Settlement.js',
		'/restaurant/auth': './restaurant/Auth.js'
	},
	onInit: function (){
		this.__parseHash();
		var _state = this.get('state'),
			_self = this;
		if((_state).toString().indexOf('HCRC')!=-1){
			Store.post('/hcredwine/restaurant/getByCode', {
				code: _state
			}).exec().then(function (data){
				var _obj = data.result;
				if(_obj){
					if(_obj.status>0 && _obj.merchantId){
						Session.setKeyValue('restaurant', _obj);
						_self.__init(_obj.merchantId);
					}else {
						_self.__init(1, _state);
					}
				}else {
					_self.__init(1);
				}
			});
		}else {
			_self.__init(_state);
		}

		return false;
	},
	onLoading:  function (value){
		if(zn.is(value, 'string')){
			return require(value);
		}

		return value;
	},
	__parseHash: function (){
		var _searchs = window.location.href.split('?'),
			_temp = [], _value, _values = {};
		_searchs.shift();
		_searchs.forEach(function (search){
			if(search.indexOf('#/')!=-1) {
				search = search.split('#/')[0];
			}
			search.split('&').forEach(function (value){
				_temp = value.split('=');
				_value = _temp[1];
				if(_temp[0]=='code'){
					_values.debug = 0;
				}
				_values[_temp[0]] = _value;
			});
		});

		this.sets(_values);
	},
	__init: function (state, hcrc){
		var _self = this;
		if(Session.jsonKeyValue('WAP_LOGIN_USER_TOKEN')){
			this.__render(state, hcrc);
		}else {
			this.update(<UI.DataLoader loader="timer" content="正在登陆中, 请稍后..." />);
			Store.get('/hcredwine/user/loginByUserCode', {
				code: _self.get('code'),
				debug: _self.get('debug')
			}).exec().then(function (data){
				if(data.status==200){
					Session.setKeyValue('WAP_LOGIN_USER_TOKEN', data.result);
					_self.__render(state, hcrc);
				}else {
					_self.__reLogin();
				}
			}, function (){
				_self.__reLogin();
			});
		}
	},
	__render: function (state, hcrc){
		if(hcrc){
			var Setup = require('./restaurant/Setup.js');
			this.update(<Setup hcrc={hcrc} />);
		}else {
			Session.setKeyValue('state', state);
			this.__initWX();
			this.update();
		}
	},
	__reLogin: function (){
		if(!this.get('debug')){
			Store.get('/hcredwine/merchant/getLoginURL', {
				state: this.get('state')
			}).exec().then(function (data){
				if(data.result){
					window.location.href = data.result;
				}else {
					alert('后台服务不可用！');
				}
			});
		}
	},
	__initWX: function (){
		Store.post('/znwechat/wx/getJSSDKConfig',{
			url: window.location.href.split('#')[0]
		}).exec().then(function (data){
			var _share = {
				title: '红酒直送', // 分享标题
				desc: '红酒扫一扫送到家',
				link: 'http://wine.hu-chun.com/', // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
				imgUrl: 'http://wine.hu-chun.com/images/getheadimg.jpeg', // 分享图标
				success: function () {
					var _token = Session.jsonKeyValue("WAP_LOGIN_USER_TOKEN");
					if(_token){
						Store.post('/hcredwine/coupon/createBySelf', {
							toUserOpenId: _token.openid
						}).exec().then(function (){
							alert('恭喜您, 获得优惠券, 快去“我的优惠券”查看吧!');
						});
					}
				}
			};
			var _config = data.result;
			_config.debug = false;
			_config.jsApiList = [
				'onMenuShareTimeline',
				'onMenuShareAppMessage',
				'onMenuShareQQ',
				'onMenuShareWeibo',
				'onMenuShareQZone'
			];
			wx.config(_config);
			wx.ready(function(){
				wx.onMenuShareTimeline(_share);
				wx.onMenuShareAppMessage(_share);
				wx.onMenuShareQQ(_share);
				wx.onMenuShareWeibo(_share);
				wx.onMenuShareQZone(_share);
			});

		});
	},
	render: function (){

	}
});
