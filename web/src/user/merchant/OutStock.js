var React = require('react');

module.exports = React.createClass({
	getInitialState: function() {
		var _token = Session.jsonKeyValue('WAP_LOGIN_USER_TOKEN'),
			_initStatus = 1;
    	return {
			status: _initStatus,
			data: Store.post('/hcredwine/merchant/pagingOutStockOrder', {
	            merchantId: _token.merchantId,
				status: _initStatus
	        })
		};
  	},
	__renderAction: function (data){
		switch (data.status) {
			case 0:
			case 1:
			case 2:
			case 3:
				return <div className="item-foot">
					<span>{data.createTime}</span>
					<span className="btn"></span>
				</div>;
		}
	},
	__renderStatus: function (status){
		switch (status) {
			case 0:
				return <span className={"status s"+status}>待支付</span>;
			case 1:
				return <span className={"status s"+status}>已支付</span>;
			case 2:
				return <span className={"status s"+status}>待收货</span>;
			case 3:
				return <span className={"status s"+status}>已完成</span>;
		}
	},
	__itemRender: function (data){
		return <div className="order-item" onClick={()=>Session.jump('/order/info?oc='+data.orderCode+'$merchant&forward=/merchant/outstock')}>
			<div className="item-head">
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
					<span>共{data.productTotalCount}件商品 合计：￥{data.price.toFixed(2)}</span>
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
	__onBack: function (){
		return Session.jump('/main/my'), false;
	},
	render:function(){
		return (
			<UI.Page onBack={this.__onBack} title="卖出订单" bStyle={{backgroundColor: '#f6f6f6'}} className="rt-merchant-instock" >
				<UI.ActivityLayout
					direction="v"
					fStyle={{backgroundColor: '#f6f6f6'}}
					bStyle={{backgroundColor: '#f9f9f9'}}
					begin={30}>
					<div className="tabs">
						{
							[
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
								},
								{
									text: '待支付',
									value: 0
								}
							].map(function (item, index) {
								return <div onClick={()=>this.__changeStatus(item.value)} className={this.state.status==item.value?'curr':''} key={index}>{item.text}</div>;
							}.bind(this))
						}
					</div>
					<UI.PagingList data={this.state.data} itemRender={this.__itemRender} />
				</UI.ActivityLayout>
			</UI.Page>
		);
	}
});
