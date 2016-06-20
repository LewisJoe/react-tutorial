/**
 * JSON数组,保存所需要的数据
 */
var data = [
	{author:"Pete Hunt", text:"This is one comment"},
	{author:"Jordan Walke", text:"This is *author* comment"}
];
/**
 * 构建Comment组件，使用props属性
 * 使用Markdown格式评论
 */
var Comment = React.createClass({
	rawMarkup:function() {
		var rawMarkup = marked(this.props.children.toString(), {sanitize:true});
		return {__html: rawMarkup};
	},
	render:function() {
		return (
			<div className="comment">
				<h2 className="commentAuthor">
					{this.props.author}
				</h2>
				// 使用下面的方法会出现问题，修改
				// {marked(this.props.children.toString())}
				<span dangerouslySetInnerHTML={this.rawMarkup()} />
			</div>
		);
	}
});
/**
 * 构建CommentList组件
 * 传递作者名字和评论文本给Comment组件
 */
var CommentList = React.createClass({
	render:function() {
		var commentNodes = this.props.data.map(function(comment){
			return (
				<Comment author={comment.author}>
					{comment.text}
				</Comment>
			);
		});
		return (
			<div className="commentList">
				// 静态渲染数据
				// <Comment author="Pete Hunt">I am a CommentList.</Comment>
				// <Comment author="Jordan Walke">This is *author* comment</Comment>
				// 动态渲染数据
				{commentNodes}
			</div>
		);
	}
});
/**
 * 构建CommentForm组件
 * 添加新的评论,发送一个请求到服务器，保存这条评论
 */
var CommentForm = React.createClass({
	// 监听表单提交事件
	handleSubmit:function(e) {
		e.preventDefault(); // 避免浏览器默认地提交表单
		var author = this.refs.author.value.trim(); // 使用ref属性给子组件命名
		var text = this.refs.text.value.trim();
		if (!text || !author) {
			return;
		};
		// TODO:send request to server
		// 当用户提交表单的时候，在CommentForm中调用这个回调函数
		this.props.onCommentSubmit({author:author, text:text});
		// 清空表单
		this.refs.author.value = "";
		this.refs.text.value = "";
		return;
	},
	render:function() {
		return (
			// 绑定事件
			<form className="commentForm" onSubmit={this.handleSubmit}>
				<input type="text" placeholder="Your name" ref="author" />
				<input type="text" placeholder="Say something..." ref="text" />
				<input type="submit" value="Post" />
			</form>
		);
	}
});
/**
* 构建CommentBox组件
*/
var CommentBox = React.createClass({
	// 轮询获取数据
	loadCommentsFromServer:function() {
		$.ajax({
			url:this.props.url,
			dataType:'json',
			cache:false,
			success:function() {
				this.setState({data:data}); // 动态更新界面
			}.bind(this),
			error:function(xhr, status, err) {
				console.error(this.props.url, status, err.toString());
			}.bind(this)
		});
	},
	// 回调函数提交数据到服务器并且刷新评论列表
	handleCommentSubmit:function(comment) {
		// 提前将评论添加到列表中
		var comments = this.state.data;
		var newComments = comments.concat([comment]);
		this.setState({data:newComments});
		// TODO: submit to the server and refresh the list
		$.ajax({
			url:this.props.url,
			dataType:'json',
			type:"POST",
			data:comment,
			success:function(data) {
				this.setState({data:data}); // 动态更新界面
			}.bind(this),
			error:function(xhr, status, err) {
				console.error(this.props.url, status, err.toString());
			}.bind(this)
		});
	},
	// 获取state状态
	// getInitialState()在组件的生命周期中仅执行一次，用于设置组件的初始化state
	getInitislState:function() {
		return {data:[]};
	},
	// 组件渲染的时候被React自动调用
	componentDidMound:function() {
		this.loadCommentsFromServer();
		// 间隔2s
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
ReactDOM.render(
	<CommentBox data={data} />,
	// 从服务器获取数据
	// <CommentBox url="/api/comments" pollInterval={2000} />,
	document.getElementById('content')
);