var React = require('react');
var ProductList = require('./ProductList.js');

module.exports = React.createClass({
	getDefaultProps: function () {
		return {
			model: 'zn_hcredwine_product_type',
			title: '商品管理',
			leftWidth: 16,
			pid: 0,
			fields: [
				{ title: 'Logo', name: 'img', type: 'ImageUploader', action: '/auction/uploadFiles' },
				{ title: '名称', type: 'Input', name: 'title' },
				{ title: '别名', type: 'Input', name: 'alias' },
				{ title: '图标', type: 'Input', name: 'icon' },
				{ title: '属性集', type: 'TreeListView',  disabled: false, cascade: false, enableCheckbox: true, activeAll: false, data: Store.post('/znadmin/model/select', { model: 'zn_admin_var', where: { pid: 3 } }), name: 'vars' },
				{ title: '图片', name: 'imgs', type: 'FileUploader', action: '/auction/uploadFiles' },
				{ title: '扩展', type: 'Textarea', name: 'ext' },
				{ title: '描述', type: 'Textarea', name: 'note' }
			]
		};
	},
	__rightRender: function (tree){
		var _currItem = tree.state.currItem;
		return <ProductList data={_currItem?_currItem.props.data:null} />;
	},
	__itemContentRender: function (item){
		//console.log(item);
		return <div style={{ display: 'inline-flex', lineHeight: '40px', position: 'relative', top: 8 }}>
			<img style={{width: 32, height: 32, margin: 5}} src={Store.fixURL(item.data.img)} />
			<span>{item.data.title}</span>
		</div>
	},
	render:function(){
		return (
			<PluginModel.TreeModelView itemContentRender={this.__itemContentRender} {...this.props} rightRender={this.__rightRender} />
		);
	}
});
