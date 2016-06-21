/**
 * JSON数组,保存所需要的数据
 * 接入数据模型
 */
var data = [
	{id:1, author:"Pete Hunt", text:"This is one comment"},
	{id:2, author:"Jordan Walke", text:"This is *author* comment"}
];
/**
 * 构建Comment组件，使用props属性
 * 使用markdown格式
 * 利用remarkable包正真的渲染HTML
 */
var Comment = React.createClass({
	rawMarkup:function() {
		var md = new Remarkable();
		var rawMarkup = md.render(this.props.children.toString());
		return { __html: rawMarkup};
	},
	render:function() {
		return (
			<div className="comment">
				<h2 className="commentAuthor">
					{this.props.author}
				</h2>
				<span dangerouslySetInnerHTML={this.rawMarkup()} />
			</div>
		);
	}
});
/**
 * 构建CommentList组件
 * 添加组件属性
 * 动态渲染数据
 */
var CommentList = React.createClass({
	render:function() {
		var commentNodes = this.props.data.map(function(comment){
			return (
				<Comment author={comment.author} key={comment.id}>
					{comment.text}
				</Comment>
			);
		});
		return (
			<div className="commentList">
				{commentNodes}
			</div>
		);
	}
});
/**
 * 构建CommentForm组件
 * 添加新评论
 * 当用户提交表单的时候，我们应该清空表单，发送一个请求到服务器
 * 然后刷新评论列表
 * 1.监听表单的提交事件，然后清空表单
 * getInitialState()初始化state状态
 * onChange事件，用于更新state
 * onSubmit事件，用于点击提交
 * preventDefault()用于避免浏览器默认提交
 */
var CommentForm = React.createClass({
	getInitialState:function() {
		return {author:"", text:""};
	},
	handleAuthorChange:function(e) {
		this.setState({author:e.target.value});
	},
	handleTextChange:function(e) {
		this.setState({text:e.target.value});
	},
	handleSubmit:function(e) {
		e.preventDefault();
		var author = this.state.author.trim();
		var text = this.state.text.trim();
		if (!text || !author) {
			return;
		};
		// TODO: send request to the server
		this.props.onCommentSubmit({author:author, text:text});
		this.setState({author:"", text:""});
	},
	render:function() {
		return (
			<form className="commentForm" onSubmit={this.handleSubmit}>
				<input type="text" placeholder="Your name" value={this.state.author} onChange={this.handleAuthorChange} />
				<input type="text" placeholder="Say something..." value={this.state.text} onChange={this.handleTextChange} />
				<input type="submit" value="Post" />
			</form>
		);
	}
});
/**
* 构建CommentBox组件
* 传入数据
* 添加一个评论数组作为它的state
* state是可变的，this.state是组件私有的，可以通过this.setState()来改变它
* 当state更新之后，组件就会重新渲染自己
* getInitialState()在组件的生命周期中仅执行一次，用于设置组件的初始化state
* componentDidMount是一个组件渲染的时候被React自动调用的方法。
* 动态更新界面的关键点就是调用this.setState(),我们用新的从服务器
* 拿到的评论数组来替换掉老的评论数组，然后UI自动更新
* 实现实时更新，使用轮询的方法
*/
var CommentBox = React.createClass({
	loadCommentsFromServer:function() {
		$.ajax({
			url:this.props.url,
			dataType:"json",
			cache:false,
			success:function(data) {
				this.setState({data:data});
			}.bind(this),
			error:function(xhr, status, err) {
				console.error(this.props.url, status, err.toString());
			}.bind(this)
		});
	},
	handleCommentSubmit:function(comment) {
		// TODO: submit to the server and refresh the list
		var comments = this.state.data;
		comment.id = Date.now();
		var newComments = comments.concat([comment]);
		this.setState({data:newComments});
		$.ajax({
			url:this.props.url,
			dataType:"json",
			type:"POST",
			data:comment,
			success:function(data) {
				this.setState({data:data});
			}.bind(this),
			error:function(xhr, status, err) {
				this.setState({data:comments});
				console.error(this.props.url, status, err.toString());
			}.bind(this)
		});
	},
	getInitialState:function() {
		return {data:[]};
	},
	componentDidMount:function() {
		this.loadCommentsFromServer();
		setInterval(this.loadCommentsFromServer, this.props.pollInterval);
	},
	render:function() {
		return (
			<div className="commentBox">
				<h1>Comments</h1>
				<CommentList data={this.state.data} />
				<CommentForm onCommentSubmit={this.handleCommentSubmit} />
			</div>
		);
	}
});
/**
 * 加载渲染
 * 传入数据
 * 从服务器获取数据,删掉data属性，使用一个URL来获取数据
 * 这个组件和前面的组件不一样，因为它必须重新渲染自己，在服务器请求返回之前
 * 该组件将不会有任何数据，请求返回之后，该组件会渲染一些新的评论
 * pollInterval为间隔时间
 */
ReactDOM.render(
	<CommentBox url="/api/comments" pollInterval={2000} />,
	document.getElementById('content')
);