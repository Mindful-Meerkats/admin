var config = {};

config.env = function(){
	return 'development';
};

config.apiServer = function(){
	var env = config.env();
	switch( env ){
		case 'development':
			return 'http://localhost:1337';
		case 'production':
			return 'http://api.suricates.nl';
		default:
			return 'http://localhost:1337';
	}
};

config.authServer = function(){
	var env = config.env();
	switch( env ){
		case 'development':
			return 'http://localhost:4444';
		case 'production':
			return 'http://auth.suricates.nl';
		default:
			return 'http://localhost:4444';
	}
};