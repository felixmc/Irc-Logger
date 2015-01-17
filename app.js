var config = require("./config");

var IrcClient = require("nirc-lib");

var dataLog = require("./")(config.mongodb);



for (serverName in config.servers) {
	var server = config.servers[serverName];

	var client = new IrcClient({
		host: server.host,
		port: server.port,
		nick: generateNick(server.nick),
		name: generateName(server.name)
	});

	client.on("connect", function() {
		for (room in server.rooms) {
			client.join(room);
		}
	});

	client.on("data", dataLog.capture);
}













var client = new IrcClient({ 
	localhost: "localhost",
	port: 6668,
	nick: "b00byTrap",
	realname: Math.random().toString(36).substring(7)
});

client.on("connected", function() {
	client.join("salt");
});

client.on("message", function(channel, author, message) {
	var target = message.split(" ").slice(-1)[0];

	var msg = target + " puts the pussy on da chainwax"; 

	client.message(channel, msg);
});

// on end, try again after delay
//
//
// read config file
//		servers: {
//			i2p: {
//				host: ""
//				port: 12345
//				// nick - optional to inherit from room
//				// real name - optional to inherit from room
//				rooms: {
//					salt: {
//						nick: [bob, bob2, bob3] // can be array or single value. if array, picks random, can also be "%random%" which will be replaced by fully random username
//						realName: ["Bobby", bobster] // same as with nicks
//					}
//				}
//			}
//
//			]
//		}
//
//  data logger class takes an irc message and splits up and logs it appropriately
//
//  create IRC clients for each room
//  bind data event to dataLogger
//
//
//
//
//
//
//
