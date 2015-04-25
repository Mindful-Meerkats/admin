var TableGrid = React.createClass({	
	getInitialState:function(){	
		return { fields: this.props.fields.split('|'), sort: "id", sortDir: "asc" } 
	},
	render: function(){		
		var sorted_rows = this.props.rows.slice(0).sort( util.sorter( this.state.sort, this.state.sortDir ) );		
		var rows = sorted_rows.map( function(r){
			var cells = this.state.fields.map( function(k){
				return <td className={k} key={r.id + "_" + k}>{r[k]}</td>;
			});			
			var openRecord = function(){
				alert( 'opening record ' + r.id );
			}
			return <tr onClick={openRecord} key={r.id}>{cells}</tr>;
		},this);		
		var hcells = this.state.fields.map( function(k){
		   var icon;		   
		   if( k === this.state.sort ){
		   	if( this.state.sortDir === "asc" ) icon = <i className="fa fa-sort-asc"></i>;
		   	else                               icon = <i className="fa fa-sort-desc"></i>;
		   }		   
		   var setSort = function(){		   	   
		   	  if( this.state.sort === k ){
		   	  	this.setState( {sortDir: ( this.state.sortDir === 'asc' ? 'desc' : 'asc') })
		   	  } else this.setState( {sort: k, sortDir: 'asc' });		   
		   }.bind(this);
           return <td onClick={setSort} className={k} key={"header_" + k}>{k.humanize()}{icon}</td>;
		},this)
		
		return <div className="tableGrid"><table><thead>{hcells}</thead><tbody>{rows}</tbody></table></div>;
	}

});	



var TableAdmin = React.createClass({	
	getInitialState:function(){	
		return { 						
			rows: [],
			gridFields: this.props.gridFields || this.props.fields, 
			showFields: this.props.showFields || this.props.fields, 
			createFields: this.props.createFields || this.props.fields, 
			updateFields: this.props.updateFields || this.props.fields,
			icon: this.props.icon || "table",
			title: this.props.title || "Data"
		} 
	},	
	componentDidMount: function() {
		api.get( this.props.url, this, 'rows' );
  	},	
	render: function(){ 				
		return (
			<div className="tableAdmin">
			  <div className="tableHeader">
			    <i className={"fa fa-" + this.state.icon}></i>
			    <label>{this.state.title}</label>
			    <input type='search' placeholder="Search..."/>
			   </div>
			   <TableGrid fields={this.state.gridFields} rows={this.state.rows} />
			</div>
		);
	}
});

