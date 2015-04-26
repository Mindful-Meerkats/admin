var TableGrid = React.createClass({	
	getInitialState:function(){			
		return { 
			fields: this.props.fields.split('|').map( function(s){ return s.split(':')[0] } ), 
			sort: "id", 
			sortDir: "asc" 
		} 
	},
	openRecord:function( r ){		
	    this.props.onRecord( r );
	},
	setSort:function( k ){
	    if( this.state.sort === k ){
			this.setState( {sortDir: ( this.state.sortDir === 'asc' ? 'desc' : 'asc') })
		} else {
			this.setState( {sort: k, sortDir: 'asc' });		   
		}		   		   
	},
	filteredSortedRows:function(){
         return this.props.rows.filter( util.search_object( this.props.search.split() ) ).sort( util.sorter( this.state.sort, this.state.sortDir ) );				
	},
	renderBody:function(){		
		var rows = this.filteredSortedRows().map( function(r){
			var cells = this.state.fields.map( function(k){
				return <td className={k} key={r.id + "_" + k}>{r[k]}</td>;
			});						
			return <tr onClick={this.openRecord.bind(this,r)} key={r.id}>{cells}<td></td></tr>;
		},this);	
		return <tbody>{rows}</tbody>;	
	},
	renderHeader:function(){
		var hcells = this.state.fields.map( function(k){
		   var icon;		   
		   if( k === this.state.sort ){
		   	if( this.state.sortDir === "asc" ) icon = <i className="fa fa-sort-asc"></i>;
		   	else                               icon = <i className="fa fa-sort-desc"></i>;
		   }		   		  
           return <td onClick={this.setSort.bind(this,k)} className={k} key={"header_" + k}>{k.humanize()}{icon}</td>;
		},this);
		return <thead>{hcells}<td></td></thead>;
	},	
	render: function(){		    		
		return <div className="tableGrid"><table>{this.renderHeader()}{this.renderBody()}</table></div>;
	}
});	

var TableFormEditorJSON = React.createClass({
	getInitialState:function(){
		return {
			data: JSON.stringify( this.props.data || null ),
			error: null
		}
	},	
	componentDidMount: function(){
		var editor = ace.edit( this.refs.aceEditor.getDOMNode() );
		var me = this;
		editor.on('input', function(){
			var result;
			try {
				result = JSON.parse( editor.getSession().getValue() );
				me.props.onInput( result );	
				me.setState({ error: null });				
			} catch( err ){
				me.setState({ error: err + "" });				
			}			
		});
	},
	render:function(){
		var error;
		if( this.state.error ) error = <div className='error'>{this.state.error}</div>;
		return <div className='tableFormEditorJSON'>{error}<div ref="aceEditor">{this.state.data}</div></div>;
	}
});

var TableFormEditorText = React.createClass({
	getInitialState:function(){
		return {
			data: this.props.data || null
		}
	},	
	sendInput:function(){
		this.props.onInput( this.refs.inputElement.getDOMNode().value );
	},
	render:function(){
		return <div className='tableFormEditorText'><input ref='inputElement' type={this.props.type || 'text'} value={this.state.data} onInput={this.sendInput} onChange={this.sendInput}/></div>;
	}
});

var TableForm = React.createClass({
	getInitialState: function(){
		return {
			fields: this.props.fields.split('|').map( function(s){ return s.split(':').concat(['json']).slice(0,2) } ),
			data:   this.props.data,
			dirty:  this.props.data.id ? false : true
		}
	},
	discardMe:function(){
		this.props.onDiscard();
	},
	closeMe:function(){		
		if( this.state.dirty && confirm('Save changes?') ) this.saveMe(); else this.discardMe();
	},
	saveMe:function(){
		this.props.onSave( this.state.data );		
	},
	sendInput:function(k,i){
		var d = this.state.data;
		d[k] = i;	
		this.setState({data: d});
	},
	renderFields:function(){		
		return this.state.fields.map( function( field ){
			var fieldName = field[0];
			var fieldType = field[1];
			var control;
			if( fieldType === 'json' ){
				control = <TableFormEditorJSON data={this.state.data[fieldName]} onInput={this.sendInput.bind(this,fieldName)}/>
			} else if( fieldType === 'text' ){
				control = <TableFormEditorText data={this.state.data[fieldName]} onInput={this.sendInput.bind(this,fieldName)}/>			
			} else if( fieldType === 'password' ){
				control = <TableFormEditorText data={this.state.data[fieldName]} onInput={this.sendInput.bind(this,fieldName)} type='password'/>
			}
			return <fieldset key={this.state.data.id + "_" + fieldName}><legend>{fieldName.humanize()}</legend>{control}</fieldset>
		}, this);
	},
	render: function(){		
		return <div className='tableForm'><div className='blocker' onClick={this.closeMe}/><form>{this.renderFields()}</form></div>
	}
});

var TableAdmin = React.createClass({	
	getInitialState: function(){	
		return { 						
			rows: [],
			gridFields: this.props.gridFields || this.props.fields, 
			formFields: this.props.formFields || this.props.fields,
			search: "",
			icon: this.props.icon || "table",
			title: this.props.title || "Data",
			record: this.props.record || null
		} 
	},	
	componentDidMount: function() {
		api.get( this.props.url, this, 'rows' );
		this.refs.searchInput.getDOMNode().focus();
  	},	
  	setSearch: function(){  		
  		this.setState({search: this.refs.searchInput.getDOMNode().value || ""});
  	},
  	openForm: function( record ){
        this.setState({ record: record });
  	},  	
  	discardForm: function(){
  		this.setState({ record: null });
  	},
  	saveForm: function(){
        // if succesfully posted/put to api (depends on if id exists)
        this.discardForm();
  	},
	render: function(){ 
	    var form;
	    if( this.state.record !== null ){           
	       form = <TableForm fields={this.state.formFields} data={this.state.record} onSave={this.saveForm} onDiscard={this.discardForm}/>;	
	    } 
		return (
			<div className="tableAdmin">
			  <div className="tableHeader">
			    <i className={"fa fa-" + this.state.icon}></i>
			    <label>{this.state.title}</label>
			    <input ref="searchInput" onInput={this.setSearch} onChange={this.setSearch} type='search' placeholder="Search..." value={this.state.search}/>
			   </div>
			   <TableGrid fields={this.state.gridFields} rows={this.state.rows} search={this.state.search} onRecord={this.openForm}/>
			   {form}
			</div>
		);
	}
});

