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
	destroyRecord:function( r ){
		if( confirm('Destroy record?') ){
			this.props.onDel( r );
		}
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
		var rows = this.filteredSortedRows().map( function(r,i){
			var cells = this.state.fields.map( function(k){
				return <div className={"tableGridCell " + k} key={r.id + "_" + k}>{util.stringify(r[k])}</div>;
			});
			return <div className="tableGridRow" key={r.id}>{cells} <span className="destroy" onClick={ this.destroyRecord.bind( this,r ) }></span><span className="edit" onClick={this.openRecord.bind(this,r)}></span></div>;
		},this);
		return <div className="tableGridBody">{rows}</div>;
	},
	renderHeader:function(){
		var hcells = this.state.fields.map( function(k){
		   var icon;
		   if( k === this.state.sort ){
		   	if( this.state.sortDir === "asc" ) icon = <i className="fa fa-chevron-up"></i>;
		   	else                               icon = <i className="fa fa-chevron-down"></i>;
		   }
           return <div className={"tableGridHeaderCell " + k} onClick={this.setSort.bind(this,k)} key={"header_" + k}>{k.humanize()}{icon}</div>;
		},this);
		return <div className="tableGridHeaderRow">{hcells}</div>;
	},
	render: function(){
		return <div className="tableGrid">{this.renderHeader()}{this.renderBody()}</div>;
	}
});

var TableForm = React.createClass({
	getInitialState: function(){
		return {
			//dit maakt van "pizza|geheim:text|tjakka:poep" [ ["pizza","json"], ["geheim","text"], ["tjakka", "poep"]]
			fields: this.props.fields.split('|').map( function(s){ return s.split(':').concat(['json']).slice(0,2) } ),
			data:   JSON.parse( JSON.stringify( this.props.data ) ),
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
	    this.setState( { data: d, dirty: true } );
	},
	shouldComponentUpdate:function(){
		return false;
	},
	renderFields:function(){
		return this.state.fields.map( function( field ){
			var fieldName = field[0];
			var fieldType = field[1];
			var control;

			switch( fieldType ){
				case 'json':
					control = <TableFormEditorJSON key={fieldName} data={this.state.data[fieldName]} onInput={this.sendInput.bind(this,fieldName)}/>
					break;
				case 'text':
					control = <TableFormEditorText key={fieldName} data={this.state.data[fieldName]} onInput={this.sendInput.bind(this,fieldName)}/>
					break;
				case 'password':
					control = <TableFormEditorText key={fieldName} data={this.state.data[fieldName]} onInput={this.sendInput.bind(this,fieldName)} type='password'/>
					break;
				case 'markdown':
					control = <TableFormEditorMD key={fieldName} data={this.state.data[fieldName]} onInput={this.sendInput.bind(this,fieldName)}/>
					break;
				default:
					throw "Unkown table editor type"
					break;
			}
			// if( fieldType === 'json' ){
			// 	control = <TableFormEditorJSON key={fieldName} data={this.state.data[fieldName]} onInput={this.sendInput.bind(this,fieldName)}/>
			// } else if( fieldType === 'text' ){
			// 	control = <TableFormEditorText key={fieldName} data={this.state.data[fieldName]} onInput={this.sendInput.bind(this,fieldName)}/>
			// } else if( fieldType === 'password' ){
			// 	control = <TableFormEditorText key={fieldName} data={this.state.data[fieldName]} onInput={this.sendInput.bind(this,fieldName)} type='password'/>
			// }
			return <fieldset key={fieldName} className={fieldName}><legend>{fieldName.humanize()}</legend>{control}</fieldset>
		}, this);
	},
	render: function(){
		return (<div className='tableForm'>
			<div className='blocker' onClick={this.closeMe}/>
				<form>
				  {this.renderFields()}
				    <div className='cancel' onClick={this.discardMe}>Cancel</div>
				    <div className='submit' onClick={this.saveMe}>Submit</div>
			    </form>
			</div>)
	}
});

var TableAdmin = React.createClass({
	getInitialState: function(){
		return {
			rows: [],
			gridFields: this.props.gridFields || ("id|" + this.props.fields),
			formFields: this.props.formFields || this.props.fields,
			search: "",
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
        this.setState({ record: record || {} });
  	},
  	discardForm: function(){
  		this.setState({ record: null });
  	},
  	refresh: function(){
  		api.get( this.props.url, this, 'rows' );
		this.refs.searchInput.getDOMNode().focus();
  	},
  	delRecord: function( r ){
  		var self = this;
  		api.del( this.props.url + '/' + r.id, function( resp ){
  			console.log( resp );
  			self.refresh();
  		});
  	},
  	saveForm: function( data ){
        // if succesfully posted/put to api (depends on if id exists)
        var newdata = {};
        this.state.formFields.split('|').forEach( function(f){
        	var fieldName = f.split(':')[0];
        	if( fieldName !== 'id' ) newdata[fieldName] = data[fieldName];
        });
        if( data.id ) api.put(this.props.url + '/' + data.id, newdata, this.refresh );
        else          api.post(this.props.url, newdata, this.refresh );
        this.discardForm();
  	},
	render: function(){
	    var form;
	    if( this.state.record !== null ){
	       form = <TableForm fields={this.state.formFields} data={this.state.record} onSave={this.saveForm} onDiscard={this.discardForm}/>;
	    }
		return (
			<div className={"tableAdmin " + this.props.className} >
			  <div className="tableHeader">
			    <input ref="searchInput" onInput={this.setSearch} onChange={this.setSearch} type='search' placeholder={"Type to search in " + this.state.title} value={this.state.search}/>
			    <div className={"create " +  this.props.className } onClick={this.openForm}></div>
			   </div>
			   <TableGrid fields={this.state.gridFields} rows={this.state.rows} search={this.state.search} onDel={ this.delRecord } onRecord={this.openForm}/>
			   {form}
			</div>
		);
	}
});

