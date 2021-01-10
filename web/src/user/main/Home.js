var React = require('react');
var CreateOrder = require('../merchant/CreateOrder.js');

module.exports = React.createClass({
	getInitialState: function() {
		var _state = Session.getKeyValue('state');
    	return {
			merchant: {},
			merchantId: _state,
			products: [],
			totalCount: 0,
			totalPrice: 0,
			data: Store.post('/hcredwine/merchant/pagingStock', {
				merchantId: _state
			})
		};
  	},
	componentDidMount: function(){
		this.__loadData();
	},
	__loadData: function (){
        Store.post('/znadmin/model/selectOne', {
			model: 'zn_hcredwine_merchant',
			where: {
				id: this.state.merchantId
			}
		}).exec().then(function (data){
			if(this.isMounted()){
				this.setState({
	                merchant: data.result
	            });
			}
        }.bind(this));
    },
	__submit: function (){
		if(this.state.totalCount>1){
			var _products = [];
			this.state.products.map(function (product, index){
				if(product.count){
					_products.push(product);
				}
			});
			Session.setKeyValue('SHOPPING_CART', {
				products: _products,
				totalCount: this.state.totalCount,
				totalPrice: this.state.totalPrice,
			});
			Session.jump('/order/createhome');
		}
	},
	__onChange: function (state){
		this.setState(state);
	},
	__onFollow: function (){
		Popup.dialog({
			title: '关注公众号有惊喜',
			top: 50,
			content: <div>
				<div style={{textAlign: 'center'}}><img style={{width:128, height: 128}} src="./images/qrcode_for_gh_87884e7d895a_344.jpg" /></div>
				<div style={{textAlign: 'center', padding: 4, fontSize:12, fontWeight:'bold'}}>长按图片 ”识别图中二维码” 关注我们</div>
				<div style={{textAlign: 'center', fontSize:12}}>惊喜等你来！</div>
			</div>
		});
	},
	render:function(){
		var _role = (Session.jsonKeyValue('WAP_LOGIN_USER_TOKEN')||{}).role;
		return (
			<UI.FixedLayout
				direction="v"
				className="rt-home"
				bStyle={{backgroundColor: '#FFF'}}
				begin={60}
				end={40}>
				<div className="gt-header">
					<div className="header">
						<a style={{width: 80, textAlign:'left'}} className="btn" onClick={this.__onFollow}>关注有礼</a>
						<span className="title">{this.state.merchant.title}</span>
						{!_role?<a style={{width: 80, textAlign:'left'}} href="#/join/index" className="btn">我要加盟</a>:<a style={{width: 100}}></a>}
					</div>
					<div className="tips">
						<div>
							<a href="#/merchant/info">企业文化</a>
						</div>
						<div>
							<a href={"tel:" + this.state.merchant.phone}><i className="fa fa-volume-control-phone" /><span>{this.state.merchant.phone}</span></a>
						</div>
					</div>
				</div>
				<div className="gt-body">
					<CreateOrder onChange={this.__onChange} data={this.state.data} />
				</div>
				<div className="gt-footer">
					<div className="left">
						<span>合计<span className="count">{+this.state.totalCount}</span>(<span style={{fontSize:8}}>两瓶起售</span>)件商品, 共￥<span className="price">{this.state.totalPrice.toFixed(2)}</span>元</span>
					</div>
					<div className={(this.state.totalCount>1?'':'disabled') + " right"} onClick={this.__submit}>
						<span>去支付</span>
					</div>
				</div>
			</UI.FixedLayout>
		);
	}
});
