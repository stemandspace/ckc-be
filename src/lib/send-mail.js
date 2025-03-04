const axios = require("axios");
const clg = require("./clg");
 async function SendZeptoMail({ templateKey,email,name,variables }) {
  try {
    const payload = {
      mail_template_key:
         templateKey,
      from: {
        address: "noreply@fullstackartists.com",
        name: "noreply",
      },
      to: [
        {
          email_address: {
            address: email,
            name:  name,
          },
        },
      ],
      merge_info: {
       ...variables
      },
    };
    const res = await axios.post(
      "https://api.zeptomail.in/v1.1/email/template",
      payload,
      {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization:
            "Zoho-enczapikey PHtE6r0OFOu42WQu9URR5vS8EcH3Ztx69b5gKFUTsNpHAqAKTk1Ur9p+lzfh/k0uXaJFEaWbzd5ss7OcsriHIWa+ZG0fCWqyqK3sx/VYSPOZsbq6x00csFUYfk3eXYHtd9Jo1CPUuN7fNA==",
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