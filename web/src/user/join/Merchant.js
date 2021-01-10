var React = require('react');

module.exports = React.createClass({
	getInitialState: function() {
		this._cityData = Store.post('/znadmin/var/getByPid', { pid: -1 });
		this._areaData = Store.post('/znadmin/var/getByPid', { pid: -1 });
    	return {
			items: [
				{ type: 'Input', name: 'title', placeholder: '请输入真实门店名称', title: '门店名称', required: true },
				{ type: 'FileUploader', name: 'imgs', title: '门店图片', action: '/hcredwine/uploadFiles', required: true },
				{ type: 'Input', name: 'contact', placeholder: '请输入真实身份证上真实姓名', title: '联系人', required: true },
				{ type: 'Input', name: 'phone', placeholder: '请输入随时联系的联系方式', title: '联系方式', required: true },
				{ type: 'Input', name: 'email', placeholder: '请输入常用邮箱', title: '邮箱' },
				{ type: 'Input', name: 'bankCardAccount', attrs: { type: 'number' }, placeholder: '请输入结算银行卡账号', title: '银行卡账号', required: true },
				{ type: 'Input', name: 'IDNumber', attrs: { type: 'number' }, placeholder: '请输入身份证号码', title: '身份证号', required: true },
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
	render: function(){
		return (
			<UI.Page title="商户 - 提交申请">
				<UI.Form
					items={this.state.items}
					merge="data"
					hiddens={{
						role: 'merchant',
						openId: (Session.jsonKeyValue('WAP_LOGIN_USER_TOKEN')||{}).openid
					}}
					btns={[{text:'确认提交', icon: 'fa-add', type: 'submit'}]}
					onSubmitSuccess={()=>{
						alert('提交成功, 请您耐心等待消息!');
						window.location.href = window.location.protocol + '//' + window.location.host + window.location.pathname + '#/main/home';
					}}
					onSubmitError={(error)=>alert(error.result)}
					action="/hcredwine/merchant/join" />
			</UI.Page>
		);
	}
});
