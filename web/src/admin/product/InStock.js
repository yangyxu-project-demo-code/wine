var React = require('react');
var InStockItem = require('./InStockItem.js');
module.exports = React.createClass({
	getInitialState: function () {
		return {
			data: Store.post('/hcredwine/batch/pagingBatch', { merchantId: 1 }),
			formItems: [
				//{ title: '批次号', name: 'batchCode', type: 'Input' },
				{ name:'products', type:'EditableTable',
					headers: [
			            {
							title: '商品项',
							textKey: '{title}(￥{price}/瓶)',
							valueKey: 'id',
							name: 'productId',
							type: 'Select',
							onChange: function (value, input, row){
								row.setRowValue({
									productTypeId: value.typeId,
									price: value.price
								});
								return value.id;
							},
							data: Store.post('/znadmin/model/select', { model: 'zn_hcredwine_product' }),
							width: 80
						},
			            {
							title: '数量',
							name: 'count',
							type: 'Input',
							attrs: { type: 'number' },
							width: 80
						}
			        ]
				}
			],
			toolbarItems: [
				{ text: '入库', icon: 'fa-plus' }
			]
		}
	},
	__doSuccess: function (){
		Popup.close('dialog');
		Toast.success('操作成功');
		this.state.data.refresh();
	},
	__addItem: function (){
		Popup.dialog({
			title: '入库',
			width: 780,
			content: <UI.Form
				method="POST"
				layout="stacked"
				action='/hcredwine/batch/addBatch'
				exts={{ merchantId: 1 }}
				merge="data"
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
	__itemRender: function (data){
		return <InStockItem data={data} />;
	},
	render: function(){
		return (
			<UI.Page title='入库订单'
				onToolbarClick={this.__onToolbarClick}
				toolbarItems={this.state.toolbarItems} >
				<UI.PagerView
					view="ListView"
					className="x"
					data={this.state.data}
					itemRender={this.__itemRender} />
			</UI.Page>
		);
	}
});
