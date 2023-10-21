import dotenv from "dotenv";
import { User } from '../models/User.js'

dotenv.config();

export const getFirstCode = async (req, res) => {
  // Primera data recibida desde el frontend
  const code = req.body.code;
  const userName = req.body.userName;
  let redirectUri = req.body.redirectUri;
  let accessToken = null;
  let INSTA_APP_ID = process.env.INSTA_APP_ID;
  let INSTA_APP_SECRET = process.env.INSTA_APP_SECRET;

  try {
    // send form based request to Instagram API
    let result = await req.post({
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
    console.log(accessToken);
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
    console.log(accessToken);
    // save accessToken  to Database
    const user = await User.findOne({
        where: {
            userName: userName
        }
    });

    user.instagramToken = accessToken;
    await user.save();
  } catch (e) {
    res.send("Fallo en el segundo paso");
  }
  console.log("Code", code);
};

