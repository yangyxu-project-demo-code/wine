var React = require('react');

module.exports = React.createClass({
	getInitialState: function () {
		this._cityData = Store.post('/znadmin/var/getByPid', { pid: -1 });
		return {
			toolbarItems: [{icon:'fa-edit', text: '修改商品信息', onClick: this.__onEdit}],
			info: null,
			formItems: [
				{ title: 'Logo', name: 'logo', type: 'ImageUploader', action: '/auction/uploadFiles' },
				{ title: '名称', name: 'title', type: 'Textarea' },
				{ title: '别名', name: 'alias', type: 'Input' },
				{
					title: '省',
					name: 'province',
					type: 'Select',
					data: Store.post('/znadmin/var/getByPid', { pid: 11 }),
					onChange: function (data){
						if(data){
							this._cityData._data.pid = data.value;
							this._cityData.exec();
						}
					}.bind(this)
				},
				{ title: '城市', name: 'city', type: 'Select', data: this._cityData },
				{ title: '地址', name: 'address', type: 'Textarea' },
				{ title: '状态', name: 'status', type: 'Select', data: [{ text: '上架', value: 1 }, { text: '下架', value: 0 }] },
				{ title: '类型', name: 'vars', type: 'CheckboxGroup', data: Store.post('/znadmin/var/getByPid', { pid: 10 }) },
				{ title: '开始时间', name: 'beginTime', type: 'Timer' },
				{ title: '结束时间', name: 'endTime', type: 'Timer' },
				{ title: '起拍价', name: 'beginPrice', type: 'Input', attrs: { type:'number' }, suffix: '￥' },
				{ title: '保留价', name: 'reservePrice', type: 'Input', attrs: { type:'number' }, suffix: '￥' },
				{ title: '预估价', name: 'evaluatePrice', type: 'Input', attrs: { type:'number' }, suffix: '￥' },
				{ title: '加价幅度', name: 'increaseStep', type: 'Input', attrs: { type:'number' }, suffix: '￥' },
				{ title: '保证金', name: 'earnestMoney', type: 'Input', attrs: { type:'number' }, suffix: '￥' },
				{ title: '佣金', name: 'brokerage', type: 'Input' },
				{ title: '延时周期', name: 'delayPeriod', type: 'Input', attrs: { type:'number' }, suffix: '秒' },
				{ title: '单位', name: 'unit', type: 'Input', placeholder: '个/套/件/品' },
				{ title: '图片', name: 'imgs', type: 'FileUploader', action: '/auction/uploadFiles' },
				{ title: '视频', name: 'videos', type: 'FileUploader', action: '/auction/uploadFiles' },
				{ title: '拍品参数', name: 'argv', type: 'RichEditor' },
				{ title: '竞买公告', name: 'gongGao', type: 'RichEditor' },
				{ title: '竞买须知', name: 'xuZhi', type: 'RichEditor' },
				{ title: '竞买帮助', name: 'bangZhu', type: 'RichEditor' },
				{ title: '描述', name: 'note', type: 'RichEditor' }
			]
		}
	},
	componentDidMount: function (){
		this.__loadUserInfo();
	},
	__doSuccess: function (){
		Popup.close('dialog');
		Popup.message({
			content: '修改成功',
			type: 'success'
		});
		this.__loadUserInfo();
	},
	__onEdit: function (data){
		Popup.dialog({
			title: '修改商品信息',
			hStyle: { backgroundColor: '#0B72A5' },
			width: 780,
			content: <UI.Form
				method="POST"
				layout="stacked"
				action='/znadmin/model/update'
				exts={{ model: 'zn_auction_product', where: { id: this.state.info.id } }}
				merge="values"
				value={this.state.info}
				style={{ margin: 25 }}
				syncSubmit={false}
				onSubmitSuccess={this.__doSuccess}
				btns={[{text: '修改', icon: 'fa-edit', type: 'submit', float: 'right', style: { marginRight:0 }},{text:'取消', type:'cancle', status: 'danger', float: 'right'}]}
				items={this.state.formItems} />
		});
	},
	__loadUserInfo: function (){
		Store.post('/znadmin/model/selectOne', {
			model: 'zn_auction_product',
			where: { id: this.props.id }
		}).exec().then(function (data){
			this.setState({
				info: data.result,
			});
		}.bind(this));
	},
	render:function(){
		if(!this.state.info){
			return null;
		}
		var _imgs = this.state.info.imgs.split(','),
			_videos = this.state.info.videos.split(',');
		return (
			<UI.Page title={this.state.info.title} icon="fa-newspaper-o" toolbarItems={this.state.toolbarItems} >
				<div className="product-info">
					<div className="info-form">
						<img className="avatar" src={Store.fixURL(this.state.info.logo)} />
						<div className="details">
							<div className="fields">
								<div>
									<span className="key">围观</span>
									<span className="value">{this.state.info.watchCount+'次'}</span>
								</div>
								<div>
									<span className="key">报名</span>
									<span>{this.state.info.applyCount+'人'}</span>
								</div>
								<div>
									<span className="key">提醒</span>
									<span>{this.state.info.notifyCount+'人'}</span>
								</div>
							</div>
							<div className="fields">
								<div>
									<span className="key">起拍价</span>
									<span>{this.state.info.beginPrice+'￥'}</span>
								</div>
								<div>
									<span className="key">加价幅度</span>
									<span>{this.state.info.increaseStep+'￥'}</span>
								</div>
								<div>
									<span className="key">保留价</span>
									<span>{this.state.info.evaluatePrice+'￥'}</span>
								</div>
							</div>
							<div className="fields">
								<div>
									<span className="key">保证金</span>
									<span>{this.state.info.earnestMoney+'￥'}</span>
								</div>
								<div>
									<span className="key">拍卖佣金</span>
									<span>{this.state.info.brokerage+'￥'}</span>
								</div>
								<div>
									<span className="key">延时周期</span>
									<span>{this.state.info.delayPeriod +'秒'}</span>
								</div>
							</div>
						</div>
					</div>

					<div className="rt-card">
						<div className="card-header">拍品描述</div>
						<div className="card-body">
							<div dangerouslySetInnerHTML={{ __html: this.state.info.note }}></div>
							<ul>
							{
								_imgs.map(function (path, index){
									if(path){
										return <li key={index} style={{padding:5, margin:5}}>
											<img style={{width: '100%'}} key={index} src={Store.fixURL(path)} />
										</li>;
									}
								})
							}
							</ul>
							<ul>
							{
								_videos.map(function (path, index){
									if(path){
										return <li key={index} style={{padding:5, margin:5}}>
											<video width="320" height="240" controls="controls">
												<source src={Store.fixURL(path)} type="video/mp4" />
												<source src={Store.fixURL(path)} type="video/ogg" />
												<source src={Store.fixURL(path)} type="video/webm" />
												<object data={Store.fixURL(path)} width="320" height="240">
													<embed src="movie.swf" width="320" height="240" />
												</object>
											</video>
										</li>;
									}
								})
							}
							</ul>
						</div>
					</div>

					<div className="rt-card">
						<div className="card-header">拍品参数</div>
						<div className="card-body">
							<div dangerouslySetInnerHTML={{ __html: this.state.info.argv }}></div>
						</div>
					</div>

					<div className="rt-card">
						<div className="card-header">竞买公告</div>
						<div className="card-body">
							<div dangerouslySetInnerHTML={{ __html: this.state.info.gongGao }}></div>
						</div>
					</div>

					<div className="rt-card">
						<div className="card-header">竞买须知</div>
						<div className="card-body">
							<div dangerouslySetInnerHTML={{ __html: this.state.info.xuZhi }}></div>
						</div>
					</div>

					<div className="rt-card">
						<div className="card-header">竞买帮助</div>
						<div className="card-body">
							<div dangerouslySetInnerHTML={{ __html: this.state.info.help }}></div>
						</div>
					</div>

				</div>
			</UI.Page>
		);
	}
});
