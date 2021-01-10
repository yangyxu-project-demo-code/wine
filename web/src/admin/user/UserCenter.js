var React = require('react');

var MENU = [
	{
		title: '基本信息',
		icon: 'fa-id-card-o',
		uri: './UserInfo.js'
	},
	{
		title: '订单',
		icon: 'fa-list-ul',
		uri: './UserOrder.js'
	},
	{
		title: '地址',
		icon: 'fa-bell-o',
		uri: './UserAddress.js'
	}
];

module.exports = React.createClass({
	getInitialState: function (){
		return {
			view: './UserInfo.js'
		}
	},
	render: function(){
		var View = this.state.view?require(this.state.view):null;
		return (
			<UI.Page title='用户中心' icon="fa-newspaper-o" >
				<UI.ActivityLayout
					begin={140}
					unit='px'
					className="rt-user-center"
					hStyle={{}}
					direction="h">
					<div className="center-left">
						<ul className="nav-menu">
							{
								MENU.map(function (item, index){
									return <li onClick={()=>this.setState({view: item.uri})} key={index} className={ this.state.view === item.uri ? 'curr' : ''}>
										<i className={'fa ' + item.icon} />
										<span>{item.title}</span>
									</li>;
								}.bind(this))
							}
						</ul>
					</div>
					<div className="center-right">
						{View && <View userId={this.props.id} />}
					</div>
				</UI.ActivityLayout>
			</UI.Page>
		);
	}
});
