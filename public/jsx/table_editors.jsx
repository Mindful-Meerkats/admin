var TableFormEditorJSON = React.createClass({
	getInitialState:function(){
		return {}
	},
	componentDidMount: function(){
		var ts = 'ace' + Date.now();
		var w = $('<pre id="' + ts + '">').text( JSON.stringify( this.props.data, null, "\t" ) );
		this.refs.aceEditor.getDOMNode().innerHTML = "";
		w.appendTo( this.refs.aceEditor.getDOMNode() );
		var editor = ace.edit( ts );
		editor.setOptions({ maxLines: Infinity, minLines: 3, showPrintMargin: false });
		editor.setAutoScrollEditorIntoView(true);
		editor.getSession().setMode("ace/mode/json");
		editor.setTheme("ace/theme/chrome");
		var me = this;
		editor.on('input', function(){
			var result;
			try {
				result = JSON.parse( editor.getSession().getValue() );
				me.props.onInput( result );
			} catch( err ){}
		});
	},
	render:function(){
		return <div className='tableFormEditorJSON'><div ref="aceEditor"></div></div>;
	}
});

var TableFormEditorMD = React.createClass({
	getInitialState:function(){
		return {}
	},
	componentDidMount: function(){
		var ts = 'ace' + Date.now();
		var w = $('<pre id="' + ts + '">').text( JSON.stringify( this.props.data, null, "\t" ) );
		this.refs.aceEditor.getDOMNode().innerHTML = "";
		w.appendTo( this.refs.aceEditor.getDOMNode() );
		var editor = ace.edit( ts );
		editor.setOptions({ maxLines: Infinity, minLines: 3, showPrintMargin: false });
		editor.setAutoScrollEditorIntoView(true);
		editor.getSession().setMode("ace/mode/markdown");
		editor.setTheme("ace/theme/chrome");
		var me = this;
		editor.on('input', function(){
			var result;
			try {
				result = editor.getSession().getValue();
				// markdown shizzle hier
				me.props.onInput( result );
			} catch( err ){}
		});
	},
	render:function(){
		return <div className='tableFormEditorJSON'><div ref="aceEditor"></div></div>;
	}
});

var TableFormEditorText = React.createClass({
	getInitialState:function(){
		return {
			data: this.props.data || null
		}
	},
	sendInput:function( e ){
		this.setState( { data: this.refs.inputElement.getDOMNode().value });
		this.props.onInput( this.refs.inputElement.getDOMNode().value );
	},
	render:function(){
		return <div className='tableFormEditorText'><input ref='inputElement' type={this.props.type || 'text'} value={this.state.data} onInput={this.sendInput} onChange={this.sendInput}/></div>;
	}
});

var TableFormEditorBool = React.createClass({
	getInitialState:function(){
		return {
			data: this.props.data || null
		}
	},
	sendInput:function( e ){
		this.setState( { data: this.refs.inputElement.getDOMNode().checked });
		this.props.onInput( this.refs.inputElement.getDOMNode().checked );
	},
	render:function(){
		var i = Math.floor( Math.random() * 10000 );
		return <div className='tableFormEditorText'><label><input ref='inputElement' type="checkbox" checked={this.state.data} onChange={this.sendInput} /> Yes, please</label></div>;
	}
});