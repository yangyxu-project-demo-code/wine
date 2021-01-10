var React = require('react');

module.exports = React.createClass({
	getInitialState: function() {
		var _uid = this.props.request.search.uid || 0;
    	return {
			userId: _uid,
			data: Store.post('/auction/my/pagingCollection', {
				userId: _uid
			}),
			count: 0
		};
  	},
	__deleteProduct: function (data){
		var _self = this;
		Alert.show({
			title: '提示',
			content: '确定取消收藏吗？',
			onConfirm: function (){
				Store.post('/auction/product/collect', {
					cancle: 1,
					userId: _self.state.userId,
					productId: data.id
				}).exec().then(function (data){
					Toast.success('取消成功！');
					_self.state.data.refresh();
				});
			}
		});
	},
	__itemRender: function (item, index){
		return (
			<div className="product">
				<div className="info" onClick={()=>Session.jump('/product/info', { productId: item.id })}>
					<img className="icon" src={Store.fixURL(item.logo)} />
					<div className="fields">
						<div>{item.title}</div>
						<div>当前价 <span className="price">￥{Math.max(item.currentPrice, item.beginPrice)}</span></div>
					</div>
				</div>
				<div className="order">
					<span className="time">将于 {item.endTime} 结束</span>
					<span className="delete" onClick={()=>this.__deleteProduct(item)}>取消</span>
				</div>
			</div>
		);
	},
	__onData: function (data){
		this.setState({
			count: data.result[1][0].count
		});
	},
	render: function(){
		return (
			<UI.Page title={"我的收藏 ("+this.state.count+")"} className="rt-remind" height={this.props.request.search.height} >
				<UI.PagingList className="data-list" onData={this.__onData} data={this.state.data} itemRender={this.__itemRender} />
			</UI.Page>
		);s
	}
});
