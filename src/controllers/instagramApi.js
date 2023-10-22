import dotenv from "dotenv";

dotenv.config();

export const getFirstCode = async (req, res) => {
  // Primera data recibida desde el frontend
  const code = req.body.code;
  const redirectUri = req.body.redirectUri;
  const idUser = req.body.id;
  let accessToken = null;
  const INSTA_APP_ID = process.env.INSTA_APP_ID;
  const INSTA_APP_SECRET = process.env.INSTA_APP_SECRET;

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

  try {
    const user = await User.findOne({
      where: {
        id: idUser,
      },
    });
    let instaAccessToken = user.instagramToken; // get from DB
    let resp = await axios.get(
      `https://graph.instagram.com/me/media?fields=media_type,username,permalink,media_url&access_token=${instaAccessToken}`
    );
    resp = resp.data;
    let instaPhotos = resp.data
      .filter((d) => d.media_type === "IMAGE")
      .map((d) => d.media_url);
    // Got insta photos
    res.send({ infoTotal: resp, fotos: instaPhotos });
  } catch (e) {
    console.log(e.response.data.error);
  }
};
