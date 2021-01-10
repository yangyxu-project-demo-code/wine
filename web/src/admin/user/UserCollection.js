var React = require('react');
module.exports = React.createClass({
	getInitialState: function () {
		return {
			data: Store.post('/auction/my/pagingCollection', {
				userId: this.props.userId
			})
		}
	},
	__listItemRender: function (data, index){
		return <div key={index} className="order-item" >
			<div className="product" onClick={()=>{
					if(data.productId){
						Session.jump('/main/Product/ProductInfo', { id: data.productId });
					}
				}}>
				<img className="logo" src={Store.fixURL(data.productLogo)} />
				<div className="info">
					<div className="title">
						{
							data.productId?<span>{data.productTitle}</span>:<span style={{color: 'red', fontWeight: 'bold'}}>{'系统已经不存在该商品详情'}</span>
						}
						<span className="create-time">{data.createTime}</span>
					</div>
					<div className="price"><span>预计</span><span>{data.beginTime}</span>开始</div>
					<div className="price"><span>在</span><span>{data.endTime}</span>结束</div>
					<div className="price"><span>保证金</span><span>￥{data.productEarnestMoney}</span></div>
				</div>
			</div>
		</div>;
	},
	render:function(){
		return (
			<UI.Page className="rt-user-order" title={'收藏'} icon="fa-star-o" bStyle={{backgroundColor:'#f1f1f1'}} >
				<UI.PagerView
					view="ListView"
					className="order-list"
					data={this.state.data}
					itemRender={this.__listItemRender} />
			</UI.Page>
		);
	}
});
