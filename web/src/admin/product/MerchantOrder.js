var React = require('react');
var OrderInfo = require('./MerchantOrderInfo.js');
module.exports = React.createClass({
	getDefaultProps: function () {
		return {
			model: 'zn_hcredwine_merchant_order'
		};
	},
	getInitialState: function () {
		return {
			data: Store.post('/znadmin/model/paging', {
				model: this.props.model
			}),
			items: [
				{ title: '订单编号', name: 'orderCode', width: 160, filter: { type: 'Input', opts: ['like'] } },
				{
					title: '支付状态',
					name: 'status',
					width: 80,
					popWidth: 120,
					filter: {
						type: 'Menu',
						data: [
							{ text: '已关闭', value: -1 },
							{ text: '待支付', value: 0 },
							{ text: '已支付', value: 1 },
							{ text: '已发货', value: 2 },
							{ text: '已完成', value: 3 }
						],
						opts: ['=']
					}
				},
				{ title: '数量(瓶)', name: 'productTotalCount', width: 80 },
				{ title: '总价(￥)', name: 'price', width: 80 },
				{ title: '提交时间', name: 'createTime', width: 140 },
				{ title: '快递单号', name: 'expressCode', width: 120 },
				{ title: '描述', name: 'note' }
			],
			toolbarItems: [
				//{ text: '过滤', icon: 'fa-plus' }
			]
		}
	},
	__doSuccess: function (){
		Popup.close('dialog');
		Toast.success('操作成功');
		this.state.data.refresh();
	},
	__showDetail: function (data) {
		Popup.dialog({
			title: '订单详情',
			hStyle: { backgroundColor: '#0B72A5' },
			width: 780,
			content: <OrderInfo onSubmitSuccess={()=>this.state.data.refresh()} orderCode={data.orderCode} />
		});
	},
	__onTableColumnRender: function (rowIndex, columnIndex, data, item, value){
		switch (columnIndex) {
			case 0:
				return <a style={{textDecoration:'underline'}} href="void:()" onClick={()=>this.__showDetail(data)} >
					{value}
				</a>;
			case 1:
				switch (+value) {
					case -1:
						return <span style={{color:'red'}}>已关闭</span>;
					case 0:
						return <a href="void:()" onClick={()=>this.__onPayOrder(data)}><span style={{color:'#8c8080'}}>待支付</span></a>;
					case 1:
						return <span style={{color:'green'}}>已支付</span>;
					case 2:
						return <span style={{color:'#00BCD4'}}>已发货</span>;
					case 3:
						return <span style={{color:'#919191'}}>已完成</span>;
				}
		}
	},
	render: function(){
		return (
			<UI.Page title='代理商订单'
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
