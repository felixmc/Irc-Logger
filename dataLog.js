var mongo = require("mongodb");

var cache

function ChatEvent(data) {

	this.date = new Date();
}

function ChatLogger(config) {

};

DataLogger.prototype.capture = function(client, server) {

	client.on("connected", this);
	client.on("topic", this.);
	client.on("names", this.);
	client.on("endOfNames", this.);
	client.on("join", this.);
	client.on("quit", this.);
	client.on("part", this.);
	client.on("message", this.);
	
	console.log(data + "\n");
};

module.exports = function(config) {
	return new DataLogger(config);
};
