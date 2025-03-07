const axios = require("axios");
const clg = require("./clg");
async function SendZeptoMail({ templateKey, email, name, variables }) {
  try {
    const payload = {
      mail_template_key: templateKey,
      from: {
        address: "noreply@fullstackartists.com",
        name: "noreply",
      },
      to: [
        {
          email_address: {
            address: email,
            name: name,
          },
        },
      ],
      merge_info: {
        ...variables,
      },
    };
    const res = await axios.post(
      "https://api.zeptomail.in/v1.1/email/template",
      payload,
      {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `${process.env.ZEPTO_MAIL_AUTHORIZATION_KEY}`,
        },
      }
    );
    // clg("Send Zepto mail............. Response - ", res);
    return { ok: true };
  } catch (error) {
    console.log("Zepto mail send Error: ", error);
    return { ok: false };
  }
}

module.exports = { SendZeptoMail };
