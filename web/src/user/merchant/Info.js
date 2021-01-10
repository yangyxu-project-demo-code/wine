var React = require('react');

module.exports = React.createClass({
	getInitialState: function() {
    	return {
			data: null
		};
  	},
	componentDidMount: function (){
		Store.post('/znadmin/model/selectOne', {
			model: 'zn_hcredwine_merchant',
			order: {
				createTime: 'desc'
			},
			where: {
				id: Session.getKeyValue('state')
			}
		}).exec().then(function (data){
			this.setState({
				data: data.result
			});
		}.bind(this));
	},
	render: function(){
		return (
			<UI.Page title="企业文化">
				<div className="rt-merchant-info">
				{
					this.state.data?<div dangerouslySetInnerHTML={{ __html: this.state.data.description }}></div>:<UI.DataLoader loader="timer" content="加载中..." />
				}
				</div>
			</UI.Page>
		);
	}
});
