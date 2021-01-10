var React = require('react');

module.exports = React.createClass({
	getInitialState: function () {
		return {
			info: null,
			model: 'zn_hcredwine_merchant'
		}
	},
	componentDidMount: function (){
		this.__loadUserInfo();
	},
	__loadUserInfo: function (){
		Store.post('/znadmin/model/selectOne', {
			model: this.state.model,
			where: { id: this.props.merchantId }
		}).exec().then(function (data){
			this.setState({
				info: data.result
			});
		}.bind(this));
	},
	__doSuccess: function (){
		Popup.close('dialog');
		Toast.success('操作成功');
		this.__loadUserInfo();
	},
	__onEdit: function (data){
		Popup.dialog({
			title: '修改',
			hStyle: { backgroundColor: '#0B72A5' },
			width: 780,
			content: <UI.Form
				method="POST"
				layout="stacked"
				action='/znadmin/model/update'
				exts={{
					model: this.state.model,
					where: { id: data.id }
				}}
				merge="updates"
				value={Store.post('/znadmin/model/selectOne', { model: this.state.model, where: { id: data.id }})}
				style={{ margin: 25 }}
				syncSubmit={false}
				onSubmitSuccess={this.__doSuccess}
				btns={[{text: '修改', icon: 'fa-edit', type: 'submit', float: 'right', style: { marginRight:0 }},{text:'取消', type:'cancle', status: 'danger', float: 'right'}]}
				items={[{ title: '描述', name: 'description', type: 'RichEditor' }]} />
		});
	},
	render:function(){
		if(!this.state.info){
			return null;
		}
		return (
			<div className="user-info">
				<div className="info-form user-item">
					<img className="avatar" src={Store.fixURL(this.state.avatarImage)} />
					<div className="details">
						<div className="name">{this.state.info.title}</div>
						<div><i className="fa fa-clock-o" />注册时间：{this.state.info.createTime}</div>
						<div><i className="fa fa-envelope" />联系人：{this.state.info.contact}</div>
						<div><i className="fa fa-envelope" />邮箱：{this.state.info.email}</div>
						<div><i className="fa fa-phone" />手机号：{this.state.info.phone}</div>
						<div><i className="fa fa-phone" />可提现金额：{this.state.info.settlementAmount}元</div>
						<div>{this.state.info.note}</div>
					</div>
				</div>
				<div className="rt-panel c-defalut">
					<div className="p-head">门店实景照片</div>
					<div className="p-body">
						{
							this.state.info.imgs.split(',').map(function (img, index){
								if(img){
									return <img key={index} style={{width: '80%', margin: 5}} src={Store.fixURL(img)} />
								}else {
									return null;
								}
							})
						}
					</div>
				</div>
				<div className="rt-panel c-defalut">
					<div className="p-head">身份证正反面扫描件</div>
					<div className="p-body">
						{
							this.state.info.IDImgs.split(',').map(function (img, index){
								if(img){
									return <img key={index} style={{width: '80%', margin: 5}} src={Store.fixURL(img)} />
								}else {
									return null;
								}
							})
						}
					</div>
				</div>
				<div className="rt-panel c-defalut">
					<div className="p-head">企业文化 <a href="javascript:void(0);" onClick={()=>this.__onEdit(this.state.info)}>编辑</a></div>
					<div className="p-body">
						<div dangerouslySetInnerHTML={{ __html: this.state.info.description }}></div>
					</div>
				</div>
			</div>
		);
	}
});
