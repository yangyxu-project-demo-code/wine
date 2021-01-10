var React = require('react');
var QRCode = require('qrcode.react');

module.exports = React.createClass({
	getInitialState: function() {
		var _token = Session.jsonKeyValue('WAP_LOGIN_USER_TOKEN');
    	return {
			data: Store.post('/hcredwine/merchant/getMerchantAuthorizeURL')
		};
  	},
	__submit: function (){
		Session.jump('/merchant/createStockOrder');
	},
	__footerView: function (){
		return <div className="footer">
			<div className="left">
				<span>合计<span className="count">{+this.state.totalCount}</span>件商品, 共￥<span className="price">{this.state.totalPrice.toFixed(2)}</span>元</span>
			</div>
			<div className="right" onClick={this.__submit}>
				<span>去进货</span>
			</div>
		</div>;
	},
	__itemRender: function (data, index){
		return <div className="order-product-item">
			<QRCode value={data.link} />
			<a href={data.link}>{data.title}</a>
		</div>;
	},
	render: function(){
		return (
			<UI.Page
				title="代理商列表"
				canBack={false}
				className="rt-merchant-stock">
				<UI.ListView className="data-list" data={this.state.data} itemRender={this.__itemRender} />
			</UI.Page>
		);
	}
});
