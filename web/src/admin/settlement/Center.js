var React = require('react');

var MENU = [
	{
		title: '商户结算',
		icon: 'fa-id-card-o',
		uri: require('./MerchantSettlement.js')
	},
	{
		title: '派送员结算',
		icon: 'fa-list-ul',
		uri: require('./MerchantSettlement.js')
	},
	{
		title: '酒楼结算',
		icon: 'fa-list-ul',
		uri: require('./MerchantSettlement.js')
	}
];

module.exports = React.createClass({
	getInitialState: function (){
		return {
			view: require('./MerchantSettlement.js')
		}
	},
	render: function(){
		var View = this.state.view;
		return (
			<UI.Page title='结算中心' icon="fa-newspaper-o" >
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
