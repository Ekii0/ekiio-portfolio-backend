const express = require("express");
const cors = require("cors");
const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
const app = express();
const PORT = process.env.PORT || 3030;

dotenv.config();
app.use(express.json());

const corsOptions = {
  origin: "https://ekiio.vercel.app",
  methods: "POST",
};

let transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    type: "OAuth2",
    user: process.env.MAIL_USERNAME,
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_KEY,
    refreshToken: process.env.REFRESH_TOKEN,
  },
});

app.post("/sendmail", cors(corsOptions), (req, res) => {
  const { name, email, subject, message } = req.body;

  let mailOptions = {
    sender: email,
    replyTo: email,
    to: process.env.TARGET_EMAIL_ADDRESS,
    subject: subject,
    text: `Hi, I am ${name} (${email}).\n ${message}`,
  };

  transporter.sendMail(mailOptions, function (err, data) {
    if (err) {
      console.log("Error " + err);
      res.status(500).send("Error " + err);
    } else {
      console.log("Email sent successfully");
      res.status(200).send("Email sent successfully");
    }
  });
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}...`);
});
