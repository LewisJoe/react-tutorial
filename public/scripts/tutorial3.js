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
 */
var CommentList = React.createClass({
	render:function() {
		return (
			<div className="commentList">
				<Comment author="Pete Hunt">This is one comment</Comment>
				<Comment author="Jordan Walke">This is *another* comment</Comment>
			</div>
		);
	}
});
/**
 * 构建CommentForm组件
 */
var CommentForm = React.createClass({
	render:function() {
		return (
			<div className="commentForm">
				Hello,world! I am a ComemntForm.
			</div>
		);
	}
});
/**
* 构建CommentBox组件
*/
var CommentBox = React.createClass({
	render:function() {
		return (
			<div className="commentBox">
				<h1>Comments</h1>
				<CommentList />
				<CommentForm />
			</div>
		);
	}
});
/**
 * 加载渲染
 */
ReactDOM.render(
	<CommentBox />,
	document.getElementById('content')
);