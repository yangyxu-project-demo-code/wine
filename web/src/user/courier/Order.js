var React = require('react');

module.exports = React.createClass({
	getInitialState: function() {
		var _courierOpenId = this.props.courierOpenId || Session.jsonKeyValue('WAP_LOGIN_USER_TOKEN').openid,
			_initStatus = 2,
			_data = Store.post('/hcredwine/courier/pagingOrder', {
	            courierOpenId: _courierOpenId,
				status: _initStatus
	        });
    	return {
			courierOpenId: _courierOpenId,
			status: _initStatus,
			data: _data
		};
  	},
	__renderStatus: function (data){
		switch (data.status) {
			case 2:
				return <span>在派送</span>;
			case 3:
				return <span>已完成</span>;
		}
	},
	__onSignOrder: function (data){
		var _self = this;
		Alert.show({
			width: 280,
			title: '提示',
			content: '确定签收该订单吗？',
			onConfirm: function (){
				Store.post('/hcredwine/order/signOrder', {
					orderCode: data.orderCode,
					openId: _self.state.courierOpenId
				}).exec().then(function (data){
					if(data.status==200){
						_self.state.data.refresh();
					}else {
						alert(data.result);
					}
				});
			}
		});
	},
	__renderAction: function (data){
		switch (data.status) {
			case 2:
				return <div className="item-foot">
					<span className="btn" onClick={()=>this.__onSignOrder(data)} >签收</span>
					<span className="btn" onClick={()=>Session.jump('/order/info?oc='+data.orderCode+'$courier&forward=/courier/order')}>查看</span>
				</div>;
			case 3:
				return <div className="item-foot">
					<span className="btn" onClick={()=>Session.jump('/order/info?oc='+data.orderCode+'$courier&forward=/courier/order')}>查看</span>
				</div>;
		}
	},
	__itemRender: function (data){
		return <div className="courier-order-item">
			<div className="item-head">
				<span>订单号：{data.orderCode}</span>
				<div className={"status s"+data.status}>{this.__renderStatus(data)}</div>
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
					<span>共{data.productTotalCount}件商品 合计：￥{data.price.toFixed(2)}</span>
				</div>
				<div>
					备注：{data.note}
				</div>
			</div>
			{this.__renderAction(data)}
		</div>;
	},
	__onData: function (){

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
			<UI.Page title="我的派送订单"  >
				<UI.ActivityLayout
					direction="v"
					className="rt-main-order"
					fStyle={{backgroundColor: '#f6f6f6'}}
					bStyle={{backgroundColor: '#f9f9f9'}}
					begin={30}>
					<div className="tabs">
						{
							[
								{
									text: '待派送',
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
					<UI.PagingList className="data-list" onData={this.__onData} data={this.state.data} itemRender={this.__itemRender} />
				</UI.ActivityLayout>
			</UI.Page>
		);
	}
});
