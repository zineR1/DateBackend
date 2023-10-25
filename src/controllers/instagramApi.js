import dotenv from "dotenv";
import axios from 'axios'
import { User } from '../models/User.js'

dotenv.config();

export const getFirstCode = async (req, res) => {
  // Primera data recibida desde el frontend
  const code = req.body.code;
  const redirectUri = req.body.redirectUrl;
  //const idUser = req.body.id;




  let accessToken = null;
  const INSTA_APP_ID = process.env.INSTA_APP_ID;
  const INSTA_APP_SECRET = process.env.INSTA_APP_SECRET;
console.log(code,"CODE")
console.log(redirectUri,"redirectUri")
//console.log(idUser,"idUser")
console.log(INSTA_APP_ID,"INSTA_APP_ID")
console.log(INSTA_APP_SECRET,"INSTA_APP_SECRET")



try {
  // En lugar de pasar un objeto con 'url' y 'form', utiliza una URL directa y envía los datos como un objeto.
  const url = "https://api.instagram.com/oauth/access_token";
  const data = {
    client_id: 1036428654475318,
    client_secret: "7b106edaf98ed16042632a487dfa10f7",
    grant_type: "authorization_code",
    redirect_uri: "https://datefrontendpruebas.onrender.com/instagramCode/",
    code: code,
  };

  const response = await axios.post(url, data);

  // Accede al cuerpo de la respuesta y analízalo como JSON
  accessToken = response.data.access_token;
  res.json(accessToken);
} catch (e) {
  return res.status(500).json({ error: "Fallo en el primer paso", error2: e });
}
   /* try {
    let resp = await axios.get(
      `https://graph.instagram.com/access_token?grant_type=ig_exchange_token&client_secret=${process.env.INSTA_APP_SECRET}&access_token=${accessToken}`
    );
    accessToken = resp.data.access_token;
    console.log(colors.black.bgRed(accessToken, "En la capa de desarrollo"));
    // save accessToken  to Database
  } catch (e) {
    return res.status(500).json({ error: "Fallo en el primer paso" });
  } */

 /*  try {
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
    return res.send(res,"Fallo en el tercer paso");
  }   */
};
