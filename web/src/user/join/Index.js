var React = require('react');
module.exports = React.createClass({
	render: function(){
		return (
			<UI.Page className="rt-join-index" bStyle={{backgroundColor:'#E7E7E7', textAlign: 'center'}} title="加盟" >
				<div className="types">
					<UI.Button text="代理商加盟" onClick={()=>Session.jump('/join/merchant')} />
					<UI.Button text="派送员加盟" onClick={()=>Session.jump('/join/courier')} />
				</div>
			</UI.Page>
		);
	}
});
