
var TableGrid = React.createClass({	
	getInitialState:function(){	
		return { rows: [], fields: this.props.fields.split('|') } ;
	},
	componentDidMount: function() {
		api.get( this.props.url, this, 'rows' );
  	},
	render: function(){		
		var rows = this.state.rows.map( function(r){
			var cells = this.state.fields.map( function(k){
				return <td className={k} key={r.id + "_" + k}>{r[k]}</td>;
			});
			return <tr key={r.id}>{cells}</tr>;
		},this);
		var hcells = this.state.fields.map( function(k){
           return <td className={k} key={"header_" + k}>{k.humanize()}</td>;
		})
		console.log( this.state.rows );
		console.log( rows );

		return <div className="tableGrid"><table><thead>{hcells}</thead><tbody>{rows}</tbody></table></div>;
	}

});	

