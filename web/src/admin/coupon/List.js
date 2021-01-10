var React = require('react');
module.exports = React.createClass({
	getDefaultProps: function () {
		return {
			model: 'zn_hcredwine_user_coupon'
		};
	},
	getInitialState: function () {
		var _where = {};
		if(this.props.couponId){
			_where.couponId = this.props.couponId;
		}

		return {
			data: Store.post('/znadmin/model/paging', {
				model: this.props.model,
				where: _where
			}),
			items: [
				{ title: '操作', width: 60, textAlign: 'center' },
				{ title: '编号', name: 'code', width: 150 },
				{ title: '状态', name: 'status', width: 60, filter: { type: 'Menu', data: [{ text:'已使用', value: 1 }, { text: '未使用', value: 0 }], opts: ['='] } },
				{ title: '抵扣价', name: 'price', width: 80 },
				{ title: '订单满额', name: 'minOrderPrice', width: 80 },
				{ title: '折扣', name: 'discount', width: 80 },
				{ title: '抵扣订单', name: 'orderCode', width: 150 },
				{ title: '抵扣时间', name: 'usedTime', width: 150 },
				{ title: '有效期', name: 'beginTime', width: 280 },
				{ title: '创建时间', name: 'createTime', width: 150 },
				{ title: '描述', name: 'note' }
			],
			formItems: [
				{ title: '状态', name: 'status', type: 'Select', data: [{ text: '激活', value: 1 }, { text: '未激活', value: 0 }] },
				{ title: '最低价', name: 'minOrderPrice', type: 'Input', attrs: { type:'number' }, suffix: '￥' }
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
				return +value==1?<span style={{color:'green'}}>已使用</span>:<span style={{color:'red'}}>未使用</span>;
			case 2:
			case 3:
				return (value||'0')+'￥';
			case 5:
				return value;
			case 7:
				return data.beginTime + ' ~ ' + data.endTime;
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
	render: function(){
		return (
			<UI.Page title='优惠券列表'>
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
