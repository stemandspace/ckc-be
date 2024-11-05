"use strict";

const axios = require("axios");

/**
 * @typedef {import('@strapi/strapi').Strapi} Strapi
 * @typedef {import('koa').Context} Context
 */

/**
 * NAC custom APIs
 * @param {{ strapi: Strapi }} param0 - Strapi instance.
 * @returns {Object} Controller methods.
 */
const controller = ({ strapi }) => ({
  // registation by UI;
  async registration(ctx) {
    try {
      const { formData, razorpayData } = ctx.request.body.data;
      const generatedPassword = generateRandomPassword();

      // Check for existing user
      const existingUser = await findUserByEmail(strapi, formData.email);

      // If user does not exist, create a new one
      if (!existingUser) {
        await createUser(strapi, formData.email, generatedPassword);
      }

      // Publish the registration entry
      await publishRegistration(strapi, formData.email, razorpayData);

      // Prepare notification payload
      const notificationPayload = {
        user_email: formData.email,
        first_name: formData.name,
        auto_password: existingUser
          ? "use your previous password"
          : generatedPassword,
      };

      // Send notification email
      const emailSent = await sendEmail(formData.email, notificationPayload);

      // Update notification status
      await updateNotificationStatus(strapi, formData.email, emailSent);

      console.log("NACR", {
        formData,
        razorpayData,
        notification: emailSent,
      });

      return ctx.send({ ok: true }, 200);
    } catch (err) {
      console.error(err);
      ctx.internalServerError("An error occurred during registration.");
    }
  },

  // registation by Webhook;
  async webhook(ctx) {
    try {
      const {
        event,
        payload: {
          payment: {
            entity: { id, email, description, contact },
          },
        },
      } = ctx.request.body.data;

      if (event === "payment.captured" && description === "NAC") {
        const generatedPassword = generateRandomPassword();

        // Check for existing user
        const existingUser = await findUserByEmail(strapi, email);

        // If user does not exist, create a new one
        if (!existingUser) {
          await createUser(strapi, email, generatedPassword);
        }

        // Publish the registration entry
        await publishRegistration(strapi, email, {
          razorpay_payment_id: id,
        });

        // Prepare notification payload
        const notificationPayload = {
          user_email: email,
          first_name: "New User",
          auto_password: existingUser
            ? "use your previous password"
            : generatedPassword,
        };

        // Send notification email
        const emailSent = await sendEmail(email, notificationPayload);

        // Send Whatsapp message
        const whatsappSent = await sendWhatsappMessage(
          contact,
          "NAC",
          "registration",
          []
        );
        console.log(whatsappSent);
        // Update notification status
        await updateNotificationStatus(strapi, email, emailSent, whatsappSent);

        console.log("NACW", {
          formData: { id, description, email },
          razorpayData: { id },
          notification: emailSent,
        });
        console.log("PAYMENT ORIGIN IS NOT VERIFIED");
        return ctx.send({ ok: true }, 200);
      }
      console.log("PAYMENT ORIGIN IS NOT VERIFIED");
      return ctx.send({ ok: true }, 200);
    } catch (err) {
      console.error(err);
      // we need to keep this because
      console.log("ERROR ON PAYMENT PROCESSING");
      return ctx.send({ ok: true }, 200);
    }
  },
});

/**
 * Generates a random password
 * @returns {string} A random password
 */
const generateRandomPassword = () => {
  return Math.random().toString(36).substring(2, 10);
};

/**
 * Finds a user by email
 * @param {Strapi} strapi - The Strapi instance
 * @param {string} email - The email of the user
 * @returns {Promise<Object|null>} The user object or null if not found
 */
const findUserByEmail = async (strapi, email) => {
  return await strapi.query("plugin::users-permissions.user").findOne({
    where: { email },
  });
};

/**
 * Creates a new user
 * @param {Strapi} strapi - The Strapi instance
 * @param {string} email - The user's email
 * @param {string} password - The user's password
 * @returns {Promise<Object>} The created user object
 */
const createUser = async (strapi, email, password) => {
  return await strapi.entityService.create("plugin::users-permissions.user", {
    data: {
      role: 1,
      blocked: false,
      confirmed: true,
      provider: "local",
      email,
      username: email,
      password,
    },
  });
};

/**
 * Publishes the registration entry
 * @param {Strapi} strapi - The Strapi instance
 * @param {string} email - The user's email
 * @param {any} razorpayData - The razorpay data
 */
const publishRegistration = async (strapi, email, razorpayData) => {
  await strapi.query("api::nac-registration.nac-registration").update({
    where: { email },
    data: {
      publishedAt: new Date(),
      payment_info: JSON.stringify(razorpayData),
    },
  });
};

/**
 * Sends a notification email
 * @param {string} email - The recipient's email
 * @param {Object} payload - The email payload
 * @returns {Promise<Object|null>} The response from the email service
 */

const sendEmail = async (email, payload) => {
  const APIKEY = "KGSTXRC-65MM4R4-N9HZ2EY-CWF3ME9";
  const requestUrl = `https://api.mailmodo.com/api/v1/triggerCampaign/51795575-e45a-5a13-8e36-f63c7b62099d`;

  try {
    const response = await axios.post(
      requestUrl,
      JSON.stringify({ email, data: payload }),
      {
        headers: {
          "Content-Type": "application/json",
          mmApiKey: APIKEY,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("failed to send email to", email);
    return null;
  }
};

const sendWhatsappMessage = async (
  phone,
  userName,
  campaignName,
  templateParams
) => {
  try {
    const payload = {
      media: {},
      buttons: [],
      location: {},
      source: "NAC",
      carouselCards: [],
      userName: userName,
      destination: phone.replace("+", ""),
      paramsFallbackValue: {},
      campaignName: campaignName,
      templateParams: templateParams,
      apiKey:
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3MWI3NTJhZmFiZjRmMDRjNzlhYThjNCIsIm5hbWUiOiJTVEVNIFJFU0VBUkNIICYgSU5OT1ZBVElPTiBMTFAgNzQyNyIsImFwcE5hbWUiOiJBaVNlbnN5IiwiY2xpZW50SWQiOiI2NzFiNzUyOWZhYmY0ZjA0Yzc5YWE4NzkiLCJhY3RpdmVQbGFuIjoiQkFTSUNfTU9OVEhMWSIsImlhdCI6MTcyOTg1MjcxNH0.vmZ66yvxmKEy4NYTooK6SLWXbH-qga6fdk1kAclwrws",
    };

    const response = await axios.post(
      "https://backend.aisensy.com/campaign/t1/api/v2",
      payload
    );
    return response.data;
  } catch (err) {
    console.error(err);
  }
};

/**
 * Updates the notification status for the user
 * @param {Strapi} strapi - The Strapi instance
 * @param {string} email - The user's email
 * @param {boolean} emailSent - Whether the email was sent successfully
 */
const updateNotificationStatus = async (
  strapi,
  email,
  emailSent,
  whatsappSent
) => {
  await strapi.query("api::nac-registration.nac-registration").update({
    where: { email },
    data: { notified: !!emailSent, wnotified: !!whatsappSent },
  });
};

module.exports = controller;
