### INSTRUCTIONS TO USING THIS SCRIPT
First, get your Discord authentication token. Google 'how to find discord authorization token
Here's a video that works as of Jan. 2020: https://www.youtube.com/watch?v=tI1lzqzLQCs

Paste your authorization token here:
```
var token = "PUT TOKEN HERE";
```
This line should look something like this
```
var token = "MTg3NzkwONJNfnsdsknaAzQ1.fDsA-a.7fsafs4ASmkdaUKeaEdSqLP34a3";
```
Next, enable developer mode: under User Settings > Appearance > Developer Mode (at the bottom).

![image](https://user-images.githubusercontent.com/61128892/74617679-684bcc00-50fc-11ea-9249-06a9d52edcd9.png)

Next, find a message. All messages above this point will be deleted. Click "Copy ID" on a message. 

![image](https://user-images.githubusercontent.com/61128892/74617741-b2cd4880-50fc-11ea-8ced-95ff3e9b47d8.png)


Paste the message ID here:
```
var before = "PUT MESSAGE ID HERE";
```
This line should look something like:
```
var before = "65385938453";
```

Finally, copy and paste ENTIRE contents of [./messageErase.js]() into your browser's console.
Ignore the warning message, I'm not trying to steal your stolen data from Discord.

### NOTES
Use Google Chrome.
