var width = 960, height = 500;
var socket = io();
$(document).ready(function(){
	socket.emit("ready", true);
	socket.on("init", function(playerData){
		console.log(playerData);
		playerData.forEach(function(playerHand,playerIndex){
			var hand = $("<span>").addClass("hand");
			$("body").append(hand);
			console.log(playerHand);
			playerHand.hand.forEach(function(c, ci){
				var card = $("<div>").addClass("card");
				card.css("background-color", c.color)
				var innerFrame = $("<div>");
				var number = $("<text>").text(c.value);

				innerFrame.append(number);
				card.append(innerFrame);
				hand.append(card);
				card.click(function(){
					$(this).remove();
					socket.emit("draw card");
				})
			})
			
		})
	})

})