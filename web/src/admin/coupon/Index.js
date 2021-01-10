var React = require('react');
module.exports = React.createClass({
	getDefaultProps: function () {
		return {
			data: null,
			model: 'zn_hcredwine_coupon'
		};
	},
	getInitialState: function () {
		var _where = {};
		if(this.props.data){
			_where.typeId = this.props.data.id;
		}
		this._cityData = Store.post('/znadmin/var/getByPid', { pid: -1 });

		return {
			data: Store.post('/znadmin/model/paging', {
				model: this.props.model
			}),
			items: [
				{ title: '操作', width: 60, textAlign: 'center' },
				{ title: '名称', name: 'title', width: 280, filter: { type: 'Input', opts: ['like'] } },
				{ title: '状态', name: 'status', width: 100, filter: { type: 'Menu', data: [{ text:'上线中', value: 1 }, { text: '已下线', value: 0 }], opts: ['='] } },
				{ title: '单价(元)', name: 'price', width: 100 },
				{ title: '发行价(元)', name: 'totalPrice', width: 100 },
				{ title: '发行量(张)', name: 'totalCount', width: 100 },
				{ title: '使用价(元)', name: 'usedPrice', width: 100 },
				{ title: '使用量(张)', name: 'usedCount', width: 100 },
				{ title: '剩余价(元)', name: 'leavePrice', width: 100 },
				{ title: '剩余量(张)', name: 'leaveCount', width: 100 },
				{ title: '折扣(%)', name: 'discount', width: 100 },
				{ title: '创建时间', name: 'createTime', width: 150 },
				{ title: '描述', name: 'note' }
			],
			formItems: [
				{ title: '名称', name: 'title', type: 'Input', required: true },
				{ title: '状态', name: 'status', type: 'Select', data: [{ text: '上架', value: 1 }, { text: '下架', value: 0 }], required: true },
				{ title: '发行价', name: 'totalPrice', type: 'Input', attrs: { type:'number' }, suffix: '￥', required: true },
				{ title: '单价', name: 'price', type: 'Input', attrs: { type:'number' }, suffix: '￥', required: true },
				//{ title: '折扣', name: 'discount', type: 'Input', attrs: { type:'number' }, suffix: '%' },
				{ title: '开始时间', name: 'beginTime', type: 'Timer' },
				{ title: '结束时间', name: 'endTime', type: 'Timer' },
				{ title: '描述', name: 'content', type: 'Textarea' }
			],
			toolbarItems: [
				{ text: '创建', icon: 'fa-plus' }
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
							where: {
								id: data.id
							}
						}).exec().then(function (data){
							Toast.success('删除成功！');
							_data.refresh();
						});
					}
				});
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
							{ text:'修改', icon: 'fa-edit' }
						]}
						itemRender={(item, index)=>{return <i title={item.text} className={'fa '+item.icon} style={item.style} />}}
						onClick={(value)=>this.__onRowActions(value, data)}
						/>;
			case 1:
				return <a style={{textDecoration:'underline'}} href={'#/main/Coupon/List?couponId=' + data.id} >{value}</a>;
			case 2:
				return +value==1?<span style={{color:'green'}}>上架中</span>:<span style={{color:'red'}}>已下架</span>;
		}
	},
	__updateItem: function (data){
		Popup.dialog({
			title: '修改',
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
			title: '添加商品',
			width: 780,
			content: <UI.Form
				method="POST"
				layout="block"
				action='/znadmin/model/insert'
				exts={{model: this.props.model}}
				hiddens={{ typeId: 0 }}
				merge="values"
				style={{ margin: 25 }}
				syncSubmit={false}
				onSubmitSuccess={this.__doSuccess}
				btns={[
					{text: '创建', icon: 'fa-plus', type: 'submit', float: 'right', style: { marginRight:0 }},
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
			<UI.Page title='优惠券管理' icon="fa-list-ul"
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
