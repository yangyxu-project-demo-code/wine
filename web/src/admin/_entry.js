require('../../../../../zn/zeanium-react-web/debug.js');
//require('zeanium-react-web');
zn.react.Application.create({
	host: 'http://47.92.75.128:6969',
	plugins: [
		//require('../../../../../zn/zn-plugin-admin')
		require('zn-plugin-admin')
	],
	home: '/login',
	routers: {
		'/login': './user/Login.js',
		//'/order/info': '../user/order/Info.js',
		'/main': {
			'/': './Main.js',
			'/Setting/Index': './setting/Index.js',
			'/Setting/Info': './setting/Info.js',
			'/Product/Index': './product/Index.js',
			'/Product/Info': './product/ProductInfo.js',
			'/User/Index': './user/UserList.js',
			'/User/Center': './user/UserCenter.js',
			'/Merchant/Index': './merchant/Index.js',
			'/Merchant/Center': './merchant/Center.js',
			'/Restaurant/Index': './restaurant/Index.js',
			'/Restaurant/Center': './restaurant/Center.js',
			'/Courier/Index': './courier/Index.js',
			'/Courier/Center': './courier/Center.js',
			'/Coupon/Index': './coupon/Index.js',
			'/Coupon/List': './coupon/List.js',
			'/Settlement/Center': './settlement/Center.js'
		}
	},
	onLoading: function (value){
		if(zn.is(value, 'string')){
			return require(value);
		}

		return value;
	}
});
