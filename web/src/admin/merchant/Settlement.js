var React = require('react');
module.exports = React.createClass({
	getDefaultProps: function () {
		return {
			model: 'zn_hcredwine_merchant_settlement'
		};
	},
	getInitialState: function () {
		return {
			data: Store.post('/znadmin/model/paging', {
				model: this.props.model,
				where: {
					merchantId: this.props.merchantId
				}
			}),
			items: [
				{ title: '操作', width: 60, textAlign: 'center' },
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
			]
		}
	},
	__onTableColumnRender: function (rowIndex, columnIndex, data, item, value){
		switch (columnIndex) {
			case 0:
				return <img style={{width:48, height: 48}} src={Store.fixURL(value)} />;
			case 1:
				return <a style={{textDecoration:'underline'}} href={'#/main/Product/Info?id=' + data.id} >{value}</a>;
		}
	},
	render: function(){
		return (
			<UI.Page title='签约酒楼'>
				<UI.PagerView
					view="Table"
					checkbox={0}
					enableFilter={false}
					showHeader={true}
					data={this.state.data}
					columnRender={this.__onTableColumnRender}
					items={this.state.items}/>
			</UI.Page>
		);
	}
});
