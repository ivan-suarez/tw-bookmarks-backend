const { Client, auth } = require("twitter-api-sdk");
const express = require("express")
const app = express()
const Cors = require('cors')
const port = 8081
const dotenv = require('dotenv')
dotenv.config()

app.use(Cors())

const readline = require("readline").createInterface({
  input: process.stdin,
  output: process.stdout,
});

//Helper function to parse callback
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

//Helper terminal input function
async function input(prompt) {
    console.log("async function")
  return new Promise(async (resolve, reject) => {
    readline.question(prompt, (out) => {
      readline.close();
      resolve(out);
    });
  });
}

// The code below sets the consumer key and consumer secret from your environment variables
// To set environment variables on macOS or Linux, run the export commands below from the terminal:
// export CLIENT_ID='YOUR-CLIENT-ID'
// export CLIENET_SECRET='YOUR-CLIENT-SECRET'
const CLIENT_ID = `${process.env.CLIENT_ID}`
const CLIENT_SECRET = `${process.env.CLIENT_SECRET}`

// Optional parameters for additional payload data
const params = {
  expansions: "author_id",
  "user.fields": ["username", "created_at"],
  "tweet.fields": ["geo", "entities", "context_annotations"],
};

app.get('/', (req, res) => {
    res.send('Hello World!')
  });

app.get('/login', (req, res) => {
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
});
  
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
});