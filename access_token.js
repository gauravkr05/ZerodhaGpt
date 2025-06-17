import fs from "fs";
import path from "path";
import { KiteConnect } from "kiteconnect";
import dotenv from "dotenv";
import { DateTime } from "luxon"; 

dotenv.config();

const apiKey = process.env.KITE_API_KEY;
const apiSecret = process.env.KITE_API_SECRET;
const tokenFile = path.join(process.cwd(), "access_token.json");

export async function getAccessToken() {
  const indiaNow = DateTime.now().setZone("Asia/Kolkata");

  if (fs.existsSync(tokenFile)) {
    const data = JSON.parse(fs.readFileSync(tokenFile, "utf-8"));
    const savedDate = DateTime.fromISO(data.generated_at).setZone("Asia/Kolkata");

    const tokenStillValid =
      indiaNow.toFormat("yyyy-MM-dd") === savedDate.toFormat("yyyy-MM-dd") &&
      indiaNow.hour < 6;

    if (tokenStillValid || (indiaNow < savedDate.plus({ days: 1 }).set({ hour: 6 }))) {
      return data.access_token;
    }
  }

  throw new Error("Access token expired. Please restart the server with a new request token.");
}

export async function generateNewToken(request_token) {
  if (!request_token) {
    throw new Error("Request token is required");
  }

  const kc = new KiteConnect({ api_key: apiKey });

  try {
    const session = await kc.generateSession(request_token, apiSecret);
    const access_token = session.access_token;

    fs.writeFileSync(tokenFile, JSON.stringify({
      access_token,
      generated_at: DateTime.now().setZone("Asia/Kolkata").toISO()
    }, null, 2));

    return access_token;
  } catch (err) {
    console.error("❌ Error generating access token:", err.message);
    throw err;
  }
}
