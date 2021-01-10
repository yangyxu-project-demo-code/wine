var React = require('react');
module.exports = React.createClass({
	getDefaultProps: function () {
		return {
			data: null,
			model: 'zn_hcredwine_merchant'
		};
	},
	getInitialState: function () {
		this._cityData = Store.post('/znadmin/var/getByPid', { pid: -1 });

		return {
			data: Store.post('/znadmin/model/paging', {
				model: this.props.model
			}),
			items: [
				{ title: '操作', width: 60, textAlign: 'center' },
				{ title: '名称', name: 'title', width: 280, filter: { type: 'Input', opts: ['like'] } },
				{
					title: '状态',
					name: 'status',
					width: 100,
					popWidth: 120,
					filter: {
						type: 'Menu',
						data: [
							{ text: '拒绝', value: -1 },
							{ text: '待审核', value: 0 },
							{ text: '已审核(材料通过)', value: 1 },
							{ text: '已验证(已支付)', value: 2 }
						],
						opts: ['=']
					}
				},
				{ title: '类型', name: 'type_convert', width: 70 },
				{ title: '联系人', name: 'contact', width: 100 },
				{ title: '邮箱', name: 'email', width: 100 },
				{ title: '电话', name: 'phone', width: 100 },
				{ title: '修改时间', name: 'modifyTime', width: 140 },
				{ title: '申请时间', name: 'createTime', width: 140 },
				{ title: '描述', name: 'note' }
			],
			formItems: [
				{ title: 'Logo', name: 'avatarImage', type: 'ImageUploader', action: '/hcredwine/uploadFiles' },
				{ title: '名称', name: 'title', type: 'Textarea' },
				{ title: '别名', name: 'alias', type: 'Input' },
				{
					title: '省',
					name: 'province',
					type: 'Select',
					data: Store.post('/znadmin/var/getByPid', { pid: 11 }),
					onChange: function (data){
						if(data){
							this._cityData._data.pid = data.value;
							this._cityData.exec();
						}
					}.bind(this)
				},
				{ title: '城市', name: 'city', type: 'Select', data: this._cityData },
				{ title: '地址', name: 'address', type: 'Textarea' },
				{ title: '联系人', name: 'contact', type: 'Input' },
				{ title: '邮箱', name: 'email', type: 'Input' },
				{ title: '电话', name: 'phone', type: 'Input', attrs: { type:'number' } },
				{ title: '身份证号码', name: 'IDNumber', type: 'Input', attrs: { type:'number' } },
				{ title: '身份证图片', name: 'IDImgs', type: 'FileUploader', action: '/hcredwine/uploadFiles' },
				{ title: '门店图片', name: 'imgs', type: 'FileUploader', action: '/hcredwine/uploadFiles' },
				{ title: '描述', name: 'note', type: 'Textarea' }
			],
			statusItems: [
				{ title: '审核状态', name: 'status', type: 'Select', data: [{ text: '驳回(材料不合格)', value: -1 }, { text: '确认通过(材料合格)', value: 1 }] }
			],
			toolbarItems: [
				{ text: '添加', icon: 'fa-plus' }
			]
		}
	},
	__onRowActions: function (value, data){
		var _data = this.state.data;
		var _self = this;
		switch (value.item.icon) {
			case 'fa-remove':
				Alert.show({
					width: 280,
					title: '提示',
					content: '确定删除该数据吗？',
					onConfirm: function (){
						Store.post('/znadmin/model/delete', {
							model: _self.props.model,
							where: { id: data.id }
						}).exec().then(function (data){
							Toast.success('删除成功！');
							_data.refresh();
						});
					}
				})
				break;
			case 'fa-edit':
				this.__updateItem(data);
				break;
		}
	},
	__onTableColumnRender: function (rowIndex, columnIndex, data, item, value){
		switch (columnIndex) {
			case 0:
				return <UI.ListView
						className="rt-flex"
						data={[
							{ text:'删除', icon: 'fa-remove' }
						]}
						itemRender={(item, index)=>{return <i title={item.text} className={'fa '+item.icon} style={item.style} />}}
						onClick={(value)=>this.__onRowActions(value, data)}
						/>;
			case 1:
				return <a style={{textDecoration:'underline'}} href={'#/main/Merchant/Center?id=' + data.id} >
					{value}
				</a>;
			case 2:
				switch (+value) {
					case -1:
						return <span style={{color:'red'}}>已驳回</span>;
					case 0:
						return <a href="void:()" onClick={()=>this.__onCheck(data)}><span style={{color:'#8c8080'}}>待审核</span></a>;
					case 1:
						return <span style={{color:'#b36d06'}}>已审核(待支付)</span>;
					case 2:
						return <span style={{color:'green'}}>已支付(验证成功)</span>;
				}
		}
	},
	__onCheck: function (data) {
		Popup.dialog({
			title: '审核',
			hStyle: { backgroundColor: '#0B72A5' },
			width: 780,
			content: <UI.Form
				method="POST"
				layout="stacked"
				action='/znadmin/model/update'
				exts={{ model: this.props.model, where: { id: data.id } }}
				merge="updates"
				value={Store.post('/znadmin/model/selectOne', { model: this.props.model, where: { id: data.id }})}
				style={{ margin: 25 }}
				syncSubmit={false}
				onSubmitSuccess={this.__doSuccess}
				btns={[{text: '确认', icon: 'fa-edit', type: 'submit', float: 'right', style: { marginRight:0 }},{text:'取消', type:'cancle', status: 'danger', float: 'right'}]}
				items={this.state.statusItems} />
		});
	},
	__updateItem: function (data){
		Popup.dialog({
			title: '修改信息',
			hStyle: { backgroundColor: '#0B72A5' },
			width: 780,
			content: <UI.Form
				method="POST"
				layout="stacked"
				action='/znadmin/model/update'
				exts={{ model: this.props.model, where: { id: data.id } }}
				merge="updates"
				value={Store.post('/znadmin/model/selectOne', { model: this.props.model, where: { id: data.id }})}
				style={{ margin: 25 }}
				syncSubmit={false}
				onSubmitSuccess={this.__doSuccess}
				btns={[{text: '修改', icon: 'fa-edit', type: 'submit', float: 'right', style: { marginRight:0 }},{text:'取消', type:'cancle', status: 'danger', float: 'right'}]}
				items={this.state.formItems} />
		});
	},
	__doSuccess: function (){
		Popup.close('dialog');
		Toast.success('操作成功');
		this.state.data.refresh();
	},
	__addItem: function (){
		Popup.dialog({
			title: '添加',
			width: 780,
			content: <UI.Form
				method="POST"
				layout="stacked"
				action='/znadmin/model/insert'
				exts={{model: this.props.model}}
				merge="values"
				style={{ margin: 25 }}
				syncSubmit={false}
				onSubmitSuccess={this.__doSuccess}
				btns={[
					{text: '添加', icon: 'fa-plus', type: 'submit', float: 'right', style: { marginRight:0 }},
					{text:'取消', type:'cancle', status: 'danger', float: 'right'}
				]}
				items={this.state.formItems} />
		});
	},
	__onToolbarClick: function (rtitem){
		switch (rtitem.icon) {
			case 'fa-plus':
				this.__addItem();
				break;
		}
	},
	render: function(){
		return (
			<UI.Page title='总仓进货'
				onToolbarClick={this.__onToolbarClick}
				toolbarItems={this.state.toolbarItems} >
				<UI.PagerView
					view="Table"
					checkbox={0}
					enableFilter={true}
					showHeader={true}
					data={this.state.data}
					columnRender={this.__onTableColumnRender}
					onTableRowClick={this.__onTableRowClick}
					items={this.state.items}/>
			</UI.Page>
		);
	}
});
