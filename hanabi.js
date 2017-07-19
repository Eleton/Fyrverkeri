var express = require("express");
var app = express();
var http = require("http").Server(app);
var io = require("socket.io")(http);

io.on("connection", function(socket){
	console.log("I'm connected!")
	socket.on("ready", function(ready){
		if(ready) socket.emit("init", playerData);
	})
	socket.on("draw card", function(cardInfo){
		var discardedCardIndex = parseInt(cardInfo.cardID.match(/\d+/)[0]);
		var whichHand = cardInfo.handID.match(/\d+/)[0];
		var newCard = cards.pop();
		console.log(cardInfo.cardID)
		console.log(playerData[whichHand].hand);
		var indexOfCardInHand = -1;
		playerData[whichHand].hand.forEach(function(obj, i){
			if(obj.id === discardedCardIndex){
				indexOfCardInHand = i;
			}
		})
		playerData[whichHand].hand[indexOfCardInHand] = newCard;
		socket.broadcast.emit("xe drew a card", cardInfo.cardID)
		io.emit("drawn card", {"card": newCard, "handID": cardInfo.handID})
	})
})

var goalPiles = {"tomato": [], "dodgerblue": [], "limegreen": [], "gold": [], "ivory": []};

var colors = ["tomato", "dodgerblue", "limegreen", "gold", "ivory"];
var values = [1,1,1,1,2,2,2,3,3,4,4,5];
var cards = colors.map(function(col){
	return values.map(function(val){
		return {"color": col, "value": val}
	})
}).reduce(function(a, b){
	return a.concat(b);
}).map(function(c, i){
	c.id = i;
	c.idString = "cardNo" + i;
	return c;
})

shuffle(cards);
var playerData = [];
var numberOfPlayers = 4;

function dealCards(){
	for(var i = 0; i < numberOfPlayers; i++){
		var hand = [];
		for(var j = 0; j < 4; j++){
			hand.push(cards.pop());
		}
		var playerObject = {"index": i, "hand": hand};
		playerData[i] = playerObject;
		//hands[i] = hand;

	}
}

app.use("/static", express.static(__dirname + '/public'));

app.get("/", function(req, res){
	dealCards();
	console.log("connected");
	res.sendFile(__dirname + "/index.html");
	//res.send("Play a game");
})

app.get("/p/:id", function(req, res){
	//dealCards();
	console.log("connected");
	res.sendFile(__dirname + "/page.html");
})

app.get("/player/:id", function(req, res){
	var p = parseInt(req.params.id);
	if(p >= 1 && p <= numberOfPlayers){
		var view = hands.filter(function(d,i){
				return p !== i;
			})
		res.send(view);	
	}else{
		res.send("No player number " + p);
}
	
})

http.listen(8000, function(){
	console.log("Listening to port 8000!")
});


function shuffle(a) {
	var j, x, i;
	for (i = a.length; i; i -= 1) {
		j = Math.floor(Math.random() * i);
		x = a[i - 1];
		a[i - 1] = a[j];
		a[j] = x;
	}
}

/*var fs = require("fs")
var path = require("path")
var bodyParser = require("body-parser")
var express = require("express")
var app = express()

app.get("/books", function(req, res){
	fs.readFile(process.argv[3], "utf8", function(error, file){
		//console.log(file)
		var obj = JSON.parse(file)
		//console.log(obj)
		res.json(obj)
	})
}).listen(process.argv[2])

/*
app.use("/search", function(req, res){
	res.send(req.query)
}).listen(process.argv[2])


/*
app.put("/message/:id", function(req, res){
	var ret = require("crypto")
		.createHash("sha1")
		.update(new Date().toDateString() + req.params.id)
		.digest("hex")

	res.send(ret)
}).listen(process.argv[2])


/*app.use(require("stylus").middleware(process.argv[3]))

app.use(express.static(process.argv[3]))

app.listen(process.argv[2])



/*
app.use(bodyParser.urlencoded({extended: false}))

app.post("/form", function(req, res){
	res.send(req.body.str.split('').reverse().join(""))
}).listen(process.argv[2])


/*
app.set("view engine", "jade")
app.set("views", process.argv[3] || path.join(__dirname, "templates"))
app.get("/home", function(req, res){
	res.render("index", {date: new Date().toDateString()})
}).listen(process.argv[2])


/*console.log(path.join(__dirname, "public"))
app.use(express.static(process.argv[3] || path.join(__dirname, "public"))).listen(process.argv[2])

/*app.get("/home", function(req, res){
	res.end("Hello World!")
}).listen(process.argv[2])

/*var express = require("express");
var app = express();



/*var path = require("path");
app.set("views", process.argv[3]);
app.set("view engine", "jade");
app.get("/home", function(req, res){
	res.render('index', {date: new Date().toDateString()});
})
app.listen(process.argv[2]);

/*var express = require("express");
var app = express();
var path = require("path");
app.use(express.static(process.argv[3]));
app.listen(process.argv[2]);
console.log(process.argv[2]);
console.log(process.argv[3]);

/*var express = require("express");
var app = express();
app.get("/home", function(req,res){
	res.end("Hello World!")
})
app.listen(process.argv[2]);
*/