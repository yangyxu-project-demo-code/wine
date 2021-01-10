var React = require('react');
module.exports = React.createClass({
	getDefaultProps: function () {
		return {

		};
	},
	getInitialState: function () {
		return {
			data: Store.post('/hcredwine/merchant/pagingStock', {
				merchantId: 1
			}),
			items: [
				{ title: '图片', name: 'productLogo', width: 60},
				{ title: '商品名称', name: 'productTitle', width: 280},
				{ title: '单位', name: 'productUnit', width: 100 },
				{ title: '单价', name: 'productPrice', width: 100 },
				{ title: '库存', name: 'count', width: 100 },
				{ title: '描述', name: 'note' }
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
			<UI.Page title='商品库存'>
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
