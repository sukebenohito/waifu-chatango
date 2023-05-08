function getLink(sfwImage, typeImage){
	return new Promise(function(resolve) {
		var url = 'https://api.waifu.pics/many/'+ sfwImage + '/' + typeImage
		console.log(url);
		var data = new FormData();
		data.append('exclude', [""]);
		var xhr = new XMLHttpRequest();
		xhr.open('POST', url, true);
		xhr.onload = function () {
			files = JSON.parse(this.responseText)["files"]
			resolve(files[0]);
		};
		xhr.send(data);
	})
}

async function getLink2(sfwImage, typeImage){
	url = 'https://api.waifu.pics/many/'+ sfwImage + '/' + typeImage;
	const response = await fetch(url, {
		method: "POST", 
		body: JSON.stringify({
			exclude : []
		}),
		headers: {
			'Content-type': 'application/json; charset=UTF-8'
		}
	});
	let files = await response.json();
	return files.files[0]
}

function rStr(s) {
	return new Promise( async (resolve) => {
		const re = /((nsfw-|)(waifu|neko|shinobu|megumin|bully|cuddle|cry|hug|awoo|kiss|lick|pat|smug|bonk|yeet|blush|smile|wave|highfive|handhold|nom|bite|glomp|slap|kill|kick|happy|wink|poke|dance|cringe)-link)/g;
		let match;
		let link;
		while ((match = re.exec(s)) !== null) {
			if (match[2] === "nsfw-"){
				link = await getLink("nsfw", match[3]);
			}
			else{
				link = await getLink("sfw", match[3]);
			}
			s = s.replace(match[1], link);
		}
		resolve(s);
		
	});
}

const originalSend = WebSocket.prototype.send;
window.sockets = [];

WebSocket.prototype.send = function(...args) {
	
	if (window.sockets.indexOf(this) === -1){
		window.sockets.push(this);
		this.addEventListener("message", (e) => {
			//console.log("Receive:", this.url, e.data)
		});
	}

	if (args[0].includes("-link")){
		var msgC = async (b, ...a) => {
			a[0] = await rStr(a[0]);
			//console.log("Sent:", this.url, a[0]);
			return originalSend.call(b, ...a);
		}
		msgC(this, ...args);
	}
	else {	
		//console.log("Sent:", this.url, args[0]);
		return originalSend.call(this, ...args);
	}
	
};

