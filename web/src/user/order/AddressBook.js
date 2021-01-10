var React = require('react');

module.exports = React.createClass({
	getInitialState: function() {
		var _info = Session.jsonKeyValue('WAP_LOGIN_USER_TOKEN');
    	return {
			data: Store.post('/znadmin/model/select', {
				model: 'zn_hcredwine_user_address',
				where: { userId: _info.id }
			})
		};
  	},
	__onChange: function (value){
		value.province = value.province_convert;
		value.city = value.city_convert;
		value.area = value.area_convert;
		this.props.onChange && this.props.onChange(value);
	},
	__itemRender: function (item, index){
		var _isCurr = +item.isDefault;
		if(this.props.value){
			_isCurr = this.props.value.id == item.id;
		}
		return (
			<div onClick={()=>this.__onChange(item, index)} className={"address-item " + (_isCurr?'rt-curr-style':'')} >
				<div className="info">
					<span>{item.name}</span>
					<span>{item.phone}</span>
				</div>
				<div className="address">
					<span>{item.province_convert}</span>
					<span>{item.city_convert}</span>
					<span>{item.area_convert}</span>
					<span>{item.address}</span>
				</div>
			</div>
		);
	},
	render:function(){
		return (
			<UI.ListView className="rt-address" data={this.state.data} itemRender={this.__itemRender} />
		);
	}
});
