var env = function(){
	return process.env.NODE_ENV || 'development';
};

var apiServer = function(){
	switch( env ){
		case 'development':
			return 'http://localhost:1337';
		case 'production':
			return 'http://api.suricates.nl';
		default:
			return 'http://localhost:1337';
	}
};

module.exports = {
	apiServer: apiServer
};