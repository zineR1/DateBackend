import { MercadoPagoConfig, Preference } from "mercadopago";
import { Event } from "../models/Event.js";
import axios from "axios";
const urlBackend = process.env.URL_BACKEND_QA;
const urlFrontend = process.env.URL_FRONTEND_QA;

export const createMPToken = async (req, res) => {
  const client_id = process.env.CLIENT_ID_MP;
  const client_secret = process.env.CLIENT_SECRET_MP;
  const { code, eventId } = req.body;
  try {
    if (code && client_id && client_secret) {
      const data = {
        client_id: client_id,
        client_secret: client_secret,
        code: code,
        grant_type: "authorization_code",
        redirect_uri: `${urlFrontend}/`,
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
  const { eventId, title, quantity, price } = req.body;
  const calculatePercentage = (number, perc) => {
    return (number * perc) / 100;
  };
  const amount = price * quantity;
  const vincufyFee = calculatePercentage(amount, 6);
  const mercadoPagoCost = calculatePercentage(amount, 6.99);
  const mpIVA = calculatePercentage(mercadoPagoCost, 21);
  const totalPrice = amount + vincufyFee + mercadoPagoCost + mpIVA;
  const totalUnitPrice = totalPrice / quantity;
  const fullTitle = `${title} + Costo de servicio`;
  const products = [
    { title: fullTitle, quantity: quantity, unit_price: totalUnitPrice },
  ];
  const event = await Event.findByPk(eventId);
  const accessToken =
    event && event.mercadoPagoToken && event.mercadoPagoToken.access_token;
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
        items: products,
        // items: [{ title: "Un productazo", quantity: 1, unit_price: 100 }],
        back_urls: {
          success: `${urlFrontend}/#/resultMP/success`,
          failure: `${urlFrontend}/#/resultMP/failure`,
          pending: `${urlFrontend}/#/resultMP/pending`,
        },
        notification_url: `${urlBackend}/webhook`,
      },
    });
    console.log(result, "RESULTADO000000");
    return res.send("Pago realizado con éxito");
  } catch (error) {
    res.send("Se produjo un error al procesar la solicitud");
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
