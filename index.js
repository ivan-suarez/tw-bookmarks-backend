const { Client, auth } = require("twitter-api-sdk");

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
const CLIENT_ID = "SGJwZkR2Y3lncE1GT3FBbFB5d1Q6MTpjaQ"
const CLIENT_SECRET = "PyayQcXMP_rLMDedtz0k8WzATg-0zfZ2jKIHj_co-EjmSkd08j";

// Optional parameters for additional payload data
const params = {
  expansions: "author_id",
  "user.fields": ["username", "created_at"],
  "tweet.fields": ["geo", "entities", "context_annotations"],
};

(async () => {
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

  //Input users callback url in termnial
  const redirectCallback = await input("Paste the redirected callback here: ");

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
    
    console.dir(getBookmark, {
      depth: null,
    });
    process.exit();
  } catch (error) {
    console.log(error);
  }
})();