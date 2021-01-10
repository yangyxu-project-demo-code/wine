var React = require('react');

module.exports = React.createClass({
	getInitialState: function() {
    	return {
			hasRead: 0,
			count: 0,
			data: Store.post('/znadmin/model/paging', {
	            model: 'zn_hcredwine_message',
				where: {
					openId: this.props.courierOpenId || Session.jsonKeyValue('WAP_LOGIN_USER_TOKEN').openid,
					hasRead: 0
				},
				order: {
					createTime: 'desc'
				}
	        })
		};
  	},
	__onItemClick: function (data){
		Store.post('/znadmin/model/updateNode', {
			model: 'zn_hcredwine_message',
			data: {
				hasRead: 1
			},
			where: {
				id: data.id
			}
		}).exec().then(function (){
			Session.jump(data.link.split('#')[1]+'&forward=/courier/message');
		});
	},
	__itemRender: function (data){
		var _order = JSON.parse(data.content);
		return <div className={"message-item read-" + data.hasRead} onClick={()=>this.__onItemClick(data)}>
			<div className="head">
				<span>{data.type}</span>
				<span>{data.createTime}</span>
			</div>
			<div className="body">
				<div className="to-address">
					<div className="title">送货地址</div>
					<div className="name">
						<span>{_order.addressName}</span>
						<span>{_order.addressPhone}</span>
					</div>
					<div className="address">
						<span>{_order.province_convert}</span>
						<span>{_order.city_convert}</span>
						<span>{_order.area_convert}</span>
						<span>{_order.addressValue}</span>
					</div>
				</div>
			</div>
			<div className="foot">
				备注：{_order.note}
			</div>
		</div>;
	},
	__onData: function (data){
		this.setState({
			count: data.result[1][0].count
		});
	},
	__changeStatus: function (value){
		this.setState({
			hasRead: value
		});
		this.state.data._data.where.hasRead = value;
		this.state.data.refresh();
	},
	render:function(){
		return (
			<UI.Page title={"我的消息 " + this.state.count + ' 条'}
				className="rt-courier-message" >
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
									text: '未读',
									value: 0
								},
								{
									text: '已读',
									value: 1
								}
							].map(function (item, index) {
								return <div onClick={()=>this.__changeStatus(item.value)} className={this.state.hasRead==item.value?'curr':''} key={index}>{item.text}</div>;
							}.bind(this))
						}
					</div>
					<UI.PagingList onData={this.__onData} data={this.state.data} itemRender={this.__itemRender} />
				</UI.ActivityLayout>
			</UI.Page>
		);
	}
});
