var React = require('react');

module.exports = React.createClass({
	getInitialState: function() {
		var _info = Session.jsonKeyValue('WAP_LOGIN_USER_TOKEN');
    	return {
			data: Store.post('/hcredwine/coupon/selectUserCoupons', {
				openId: _info.openid
			}),
			value: this.props.value||[],
			valuePrice: this.props.valuePrice || 0
		};
  	},
	__onChange: function (value, valuePrice){
		this.props.onChange && this.props.onChange(value, valuePrice);
	},
	__onItemClick: function (item, index){
		if(this.state.value.indexOf(item.id)==-1){
			if(this.props.size==this.state.value.length){
				alert('两瓶抵扣一张，暂时只能抵扣' + this.props.size + '张代金券');
				return false;
			}else {
				this.state.value.push(item.id);
				this.state.valuePrice = this.state.valuePrice + item.price;
			}
		}else {
			this.state.value.splice(this.state.value.indexOf(item.id), 1);
			this.state.valuePrice = this.state.valuePrice - item.price;
		}
		this.__onChange(this.state.value, this.state.valuePrice);
	},
	__itemRender: function (item, index){
		var _isChecked = this.state.value.indexOf(item.id)!=-1;
		return (
			<div onClick={()=>this.__onItemClick(item, index)} className={"coupon-item " + (_isChecked?'curr':'')} >
				<div className="left"></div>
				<div className="title">
					<div>￥<span className="value">{item.price.toFixed(2)}元</span></div>
				</div>
				<div className="valid-time">编码：{item.code}</div>
				<div className="valid-time">激活时间：{item.beginTime}</div>
				<div className="valid-time">截止时间：{item.endTime}</div>
				<div className="valid-time">说明：{item.note}</div>
				<div className="right"></div>
			</div>
		);
	},
	render: function(){
		return (
			<UI.ListView className="rt-order-coupon" data={this.state.data} itemRender={this.__itemRender} />
		);
	}
});
