var React = require('react');
module.exports = React.createClass({
	getInitialState: function () {
		return {
			data: []
		}
	},
	componentDidMount: function (){
		Store.post('/znadmin/model/select', {
			model: 'zn_hcredwine_merchant_product_stock_batch_detail',
			where: {
				batchId: this.props.data.id
			}
		}).exec().then(function (data){
			this.setState({
				data: data.result
			});
		}.bind(this));
	},
	render: function(){
		var _value = this.props.data;
		return (
			<div className="rt-product-instockitem">
				<div className="head">
					<span>批次单号 {_value.batchCode}</span>
					<span>提交时间 {_value.createTime}</span>
				</div>

				<div className="body">
					<div>瓶数：{_value.totalNumber} 瓶  总价：{_value.totalPrice} 人民币</div>
					<ul className="detail-list">
						<li className="detail-item">
							<span>编号</span>
							<span>产品</span>
							<span>数量</span>
						</li>
						{
							this.state.data.map(function (item, index){
								return <li className="detail-item" key={index}>
									<span>{item.id}</span>
									<span>{item.productId}</span>
									<span>{item.count}</span>
								</li>;
							}.bind(this))
						}
					</ul>
				</div>
			</div>
		);
	}
});
