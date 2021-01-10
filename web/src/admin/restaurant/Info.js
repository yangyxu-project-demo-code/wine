var React = require('react');

module.exports = React.createClass({
	getInitialState: function () {
		return {
			info: null,
			model: 'zn_hcredwine_restaurant'
		}
	},
	componentDidMount: function (){
		this.__loadUserInfo();
	},
	__loadUserInfo: function (){
		Store.post('/znadmin/model/selectOne', {
			model: this.state.model,
			where: { openId: this.props.openId }
		}).exec().then(function (data){
			this.setState({
				info: data.result
			});
		}.bind(this));
	},
	render:function(){
		if(!this.state.info){
			return null;
		}
		return (
			<div className="user-info">
				<div className="info-form user-item">
					<div className="details">
						<div className="name">{this.state.info.name}</div>
						<div><i className="fa fa-clock-o" />注册时间：{this.state.info.createTime}</div>
						<div><i className="fa fa-envelope" />邮箱：{this.state.info.email}</div>
						<div><i className="fa fa-phone" />手机号：{this.state.info.phone}</div>
						<div>性别：{this.state.info.sex}</div>
						<div>年龄：{this.state.info.age}</div>
						<div>地址：{this.state.info.province_convert} / {this.state.info.city_convert} / {this.state.info.area_convert} / {this.state.info.address}</div>
						<div>认证备注：{this.state.info.note}</div>
					</div>
				</div>

				<div className="rt-panel c-defalut">
					<div className="p-head">身份证正反面扫描件</div>
					<div className="p-body">
						{
							this.state.info.IDImgs.split(',').map(function (img, index){
								if(img){
									return <img key={index} style={{width: '80%', margin: 5}} src={Store.fixURL(img)} />
								}else {
									return null;
								}
							})
						}
					</div>
				</div>
			</div>
		);
	}
});
