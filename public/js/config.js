var config = {};

config.env = function(){
    var href = window.location.href;
	if( href.indexOf('localhost') !== -1  ){
		return 'development';
	}else if( href.indexOf('suricates') !== -1 ) {
		return 'accept'
	}else {
		return 'production'
	}
};

config.apiServers = {
    development: 'http://localhost:1337',
    accept: 'http://api.suricates.nl',
    production: 'http://api.mindful-meerkats.com',
    default: 'http://localhost:1337'
};
    

config.apiServer = function(){
    return config.apiServers[ config.env() ] || config.apiServers.default;
};

config.authServer = function(){
	var env = config.env();
	switch( env ){
		case 'development':
			return 'http://localhost:4444';
		case 'accept':
			return 'http://auth.production.suricates.nl';
		case 'production':
			return 'http://auth.suricates.nl';
		default:
			return 'http://localhost:4444';
	}
};
