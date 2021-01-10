var React = require('react');
module.exports = React.createClass({
	getInitialState: function() {
    	return {
			tabs: [
				{ title: '首页', icon: 'fa-home', uri: '/main/home' },
				{ title: '订单', icon: 'fa-newspaper-o', uri: '/main/order' },
				{ title: '我的', icon: 'fa-user',	uri: '/main/my' }
			]
		};
  	},
	componentDidMount: function (){

	},
	__renderPage: function (){
		var _view = <div>Empty Page</div>;
		if(this.props.view){
			_view = <this.props.view path={this.props.request.path} {...this.props.request.search} />;
		}

		return _view;
	},
	render:function(){
		return (
			<UI.ActivityLayout
				className="rt-user-main"
				direction="v"
				end={50}>
				{this.__renderPage()}
				<ul className="nav-menu">
					{
						this.state.tabs.map(function (item, index){
							return <li onClick={()=>{ Session.jump(item.uri); }} key={index} className={ this.props.path === item.uri ? 'curr' : ''}>
								<div><i className={'fa ' + item.icon} /></div>
								<div><span className='title'>{item.title}</span></div>
							</li>;
						}.bind(this))
					}
				</ul>
			</UI.ActivityLayout>
		);
	}
});
