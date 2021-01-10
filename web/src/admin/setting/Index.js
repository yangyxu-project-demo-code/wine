var React = require('react');
module.exports = React.createClass({
	getDefaultProps: function () {
		return {
			model: 'zn_hcredwine_setting'
		};
	},
	getInitialState: function () {
		return {
			data: Store.post('/znadmin/model/paging', {
				model: this.props.model
			}),
			items: [
				{ title: '操作', width: 60, textAlign: 'center' },
				{ title: '状态', name: 'status', width: 100 },
				{ title: 'host', name: 'host', width: 200 },
				{ title: 'port', name: 'port', width: 100 },
				{ title: '服务热线', name: 'hotPhone', width: 180 },
				{ title: '描述', name: 'note' }
			],
			formItems: [
				{ title: 'host', name: 'host', type: 'Textarea' },
				{ title: 'port', name: 'port', type: 'Input' },
				{ title: '服务热线', name: 'hotPhone', type: 'Input' },
				{ title: '状态', name: 'status', type: 'Select', data: [{ text: '设置默认', value: 1 }, { text: '取消默认', value: 0 }] },
				{ title: '版本信息', name: 'version', type: 'RichEditor' },
				{ title: '拍卖协议', name: 'protocol', type: 'RichEditor' }
			],
			toolbarItems: [
				{ text: '添加', name: 'add', icon: 'fa-plus' }
			]
		}
	},
	__doSuccess: function (){
		Popup.close('dialog');
		Popup.message({
			content: '操作成功！',
			type: 'success'
		});
		this.state.data.refresh();
	},
	__addItem: function (pid){
		Popup.dialog({
			title: '添加设置',
			width: 680,
			content: <UI.Form
				method="POST"
				layout="stacked"
				action='/znadmin/model/insert'
				exts={{model: this.props.model}}
				merge="values"
				style={{ margin: 25 }}
				syncSubmit={false}
				onSubmitSuccess={this.__doSuccess}
				btns={[{text: '添加', icon: 'fa-plus', type: 'submit', float: 'right', style: { marginRight:0 }},{text:'取消', type:'cancle', status: 'danger', float: 'right'}]}
				items={this.state.formItems} />
		});
	},
	__updateItem: function (data){
		Popup.dialog({
			title: '更新设置',
			hStyle: { backgroundColor: '#0B72A5' },
			width: 680,
			content: <UI.Form
				method="POST"
				layout="stacked"
				action='/znadmin/model/update'
				exts={{model: this.props.model, where: { id: data.id } }}
				merge="updates"
				value={Store.post('/znadmin/model/selectOne', {model: this.props.model, where: { id: data.id }})}
				style={{ margin: 25 }}
				syncSubmit={false}
				onSubmitSuccess={this.__doSuccess}
				btns={[{text: '更新', icon: 'fa-edit', type: 'submit', float: 'right', style: { marginRight:0 }},{text:'取消', type:'cancle', status: 'danger', float: 'right'}]}
				items={this.state.formItems} />
		});
	},
	__onToolbarClick: function (item){
		switch (item.name) {
			case 'add':
				this.__addItem();
				break;
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
							{ text:'删除', icon: 'fa-remove' },
							{ text:'编辑', icon: 'fa-edit' },
						]}
						itemRender={(item, index)=>{return <i title={item.text} className={'fa '+item.icon} style={item.style} />}}
						onClick={(value)=>this.__onRowActions(value, data)}
						/>;
			case 1:
				return <a style={{textDecoration:'underline'}} href={'#/main/SettingInfo?id=' + data.id} >{data.status==0?<span style={{color: 'red'}}>非默认设置</span>:<span style={{color: 'green'}}>默认设置</span>}</a>;
		}
	},
	render:function(){
		return (
			<UI.Page title='版本设置管理' icon="fa-gear" toolbarItems={this.state.toolbarItems} onToolbarClick={this.__onToolbarClick} >
				<UI.PagerView
					view="Table"
					enableFilter={true}
					checkbox={0}
					showHeader={true}
					data={this.state.data}
					columnRender={this.__onTableColumnRender}
					onTableRowClick={this.__onTableRowClick}
					items={this.state.items}/>
			</UI.Page>
		);
	}
});
