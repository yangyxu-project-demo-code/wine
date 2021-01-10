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
				{ title: '编号', name: 'code', width: 180, filter: { type: 'Input', opts: ['like'] } },
				{ title: '名称', name: 'title', width: 180, filter: { type: 'Input', opts: ['like'] } },
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
				{ title: '邮箱', name: 'email', width: 150 },
				{ title: '电话', name: 'phone', width: 100 },
				{ title: '省', name: 'province_convert', width: 60},
				{ title: '市', name: 'city_convert', width: 60 },
				{ title: '区', name: 'area_convert', width: 60 },
				{ title: '地址', name: 'address', width: 240 },
				{ title: '审核时间', name: 'modifyTime', width: 140 },
				{ title: '申请时间', name: 'createTime', width: 140 },
				{ title: '备注', name: 'note', width: 240 },
				{ title: '', name: 'note' }
			],
			formItems: [
				{ type: 'Input', name: 'title',  title: '门店名称', disabled: true },
				{ type: 'FileUploader', isImage: true, name: 'imgs', title: '门店图片', disabled: true },
				{ type: 'Input', name: 'contact', title: '联系人', disabled: true },
				{ type: 'Input', name: 'phone', title: '联系方式', disabled: true },
				{ type: 'Input', name: 'email', title: '邮箱', disabled: true },
				{ type: 'Input', name: 'IDNumber', title: '身份证号', disabled: true },
				{ type: 'FileUploader', isImage: true, name: 'IDImgs', title: '身份证正反面', disabled: true },
				{ type: 'Input', name: 'province_convert', title: '省', disabled: true },
				{ title: '市', name: 'city_convert', type: 'Input', disabled: true },
				{ title: '区/镇', name: 'area', type: 'Input', disabled: true },
				{ title: '地址', name: 'address', type: 'Input', disabled: true },
				{ title: '审核状态', name: 'status', type: 'Select', data: [{ text: '驳回(材料不合格)', value: -1 }, { text: '确认通过(材料合格)', value: 1 }] },
				{ title: '备注', name: 'note', type: 'Textarea' }
			],
			toolbarItems: []
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
							where: {
								id: data.id
							}
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
			case 2:
				return <a style={{textDecoration:'underline'}} href={'#/main/Merchant/Center?id=' + data.id} >
					{value}
				</a>;
			case 3:
				switch (+value) {
					case -1:
						return <span style={{color:'red'}}>已驳回</span>;
					case 0:
						return <a href="void:()" onClick={()=>this.__onCheck(data)}><span style={{color:'#8c8080'}}>待审核</span></a>;
					case 1:
						return <span style={{color:'#b36d06'}}>已审核(待下单)</span>;
					case 2:
						return <span style={{color:'green'}}>已验证(下单成功)</span>;
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
				action='/znadmin/model/updateNode'
				exts={{ model: this.props.model, where: { id: data.id } }}
				merge="data"
				value={Store.post('/znadmin/model/selectOne', { model: this.props.model, where: { id: data.id }})}
				style={{ margin: 25 }}
				syncSubmit={false}
				onSubmitSuccess={this.__doSuccess}
				btns={[
					{text: '确认', icon: 'fa-edit', type: 'submit', float: 'right', style: { marginRight:0 }},
					{text:'取消', type:'cancle', status: 'danger', float: 'right'}
				]}
				items={this.state.formItems} />
		});
	},
	__doSuccess: function (){
		Popup.close('dialog');
		Toast.success('操作成功');
		this.state.data.refresh();
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
			<UI.Page title='代理商管理' icon="fa-list-ul"
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
