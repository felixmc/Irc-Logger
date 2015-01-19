var mongo = require("mongodb").MongoClient;

function ChatLogger(config) {
	this.rooms = {};

	var dbUrl = "mongodb://" + config.host + ":" + config.port + "/" + config.database;

	this.log = function(data) {
		data.date = new Date();
		mongo.connect(dbUrl, function(err, db) {
			if (err)
				console.error(err);
			else {
				db.collection("events").insert(data, function(err) {
					if (err)
						console.error(err);
				});
			}	
		});
	};
};

ChatLogger.prototype.log = function(obj) {
	obj.date = new Date();
};

ChatLogger.prototype.capture = function(client, server) {

	var self = this;

	client.on("connected", function() {
		self.log({
			type  : "server-connect",
			server: server.id,
			name  : server.name,
			nick  : server.nick,
			url   : server.host + ":" + server.port
		});
	});

	client.on("topic", function(room, topic) {
		if (!this.rooms[room]) this.rooms[room] = {};
		this.rooms[room].topic = topic;
	});
	
	client.on("names", function(room, names) {
		if (!this.rooms[room]) this.rooms[room] = {};
		if (!this.rooms[room].names) this.rooms[room].names = []; 
		this.rooms[room].names = this.rooms[room].names.concat(names);
	});
	
	client.on("endOfNames", function(room) {
		self.log({
			type  : "room-join",
			server: server.id,
			topic : this.rooms[room].topic,
			names : this.rooms[room].names
		});
	});

	client.on("join", function(room, user) {
		self.log({
			type  : "user-join",
			server: server.id,
			room  : room,
			user  : user
		});
	});
	
	client.on("quit", function(user) {
		self.log({
			type  : "user-quit",
			server: server.id,
			user  : user
		});
	});
	
	client.on("part", function(room, user) {
		self.log({
			type  : "user-part",
			server: server.id,
			room  : room,
			user  : user
		});
	});
	
	client.on("message", function(room, user, text) {
		self.log({
			type  : "user-message",
			server: server.id,
			room  : room,
			user  : user,
			text  : text
		});
	});
	
	client.on("end", function() {
		self.log({
			type  : "server-disconnect",
			server: server.id
		});
	});
};

module.exports = function(config) {
	return new ChatLogger(config);
};
