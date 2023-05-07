function getLink(t){
	return new Promise(function(resolve) {
		var data = new FormData();
		data.append('exclude', [""]);
		var xhr = new XMLHttpRequest();
		xhr.open('POST', 'https://api.waifu.pics/many/sfw/' + t, true);
		xhr.onload = function () {
			files = JSON.parse(this.responseText)["files"]
			resolve(files[0]);
		};
		xhr.send(data);
	})
}
async function rStr(s) {
	return new Promise( async (resolve) => {
		const re = /((waifu|neko|shinobu|megumin|bully|cuddle|cry|hug|awoo|kiss|lick|pat|smug|bonk|yeet|blush|smile|wave|highfive|handhold|nom|bite|glomp|slap|kill|kick|happy|wink|poke|dance|cringe)-link)/g;
		let match;
		let link;
		while ((match = re.exec(s)) !== null) {
			link = await getLink(match[2]);
			s = s.replace(match[1], link);
		}
		resolve(s);
	});
}

(function () {
	var OrigWebSocket = window.WebSocket;
	var callWebSocket = OrigWebSocket.apply.bind(OrigWebSocket);
	var wsAddListener = OrigWebSocket.prototype.addEventListener;
	wsAddListener = wsAddListener.call.bind(wsAddListener);
	window.WebSocket = function WebSocket(url, protocols) {
		var ws;
		if (!(this instanceof WebSocket)) {
		// Called without 'new' (browsers will throw an error).
			ws = callWebSocket(this, arguments);
		} else if (arguments.length === 1) {
			ws = new OrigWebSocket(url);
		} else if (arguments.length >= 2) {
			ws = new OrigWebSocket(url, protocols);
		} else { // No arguments (browsers will throw an error)
			ws = new OrigWebSocket();
	}

	wsAddListener(ws, 'message', function(event) {
		//console.log("Received:", event);
	});
	return ws;
	}.bind();
	window.WebSocket.prototype = OrigWebSocket.prototype;
	window.WebSocket.prototype.constructor = window.WebSocket;

	var wsSend = OrigWebSocket.prototype.send;
	wsSend = wsSend.apply.bind(wsSend);
	OrigWebSocket.prototype.send = function (data) {
		if (data.includes("-link")){
			var msgC = async (b, a) => {
				a[0] = await rStr(a[0]);
				return wsSend(b, a);
			}
			msgC(this, arguments);
		}
		else{
			//console.log("Sent:", data);
			return wsSend(this, arguments);
		}
	};
})();
