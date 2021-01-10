var React = require('react');

module.exports = React.createClass({
	getInitialState: function() {
		var _initStatus = 0;
    	return {
			status: _initStatus,
			data: Store.post('/hcredwine/my/pagingOrder', {
	            userId: this.props.userId || Session.jsonKeyValue('WAP_LOGIN_USER_TOKEN').id,
				status: _initStatus
	        })
		};
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
	__renderAction: function (data){
		switch (data.status) {
			case 0:
				return <div className="item-foot">
					<span>{data.createTime}</span>
					<div>
						<span className="btn" onClick={()=>this.__onPay(data)}>支付</span>
					</div>
				</div>;
			case 1:
				return <div className="item-foot">
					<span>{data.createTime}</span>
					<span className="btn">查看物流</span>
				</div>;
		}
	},
	__renderStatus: function (status){
		switch (status) {
			case 0:
				return <span className={"status s"+status}>待支付</span>;
			case 1:
				return <span className={"status s"+status}>已支付(待收货)</span>;
			case 2:
				return <span className={"status s"+status}>已发货</span>;
			case 3:
				return <span className={"status s"+status}>已完成</span>;
		}
	},
	__itemRender: function (data){
		return <div className="order-item" >
			<div className="item-head" onClick={()=>Session.jump('/order/info', { code: data.orderCode })}>
				<span>{data.orderCode}</span>
				{this.__renderStatus(data.status)}
			</div>
			<div className="item-body">
				{
					data.products.map(function (product, index){
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
				<div className="total-price">
					<span>共{data.productTotalCount}件商品 合计：￥{data.discountPrice.toFixed(2)}</span>
				</div>
				<div className="total-price">
					<span>总价：￥{data.price.toFixed(2)}</span>
					{data.couponPrice?<span> - ￥{data.couponPrice.toFixed(2)}(代金券抵扣)</span>:null}
				</div>
				<div>
					{data.note}
				</div>
			</div>
			{this.__renderAction(data)}
		</div>;
	},
	__changeStatus: function (value){
		this.setState({
			status: value
		});
		this.state.data.extend({
			status: value
		}).refresh();
	},
	render:function(){
		return (
			<UI.ActivityLayout
				direction="v"
				className="rt-main-order"
				fStyle={{backgroundColor: '#f6f6f6'}}
				begin={68}>
				<div className="header">
					<div className="title">我的订单</div>
					<div className="tabs">
						{
							[
								{
									text: '待支付',
									value: 0
								},
								{
									text: '已支付',
									value: 1
								},
								{
									text: '已发货',
									value: 2
								},
								{
									text: '已完成',
									value: 3
								}
							].map(function (item, index) {
								return <div onClick={()=>this.__changeStatus(item.value)} className={this.state.status==item.value?'curr':''} key={index}>{item.text}</div>;
							}.bind(this))
						}
					</div>
				</div>
				<UI.PagingList className="data-list" data={this.state.data} itemRender={this.__itemRender} />
			</UI.ActivityLayout>
		);
	}
});
