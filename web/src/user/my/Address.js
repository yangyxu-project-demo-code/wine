var React = require('react');

module.exports = React.createClass({
	getDefaultProps: function (){
		return {
			model: 'zn_hcredwine_user_address'
		};
	},
	getInitialState: function() {
		var _uid = this.props.userId || Session.jsonKeyValue('WAP_LOGIN_USER_TOKEN').id;
		this._cityDS = Store.post('/znadmin/var/getByPid', { pid: -1 });
		this._areaDS = Store.post('/znadmin/var/getByPid', { pid: -1 });
    	return {
			userId: _uid,
			data: Store.post('/znadmin/model/select', {
				model: this.props.model,
				where: { userId: _uid }
			}),
			formItems: [
				{ title:
					'是否默认',
					name: 'isDefault',
					type: 'Radio',
					data: [{text:'是', value: 1}, {text:'否', value: 0}]
				},
				{ title: '收货人姓名', name: 'name', type: 'Input', required: true },
				{ title: '手机号码', name: 'phone', type: 'Input', required: true },
				{ title:
					'省份',
					name: 'province',
					type: 'Select',
					data: Store.post('/znadmin/var/getByPid', { pid: 3 }),
					onChange: function (data){
						this._cityDS._data.pid = data.value;
						this._cityDS.exec();
					}.bind(this)
				},
				{
					title: '城市',
					name: 'city',
					type: 'Select',
					data: this._cityDS,
					onChange: function (data){
						this._areaDS._data.pid = data.value;
						this._areaDS.exec();
					}.bind(this)
				},
				{ title: '地区', name: 'area', type: 'Select', data: this._areaDS, },
				{ title: '邮政编码', name: 'postcode', type: 'Input' },
				{ title: '详细地址', name: 'address', type: 'Textarea', required: true }
			]
		};
  	},
	__onRemove: function (data){
		var _self = this;
		Alert.show({
			title: '提示',
			content: '确定删除该数据吗？',
			onConfirm: function (){
				Store.post('/znadmin/model/delete', {
					model: _self.props.model,
					where: {
						id: data.id
					}
				}).exec().then(function (data){
					Toast.success('删除成功！');
					_self.state.data.refresh();
				});
			}
		});
	},
	__itemRender: function (item, index){
		return (
			<div className={"address-item " + (+item.isDefault?'rt-curr-style':'')} >
				<div className="info">
					<span>{item.name}</span>
					<span>{item.phone}</span>
				</div>
				<div className="address">
					<span>{item.province_convert}</span>
					<span>{item.city_convert}</span>
					<span>{item.area_convert}</span>
					<span>{item.address}</span>
				</div>
				<div className="action">
					<span onClick={()=>this.__onEdit(item)}><i className="fa fa-edit" /></span>
					<span onClick={()=>this.__onRemove(item)}><i className="fa fa-remove" /></span>
				</div>
			</div>
		);
	},
	__onEdit: function (data){
		Popup.dialog({
			title: '更新地址',
			content: <UI.Form
				method="POST"
				layout="stacked"
				action='/znadmin/model/update'
				exts={{model: this.props.model, where: { id: data.id }}}
				merge="updates"
				value={data}
				syncSubmit={false}
				onSubmitSuccess={this.__doSuccess}
				btns={[{text: '更新', icon: 'fa-edit', type: 'submit', float: 'right', style: { marginRight:0 }},{text:'取消', type:'cancle', status: 'danger', float: 'right'}]}
				items={this.state.formItems} />
		});
	},
	__doSuccess: function (){
		Popup.close('dialog');
		Toast.success('操作成功');
		this.state.data.refresh();
	},
	__onAdd: function (){
		Popup.dialog({
			title: '添加地址',
			top: 50,
			content: <UI.Form
				method="POST"
				layout="stacked"
				action='/znadmin/model/insert'
				exts={{model: this.props.model}}
				merge="values"
				hiddens={{ userId: this.state.userId }}
				syncSubmit={false}
				onSubmitSuccess={this.__doSuccess}
				btns={[{text: '添加', icon: 'fa-plus', type: 'submit', float: 'right', style: { marginRight:0 }},{text:'取消', type:'cancle', status: 'danger', float: 'right'}]}
				items={this.state.formItems} />
		});
	},
	render:function(){
		return (
			<UI.Page title='我的收货地址' >
				<UI.ActivityLayout
					direction="v"
					className="rt-address"
					hStyle={{backgroundColor: '#FAFAFA'}}
					end={44}>
					<UI.ListView className="address" data={this.state.data} itemRender={this.__itemRender} />
					<UI.Button onClick={this.__onAdd} text="添加新地址" style={{margin: 5}} />
				</UI.ActivityLayout>
			</UI.Page>
		);
	}
});
