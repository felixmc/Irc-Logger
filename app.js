// config
var config     = require("./config");
var retryDelay = 5000;

// modules
var IrcClient = require("nirc-lib");
var chatLog   = require("./ChatLogger")(config.mongodb);

// data
var connections = {};

function generateName(name) {
	if (Array.isArray(name)) {
		name[Math.floor(Math.random() * name.length)];	
	} else if (name === "%random%") {
		return Math.random().toString(36).substring(7);
	} else {
		return name;
	}
}

function connectToServer(serverName) {
	var server = config.servers[serverName];
		
	var clientConfig = {
		id  : serverName,
		host: server.host,
		port: server.port,
		nick: generateName(server.nick),
		name: generateName(server.name)
	};
	
	var client = new IrcClient(clientConfig);

	chatLog.capture(client, clientConfig);

	client.on("connected", function() {
		server.rooms.forEach(function(room) {
			client.join(room);
		});
	});

	client.on("end", function() {
		delete connections[serverName];
		
		setTimeout(function() {
			connectToServer(serverName);
		}, retryDelay);
	});

	connections[serverName] = client;
}

for (serverName in config.servers) {
	connectToServer(serverName);
}
