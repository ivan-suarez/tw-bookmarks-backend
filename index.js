const express = require('express');
const { Client, auth } = require("twitter-api-sdk");
const app = express();
app.use(express.json());
const dotenv = require('dotenv');
const Cors = require('cors');
app.use(Cors());

dotenv.config();

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const CALLBACK = process.env.CALLBACK;

const params = {
  expansions: "author_id",
  "user.fields": ["username", "created_at"],
  "tweet.fields": ["geo", "entities", "context_annotations"],
};

const authClient = new auth.OAuth2User({
  client_id: CLIENT_ID,
  client_secret: CLIENT_SECRET,
  callback: CALLBACK,
  scopes: ["tweet.read", "users.read", "bookmark.read"],
});

const client = new Client(authClient);
const STATE = "my-state";


const getQueryStringParams = (query) => {
  console.log("getquery")
return query
  ? (/^[?#]/.test(query) ? query.slice(1) : query)
      .split(/[\?\&]/)
      .reduce((params, param) => {
        let [key, value] = param.split("=");
        params[key] = value
          ? decodeURIComponent(value.replace(/\+/g, " "))
          : "";
        return params;
      }, {})
  : {};
};

app.get('/', (req, res) => res.send('Hello world'));
app.get('/generateUrl', async(req, res) => {
  try{
    console.log("try");
    
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

app.post('/getBookmarks', async(req, res) =>{
  console.log('getbookmarks');
  //console.log(req.query.data);
  //console.log(req.params);
  //console.log(req.body);
  const { state, code } = req.body.url.query;
  console.log(state);
  console.log(code);
  //const state = req.state;
  //const code = req.code;
  try {
    //Parse callback
    console.log("try callback")
    //const { state, code } = getQueryStringParams(redirectCallback);
    if (state !== STATE) {
      console.log("State isn't matching");
    }
    //Gets access token
    //Step 3: POST oauth2/token - Access Token
    await authClient.requestAccessToken(code);

    //Get the user ID
    const {
      data: { id },
    } = await client.users.findMyUser();

    //Makes api call
    const getBookmark = await client.bookmarks.getUsersIdBookmarks(id, params);
    const mybookmarks = getBookmark.data.map(obj => obj.text);


    res.send(mybookmarks);
  }catch(error){
    console.log(error);
    res.send(error);
  }
});


app.post('/getBookmarkss', async(req, res) =>{
  const redirectCallback = req.body.url;
  console.log(req.body);
  try {
    //Parse callback
    console.log("try")
    const { state, code } = getQueryStringParams(redirectCallback);
    if (state !== STATE) {
      console.log("State isn't matching");
    }
    //Gets access token
    //Step 3: POST oauth2/token - Access Token
    await authClient.requestAccessToken(code);

    //Get the user ID
    const {
      data: { id },
    } = await client.users.findMyUser();

    //Makes api call
    const getBookmark = await client.bookmarks.getUsersIdBookmarks(id, params);
    const mybookmarks = getBookmark.data.map(obj => obj.text);
    res.send(mybookmarks);
  }catch(error){
    console.log(error);
  }
  
});

app.listen('8080', () => console.log('App listening at http://localhost:8080'));