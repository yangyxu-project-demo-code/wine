var React = require('react');

module.exports = React.createClass({
	getInitialState: function (){
		return {
			value: null
		}
	},
	componentDidMount: function(){
		this.__loadData();
	},
    __loadData: function (){
		Store.post('/znadmin/model/selectOne', {
			model: 'zn_hcredwine_setting',
			where: { isDefault: 1 }
		}).exec().then(function (data){
			if(data.result && data.result.protocol){
				this.setState({
					value: data.result.protocol
				});
			}else {
				this.setState({
					value: '<div style="text-align:center;">暂无版本信息</div>'
				});
			}
		}.bind(this));
    },
	__onNext: function (){
		var _token = Session.jsonKeyValue('WAP_LOGIN_USER_TOKEN');
		if(!_token){
			return Session.jump('/login', { forward: this.props.path});
		}else {
			//console.log(_token.id, this.props.request.search.pid);
			Session.jump('/order/create', {
				userId: _token.id,
				productId: this.props.request.search.pid
			});
		}
	},
	__renderFooter: function (){
		if(this.state.value){
			return <div className="action">
				<div className="apply" onClick={this.__onNext}>
					<span>我同意以上协议，下一步</span>
				</div>
			</div>;
		}
	},
	__renderData: function () {
		return <div style={{padding: 5}} dangerouslySetInnerHTML={{ __html: this.state.value }}></div>;
	},
	render:function(){
		return (
			<UI.Page
				className="rt-product-info"
				bStyle={{backgroundColor: '#f6f6f6'}}
				footerView={this.__renderFooter()}
				end={(this.state.value?45:0)}
				title="竞拍服务协议" >
				{
					!!this.state.value?this.__renderData():<UI.DataLoader loader="timer" content="加载中..." />
				}
			</UI.Page>
		);
	}
});
