/**
* 构建CommentBox组件
*/
var CommentBox = React.createClass({
	render:function() {
		return (
			<div className="commentBox">
				Hello,world! I am a CommentBox.
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