var React = require('react');

module.exports = React.createClass({
	getInitialState: function() {
		var _uid = this.props.request.search.uid || 0;
    	return {
			currIndex: 0,
			tabItems: [
				{ text: '参拍中', status: 17 },
				{ text: '已结束', status: 18 },
				{ text: '已拍下', status: 19 }
			],
			userId: _uid,
			data: Store.post('/auction/my/pagingOrder', {
				userId: _uid
			})
		};
  	},
	componentDidMount: function (){
		this.fireClick(0);
	},
	fireClick: function (index){
		var _data = this.state.tabItems[index];
		if(_data){
			this.state.data._data.status = _data.status;
			this.state.data._data.pageIndex = 1;
			this.state.data.exec();
			this.setState({
				status: _data.status
			});
		}
	},
	__deleteProduct: function (item){
		var _self = this;
		Alert.show({
			title: '提示',
			content: '确定删除该提醒吗？',
			onConfirm: function (){
				var _token = Session.jsonKeyValue('WAP_LOGIN_USER_TOKEN');
				Store.post('/auction/product/notify', {
					cancle: 1,
                    userId: _token.id,
                    productId: item.id
				}).exec().then(function (data){
					Toast.success('删除成功！');
					if(_self._data){
						_self._data.refresh();
					}
				});
			}
		});
	},
	__itemRender: function (item, index){
		return <div key={index} className="product">
			<div className="title">
				<span>订单编号 {item.orderCode}</span>
			</div>
			<div className="info" onClick={()=>Session.jump('/product/info', { productId: item.productId })}>
				<img className="icon" src={Store.fixURL(item.product_logo)} />
				<div className="fields">
					<div>{item.productTitle}</div>
					<div>
						<div>拍卖编号 {item.bidCode}</div>
						<div>当前价 <span className="price">￥{item.price}</span></div>
					</div>
				</div>
			</div>
			<div className="order">
				<span className="time">{item.createTime}</span>
				<span className="delete" onClick={()=>this.__deleteProduct(item)}>删除</span>
			</div>
		</div>;
	},
	render: function(){
		return (
			<UI.Page
				title="我的订单"
				className="rt-order"
				bStyle={{ backgroundColor: '#f6f6f6' }}
				height={this.props.request.search.height} >
				<UI.FixedLayout
					direction="v"
					begin={35}
					unit="px"
					hStyle={{ borderBottom: '1px solid #3d3d3d' }} >
					<div className="header">
						{
							this.state.tabItems.map(function (item, index){
								return <div key={index} className={(this.state.status==item.status?'curr':'')} onClick={()=>this.fireClick(index)}>{item.text}</div>;
							}.bind(this))
						}
					</div>
					<div className="body">
						<UI.PagingList className="data-list" onData={this.__onData} data={this.state.data} itemRender={this.__itemRender} />
					</div>
				</UI.FixedLayout>
			</UI.Page>
		);
	}
});
