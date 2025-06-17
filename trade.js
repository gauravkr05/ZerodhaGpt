import { KiteConnect } from "kiteconnect";

const apiKey = "bjyhcsv5keda47r9";
// const apiSecret = "y5cvtm4sd795v9rizxhv0bcs46mebu1h";
// const requestToken = "giiKeIDjPq350BSEhqjuCIDoERx65cUW";

let access_token="TxgqkQJFDVveBGuJaofQnzfKkUwAiq57";



const kc = new KiteConnect({ api_key: apiKey });
// console.log(kc.getLoginURL());
// async function generateAccessToken() {
//   try {
//     const session = await kc.generateSession(requestToken, apiSecret);
//     console.log("✅ Access token:", session.access_token);
//     // Optional: Save it to a file
//     // fs.writeFileSync("access_token.txt", session.access_token);
//   } catch (err) {
//     console.error("❌ Failed to generate access token:", err);
//   }
// }

// generateAccessToken();
export async function placeOrder(tradingsymbol, transaction_type, quantity) {
  try {
    // kc.setAccessToken(access_token);
    // const profile = await kc.getProfile();
    // console.log("✅ Logged in as:", profile.user_name);

    const order = await kc.placeOrder("regular", {
      exchange: "NSE",
      tradingsymbol,
      transaction_type,
      quantity,
      product: "CNC",
      order_type: "MARKET",
    });

    // Wait a bit and fetch order status
    await new Promise(resolve => setTimeout(resolve, 1000)); // 1 second delay
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
  const holdings = await kc.getPosition();
  let allHoldings = "";
  holdings.map(holding => {
    allHoldings += `stock: ${holding.tradingsymbol}, quantity: ${holding.quantity}, currp: ₹${holding.last_price}\n`;
  });
  return allHoldings;
}


