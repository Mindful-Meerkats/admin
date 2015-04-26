var TableGrid = React.createClass({	
	getInitialState:function(){			
		return { fields: this.props.fields.split('|'), sort: "id", sortDir: "asc" } 
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

var TableForm = React.createClass({
	getInitialState: function(){
		return {
			fields: this.props.fields.split('|'),
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
	render: function(){
		return <div className='tableForm'><div className='blocker' onClick={this.closeMe}/><form>Dit is het formulier</form></div>
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

