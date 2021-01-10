var React = require('react');
module.exports = React.createClass({
	getDefaultProps: function () {
		return {
			model: 'zn_hcredwine_user'
		};
	},
	getInitialState: function () {
		return {
			data: Store.post('/znadmin/model/paging', {
				model: this.props.model,
				where: this.props.where||{}
			}),
			items: [
				{ title: '用户名', name: 'nickname', width: 220, filter: { type: 'Input', opts: ['like'] } },
				{ title: 'OpenId', name: 'openid', width: 240, filter: { type: 'Input', opts: ['like'] } },
				//{ title: 'Unionid', name: 'unionid', width: 260, filter: { type: 'Input', opts: ['like'] } },
				{ title: '状态', name: 'status_convert', width: 80 },
				{ title: '性别', name: 'sex', width: 80 },
				{ title: '年龄', name: 'age', width: 60 },
				{ title: '国籍', name: 'country', width: 60 },
				{ title: '省', name: 'province', width: 60 },
				{ title: '城市', name: 'city', width: 60 },
				{ title: '地址', name: 'address', width: 300 },
				{ title: '备注', name: 'note' }
			]
		}
	},
	__onTableColumnRender: function (rowIndex, columnIndex, data, item, value){
		switch (columnIndex) {
			case 0:
				return <a style={{textDecoration:'underline'}} href={'#/main/User/Center?id=' + data.id} >
					<img style={{width: 24, height: 24, borderRadius: '50%', position: 'relative', top: 8, marginRight: 3}} src={Store.fixURL(data.headimgurl)} />
					{value}
				</a>;
			case 3:
				return value==1?'男':'女';
		}
	},
	render:function(){
		return (
			<UI.Page title='用户信息管理' icon="fa-newspaper-o" >
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
