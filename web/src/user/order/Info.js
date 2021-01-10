var React = require('react');

module.exports = React.createClass({
	getInitialState: function() {
		var _role = this.props.request.search.role;
		var _code = this.props.request.search.oc || this.props.request.search.code;
		var _codeAry = _code.split('$');
		_role = _role||_codeAry[1];
    	return {
			orderCode: _codeAry[0],
			role: _role,
			openId: Session.jsonKeyValue('WAP_LOGIN_USER_TOKEN').openid,
			data: null
		};
  	},
	componentDidMount: function(){
		if(this.props.request.search.callback){
			setTimeout(this.__loadInfo, 3000);
		}else {
			this.__loadInfo();
		}
	},
	__loadInfo: function () {
		Store.post('/hcredwine/order/getOrderInfoByCode', {
			code: this.state.orderCode
		}).exec().then(function (data){
			if(this.isMounted()){
				this.setState({
					data: data.result
				});
			}
		}.bind(this));
	},
	__onPay: function (data){
		Store.post('/hcredwine/order/payOrder', {
			orderCode: data.orderCode
		}).exec().then(function (data){
			var _result = data.result;
			if(_result.token_id){
				window.location.href ='https://pay.swiftpass.cn/pay/jspay?token_id=' + _result.token_id + '&showwxtitle=1';
			}else {
				alert(_result.err_msg);
			}
		});
	},
	__renderStatus: function (info){
		switch (info.status) {
			case 0:
				return <span>
					待支付
					<a onClick={()=>this.__onPay(info)} className="pay">去支付</a>
				</span>;
			case 1:
				return <span>已支付</span>;
			case 2:
				return <span>配送中</span>;
			case 3:
				return <span>已签收</span>;
		}
	},
	__renderGetAddress: function (info){
		var _role = this.state.role;
		if((_role=='merchant'||_role=='courier')&&info.merchant){
			var _merchant = info.merchant;
			return (
				<div className="info-address item">
					<div className="head">
						取货地址
					</div>
					<div>
						<div className="title">
							<span>{_merchant.title}</span>
							<a href={'tel: '+_merchant.phone}>{_merchant.phone}</a>
						</div>
						<div className="info">
							<span>{_merchant.province_convert}</span>
							<span>{_merchant.city_convert}</span>
							<span>{_merchant.area_convert}</span>
							<span><a>{_merchant.address}</a></span>
						</div>
					</div>
				</div>
			);
		}

		return null;
	},
	__renderCourier: function (info){
		if(info.courier){
			var _courier = info.courier;
			return (
				<div className="info-address item">
					<div className="head">
						派送员
					</div>
					<div>
						<div className="title">
							<span>{_courier.name}</span>
							<a href={'tel: '+_courier.phone}>{_courier.phone}</a>
						</div>
						<div className="info">
							<span>{_courier.province_convert}</span>
							<span>{_courier.city_convert}</span>
							<span>{_courier.area_convert}</span>
							<span><a>{_courier.address}</a></span>
						</div>
					</div>
				</div>
			);
		}

		return null;
	},
	renderData: function(){
		var _info = this.state.data;
		return (
			<div className="body">
				<div className="info-title item">
					<div className="title">订单信息</div>
					<div className="info">
						<div className="code">订单编号：   {_info.orderCode}</div>
						<div className="time">下单时间：   {_info.createTime}</div>
						<div className={"status s"+_info.status}>订单状态：   {this.__renderStatus(_info)}</div>
					</div>
				</div>
				{this.__renderCourier(_info)}
				{this.__renderGetAddress(_info)}
				<div className="info-address item">
					<div className="head">
						送货地址
					</div>
					<div>
						<div className="title">
							<span>{_info.addressName}</span>
							<a href={'tel: '+_info.addressPhone}>{_info.addressPhone}</a>
						</div>
						<div className="info">
							<span>{_info.addressProvince}</span>
							<span>{_info.addressCity}</span>
							<span>{_info.addressArea}</span>
							<span><a>{_info.addressValue}</a></span>
						</div>
					</div>
				</div>
				<div className="info-products item">
					<div className="head">
						商品详情
					</div>
					{
						_info.products.map(function (product, index){
							return <div className="order-product-item" key={index}>
								<img className="logo" src={Store.fixURL(product.productLogo)} />
								<div className="detail">
									<div className="title">{product.productTitle}</div>
									<div className="price">
										<span>￥{product.price.toFixed(2)}/瓶</span>
										<span>x{product.count}</span>
									</div>
								</div>
							</div>;
						})
					}
				</div>
				<div className="info-price item">
					<span>共<span style={{color: 'red'}}>{_info.productTotalCount}</span>件商品 合计：<span style={{color: 'red'}}>￥{_info.discountPrice.toFixed(2)}</span></span>
				</div>
				<div className="info-price item">
					<span>总价：<span style={{color: 'red'}}>￥{_info.price.toFixed(2)}</span> - <span style={{color: 'red'}}>￥{_info.couponPrice.toFixed(2)}(代金券抵扣)</span></span>
				</div>
				<div className="info-note item">
					备注： {_info.note}
				</div>
			</div>
		);
	},
	__onVieOrder: function (){
		var _self = this;
		Store.post('/hcredwine/order/vieOrder', {
			orderCode: this.state.data.orderCode,
			openId: this.state.openId
		}).exec().then(function (data){
			if(data.status==200){
				_self.__loadInfo();
			}else {
				alert(data.result);
			}
		});
	},
	__onSignOrder: function (){
		var _self = this;
		Store.post('/hcredwine/order/signOrder', {
			orderCode: this.state.data.orderCode,
			openId: this.state.openId
		}).exec().then(function (data){
			if(data.status==200){
				_self.__loadInfo();
			}else {
				alert(data.result);
			}
		});
	},
	__renderFooter: function (){
		if(this.state.role=='courier'){
			if(this.state.data){
				switch (this.state.data.status) {
					case 1:
						if(!this.state.data.courierOpenId){
							return <div className="foot">
								<UI.Button text="抢单" onClick={this.__onVieOrder} />
							</div>;
						}
						break;
					case 2:
						if(this.state.data.courierOpenId==this.state.openId){
							return <div className="foot">
								<UI.Button text="签收" onClick={this.__onSignOrder} />
							</div>;
						}
						break;
				}
			}
		}

		return null;
	},
	__onBack: function (){
		var _forward = this.props.request.search.forward;
		if(!_forward){
			_forward = '/main/order';
		}
		return Session.jump(_forward), false;
	},
	render: function (){
		return <UI.Page
			onBack={this.__onBack}
			className="rt-order-info"
			bStyle={{backgroundColor: '#f6f6f6'}}
			footerView={this.__renderFooter()}
			end={(this.state.data?42:0)}
			title="订单详情" >
			{
				this.state.data?this.renderData():<UI.DataLoader loader="timer" content="加载中..." />
			}
		</UI.Page>
	}
});
