var React = require('react');

module.exports = React.createClass({
	getInitialState: function() {
    	return {
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
		Store.post('/hcredwine/merchant/getOrderInfoByCode', {
			code: this.props.request.search.oc
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
	renderData: function(){
		var _info = this.state.data;
		return (
			<div className="body">
				<div className="info-title item">
					<div className="header">订单信息</div>
					<div className="info">
						<div className="code">订单编号：   {_info.orderCode}</div>
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
	__onBack: function (){
		if(this.props.request.search.callback){
			return Session.jump('/main/my'), false;
		}
	},
	render: function (){
		return <UI.Page
			onBack={this.__onBack}
			className="rt-order-info"
			bStyle={{backgroundColor: '#f6f6f6'}}
			title="订单详情" >
			{
				this.state.data?this.renderData():<UI.DataLoader loader="timer" content="加载中..." />
			}
		</UI.Page>
	}
});
