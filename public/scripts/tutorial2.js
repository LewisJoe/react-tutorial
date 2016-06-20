/**
 * 构建CommentList组件
 */
var CommentList = React.createClass({
	render:function() {
		return (
			<div className="commentList">
				Hello,world! I am a CommentList.
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