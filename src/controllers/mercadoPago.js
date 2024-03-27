import { MercadoPagoConfig, Preference } from "mercadopago";
// import { User } from "../models/User.js";
import { Event } from "../models/Event.js";
import axios from "axios";
const urlBackend = process.env.URL_BACKEND;

export const createMPToken = async (req, res) => {
  const { code, eventId } = req.body;
  try {
    if (code) {
      const data = {
        client_id: "7016024355594930",
        client_secret: "JuuSrhW9y4hU7O9oIRv0WU7D6g8yVXEV",
        code: code,
        grant_type: "authorization_code",
        redirect_uri: "https://datefrontendpruebas.onrender.com/",
      };

      const accessTokenResponse = await axios.post(
        "https://api.mercadopago.com/oauth/token",
        data,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      let event = await Event.findByPk(eventId);
      event.mercadoPagoToken = accessTokenResponse.data;
      await event.save();
      res.send("Token de mercado pago guardado con éxito");
    }
  } catch (error) {
    res.send(error);
  }
};

export const createOrder = async (req, res) => {
  const { eventId, products } = req.body;
  const event = await Event.findByPk(2);
  console.log(event, "event");
  const accessToken =
    event && event.mercadoPagoToken && event.mercadoPagoToken.access_token;
  console.log(accessToken, "ACCESSTOKEN");
  try {
    const client = new MercadoPagoConfig({
      accessToken: accessToken,
    });

    const preferences = new Preference(client);

    const result = await preferences.create({
      body: {
        //   payment_methods: {
        //     excluded_payment_methods: [],
        //     excluded_payment_types: [],
        //     installments: 12,
        //   },
        // items: products,
        items: [{ title: "Una productazo", quantity: 1, unit_price: 100 }],
        back_urls: {
          success: `${urlBackend}/success`,
          failure: `${urlBackend}/failure`,
          pending: `${urlBackend}/pending`,
        },
        notification_url: `${urlBackend}/webhook`,
      },
    });
    console.log(result, "RESULTADO000000");
    res.send(result);
  } catch (error) {
    console.log(error, "ERRORRRRRR");
    res.send(error);
  }
};

export const receiveWebHook = async (req, res) => {
  const payment = req.query;
  try {
    if (payment.type === "payment") {
      await mercadopago.payment.findById(payment["data.id"]);
    }
    res.sendStatus(204);
  } catch (error) {
    return res.sendStatus(500).json({ error: error.message });
  }
};
