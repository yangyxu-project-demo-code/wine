var React = require('react');

module.exports = React.createClass({
	getInitialState: function() {
		this._cityData = Store.post('/znadmin/var/getByPid', { pid: -1 });
		this._areaData = Store.post('/znadmin/var/getByPid', { pid: -1 });
    	return {
			data: null,
			items: [
				{ type: 'Input', name: 'title', placeholder: '请输入真实门店名称', title: '门店名称', required: true },
				{ type: 'FileUploader', isImage: true, name: 'imgs', title: '门店图片', action: '/hcredwine/uploadFiles', required: true },
				{ type: 'Input', name: 'contact', placeholder: '请输入真实身份证上真实姓名', title: '联系人', required: true },
				{ type: 'Input', name: 'phone', placeholder: '请输入随时联系的联系方式', title: '联系方式', required: true },
				{ type: 'Input', name: 'email', placeholder: '请输入常用邮箱', title: '邮箱', required: true },
				{ type: 'Input', name: 'IDNumber', attrs: { type: 'number' }, placeholder: '请输入身份证号码', title: '身份证号' },
				{ type: 'FileUploader', isImage: true, required: true, name: 'IDImgs', placeholder: '请上传个人身份证正反面图片', title: '身份证正反面', action: '/hcredwine/uploadFiles' },
				{
					title: '省',
					name: 'province',
					type: 'Select',
					data: Store.post('/znadmin/var/getByPid', { pid: 3 }),
					onChange: function (data){
						if(data){
							this._cityData._data.pid = data.value;
							this._cityData.exec();
						}
					}.bind(this)
				},
				{
					title: '市',
					name: 'city',
					type: 'Select',
					data: this._cityData,
					onChange: function (data){
						if(data){
							this._areaData._data.pid = data.value;
							this._areaData.exec();
						}
					}.bind(this)
				},
				{ title: '区/镇', name: 'area', type: 'Select', data: this._areaData },
				{ title: '地址', name: 'address', placeholder: '请输入真实联系地址', type: 'Textarea', required: true }
			]
		};
  	},
	componentDidMount: function (){
		var _openId = (Session.jsonKeyValue('WAP_LOGIN_USER_TOKEN')||{}).openid;
		Store.post('/znadmin/model/selectOne', {
			model: 'zn_hcredwine_merchant',
			order: {
				createTime: 'desc'
			},
			where: {
				openId: _openId
			}
		}).exec().then(function (data){
			this.setState({
				data: data.result
			});
		}.bind(this));
	},
	__onPay: function (){

	},
	__renderStatus: function () {
		if(this.state.data){
			switch (this.state.data.status) {
				case 0:
					return <div style={{
							backgroundColor: '#FFC107',
							color: '#FFF',
							margin: 10,
							textAlign: 'center',
							padding: 3,
							borderRadius: 5
						}}>
						<i style={{padding: 5}} className="fa fa-clock-o" />
						<span>等待审核中</span>
					</div>;
				case 1:
					return <div style={{
							backgroundColor: '#00BCD4',
							color: '#FFF',
							margin: 10,
							textAlign: 'center',
							padding: 3,
							borderRadius: 5
						}}>
						<i className="fa fa-check-circle-o" />
						<span style={{padding: 5}}>审核通过</span>
						<a onClick={()=>Session.jump('/merchant/createStockOrder')} href="javascript:void(0)">去进货</a>
					</div>;
				case 2:
					return <div style={{
							backgroundColor: '#24cb2a',
							color: '#FFF',
							margin: 10,
							textAlign: 'center',
							padding: 3,
							borderRadius: 5
						}}>
						<i className="fa fa-check-circle-o" />
						<span style={{padding: 5}}>已认证</span>
					</div>;
				case -1:
					return <div style={{
							margin: 10,
							backgroundColor: '#f0695f',
							borderRadius: 5,
							color: '#FFF',
						}}>
						<div style={{
								textAlign: 'center',
								padding: 3
							}}>
							<i style={{padding: 5}} className="fa fa-exclamation-circle" />
							<span>因为材料问题被驳回</span>
						</div>
						<div style={{padding: 5, fontSize: 12}}>原因：{this.state.data.note} <a onClick={()=>Session.jump('/join/merchant')} href="javascript:void(0)">重新申请</a></div>
					</div>;
			}
		}
	},
	render: function(){
		return (
			<UI.Page title="代理商 - 申请认证">
				{this.__renderStatus()}
				<UI.Form
					items={this.state.items}
					style={{padding: 10}}
					disabled={true}
					value={this.state.data} />
			</UI.Page>
		);
	}
});
