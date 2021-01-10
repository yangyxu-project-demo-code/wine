var React = require('react');

module.exports = React.createClass({
	getInitialState: function () {
		return {
			info: null,
			model: 'zn_hcredwine_user'
		}
	},
	componentDidMount: function (){
		this.__loadUserInfo();
	},
	__loadUserInfo: function (){
		Store.post('/znadmin/model/selectOne', {
			model: this.state.model,
			where: { id: this.props.userId }
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
					<img className="avatar" src={this.state.info.headimgurl} />
					<div className="details">
						<span className="last-logintime">最近一次登录时间：{this.state.info.lastLoginTime||'还未登陆'}</span>
						<div className="name">{this.state.info.nickname}</div>
						<div><i className="fa fa-clock-o" />注册时间：{this.state.info.createTime}</div>
						<div>OpenId：{this.state.info.openId}</div>
						<div>地址：{this.state.info.country} / {this.state.info.province} / {this.state.info.city}</div>
						<div>年龄：{this.state.info.age}</div>
						<div>性别：{this.state.info.sex==1?'男':'女'}</div>
						<div>{this.state.info.note}</div>
					</div>
				</div>
			</div>
		);
	}
});
