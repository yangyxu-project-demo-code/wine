var React = require('react');

var AddressBook = require('./AddressBook.js');
var Coupon = require('./Coupon.js');

module.exports = React.createClass({
	getInitialState: function() {
		var _search = this.props.request.search;
		var _userId = (Session.jsonKeyValue('WAP_LOGIN_USER_TOKEN')||{}).id;
		return {
			userId: _userId,
			productId: _search.pid || 1,
			product: null,
			address: null,
			totalCount: 0
		};
  	},
	componentDidMount: function(){
		this.__loadInfo();
	},
	__loadInfo: function () {
		if(this.state.userId&&this.state.productId){
			Store.post('/hcredwine/order/getPreOrderInfo', {
				userId: this.state.userId,
				productId: this.state.productId
			}).exec().then(function (data){
				if(data.status==200){
					var _data = data.result,
						_address = _data[0],
						_product = _data[1];
					_product.count = 1;
					_product.total = _product.count * _product.price;
					this.setState({
						address: _address,
						product: _product,
						totalCount: _product.total
					});
				}else {
					alert('亲，不好意思，该商品已经卖完了~~');
				}
			}.bind(this));
		}else {
			alert('亲，不好意思，您请求页面出错了~~');
			//window.history.back();
		}
	},
	__onSubmit: function (){
		if(!this.state.address){
			return Toast.error('请选择地址');
		}
		var _self = this;
		Store.post('/hcredwine/order/create', {
			userId: this.state.userId,
			addressId: this.state.address.id,
			merchantId: Session.getKeyValue('state'),
			products: [
				this.state.product
			],
			note: this.refs.note.getValue()
		}).exec().then(function (data){
			if(data.status!=200){
				alert(data.result);
			}else {
				_self.__onPay(data.result);
			}
		}, function (data){
			alert(data);
		})
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
	__onChangeCount: function (value){
		var _product = this.state.product;
		_product.count = _product.count + value;
		_product.total = _product.count * _product.price;
		this.setState({
			totalCount: _product.total,
			product: this.state.product
		});
	},
	__onSelectCoupon: function () {
		Popup.dialog({
			title: '选择优惠券',
			top: 50,
			content: <Coupon userId={this.state.userId} onChange={this.__onCouponChange} />
		});
	},
	__onCouponChange: function (value){
		this.setState({
			coupons: value
		});
		Popup.close('dialog');
	},
	__toAddress: function (){
		Popup.close('dialog');
		Session.jump('/my/address');
	},
	__getTitle: function (){
		return <div>
			<span>选择收货地址</span>
			<a  href="javascript:void(0);" onClick={this.__toAddress} style={{marginLeft: 10,fontSize:14}}>管理收货地址</a>
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
		if(!this.state.product){
			return <UI.DataLoader loader="timer" content="正在努力加载数据中..." />;
		}

		var _product = this.state.product||{},
			_address = this.state.address;

		return (
			<UI.ActivityLayout
				direction="v"
				className="rt-order-create"
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
						<div className="info">
							<img className="logo" src={Store.fixURL(_product.logo)} />
							<div className="right">
								<div className="title">{_product.title}</div>
								<div className="ext">
									<span className="price">￥{_product.price.toFixed(2)}/{_product.unit}</span>
									<span className="count">x{_product.count}</span>
								</div>
							</div>
						</div>
						<ul className="exts">
							<li>
								<span>购买数量</span>
								<div>
									<span className="btn" onClick={()=>this.__onChangeCount(-1)}>-</span>
									<span className="count-value">{_product.count}</span>
									<span className="btn" onClick={()=>this.__onChangeCount(1)}>+</span>
								</div>
							</li>
							<li onClick={this.__onSelectCoupon}>
								<span>优惠券</span>
								<div>
									暂无优惠券
								</div>
							</li>
							<li>
								<span>买家留言</span>
								<UI.Input style={{ marginLeft: 10, flex: 1 }} ref="note" name="note" />
							</li>
						</ul>
					</div>
				</div>
				<div className="action">
					<div className="price">合计：<span className="price-value">￥{this.state.totalCount.toFixed(2)}</span></div>
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
