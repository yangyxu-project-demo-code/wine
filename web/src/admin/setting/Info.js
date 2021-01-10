var React = require('react');

module.exports = React.createClass({
	getInitialState: function () {
		var _where = {};
		if(this.props.id){
			_where.id = this.props.id;
		}
		return {
			toolbarItems: [{icon:'fa-edit', text: '修改信息', onClick: this.__onEdit}],
			info: null,
			formItems: [
				{ title: 'host', name: 'host', type: 'Textarea' },
				{ title: 'port', name: 'port', type: 'Input' },
				{ title: '服务热线', name: 'hotPhone', type: 'Input' },
				{ title: '状态', name: 'status', type: 'Select', data: [{ text: '设置默认', value: 1 }, { text: '取消默认', value: 0 }] },
				{ title: '版本信息', name: 'version', type: 'RichEditor' },
				{ title: '拍卖协议', name: 'protocol', type: 'RichEditor' }
			],
			data: Store.post('/znadmin/model/select', {
				model: 'zn_auction_setting',
				where: _where
			})
		}
	},
	componentDidMount: function (){
		this.__loadUserInfo();
	},
	__doSuccess: function (){
		Popup.close('dialog');
		Popup.message({
			content: '修改成功',
			type: 'success'
		});
		this.__loadUserInfo();
	},
	__onEdit: function (data){
		Popup.dialog({
			title: '修改',
			hStyle: { backgroundColor: '#0B72A5' },
			width: 580,
			content: <UI.Form
				method="POST"
				layout="stacked"
				action='/znadmin/model/update'
				exts={{ model: 'zn_auction_setting', where: { id: this.state.info.id } }}
				merge="updates"
				value={Store.post('/znadmin/model/selectOne', { model: 'zn_auction_setting', where: { id: this.state.info.id } })}
				style={{ margin: 25 }}
				syncSubmit={false}
				onSubmitSuccess={this.__doSuccess}
				btns={[{text: '修改', icon: 'fa-edit', type: 'submit', float: 'right', style: { marginRight:0 }},{text:'取消', type:'cancle', status: 'danger', float: 'right'}]}
				items={this.state.formItems} />
		});
	},
	__loadUserInfo: function (){
		Store.post('/znadmin/model/selectOne', {
			model: 'zn_auction_setting',
			where: { id: this.props.id }
		}).exec().then(function (data){
			this.setState({
				info: data.result,
			});
		}.bind(this));
	},
	render:function(){
		if(!this.state.info){
			return null;
		}
		return (
			<UI.Page title={'版本设置'} toolbarItems={this.state.toolbarItems} >
				<div className="product-info">
					<div className="rt-card">
						<div className="card-header">版本信息</div>
						<div className="card-body">
							<div dangerouslySetInnerHTML={{ __html: this.state.info.version }}></div>
						</div>
					</div>

					<div className="rt-card">
						<div className="card-header">拍卖规则及协议</div>
						<div className="card-body">
							<div dangerouslySetInnerHTML={{ __html: this.state.info.protocol }}></div>
						</div>
					</div>
				</div>
			</UI.Page>
		);
	}
});
