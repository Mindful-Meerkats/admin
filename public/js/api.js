
var api = {};
api.server = "http://localhost:1337";
api.get = function( url, obj, key ){
   $.ajax({
	  url: api.server + url,
	  dataType: 'json',
	  success: function( data ){
		var result = {};
		result[key] = data;
		obj.setState( result );
	  }.bind(this),
	  error: function( xhr, status, err ){
		console.error( url, status, err.toString() );
	  }.bind(this)
	});
};
api.post = function( url, data, cb ){

	$.ajax({
	  url: api.server + url + (data.id ? '/' + data.id : ''),
	  dataType: 'json',
	  method: 'post',
	  data: data,
	  success: function( data ){
		cb();
	  }.bind(this),
	  error: function( xhr, status, err ){
		alert( status + ": " + err.toString() );
	  }.bind(this)
	});
};
api.put = function( url, data, cb ){
	$.ajax({
	  url: api.server + url,
	  dataType: 'json',
	  method: 'put',
	  data: data,
	  success: function( data ){
		cb();
	  }.bind(this),
	  error: function( xhr, status, err ){
		alert( status + ": " + err.toString() );
	  }.bind(this)
	});
};
api.del = function( url, cb ){
	$.ajax({
	  url: api.server + url,
	  method: 'delete',
	  success: function( data ){
		cb();
	  }.bind(this),
	  error: function( xhr, status, err ){
		alert( status + ": " + err.toString() );
	  }.bind(this)
	});
};
