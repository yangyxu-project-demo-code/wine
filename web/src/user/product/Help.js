var React = require('react');

module.exports = React.createClass({
	getInitialState: function (){
		return {
			value: null
		};
	},
	componentDidMount: function (){
		Store.post('/znadmin/model/selectOne', {
			model: 'zn_auction_product',
			where: { id: this.props.request.search.pid }
		}).exec().then(function (data){
			if(data.result && data.result.bangZhu){
				this.setState({
					value: data.result.bangZhu
				});
			}else {
				this.setState({
					value: '<div style="text-align:center;">暂无竞拍帮助</div>'
				});
			}
		}.bind(this));
	},
	renderContent: function(){
		if(!this.state.value){
			return <UI.DataLoader loader="timer" content="加载中..." />;
		}
		return (
			<div style={{ padding: 15 }} dangerouslySetInnerHTML={{ __html: this.state.value }}></div>
		);
	},
	render: function(){
		if(this.props.request.search.page){
			return <UI.Page
				bStyle={{backgroundColor: '#f6f6f6'}}
				title="司法竞拍帮助" >
				{this.renderContent()}
			</UI.Page>
		}else {
			return this.renderContent();
		}
	}
});
