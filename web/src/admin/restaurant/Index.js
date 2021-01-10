var React = require('react');
var QRCode = require('qrcode.react');
module.exports = React.createClass({
	getDefaultProps: function () {
		return {
			data: null,
			model: 'zn_hcredwine_restaurant'
		};
	},
	getInitialState: function () {
		return {
			data: Store.post('/znadmin/model/paging', {
				model: this.props.model
			}),
			items: [
				{ title: '二维码', name: 'code', width: 160, filter: { type: 'Input', opts: ['like'] } },
				{ title: '状态', name: 'status', width: 120, filter: { type: 'Select', data: [{ text:'已绑定', value: 1 }, { text: '未绑定', value: 0 }], opts: ['='] } },
				{ title: '姓名', name: 'name', width: 80, filter: { type: 'Input', opts: ['like'] } },
				{ title: '年龄', name: 'age', width: 50 },
				{ title: '性别', name: 'sex', width: 50 },
				{ title: '邮箱', name: 'email', width: 150 },
				{ title: '电话', name: 'phone', width: 100 },
				{ title: '省', name: 'province_convert', width: 80},
				{ title: '市', name: 'city_convert', width: 80 },
				{ title: '区', name: 'area_convert', width: 80 },
				{ title: '地址', name: 'address', width: 260 },
				{ title: '绑定时间', name: 'modifyTime', width: 140 },
				{ title: '生成时间', name: 'createTime', width: 140 },
				{ title: '备注', name: 'note', width: 200 },
				{ title: '描述', name: 'last' }
			],
			authFormItems: [
				{ title: '姓名', name: 'name', type: 'Input', disabled: true },
				{ title: '性别', name: 'sex', type: 'Input', disabled: true},
				{ title: '年龄', name: 'age', type: 'Input', disabled: true},
				{ title: '省', name: 'province_convert', type: 'Input', disabled: true},
				{ title: '市', name: 'city_convert', type: 'Input', disabled: true },
				{ title: '区', name: 'area_convert', type: 'Input', disabled: true },
				{ title: '地址', name: 'address', type: 'Textarea', disabled: true },
				{ title: '邮箱', name: 'email', type: 'Input', disabled: true },
				{ title: '电话', name: 'phone', type: 'Input', disabled: true },
				{ title: '身份证号码', name: 'IDNumber', type: 'Input', disabled: true },
				{ title: '身份证图片', name: 'IDImgs', isImage: true, type: 'FileUploader', disabled: true },
				{ title: '审核状态', name: 'status', type: 'Select', data: [{ text: '驳回(材料不合格)', value: -1 }, { text: '确认通过(材料合格)', value: 1 }] },
				{ title: '描述', name: 'note', type: 'Textarea' }
			]
		}
	},
	__onTableColumnRender: function (rowIndex, columnIndex, data, item, value){
		switch (columnIndex) {
			case 0:
				var _value = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx30e5bdf40c2d4b27&redirect_uri=http://wine.hu-chun.com/&response_type=code&scope=snsapi_userinfo&state="+value+"#wechat_redirect"
				return <QRCode value={_value} />;
			case 2:
				if(data.status>0){
					return <a style={{textDecoration:'underline'}} href={'#/main/Restaurant/Center?id=' + data.id + '&openId=' + data.openId} >
						{data.id + "、" + value}
					</a>;
				}else {
					return data.id + "、" + value;
				}
			case 1:
				switch (+value) {
					case -1:
						return <span style={{color:'red'}}>已锁定</span>;
					case 0:
						return <a href="void:()" onClick={()=>this.__onCheck(data)}><span style={{color:'#8c8080'}}>未绑定</span></a>;
					case 1:
						return <span style={{color:'#b36d06'}}>已绑定</span>;
					case 2:
						return <span style={{color:'green'}}>已验证</span>;
				}
		}
	},
	__onCheck: function (data) {
		return null;
		Popup.dialog({
			title: '签约',
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
				btns={[{text: '确认签约', icon: 'fa-edit', type: 'submit', float: 'right', style: { marginRight:0 }},{text:'取消', type:'cancle', status: 'danger', float: 'right'}]}
				items={this.state.authFormItems} />
		});
	},
	__doSuccess: function (){
		Popup.close('dialog');
		Toast.success('操作成功');
		this.state.data.refresh();
	},
	__generateRestaurant: function (){
		Popup.dialog({
			title: '批量创建酒楼二维码',
			hStyle: { backgroundColor: '#0B72A5' },
			width: 580,
			content: <UI.Form
				method="POST"
				layout="stacked"
				action='/hcredwine/restaurant/create'
				style={{ margin: 25 }}
				syncSubmit={false}
				onSubmitSuccess={this.__doSuccess}
				btns={[{text: '确认', icon: 'fa-edit', type: 'submit', float: 'right', style: { marginRight:0 }},{text:'取消', type:'cancle', status: 'danger', float: 'right'}]}
				items={[{type:'Input', name: 'count', title: '数量', attrs: {type:'number'}, required: true}]} />
		});
	},
	__onToolbarClick: function (rtitem){
		switch (rtitem.name) {
			case 'generate':
				this.__generateRestaurant();
				break;
		}
	},
	render: function(){
		return (
			<UI.Page title='酒楼管理' icon="fa-list-ul" toolbarItems={[{text:'生成酒楼二维码', name:'generate'}]} onToolbarClick={this.__onToolbarClick} >
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
