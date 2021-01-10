var React = require('react');

module.exports = React.createClass({
	getDefaultProps: function (){
		return {
			data: null
		};
	},
	getInitialState: function() {
    	return {
			products:[],
			totalCount: 0,
			totalPrice: 0
		};
  	},
	__footerView: function (){
		return <div className="footer">
			<div className="left">
				<span>合计<span className="count">{+this.state.totalCount}</span>件商品, 共￥<span className="price">{this.state.totalPrice.toFixed(2)}</span>元</span>
			</div>
			<div className="right" onClick={this.__submit}>
				<span>确认下单</span>
			</div>
		</div>;
	},
	__onData: function (){

	},
	__onMinusClick: function (data, index){
		if(this.state.products[index].count!=0){
			this.state.products[index].count--;
			this.state.products[index].totalPrice = this.state.products[index].count * this.state.products[index].price;
			this.__calculate();
			this.forceUpdate();
		}
	},
	__onPlusClick: function (data, index){
		if(this.state.products[index].count<data.count){
			this.state.products[index].count++;
			this.state.products[index].totalPrice = (+(this.state.products[index].count||0)) * (+(this.state.products[index].price||0));
			this.__calculate();
			this.forceUpdate();
		}
	},
	__onCountChange: function (event, data, index){
		var _value = (+event.target.value).toFixed(0);
		if(_value<data.count+1){
			this.state.products[index].count = _value;
			this.state.products[index].totalPrice = _value * this.state.products[index].price;
			this.__calculate();
			this.forceUpdate();
		}else {

		}
	},
	__calculate: function (){
		var _totalCount = 0,
			_totalPrice = 0;
		this.state.products.forEach(function (product){
			_totalCount += +(product.count||0);
			_totalPrice += +(product.totalPrice||0);
		});
		this.state.totalCount = _totalCount;
		this.state.totalPrice = _totalPrice;
		this.props.onChange && this.props.onChange(this.state);
	},
	__itemRender: function (data, index){
		if(!this.state.products[index]){
			var _price = data.productPrice;
			if(this.props.isMerchant&&data.productProxyPrice){
				_price = data.productProxyPrice;
			}
			this.state.products.push({
				productTitle: data.productTitle,
				productLogo: data.productLogo,
				productId: data.productId,
				price: _price||0,
				count: 0
			});
		}

		return <div className="order-product-item">
			<img className="logo" src={Store.fixURL(data.productLogo)}  onClick={()=>Session.jump('/product/info', { productId: data.productId })} />
			<div className="info" onClick={()=>Session.jump('/product/info', { productId: data.productId })}>
				<div className="title">{data.productTitle}</div>
				<div className="detail">
					<span className="price">零售价：￥{(data.productPrice).toFixed(2)}/{data.productUnit}</span>
					{this.props.isMerchant&&<span className="price">代理价：￥{(data.productProxyPrice).toFixed(2)}/{data.productUnit}</span>}
					<span className="count">库存：{data.count} {data.productUnit}</span>
				</div>
			</div>
			<div className="action">
				<span className="btn" onClick={()=>this.__onMinusClick(data, index)}><i className="fa fa-minus" /></span>
				<input className="count" onChange={(event)=>this.__onCountChange(event, data, index)} type="number" value={this.state.products[index].count} />
				<span className="btn" onClick={()=>this.__onPlusClick(data, index)}><i className="fa fa-plus" /></span>
			</div>
		</div>;
	},
	render: function(){
		return (
			<UI.PagingList className="rt-merchant-createorder" onData={this.__onData} data={this.props.data} itemRender={this.__itemRender} />
		);
	}
});
