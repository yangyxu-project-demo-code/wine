var React = require('react');

module.exports = React.createClass({
	getDefaultProps: function (){
		return {
			model: 'zn_hcredwine_user_coupon'
		};
	},
	getInitialState: function() {
		var _session = Session.jsonKeyValue('WAP_LOGIN_USER_TOKEN');
    	return {
			status: 0,
			data: Store.post('/znadmin/model/paging', {
				model: this.props.model,
				where: { toUserOpenId: _session.openid, status: 0 }
			})
		};
  	},
	__onRemove: function (data){
		var _self = this;
		Alert.show({
			title: '提示',
			content: '确定删除该优惠券吗？',
			onConfirm: function (){
				Store.post('/znadmin/model/delete', {
					model: _self.props.model,
					where: {
						id: data.id
					}
				}).exec().then(function (data){
					Toast.success('删除成功！');
					_self.state.data.refresh();
				});
			}
		});
	},
	__itemRender: function (item, index){
		return (
			<div className={"coupon-item s"+item.status} >
				<div className="title">￥<span className="value">{item.price.toFixed(2)}元</span></div>
				<div className="valid-time">
					<div className="code">代金券：{item.code}</div>
					<div>状态：{item.status==0?<span>未使用</span>:<span>已使用</span>}</div>
					<div>创建时间：{item.createTime}</div>
					<div>有效期：</div>
					<div>{item.beginTime} ~ {item.endTime}</div>
				</div>
			</div>
		);
	},
	__onData: function (){

	},
	__changeStatus: function (value){
		this.setState({
			status: value
		});
		this.state.data._data.where.status = value;
		this.state.data.refresh();
	},
	render:function(){
		return (
			<UI.Page title="我的优惠券" className="rt-order-coupon rt-my-coupon" >
				<UI.ActivityLayout
					direction="v"
					fStyle={{backgroundColor: '#f6f6f6'}}
					bStyle={{backgroundColor: '#f9f9f9'}}
					begin={30}>
					<div className="tabs">
						{
							[
								{
									text: '未使用',
									value: 0
								},
								{
									text: '已使用',
									value: 1
								}
							].map(function (item, index) {
								return <div onClick={()=>this.__changeStatus(item.value)} className={this.state.status==item.value?'curr':''} key={index}>{item.text}</div>;
							}.bind(this))
						}
					</div>
					<UI.PagingList onData={this.__onData} data={this.state.data} itemRender={this.__itemRender} />
				</UI.ActivityLayout>
			</UI.Page>
		);
	}
});
