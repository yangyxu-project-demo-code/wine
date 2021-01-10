var React = require('react');

module.exports = React.createClass({
	getInitialState: function() {
    	return {
			data: null
		};
  	},
	componentDidMount: function(){
		this.__loadData();
	},
    __loadData: function (){
		Store.post('/znadmin/model/selectOne', {
			model: 'zn_hcredwine_product',
			where: {
				id: this.props.request.search.productId
			}
        }).exec().then(function (data){
            this.setState({
                data: data.result
            });
        }.bind(this));
    },
	__renderData: function (){
		var _data = this.state.data;
		var _imgs = _data.imgs.split(',');
		_imgs.pop();
		_imgs.shift();

		_imgs = _imgs.map(function (value){
			return Store.fixURL(value);
		});
		return <div className="container">
			<UI.Slider style={{height: 240}} autoPlayInterval={2e3}>
				{
					_imgs.map(function (value, index){
						return <img key={index} src={value} />;
					})
				}
			</UI.Slider>
			<div className="part">
				<div className="title">{_data.title}</div>
				<div className="alias">{_data.alias}</div>
				<div className="price">
					￥{_data.price.toFixed(2)}/{_data.unit}
				</div>
			</div>
			<div className="info">
				<div className="desc" dangerouslySetInnerHTML={{ __html: _data.detail }}></div>
				<div className="imgs">
					{
						_imgs.map(function (value, index){
							return <img key={index} src={value} />;
						})
					}
				</div>
			</div>
		</div>;
	},
	__onAddToShoppingCart: function (){
		Store.post('/hcredwine/my/addToShoppingCart', {
			userId: 1,
			productId: this.state.data.id
		}).exec().then(function (){
			alert('添加成功');
		});
	},
	__renderFooter: function (){
		if(this.state.data){
			return <div className="action">
				<a className={"btn "} onClick={()=>this.__onAddToShoppingCart()} >
					<i className="fa fa-cart-plus" />
					<span>加入购物车</span>
				</a>
				<a className="apply" onClick={()=>Session.jump('/order/create', { pid: this.state.data.id })}>
					<span>立即购买</span>
					<span>(金额 ￥{this.state.data.price.toFixed(2)})</span>
				</a>
			</div>;
		}
	},
	render: function(){
		//end={(this.state.data?45:0)}
		return (
			<UI.Page
				className="rt-product-info"
				bStyle={{backgroundColor: '#f6f6f6'}}
				footerView={this.__renderFooter()}
				end={(0)}
				title="商品详情" >
				{
					this.state.data?this.__renderData():<UI.DataLoader loader="timer" content="加载中..." />
				}
			</UI.Page>
		);
	}
});
