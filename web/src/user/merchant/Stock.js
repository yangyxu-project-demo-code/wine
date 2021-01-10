var React = require('react');

module.exports = React.createClass({
	getInitialState: function() {
		var _token = Session.jsonKeyValue('WAP_LOGIN_USER_TOKEN');
    	return {
			stockData: Store.post('/hcredwine/merchant/pagingStock', {
				merchantId: _token.merchantId
			}),
			products:[],
			totalCount: 0,
			totalPrice: 0
		};
  	},
	__submit: function (){
		Session.jump('/merchant/createStockOrder');
	},
	__footerView: function (){
		return <div className="footer">
			<div className="left" style={{textAlign:'left',padding:5, color:'#800010', fontWeight: 'bold'}}>
				<span>注：系统会自动发货到已认证地址</span>
			</div>
			<div className="right" onClick={this.__submit}>
				<span>去进货</span>
			</div>
		</div>;
	},
	__onTableValueChange: function (){
		var _values = this.refs.table.getValue(),
			_count = 0, _price = 0;
			return;
		_values.map(function (value){
			_count += (value.count?value.count:0);
			_price += (value.price?value.price:0);
		});
		this.setState({
			totalCount: _count,
			totalPrice: _price
		});
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
			this.state.products[index].totalPrice = this.state.products[index].count * this.state.products[index].price;
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
			_totalCount += product.count;
			_totalPrice += product.totalPrice;
		});
		this.state.totalCount = _totalCount;
		this.state.totalPrice = _totalPrice;
	},
	__itemRender: function (data, index){
		if(!this.state.products[index]){
			this.state.products.push({
				productId: data.productId,
				price: data.productPrice,
				count: 0
			});
		}

		return <div className="order-product-item">
			<img className="logo" src={Store.fixURL(data.productLogo)} />
			<div className="info">
				<div className="title">{data.productTitle}</div>
				<div className="detail">
					<span className="price">￥{(data.productPrice).toFixed(2)}/{data.productUnit}</span>
				</div>
			</div>
			{
				/*
				<div className="action">
					<span className="btn" onClick={()=>this.__onMinusClick(data, index)}><i className="fa fa-minus" /></span>
					<input className="count" onChange={(event)=>this.__onCountChange(event, data, index)} type="number" value={this.state.products[index].count} />
					<span className="btn" onClick={()=>this.__onPlusClick(data, index)}><i className="fa fa-plus" /></span>
				</div>
				*/
			}
			<div className="stock">
				<div>库存 / {data.productUnit}</div>
				<div className="count">{data.count}</div>
			</div>
		</div>;
	},
	render: function(){
		return (
			<UI.Page
				title="库存"
				className="rt-merchant-stock"
				end={40}
				footerView={this.__footerView()}>
				<UI.PagingList className="data-list" onData={this.__onData} data={this.state.stockData} itemRender={this.__itemRender} />
			</UI.Page>
		);
	}
});
