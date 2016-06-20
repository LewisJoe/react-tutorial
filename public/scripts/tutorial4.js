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
* 传入数据
*/
var CommentBox = React.createClass({
	render:function() {
		return (
			<div className="commentBox">
				<h1>Comments</h1>
				<CommentList data={this.props.data}/>
				<CommentForm />
			</div>
		);
	}
});
/**
 * 加载渲染
 * 传入数据
 */
ReactDOM.render(
	<CommentBox data={data} />,
	document.getElementById('content')
);