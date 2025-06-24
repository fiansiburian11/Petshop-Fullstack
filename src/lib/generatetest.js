import crypto from "crypto";

const order_id = "ORDER-42-1750589986820";
const status_code = "200";
const gross_amount = "450000";
const serverKey = "SB-Mid-server-1mDYgifuXHgCegho9tsQjf7-";

const signature = crypto
  .createHash("sha512")
  .update(order_id + status_code + gross_amount + serverKey)
  .digest("hex");

console.log(signature);
