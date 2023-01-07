const express = require('express');
const { Client, auth } = require("twitter-api-sdk");
const app = express();

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;

app.get('/', (req, res) => res.send('Hello world'));
app.get('/generateUrl', async(req, res) => {
  try{
    console.log("try");
    const authClient = new auth.OAuth2User({
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      callback: "https://www.example.com/oauth",
      scopes: ["tweet.read", "users.read", "bookmark.read"],
    });
  
    const client = new Client(authClient);
    const STATE = "my-state";
    
    //Get authorization
    //Step 1: Construct an Authorize URL
    const authUrl = authClient.generateAuthURL({
      state: STATE,
      code_challenge: "challenge",
    });
  
    console.log(`Please go here and authorize:`, authUrl);
    res.send(authUrl);
  }catch(error){
    console.log(error);
  }
});
app.get('/getBookmarks', (req, res) => res.send('Hello world'));

app.listen('8080', () => console.log('App listening at http://localhost:8080'));