
export const getFirstCode = async(req, res) => {
// Primera data recibida desde el frontend
let code = req.body.code;
let redirectUri = req.body.redirectUri;
let accessToken = null;
let INSTA_APP_ID = 1036428654475318;
let INSTA_APP_SECRET = '7b106edaf98ed16042632a487dfa10f7';
try {
    // send form based request to Instagram API
    let result = await request.post({
        url: 'https://api.instagram.com/oauth/access_token',
        form: {
            client_id: INSTA_APP_ID,
            client_secret: INSTA_APP_SECRET,
            grant_type: 'authorization_code',
            redirect_uri: redirectUri,
            code: code
        }
    });

    // Got access token. Parse string response to JSON
    accessToken = JSON.parse(result).access_token;
    res.json(accessToken);
} catch (e) {
    console.log("Error=====", e);
}
}