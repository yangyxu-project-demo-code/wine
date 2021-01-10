var React = require('react');
var AddressBook = require('./AddressBook.js');
var Coupon = require('./Coupon.js');

module.exports = React.createClass({
	getInitialState: function() {
		var _info = (Session.jsonKeyValue('WAP_LOGIN_USER_TOKEN')||{});
		var _userId = _info.id;
		var _shoppingCart = Session.jsonKeyValue('SHOPPING_CART');
		return {
			loading: false,
			coupons: [],
			couponPrice: 0,
			address: null,
			totalCount: _shoppingCart.totalCount,
			totalPrice: _shoppingCart.totalPrice,
			products: _shoppingCart.products,
			userId: _userId,
			userOpenId: _info.openid
		};
  	},
	componentDidMount: function(){
		this.__loadInfo();
	},
	__loadInfo: function () {
		if(this.state.userId){
			Store.post('/znadmin/model/selectOne', {
				model: 'zn_hcredwine_user_address',
				fields: [
					'id',
					'phone',
					'zn_convert_var(province) as province',
					'zn_convert_var(city) as city',
					'zn_convert_var(area) as area',
					'address',
				],
				where: {
					userId: this.state.userId,
					isDefault: 1
				}
			}).exec().then(function (data){
				if(data.status==200){
					this.setState({
						address: data.result
					});
				}
			}.bind(this));
		}else {
			alert('亲，不好意思，您请求页面出错了~~');
			window.history.back();
		}
	},
	__onSubmit: function (){
		if(!this.state.address){
			return Toast.error('请选择地址');
		}

		if((this.state.totalPrice - this.state.couponPrice)<0){
			return alert("订单总价不能小于0！"), false;
		}

		if(this.state.loading){
			return false;
		}
		var _self = this,
			_restaurant = Session.jsonKeyValue('restaurant')||{};
		this.setState({
			loading: true
		});
		Store.post('/hcredwine/order/create', {
			userId: this.state.userId,
			addressId: this.state.address.id,
			merchantId: Session.getKeyValue('state'),
			restaurantId: _restaurant.id||0,
			products: this.state.products,
			coupons: this.state.coupons.join(','),
			couponPrice: this.state.couponPrice,
			note: this.refs.note.getValue()
		}).exec().then(function (data){
			if(data.status!=200){
				Toast.error(data.result);
			}else {
				_self.__onPay(data.result);
			}
			_self.setState({
				loading: false
			});
		}, function (data){
			Toast.success('提交失败');
		});
	},
	__onPay: function (orderCode){
		Store.post('/hcredwine/order/payOrder', {
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
	__onSelectCoupon: function () {
		Popup.dialog({
			title: '选择优惠券',
			top: 50,
			content: <Coupon valuePrice={this.state.couponPrice} value={this.state.coupons} onChange={this.__onCouponChange} size={Math.floor(this.state.totalCount/2)} onChange={this.__onCouponChange} />
		});
	},
	__onCouponChange: function (value, valuePrice){
		this.setState({
			coupons: value,
			couponPrice: valuePrice
		});
	},
	__toAddress: function (){
		Popup.close('dialog');
		Session.jump('/my/address');
	},
	__getTitle: function (){
		return <div>
			<span>选择收货地址</span>
			<a href="javascript:void(0);" onClick={this.__toAddress} style={{marginLeft: 10,fontSize:14}}>管理收货地址</a>
		</div>;
	},
	__onSelectAddress: function () {
		Popup.dialog({
			title: this.__getTitle(),
			top: 50,
			content: <AddressBook value={this.state.address} userId={this.state.userId} onChange={this.__onAddressChange} />
		});
	},
	__onAddressChange: function (value){
		this.setState({
			address: value
		});
		Popup.close('dialog');
	},
	__renderContent: function(){
		if(!this.state.products){
			return <UI.DataLoader loader="timer" content="正在努力加载数据中..." />;
		}

		var _products = this.state.products||[],
			_address = this.state.address;

		return (
			<UI.ActivityLayout
				direction="v"
				className="rt-order-create-home"
				hStyle={{backgroundColor: '#f6f5f5'}}
				end={40}>
				<div className="container">
					<div className="address">
						<i className="fa fa-map-marker" />
						{_address?<div className="address-info" onClick={this.__onSelectAddress}>
							<div>
								<span>收货人：{_address.name}</span>
								<span>{_address.phone}</span>
							</div>
							<div>
								<span>地址：{_address.province} {_address.city} {_address.area} {_address.address}</span>
							</div>
						</div>:<a href="#/my/address">添加收货地址</a>}
						<i className="fa fa-angle-right" />
					</div>
					<div className="product">
						<div>
							{
								_products.map(function (product, index){
									return <div className="info" key={index}>
										<img className="logo" src={Store.fixURL(product.productLogo)} />
										<div className="right">
											<div className="title">{product.productTitle}</div>
											<div className="ext">
												<span className="price">￥{product.price.toFixed(2)}/瓶</span>
												<span className="count">x{product.count}</span>
											</div>
										</div>
									</div>;
								})
							}
						</div>
						<ul className="exts">
							<li onClick={this.__onSelectCoupon}>
								<span>优惠券</span>
								<div>
									{this.state.coupons.length?<span>已选择{this.state.coupons.length}张代金券</span>:<span>未选择代金券</span>}
								</div>
							</li>
							<li>
								<span>买家留言</span>
								<UI.Input style={{ marginLeft: 10, flex: 1 }} ref="note" name="note" />
							</li>
							<li>
								<span>合计</span>
								<span>总价 ￥{(this.state.totalPrice).toFixed(2)} - 抵扣优惠券 ￥{(this.state.couponPrice).toFixed(2)}</span>
							</li>
						</ul>
					</div>
				</div>
				<div className="action">
					<div className="price">
						<span>总价：</span>
						<span className="price-value">{(this.state.totalPrice - this.state.couponPrice).toFixed(2) + '元'}</span>
					</div>
					<div className="apply" onClick={this.__onSubmit}>
						<span>提交订单</span>
					</div>
				</div>
			</UI.ActivityLayout>
		);
	},
	render: function (){
		return (
			<UI.Page title="确认订单" >
				{this.__renderContent()}
			</UI.Page>
		);
	}
});
