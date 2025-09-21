import twilio from "twilio";
const client = twilio("TWILIO_ACCOUNT_SID", "TWILIO_AUTH_TOKEN");

client.messages.create({
  body: "Your OTP is 123456",
  from: "+1234567890", // Twilio number
  to: "+91XXXXXXXXXX"
}).then(message => console.log(message.sid));
