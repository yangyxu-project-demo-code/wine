var React = require('react');

var MENU = [
	{
		title: '商品列表',
		icon: 'fa-list-ul',
		uri: './ProductList.js'
	},
	{
		title: '商品库存',
		icon: 'fa-list-ul',
		uri: './Stock.js'
	},
	{
		title: '进货订单',
		icon: 'fa-list-ul',
		uri: './InStock.js'
	},
	{
		title: '代理商订单',
		icon: 'fa-list-ul',
		uri: './MerchantOrder.js'
	},
	{
		title: '用户订单',
		icon: 'fa-list-ul',
		uri: './UserOrder.js'
	}
];

module.exports = React.createClass({
	getInitialState: function (){
		return {
			view: './ProductList.js'
		}
	},
	render: function(){
		var View = this.state.view?require(this.state.view):null;
		return (
			<UI.Page title='商品管理' icon="fa-newspaper-o" >
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
