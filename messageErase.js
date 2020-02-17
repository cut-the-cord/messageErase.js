// INSTRUCTIONS TO USING THIS SCRIPT
// First, get your Discord authentication token. Google 'how to find discord authorization token'. 
// Here's a video that works as of Jan. 2020: https://www.youtube.com/watch?v=tI1lzqzLQCs
// Paste your authorization token here:
var token = "PUT TOKEN HERE";
// this line should look something like var token = "MTg3NzkwONJNfnsdsknaAzQ1.fDsA-a.7fsafs4ASmkdaUKeaEdSqLP34a3";

// Next, enable developer mode: under User Settings > Appearance > Developer Mode (at the bottom)
// Click "Copy ID" and paste it here:
var before = "PUT MESSAGE ID HERE";

// this line should look something like var before = "65385938453";
// All messages before this ID will be overwritten.
// Finally just copy and paste this entire script into the JavaScript console. Rinse and repeat for each channel.

// OTHER NOTES
// This script evolved from this gist: https://gist.github.com/CarletonStuberg/0c838a6248772c6fea1339ddad503cce

// This script has only been tested on Google Chrome.

// When messages are being erased, do not change your current channel / DM. The script will then fail.

// At times you will get an "Error 429". This occurs when Discord is rate-limiting your actions.

// This script will perform more passes to delete remaining messages if this occurs.

// If you're in a DM you will receive a 403 error for every message the other user sent (you don't have permission to delete their messages).
// To avoid this, you can add your userID here so this script knows to only delete messages belonging to you.
// This step is entirely optional.
var userId = null;
// Google "how to find my discord user id" if you are having trouble finding your userID.

var MESSAGE_CONTENT = [
	"***This message has been overwritten by Free and Open Source Script.***",
	"Discord is a hostile company that collects vast quantities of data on its users. While Discord has produced some open source projects, their main application is proprietary and any claims of privacy cannot be validated.",
	"Why does Discord store millions of messages for free, when Slack does not? Discord is not the product. You, and your millions of messages, are the product.",
	"Script available here:\\nhttps://github.com/cut-the-cord/messageErase.js/",
].join("\\n\\n");


var rate_limited_msgs = [];

cleanUp = function(rate_limited, overwrite = null) {
	const channel = window.location.href.split('/').pop();
	const baseURL = `https://discordapp.com/api/channels/${channel}/messages`;
	const headers = {"authorization": token, "content-type": "application/json"};
	let clock = 0;
	let interval = 300;

	function delay(duration) {
		return new Promise((resolve, reject) => {
			setTimeout(() => resolve(), duration);
		});
	}
	failed_again = [];
	Promise.all(rate_limited.map((msg_id) => {
		// if we don't have anything to overwrite the message with, then delete it
		if (overwrite == null) {
			return delay(clock += interval).then(() =>
				fetch(`${baseURL}/${msg_id}`, {
						headers,
						"method": "DELETE"
				}).then(response => {
					if (response.status == 429) {
						console.warn(msg_id+ " failed to delete due to rate limiting");
						failed_again.push(msg_id);
					}
				})
			)
		// otherwise, make a PATCH request to delete the method
		} else {
			return delay(clock += interval).then(() =>
				fetch(`${baseURL}/${msg_id}`, {
						headers,
						"body": "{\"content\":\"" + overwrite + "\"}",
						"method": "PATCH"
				}).then(response => {
					if (response.status == 429) {
						console.warn(msg_id + " failed to overwrite due to rate limiting");
						failed_again.push(msg_id);
					}
				})
			)
			
		}
	})).then( () => {
		if (failed_again.length > 0) {
			console.log("Performing another pass. [" + failed_again.length + " remaining]");
			setTimeout(() => cleanUp(failed_again, overwrite), 5000);
		} else {
			console.log("Erase complete. Thank you for choosing free and open source software.");
		}
	});
}

eraseMessages = function(before_id, overwrite = null) {
	//get information about the current channel
	const channel = window.location.href.split('/').pop();
	const baseURL = `https://discordapp.com/api/channels/${channel}/messages`;
	const headers = {"authorization": token, "content-type": "application/json"};

	let clock = 0;
	let interval = 500;

	function delay(duration) {
		return new Promise((resolve, reject) => {
			setTimeout(() => resolve(), duration);
		});
	}

	var messages_left = true;
	// get a list of all messages before the current id
    fetch(baseURL + '?before=' + before_id + '&limit=100', {headers})
	    .then(resp => resp.json())
		.then(messages => {
		    // check if we have any more messages
			if (messages.length < 1) {
				messages_left = false;
				return;
			}
			// find the ID of the last message
			before_id = messages[messages.length - 1].id;
			// now analyze each method
			return Promise.all(messages.map((message) => {
				// only attempt to patch the message if this message
				// belongs to the user
				if (userId == null || userId == message.author.id) {
					// if no overwrite message was provided, then just make a DELETE request
					if (overwrite == null) {
						return delay(clock += interval).then(() =>
							fetch(`${baseURL}/${message.id}`, {
									headers,
									"method": "DELETE"
							}).then(response => {
								if (response.status == 429) {
									console.warn(message.id + " failed to delete due to rate limiting");
									rate_limited_msgs.push(message.id);
								}
							})
						)
					// otherwise, make a PATCH request to delete the method
					} else {
						return delay(clock += interval).then(() =>
							fetch(`${baseURL}/${message.id}`, {
									headers,
									"body": "{\"content\":\"" + overwrite + "\"}",
									"method": "PATCH"
							}).then(response => {
								if (response.status == 429) {
									console.warn(message.id + " failed to overwrite due to rate limiting");
									rate_limited_msgs.push(message.id);
								}
							})
						)
						
					}
					
				}
			}));
	}).then(() => {
		// check if we have any more messages to process
		// if so, run the function again
		if (messages_left) {
			setTimeout(() => eraseMessages(before_id, overwrite), 200);
		} else {
			console.log("Cleaning up any messages that got fucked by rate limiting.");
			cleanUp(rate_limited_msgs, overwrite);
		}
	});
}

// note: you can also leave out the "overwrite" argument to simply erase your messages
// eraseMessages(before); // erases instead of overwrites
eraseMessages(before, MESSAGE_CONTENT);