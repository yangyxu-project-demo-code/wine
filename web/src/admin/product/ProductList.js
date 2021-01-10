var React = require('react');
module.exports = React.createClass({
	getDefaultProps: function () {
		return {
			data: null,
			model: 'zn_hcredwine_product'
		};
	},
	componentWillReceiveProps: function (nextProps){
		if(nextProps.data!==this.props.data){
			this.state.data._data.where = {
				typeId: nextProps.data.id
			};
			this.state.data.exec();
		}
	},
	getInitialState: function () {
		var _where = {};
		if(this.props.data){
			_where.typeId = this.props.data.id;
		}
		this._cityData = Store.post('/znadmin/var/getByPid', { pid: -1 });

		return {
			data: Store.post('/znadmin/model/paging', {
				model: this.props.model,
				where: _where
			}),
			items: [
				{ title: '操作', width: 60, textAlign: 'center' },
				{ title: '商品名称', name: 'title', width: 280, filter: { type: 'Input', opts: ['like'] } },
				{ title: '状态', name: 'status', width: 100, filter: { type: 'Menu', data: [{ text:'上线中', value: 1 }, { text: '已下线', value: 0 }], opts: ['='] } },
				{ title: '别名', name: 'alias', width: 120 },
				{ title: '类型', name: 'typeId_convert', width: 70 },
				{ title: '原始价', name: 'price', width: 100 },
				{ title: '代理价', name: 'proxyPrice', width: 100 },
				{ title: '促销价', name: 'discountPrice', width: 100 },
				{ title: '修改时间', name: 'modifyTime', width: 150 },
				{ title: '创建时间', name: 'createTime', width: 150 },
				{ title: '描述', name: 'note' }
			],
			formItems: [
				{ title: 'Logo', name: 'logo', type: 'ImageUploader', action: '/hcredwine/uploadFiles' },
				{ title: '名称', name: 'title', type: 'Textarea' },
				{ title: '别名', name: 'alias', type: 'Input' },
				{ title: '状态', name: 'status', type: 'Select', data: [{ text: '上架', value: 1 }, { text: '下架', value: 0 }] },
				{ title: '原价', name: 'price', type: 'Input', attrs: { type:'number' }, suffix: '￥' },
				{ title: '代理价', name: 'proxyPrice', type: 'Input', attrs: { type:'number' }, suffix: '￥' },
				{ title: '促销价', name: 'discountPrice', type: 'Input', attrs: { type:'number' }, suffix: '￥' },
				{ title: '单位', name: 'unit', type: 'Input', placeholder: '个/套/件/品/瓶' },
				{ title: '图片', name: 'imgs', type: 'FileUploader', action: '/hcredwine/uploadFiles' },
				{ title: '视频', name: 'videos', type: 'FileUploader', action: '/hcredwine/uploadFiles' },
				{ title: '描述', name: 'detail', type: 'RichEditor' }
			],
			toolbarItems: [
				{ text: '添加', icon: 'fa-plus' }
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
							{ text:'删除商品', icon: 'fa-remove' },
							{ text:'修改商品', icon: 'fa-edit' }
						]}
						itemRender={(item, index)=>{return <i title={item.text} className={'fa '+item.icon} style={item.style} />}}
						onClick={(value)=>this.__onRowActions(value, data)}
						/>;
			case 1:
				return <a style={{textDecoration:'underline'}} href={'#/main/Product/ProductInfo?id=' + data.id} >
					<img style={{width: 24, height: 24, borderRadius: '50%', position: 'relative', top: 8, marginRight: 3}} src={Store.fixURL(data.logo)} />
					{value}
				</a>;
			case 2:
				return +value==1?<span style={{color:'green'}}>上架中</span>:<span style={{color:'red'}}>已下架</span>;
			case 5:
			case 6:
			case 7:
				return (value||'0')+'￥';
		}
	},
	__updateItem: function (data){
		Popup.dialog({
			title: '修改商品信息',
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
	__addItem: function (pid){
		/*
		if(!this.props.data){
			Toast.warning('请先选择左边商品类型项');
			return false;
		}
		hiddens={{ typeId: this.props.data.id }}
		*/
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
	render: function(){
		return (
			<UI.Page title='商品列表' icon="fa-list-ul"
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
