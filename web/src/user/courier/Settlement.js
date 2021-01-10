var React = require('react');

module.exports = React.createClass({
	getInitialState: function() {
		var _token = Session.jsonKeyValue('WAP_LOGIN_USER_TOKEN');
		var _initType = 1;
    	return {
			openId: _token.openid,
			info: null,
			value: 0,
			type: _initType,
			data: Store.post('/hcredwine/courier/pagingSettlement', {
				openId: _token.openid,
				type: _initType
			})
		};
  	},
	componentDidMount: function (){
		this.__loadMerchantInfo();
	},
	__loadMerchantInfo: function (){
		Store.post('/znadmin/model/selectOne', {
			model: 'zn_hcredwine_courier',
			where: {
				openId: this.state.openId
			}
		}).exec().then(function (data){
			this.setState({
				info: data.result
			});
		}.bind(this));
	},
	__submit: function (){
		if(this.state.value){
			Store.post('/hcredwine/courier/withdraw', {
				openId: this.state.openId,
				value: this.state.value
			}).exec().then(function (data){
				this.__changeType(-1);
			}.bind(this));
		}
	},
	__onCountChange: function (event, data, index){
		var _value = (+event.target.value).toFixed(0);
		if(_value<this.state.info.salary){
			this.state.value = _value;
		}else {
			this.state.value = this.state.info.salary;
		}

		this.forceUpdate();
	},
	__footerView: function (){
		var _info = this.state.info;
		if(_info){
			return <div className="footer">
				<div className="left" style={{textAlign:'left',padding:5, color:'#800010', fontWeight: 'bold'}}>
					<input className="count" onChange={(event)=>this.__onCountChange(event)} type="number" value={this.state.value} />
				</div>
				<div className="right" onClick={this.__submit} >
					<span>申请提现</span>
					<span>额度 {_info.salary} 元</span>
				</div>
			</div>;
		}
		return null;
	},
	__onData: function (){

	},
	__itemRender: function (data, index){
		return <div className="settlement-item">
			<div>{data.type==1?'+':'-'}{data.value}￥</div>
			<div>{data.createTime}</div>
		</div>;
	},
	__changeType: function (value){
		this.setState({
			type: value
		});
		this.state.data.extend({
			type: value
		}).refresh();
	},
	render: function(){
		return (
			<UI.Page
				title="订单结算"
				className="rt-merchant-settlement"
				end={40}
				footerView={this.__footerView()}>
				<UI.ActivityLayout
					direction="v"
					fStyle={{backgroundColor: '#f6f6f6'}}
					bStyle={{backgroundColor: '#f9f9f9'}}
					begin={30}>
					<div className="tabs">
						{
							[
								{
									text: '收入',
									value: 1
								},
								{
									text: '提现',
									value: -1
								}
							].map(function (item, index) {
								return <div onClick={()=>this.__changeType(item.value)} className={this.state.type==item.value?'curr':''} key={index}>{item.text}</div>;
							}.bind(this))
						}
					</div>
					<UI.PagingList onData={this.__onData} data={this.state.data} itemRender={this.__itemRender} />
				</UI.ActivityLayout>
			</UI.Page>
		);
	}
});
