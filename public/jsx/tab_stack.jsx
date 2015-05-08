var TabStack = React.createClass({
	getInitialState:function(){
		return { tabIndex: 1 }
	},
	setTabIndex:function(i){
		this.setState({tabIndex: i});
	},
	render: function(){
		var labels = React.Children.map( this.props.children, function(c,i){
			return <div className={"tabLabel " + c.props.className + (i === this.state.tabIndex ? " selected" : "" )} onClick={this.setTabIndex.bind(this,i)}>{c.props.title}</div>;
		}, this);
		var pane = this.props.children[ this.state.tabIndex ];
		return (
			<div className='tabStack'>
				<div className='tabLabels'>{labels}</div>
				<TableAdmin key={pane.props.className} {...pane.props} />
			</div>
		);
	}
})