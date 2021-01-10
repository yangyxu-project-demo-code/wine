var React = require('react');

module.exports = React.createClass({
	getInitialState: function() {
		this._cityData = Store.post('/znadmin/var/getByPid', { pid: -1 });
		this._areaData = Store.post('/znadmin/var/getByPid', { pid: -1 });
    	return {
			data: null,
			items: [
				{ type: 'Input', name: 'merchantCode', placeholder: '请输入代理商编号', title: '代理商编号', disabled: true },
				{ type: 'Input', name: 'name', placeholder: '请输入真实身份证上真实姓名', title: '联系人', disabled: true },
				{ type: 'Select', name: 'sex', data: [{text:'男',value:'男'},{text:'女',value:'女'}], placeholder: '请选择性别', title: '性别', disabled: true },
				{ type: 'Input', name: 'age', attrs: { type: 'number' }, placeholder: '请输入年龄', title: '年龄', disabled: true },
				{ type: 'Input', name: 'phone', placeholder: '请输入随时联系的联系方式', title: '联系方式', required: true },
				{ type: 'Input', name: 'email', placeholder: '请输入常用邮箱', title: '邮箱', required: true },
				{ type: 'Input', name: 'bankCardAccount', attrs: { type: 'number' }, placeholder: '请输入结算银行卡账号', title: '银行卡账号', required: true },
				{ type: 'Input', name: 'IDNumber', attrs: { type: 'number' }, placeholder: '请输入身份证号码', title: '身份证号', disabled: true },
				{ type: 'FileUploader', isImage: true, disabled: true, name: 'IDImgs', placeholder: '请上传个人身份证正反面图片', title: '身份证正反面', action: '/hcredwine/uploadFiles' },
				{
					title: '省',
					name: 'province',
					type: 'Select',
					disabled: true,
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
					disabled: true,
					data: this._cityData,
					onChange: function (data){
						if(data){
							this._areaData._data.pid = data.value;
							this._areaData.exec();
						}
					}.bind(this)
				},
				{ title: '区/镇', name: 'area', type: 'Select', disabled: true, data: this._areaData },
				{ title: '地址', name: 'address', placeholder: '请输入真实联系地址', type: 'Textarea', required: true },
				{ title: '说明', name: 'note', placeholder: '描述一下自己', type: 'Textarea', required: true }
			]
		};
  	},
	render: function(){
		return (
			<UI.Page title="酒楼信息">
				<UI.Form
					items={this.state.items}
					merge="data"
					hiddens={{

					}}
					value={Store.post('/znadmin/model/selectOne', {
						model: 'zn_hcredwine_restaurant',
						where: {
							openId: (Session.jsonKeyValue('WAP_LOGIN_USER_TOKEN')||{}).openid
						}
					})}
					btns={[{text:'修改信息', icon: 'fa-edit', type: 'submit'}]}
					onSubmitSuccess={(data)=>{
						alert('恭喜您修改成功!');
						Session.setKeyValue('state', data.result);
						window.location.href = window.location.protocol + '//' + window.location.host + window.location.pathname + '#/main/home';
					}}
					onSubmitError={(error)=>alert(error.result)}
					action="/znadmin/model/updateNode" />
			</UI.Page>
		);
	}
});
