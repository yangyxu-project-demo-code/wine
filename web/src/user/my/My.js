var React = require('react');

module.exports = React.createClass({
	getInitialState: function() {
		var _info = Session.jsonKeyValue('WAP_LOGIN_USER_TOKEN');
    	return {
			info: _info,
			items: [
				{ title: '订单', icon: 'fa-reorder', uri: '/main/order' },
				{ title: '优惠券', icon: 'fa-ticket', uri: '/my/coupon' },
				{ title: '地址', icon: 'fa-address-book-o', uri: '/my/address' }
			]
		};
  	},
	componentDidMount: function (){
		this.__loadRoleData();
	},
	__loadRoleData: function (){
		Store.post('/hcredwine/user/getUserByOpenId', {
			openId: this.state.info.openid
		}).exec().then(function (data){
			if(this.isMounted()){
				this.setState({
					info: data.result
				});
				Session.setKeyValue('WAP_LOGIN_USER_TOKEN', data.result);
			}
		}.bind(this));
	},
	__onItemClick: function (item, index){
		if(item.uri){
			Session.jump(item.uri, { uid: this.state.info.id });
		}
	},
	__itemRender: function(item, index){
		if(item.phone){
			return <a href={'tel:' + item.phone} style={{color: '#3d3d3d'}}>
				<i style={{margin:5, width: 16}} className={'fa ' +item.icon} />
				{item.title}
				<i style={{float:'right',margin:3, marginTop: 12, width: 16}} className='fa fa-angle-right' />
			</a>;
		} else {
			return <div onClick={()=>this.__onItemClick(item, index)}>
				<i style={{margin:5, width: 16}} className={'fa ' +item.icon} />
				{item.title}
				<i style={{float:'right',margin:3, marginTop: 12, width: 16}} className='fa fa-angle-right' />
			</div>;
		}
	},
	render:function(){
		if(!this.state.info){
			return <UI.DataLoader loader="timer" content="加载中..." />;
		}
		var _img = this.state.info.headimgurl,
			_menus = [];
		if(!_img){
			_img = './images/logo/Icon.png';
		}
		switch (this.state.info.role) {
			case 'merchant':
				_menus = [
					{ title: '代理商认证', icon: 'fa-address-card-o', uri: '/merchant/auth' }
				];
				if(this.state.info.merchantStatus>0){
					_menus = _menus.concat([
						{ title: '商品库存', icon: 'fa-pie-chart', uri: '/merchant/stock' },
						{ title: '进货', icon: 'fa-cart-plus', uri: '/merchant/createStockOrder' },
						{ title: '进货订单', icon: 'fa-indent', uri: '/merchant/instock' },
						{ title: '卖出订单', icon: 'fa-share-square-o', uri: '/merchant/outstock' },
						{ title: '订单结算', icon: 'fa-calculator', uri: '/merchant/settlement' }
					]);
				}
				break;
			case 'courier':
				_menus = [
					{ title: '送货员认证', icon: 'fa-address-card-o', uri: '/courier/auth' }
				];
				if(this.state.info.courierStatus>1){
					_menus = _menus.concat([
						{ title: '送货订单', icon: 'fa-list', uri: '/courier/order' },
						{ title: '送货消息', icon: 'fa-snapchat', uri: '/courier/message' },
						{ title: '订单结算', icon: 'fa-calculator', uri: '/courier/settlement' }
					]);
				}
				break;
			case 'restaurant':
				_menus = [
					{ title: '酒楼信息', icon: 'fa-address-card-o', uri: '/restaurant/auth' },
					{ title: '订单结算', icon: 'fa-calculator', uri: '/restaurant/settlement' }
				];
				break;
		}
		return (
			<div className="rt-my" >
				<div className="my">
					<a className="edit" onClick={()=>Session.jump('/my/infoedit')}>
						<i className="fa fa-edit" />
					</a>
					<div className="info">
						<img className="avatar" src={_img} />
						<span className="title">{this.state.info.nickname}</span>
						<div>
							<span>{this.state.info.country} {this.state.info.city}</span>
						</div>
					</div>
				</div>
				<ul className="rt-ul rt-list">
					{
						this.state.items.map(function (item, index){
							return <li key={index}>
								{this.__itemRender(item, index)}
							</li>;
						}.bind(this))
					}
				</ul>
				<ul className="rt-ul rt-list">
					{
						_menus.map(function (item, index){
							return <li key={index}>
								{this.__itemRender(item, index)}
							</li>;
						}.bind(this))
					}
				</ul>
				<ul className="rt-ul rt-list">
					{
						[
							//{ title: '版本信息', icon: 'fa-info-circle', uri: '/setting/version' },
							//{ title: '购买规则及协议', icon: 'fa-anchor', uri: '/setting/protocol' }
						].map(function (item, index){
							return <li key={index}>
								{this.__itemRender(item, index)}
							</li>;
						}.bind(this))
					}
				</ul>
			</div>
		);
	}
});
