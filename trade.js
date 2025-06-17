import { KiteConnect } from "kiteconnect";
import { getAccessToken } from "./access_token.js";

const kc = new KiteConnect({ api_key: process.env.KITE_API_KEY });

async function ensureToken() {
  try {
    const token = await getAccessToken();
    kc.setAccessToken(token);
  } catch (err) {
    console.error("Failed to get access token:", err);
    throw err;
  }
}

export async function placeOrder(tradingsymbol, transaction_type, quantity) {
  try {
    await ensureToken();
    const order = await kc.placeOrder("regular", {
      exchange: "NSE",
      tradingsymbol,
      transaction_type,
      quantity,
      product: "CNC",
      order_type: "MARKET",
    });

    await new Promise(resolve => setTimeout(resolve, 1000));
    const orders = await kc.getOrders();
    const placedOrder = orders.find(o => o.order_id === order.order_id);

    if (placedOrder && placedOrder.status === "REJECTED") {
      return {
        success: false,
        order_id: order.order_id,
        error: `Order rejected: ${placedOrder.status_message || "Unknown reason"}`
      };
    }

    return {
      success: true,
      order_id: order.order_id,
      error: null,
    };
  } catch (err) {
    console.error("❌ Error placing order:", err.message);
    return {
      success: false,
      order_id: null,
      error: err.message || "Unknown error",
    };
  }
}

export async function getPosition() {
  try {
    await ensureToken();
    const holdings = await kc.getPosition();
    let allHoldings = "";
    holdings.map(holding => {
      allHoldings += `stock: ${holding.tradingsymbol}, quantity: ${holding.quantity}, currp: ₹${holding.last_price}\n`;
    });
    return allHoldings;
  } catch (err) {
    console.error("❌ Error getting positions:", err.message);
    return `Error fetching positions: ${err.message}`;
  }
}


