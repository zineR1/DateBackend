import dotenv from "dotenv";

dotenv.config();

export const getFirstCode = async (req, res) => {
  // Primera data recibida desde el frontend
  let code = req.body.code;
  let redirectUri = req.body.redirectUri;
  let accessToken = null;
  let INSTA_APP_ID = process.env.INSTA_APP_ID;
  let INSTA_APP_SECRET = process.env.INSTA_APP_SECRET;

  try {
    // send form based request to Instagram API
    let result = await request.post({
      url: "https://api.instagram.com/oauth/access_token",
      form: {
        client_id: INSTA_APP_ID,
        client_secret: INSTA_APP_SECRET,
        grant_type: "authorization_code",
        redirect_uri: redirectUri,
        code: code,
      },
    });

    // Got access token. Parse string response to JSON
    accessToken = JSON.parse(result).access_token;
    //res.json(accessToken);
  } catch (e) {
    res.send("Fallo en el primer paso");
  }
  try {
    let resp = await axios.get(
      `https://graph.instagram.com/access_token?grant_type=ig_exchange_token&client_secret=${process.env.INSTA_APP_SECRET}&access_token=${accessToken}`
    );
    accessToken = resp.data.access_token;
    console.log(colors.black.bgRed(accessToken, "En la capa de desarrollo"));
    // save accessToken  to Database
  } catch (e) {
    res.send("Fallo en el segundo paso");
  }
};
