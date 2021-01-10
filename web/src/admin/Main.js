var React = require('react');
module.exports = React.createClass({
	getInitialState:function(){
		return {
			data: Store.post('/znadmin/model/select', { model: 'zn_admin_menu', ifEnabledRights: false, where: { pid: 2 } })
		};
	},
	__onMenuItemClick: function (item){
		var _data = item.props.data;
		if(_data.url){
			Session.jump(_data.url);
		}
	},
	__itemContentRender: function (item, index){
		return <span>
			<i className={'fa ' + item.data.icon} style={{width: 16, margin: 5}} />
			{item.data.title}
		</span>;
	},
	render:function(){
		if(!Session.json()){
			Session.jump('/index');
		} else {
			if(!this.props.request || this.props.request.name == ''){
				Session.jump('/main/znadmin/MyInfo');
			}
		}
		var _title = Session.json().name || Session.json().email;
		return (
			<UI.FixedLayout
				style={{position: 'fixed'}}
				direction="v"
				unit="rem"
				end={3}
				begin={5}>
				<div className="main-top admin">
					<div className="rt-fl" ><span style={{marginLeft: 10}}>沪春互联网科技有限公司 -- 数据管理平台</span></div>
					<div className="right">

					</div>
				</div>
				<UI.ActivityLayout
					begin={18}
					unit="rem"
					hStyle={{borderRight:'1px solid #e9e9e9'}}
					fStyle={{left: '19rem'}}
					direction="h">
					<UI.TreeListView itemContentRender={this.__itemContentRender} className="c-tree-nav-menu"  activeAll={true} onClick={this.__onMenuItemClick} data={this.state.data} />
					{this.props.view && <this.props.view {...this.props.request.search} />}
				</UI.ActivityLayout>
				<div className="main-foot">上海沪春互联网有限公司 @2016 - @2017</div>
			</UI.FixedLayout>
		);
	}
});
