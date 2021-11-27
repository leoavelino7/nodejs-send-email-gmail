require("dotenv").config();
const nodemailer = require("nodemailer");
const { google } = require("googleapis");

const {
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI,
  REFRESH_TOKEN,
  USER_NAME,
  USER_EMAIL,
} = process.env;

const oAuth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI
);

oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

async function sendMail({ subject, html }) {
  try {
    const accessToken = await oAuth2Client.getAccessToken();

    const transport = nodemailer.createTransport({
      service: "gmail",
      auth: {
        type: "OAuth2",
        user: USER_EMAIL,
        clientId: CLIENT_ID,
        clientSecret: CLIENT_SECRET,
        refreshToken: REFRESH_TOKEN,
        accessToken,
      },
    });

    const mailOptions = {
      from: `${USER_NAME} <${USER_EMAIL}>`,
      to: USER_EMAIL,
      subject,
      html,
    };

    const result = await transport.sendMail(mailOptions);
    return result;
  } catch (error) {
    return error;
  }
}

sendMail({
  subject: "Gmail API",
  html: "<p>Example text in the body of the email</p>",
})
  .then((result) => console.log("Email sended:", result))
  .catch((error) => console.error(error.message));
