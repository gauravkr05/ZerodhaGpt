import { KiteConnect } from "kiteconnect";

const apiKey = "bjyhcsv5keda47r9";
// const apiSecret = "y5cvtm4sd795v9rizxhv0bcs46mebu1h";
// const requestToken = "uJIEI5uEKx6NxiXlAejUv6jA1iLZtOo1";
let access_token="CwloE8pImju1BnH1yI56Ihnab11M9LpW";


const kc = new KiteConnect({ api_key: apiKey });
// console.log(kc.getLoginURL());

export async function placeOrder(tradingsymbol,transaction_type,quantity) {
  try{
    kc.setAccessToken(access_token);
    const profile = await kc.getProfile();
    console.error("👤 Logged in as:", profile.user_name);
  
        
       const order=  await kc.placeOrder("regular",{
             exchange:"NSE",
             tradingsymbol,
          transaction_type,
          quantity,
          product:"CNC",
          order_type:"MARKET" , 
          });
  } catch (err) {
    console.error(err);
  }
}


// async function generateSession() {
//   try {
//     const response = await kc.generateSession(requestToken, apiSecret);
//     kc.setAccessToken(response.access_token);
//     console.log(response.access_token);
//     console.log("Session generated:", response);
//   } catch (err) {
//     console.error("Error generating session:", err);
//   }
// }

// async function placeOrder() {
//   try {
//     const order = await kc.placeOrder("regular",{
//        exchange:"NSE",
//        tradingsymbol:"PRAKASHSTEEL",
//     transaction_type:"BUY",
//     quantity:1,
//     product:"CNC",
//     order_type:"MARKET" , 
//     });
//     console.log("Profile:", profile);
//   } catch (err) {
//     console.error("Error getting profile:", err);
//   }
// }
// // Initialize the API calls
