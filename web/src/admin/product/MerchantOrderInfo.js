var React = require('react');

module.exports = React.createClass({
	getInitialState: function() {
    	return {
			data: null
		};
  	},
	componentDidMount: function(){
		this.__loadInfo();
	},
	__loadInfo: function () {
		Store.post('/hcredwine/merchant/getOrderInfoByCode', {
			code: this.props.orderCode
		}).exec().then(function (data){
			if(this.isMounted()){
				this.setState({
					data: data.result
				});
			}
		}.bind(this));
	},
	__onPay: function (data){
		Store.post('/hcredwine/merchant/payOrder', {
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
				return <span>待支付</span>;
			case 1:
				return <span>已支付</span>;
			case 2:
				return <span>配送中</span>;
			case 3:
				return <span>已完成</span>;
		}
	},
	__onSetExpress: function (info){
		var _expressCode = this.refs.expressCode.value;
		var _self = this;
		if(_expressCode){
			Store.post('/znadmin/model/updateNode', {
				model: 'zn_hcredwine_merchant_order',
				data: {
					status: 2,
					expressCode: _expressCode
				},
				where: {
					orderCode: info.orderCode
				}
			}).exec().then(function (data){
				Toast.success('提交成功');
				info.status = 2;
				info.expressCode = _expressCode;
				_self.setState({
					data: info
				});
				_self.props.onSubmitSuccess && _self.props.onSubmitSuccess();
			});
		}
	},
	__renderExpressCode: function (info){
		if(info.status==1){
			return <div>
				<input ref="expressCode" required={true} name="expressCode" placeholder="填写快递单号" />
				<button onClick={()=>this.__onSetExpress(info)} style={{marginLeft:10}}>确认填写(谨慎：不能修改)</button>
			</div>;
		}
		return info.expressCode;
	},
	renderData: function(){
		var _info = this.state.data;
		return (
			<div className="body">
				<div className="info-title item">
					<div className="header">订单信息</div>
					<div className="info">
						<div className="code">订单编号：   {_info.orderCode}</div>
						<div className="code">快递单号：   {this.__renderExpressCode(_info)}</div>
						<div className="time">下单时间：   {_info.createTime}</div>
						<div className={"status s"+_info.status}>订单状态：   {this.__renderStatus(_info)}</div>
					</div>
				</div>
				<div className="info-address item">
					<div className="header">送货地址</div>
					<div className="title">
						<span>{_info.addressContact}</span>
						<a>{_info.addressPhone}</a>
					</div>
					<div className="info">
						<span>{_info.addressProvince}</span>
						<span>{_info.addressCity}</span>
						<span>{_info.addressArea}</span>
						<span><a>{_info.addressValue}</a></span>
					</div>
				</div>
				<div className="info-products item">
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
					<span>共<span style={{color: 'red'}}>{_info.productTotalCount}</span>件商品 合计：<span style={{color: 'red'}}>￥{_info.price.toFixed(2)}</span></span>
				</div>
				<div className="info-note item">
					备注： {_info.note}
				</div>
			</div>
		);
	},
	render: function (){
		return (
			<div className="rt-order-info">
				{this.state.data?this.renderData():<UI.DataLoader loader="timer" content="加载中..." />}
			</div>
		);
	}
});
