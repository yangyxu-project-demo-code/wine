var React = require('react');
var CreateOrder = require('./CreateOrder.js');

module.exports = React.createClass({
	getInitialState: function() {
		var _token = Session.jsonKeyValue('WAP_LOGIN_USER_TOKEN');
    	return {
			stockData: Store.post('/hcredwine/merchant/pagingStock', {
				merchantId: 1
			}),
			totalCount: 0,
			totalPrice: 0
		};
  	},
	__submit: function (){
		var _token = Session.jsonKeyValue('WAP_LOGIN_USER_TOKEN');
		var _self = this;
		if(this.state.totalCount>0 && _token){
			var _products = [];
			this.state.products.map(function (product){
				if(product.count){
					_products.push(product);
				}
			});
			Store.post('/hcredwine/merchant/createOrder', {
				merchantId: _token.merchantId,
				products: _products
			}).exec().then(function (data){
				if(data.status!=200){
					Toast.error(data.result);
				}else {
					_self.__onPay(data.result);
				}
			});
		}else {

		}
	},
	__onPay: function (orderCode){
		Store.post('/hcredwine/merchant/payOrder', {
			orderCode: orderCode
		}).exec().then(function (data){
			var _result = data.result;
			if(_result.token_id){
				window.location.href ='https://pay.swiftpass.cn/pay/jspay?token_id=' + _result.token_id + '&showwxtitle=1';
			}else {
				alert(_result.err_msg);
			}
		});
	},
	__footerView: function (){
		return <div className="footer">
			<div className="left">
				<span>合计<span className="count">{+this.state.totalCount}</span>件商品, 共￥<span className="price">{this.state.totalPrice.toFixed(2)}</span>元</span>
			</div>
			<div className={(this.state.totalCount?'':'disabled') + " right"} onClick={this.__submit}>
				<span>去支付</span>
			</div>
		</div>;
	},
	__onChange: function (state){
		this.setState(state);
	},
	render: function(){
		return (
			<UI.Page
				title="进货"
				className="rt-merchant-createstockorder"
				end={40}
				footerView={this.__footerView()}>
				<CreateOrder isMerchant={true} onChange={this.__onChange} data={this.state.stockData} />
			</UI.Page>
		);
	}
});
