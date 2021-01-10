var React = require('react');
var OrderInfo = require('../product/UserOrderInfo.js');
module.exports = React.createClass({
	getDefaultProps: function () {
		return {
			data: null,
			model: 'zn_hcredwine_merchant_settlement'
		};
	},
	getInitialState: function () {
		return {
			data: Store.post('/znadmin/model/paging', {
				model: this.props.model,
				order: 'createTime asc'
			}),
			items: [
				{ title: '订单编号', name: 'orderCode', width: 150, filter: { type: 'Input', opts: ['like'] } },
				{
					title: '类型',
					name: 'type',
					width: 100,
					popWidth: 120,
					filter: {
						type: 'Menu',
						data: [
							{ text: '提现', value: -1 },
							{ text: '收入', value: 1 }
						],
						opts: ['=']
					}
				},
				{
					title: '状态',
					name: 'status',
					width: 100,
					popWidth: 120,
					filter: {
						type: 'Menu',
						data: [
							{ text: '待审核', value: 0 },
							{ text: '已审核', value: 1 }
						],
						opts: ['=']
					}
				},
				{ title: '金额(元)', name: 'value', width: 150 },
				{ title: '结余(元)', name: 'balance', width: 150 },
				{ title: '审核时间', name: 'modifyTime', width: 140 },
				{ title: '申请时间', name: 'createTime', width: 140 },
				{ title: '备注', name: 'note', width: 240 },
				{ title: '', name: 'note' }
			],
			toolbarItems: []
		}
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
				return <a style={{textDecoration:'underline'}} href="javascript:void(0);" onClick={()=>this.__showDetail(data)} >
					{value}
				</a>;
			case 1:
				switch (+value) {
					case -1:
						return <span style={{color:'red'}}>提现</span>;
					case 1:
						return <span style={{color:'green'}}>收入</span>;
				}
			case 2:
				switch (+value) {
					case -1:
						return <span style={{color:'green'}}>已驳回</span>;
					case 0:
						return <a href="void:()" onClick={()=>this.__onCheck(data)}><span style={{color:'#8c8080'}}>待审核</span></a>;
					case 1:
						return <span style={{color:'green'}}>已审核</span>;
				}
			case 3:
				return (data.type==1?'+':'-')+value;
		}
	},
	__onCheck: function (data) {
		Store.post('/znadmin/model/selectOne', {
			model: 'zn_hcredwine_merchant',
			fields: 'id, settlementAmount, bankCardAccount',
			where: {
				openId: data.openId
			}
		}).exec().then(function (value){
			var _data = value.result;
			if(_data.settlementAmount<data.value){
				alert('提取金额余额不足');
			}else {
				Popup.dialog({
					title: '审核结算',
					hStyle: { backgroundColor: '#0B72A5' },
					width: 780,
					content: <UI.Form
						method="POST"
						layout="stacked"
						action='/hcredwine/merchant/confirmWithdraw'
						style={{ margin: 25 }}
						syncSubmit={false}
						onSubmitSuccess={this.__doSuccess}
						btns={[
							{text: '确认', icon: 'fa-edit', type: 'submit', float: 'right', style: { marginRight:0 }},
							{text:'取消', type:'cancle', status: 'danger', float: 'right'}
						]}
						items={[
							{ title: '银行账号', name: 'account', type: 'Input', value: _data.settlementAmount },
							{ title: '审核状态', name: 'status', type: 'Select', data: [{ text: '驳回', value: -1 }, { text: '审核通过', value: 1 }] },
							{ title: '备注', name: 'note', type: 'Textarea' }
						]} />
				});
				console.log(merchant);
			}
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
			<UI.Page title='代理商结算' icon="fa-list-ul"
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
