var React = require('react');

module.exports = React.createClass({
	getInitialState: function() {
		this._cityData = Store.post('/znadmin/var/getByPid', { pid: -1 });
		this._areaData = Store.post('/znadmin/var/getByPid', { pid: -1 });
    	return {
			data: null,
			items: [
				{ type: 'Input', name: 'name', placeholder: '请输入真实身份证上真实姓名', title: '联系人', required: true },
				{ type: 'Select', name: 'sex', data: [{text:'男',value:'男'},{text:'女',value:'女'}], placeholder: '请选择性别', title: '性别' },
				{ type: 'Input', name: 'age', attrs: { type: 'number' }, placeholder: '请输入年龄', title: '年龄' },
				{ type: 'Input', name: 'phone', placeholder: '请输入随时联系的联系方式', title: '联系方式', required: true },
				{ type: 'Input', name: 'email', placeholder: '请输入常用邮箱', title: '邮箱' },
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
		if(this.props.request.search.callback){
			setTimeout(this.__loadInfo, 3000);
		}else {
			this.__loadInfo();
		}
	},
	__loadInfo: function (){
		var _openId = (Session.jsonKeyValue('WAP_LOGIN_USER_TOKEN')||{}).openid;
		Store.post('/znadmin/model/selectOne', {
			model: 'zn_hcredwine_courier',
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
		Store.post('/hcredwine/courier/payAuth', {
			openId: this.state.data.openId
		}).exec().then(function (data){
			if(data.status==200){
				var _result = data.result;
				if(_result.token_id){
					window.location.href ='https://pay.swiftpass.cn/pay/jspay?token_id=' + _result.token_id + '&showwxtitle=1';
				}else {
					alert(_result.err_msg);
				}
			}else {
				alert(data.result);
			}
		});
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
						<a onClick={()=>this.__onPay()} href="javascript:void(0)">去支付{(1000).toFixed(2)}元押金</a>
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
						<div style={{padding: 5, fontSize: 12}}>原因：{this.state.data.note} <a onClick={()=>Session.jump('/join/courier')} href="javascript:void(0)">重新申请</a></div>
					</div>;
			}
		}
	},
	__onBack: function (){
		if(this.props.request.search.callback){
			return Session.jump('/main/home'), false;
		}
	},
	render: function(){
		if(this.state.data){
			return (
				<UI.Page onBack={this.__onBack} title="派送员 - 申请认证">
					{this.__renderStatus()}
					<UI.Form
						items={this.state.items}
						style={{padding: 10}}
						readonly={true}
						value={this.state.data} />
				</UI.Page>
			);
		}else {
			return (
				<UI.Page onBack={this.__onBack} title="派送员 - 申请认证">
					<UI.DataLoader loader="timer" content="加载中..." />
				</UI.Page>
			);
		}
	}
});
