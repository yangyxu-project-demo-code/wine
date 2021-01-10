var React = require('react');

var MENU = [
	{
		title: '基本信息',
		icon: 'fa-id-card-o',
		uri: './Info.js'
	},
	{
		title: '库存',
		icon: 'fa-list-ul',
		uri: './Stock.js'
	},
	{
		title: '进货订单',
		icon: 'fa-list-ul',
		uri: './InStock.js'
	},
	{
		title: '卖出订单',
		icon: 'fa-list-ul',
		uri: './Order.js'
	},
	{
		title: '结算明细',
		icon: 'fa-list-ul',
		uri: './Order.js'
	},
	{
		title: '签约酒楼',
		icon: 'fa-list-ul',
		uri: './RestaurantList.js'
	}
];

module.exports = React.createClass({
	getInitialState: function (){
		return {
			view: './Info.js'
		}
	},
	render: function(){
		var View = this.state.view?require(this.state.view):null;
		return (
			<UI.Page title='商户中心' icon="fa-newspaper-o" >
				<UI.ActivityLayout
					begin={140}
					unit='px'
					className="rt-merchant-center"
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
						{View && <View merchantId={this.props.id} />}
					</div>
				</UI.ActivityLayout>
			</UI.Page>
		);
	}
});
