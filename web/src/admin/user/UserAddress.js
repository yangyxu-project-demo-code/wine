var React = require('react');
var View = require('../../user/my/Address.js');
module.exports = React.createClass({
	render:function(){
		return (
			<View userId={this.props.userId} />
		);
	}
});
