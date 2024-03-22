import { MercadoPagoConfig, Preference } from "mercadopago";
import axios from "axios";

export const createMPToken = async (req, res) => {
  console.log("LLEGUE A LA FUNCION CREATEMPTOKEN()");
  const { code } = req.body;
  console.log(code, "CODE");
  try {
    if (code) {
      const data = {
        client_id: "7016024355594930",
        client_secret: "JuuSrhW9y4hU7O9oIRv0WU7D6g8yVXEV",
        code: code,
        grant_type: "authorization_code",
        redirect_uri: "https://datefrontendpruebas.onrender.com/",
        // refresh_token: "TG-XXXXXXXX-241983636",
        // test_token: true,
      };

      const accessToken = axios.post("https://api.mercadopago.com/oauth/token", data, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      res.send(accessToken.data)
    }
  } catch (error) {
    res.send(error);
  }
};

export const createOrder = async (req, res) => {
  //ver si el accessToken lo voy a pasar desde el front o directamente
  //lo recupero desde la base de datos o algo
  const { accessToken, products, back_urls, notification_url } = req.body;
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
        // items: [{ title: "My product", quantity: 1, unit_price: 2000 }],
        back_urls: back_urls,
        // back_urls: {
        //   success: "http://localhost:3001/success",
        //   failure: "http://localhost:3001/failure",
        //   pending: "http://localhost:3001/pending",
        // },
        notification_url: notification_url,
        //     notification_url:
        //       "https://3347-2803-9800-9884-ba08-70e6-eba5-59b0-3e20.ngrok-free.app/webhook",
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
      const data = await mercadopago.payment.findById(payment["data.id"]);
      console.log(data, "DATA QUE BUSCOOO");
    }
    res.sendStatus(204);
  } catch (error) {
    console.log(error, "ERROR RECEIVEWEBHOOK");
    return res.sendStatus(500).json({ error: error.message });
  }
};
