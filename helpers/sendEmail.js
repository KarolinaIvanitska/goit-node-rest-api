import nodemailer from "nodemailer";
import "dotenv/config";

const { UKR_NET_PASSWORD, UKR_NET_EMAIL } = process.env;

const nodemailerConfig = {
  host: "smtp.ukr.net",
  port: 465,
  secure: true,
  auth: {
    user: UKR_NET_EMAIL,
    pass: UKR_NET_PASSWORD,
  },
};

const transport = nodemailer.createTransport(nodemailerConfig);

// const data = {
//   from: UKR_NET_EMAIL,
//   to: "karolina.ivanitska@gmail.com",
//   subject: "Hello from nodemailer",
//   html: "<h1>Hello</h1>",
// };
const sendEmail = (data) => {
  const email = { ...data, from: UKR_NET_EMAIL };
  return transport.sendMail(email);
};

export default sendEmail;

// transport
//   .sendMail(email)
//   .then(() => console.log("Email sent"))
//   .catch((error) => console.log(error.message));
