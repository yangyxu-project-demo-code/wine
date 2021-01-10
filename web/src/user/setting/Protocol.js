var React = require('react');

module.exports = React.createClass({
	getInitialState: function (){
		return {
			value: null
		};
	},
	componentDidMount: function (){
		Store.post('/znadmin/model/selectOne', {
			model: 'zn_auction_setting',
			where: { isDefault: 1 }
		}).exec().then(function (data){
			if(data.result && data.result.version){
				this.setState({
					value: data.result.version
				});
			}else {
				this.setState({
					value: '<div style="text-align:center;">暂无版本信息</div>'
				});
			}
		}.bind(this));
	},
	render: function(){
		return (
			<UI.Page title="拍卖规则及协议" >
				{
					this.state.value ? <div style={{ padding: 15 }} dangerouslySetInnerHTML={{ __html: this.state.value }}></div> : <UI.DataLoader loader="timer" content="加载中..." />
				}
			</UI.Page>
		);
	}
});
