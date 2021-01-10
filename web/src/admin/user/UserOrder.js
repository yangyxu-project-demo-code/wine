var React = require('react');
var UserOrder = require('../../user/main/Order.js');
module.exports = React.createClass({
	render:function(){
		return (
			<UserOrder userId={this.props.userId} />
		);
	}
});
