var React = require('react');

var MENU = [
	{
		title: '基本信息',
		icon: 'fa-id-card-o',
		uri: require('./Info.js')
	},
	{
		title: '派送订单',
		icon: 'fa-list-ul',
		uri: require('../../user/courier/Order.js')
	},
	{
		title: '派送消息',
		icon: 'fa-list-ul',
		uri: require('../../user/courier/Message.js')
	}
];

module.exports = React.createClass({
	getInitialState: function (){
		return {
			view: require('./Info.js')
		}
	},
	render: function(){
		var View = this.state.view;
		return (
			<UI.Page title='派送员中心' icon="fa-newspaper-o" >
				<UI.ActivityLayout
					begin={140}
					unit='px'
					className="rt-merchant-center"
					hStyle={{}}
					direction="h">
					<div className="center-left">
						<ul className="nav-menu">
							{
								MENU.map(function (item, index){
									return <li onClick={()=>this.setState({view: item.uri})} key={index} className={ this.state.view === item.uri ? 'curr' : ''}>
										<span>{item.title}</span>
									</li>;
								}.bind(this))
							}
						</ul>
					</div>
					<div className="center-right">
						{View && <View courierId={this.props.id} courierOpenId={this.props.openId} />}
					</div>
				</UI.ActivityLayout>
			</UI.Page>
		);
	}
});
