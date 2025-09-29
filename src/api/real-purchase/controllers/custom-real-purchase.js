const razorpay = require("../../../rz");

/**
 * @typedef {import('@strapi/strapi').Strapi} Strapi
 * @typedef {import('koa').Context} Context
 */

// Constants for better maintainability
const PURCHASE_STATUS = {
  PENDING: "pending",
  COMPLETED: "paid",
  FAILED: "failed",
};

const REQUIRED_FIELDS = [
  "type",
  "amount",
  "currency",
  "user_id",
  "plan_id",
  "topup_id",
];

// Enhanced validation function with type checking and better error messages
function validateRequiredFields(data, requiredFields = REQUIRED_FIELDS) {
  if (!data || typeof data !== "object") {
    const error = new Error("Invalid request data");
    // @ts-ignore
    error.status = 400;
    throw error;
  }

  const missingFields = requiredFields.filter((field) => {
    const value = data[field];
    return value === undefined || value === null || value === "";
  });

  if (missingFields.length > 0) {
    const error = new Error(
      `Missing required parameter${
        missingFields.length > 1 ? "s" : ""
      }: ${missingFields.join(", ")}`
    );
    // @ts-ignore
    error.status = 400;
    throw error;
  }

  // Validate amount is a positive number
  if (typeof data.amount !== "number" || data.amount <= 0) {
    const error = new Error("Amount must be a positive number");
    // @ts-ignore
    error.status = 400;
    throw error;
  }

  // Validate currency format
  if (typeof data.currency !== "string" || data.currency.length !== 3) {
    const error = new Error("Currency must be a valid 3-letter code");
    // @ts-ignore
    error.status = 400;
    throw error;
  }
}

function validateWebhookEvent({ event, status, description }, ctx) {
  // Validate webhook event type
  if (event !== "payment.captured") {
    console.log("Webhook event not payment.captured:", event);
    return ctx.send({ ok: true }, 200);
  }

  // Validate payment status
  if (status !== "captured") {
    console.log("Payment not captured:", status);
    return ctx.send({ ok: true }, 200);
  }

  // Validate description contains students.spacetopia
  if (!description || !description.includes("students.spacetopia")) {
    console.log(
      "Description does not contain students.spacetopia:",
      description
    );
    return ctx.send({ ok: true }, 200);
  }
}

const controller = ({ strapi }) => ({
  /**
   * Handle Razorpay webhook for payment validation and user premium update
   * @param {Context} ctx - Koa context
   * @returns {Promise<any>} Response indicating webhook processing status
   */
  async handleWebhook(ctx) {
    const transaction = await strapi.db.connection.transaction();

    try {
      // @ts-ignore
      const webhookData = ctx.request.body.data;
      // Extract payment information from webhook
      const {
        event,
        payload: {
          payment: {
            entity: {
              id: paymentId,
              description,
              notes,
              amount,
              currency,
              status,
            },
          },
        },
      } = webhookData;

      validateWebhookEvent({ event, status, description }, ctx);

      // Extract purchase information from notes
      const {
        real_purchase_id,
        purchase_id,
        user_id,
        type,
        plan_id,
        topup_id,
      } = notes;

      if (!real_purchase_id || !user_id || !type) {
        console.log("Missing required purchase information in notes");
        return ctx.send({ ok: true }, 200);
      }

      // Find the real purchase record
      const realPurchase = await strapi
        .query("api::real-purchase.real-purchase")
        .findOne({
          where: { id: real_purchase_id },
        });

      if (!realPurchase) {
        console.log("Real purchase not found:", real_purchase_id);
        return ctx.send({ ok: true }, 200);
      }

      // Update real purchase status to completed
      await strapi.query("api::real-purchase.real-purchase").update({
        where: { id: real_purchase_id },
        data: {
          status: PURCHASE_STATUS.COMPLETED,
          metadata: {
            ...realPurchase.metadata,
            rz_payment_id: paymentId,
            webhook_processed_at: new Date().toISOString(),
            payment_captured_at: new Date().toISOString(),
          },
        },
      });

      // Process user account updates using service methods
      const realPurchaseService = strapi.service(
        "api::real-purchase.real-purchase"
      );

      if (type === "premium") {
        // Update user premium (1 year from now)
        const currentDate = Math.floor(Date.now() / 1000);
        const oneYearInSeconds = 365 * 24 * 60 * 60;
        const newPremiumDate = currentDate + oneYearInSeconds;

        await realPurchaseService.updateUserPremium(
          user_id,
          newPremiumDate,
          plan_id
        );

        // Add plan credits if plan_id is provided
        if (plan_id) {
          const planCredits = await realPurchaseService.getPlanCredits(plan_id);
          if (planCredits > 0) {
            await realPurchaseService.addCreditsToUser(user_id, planCredits);
            console.log("Plan credits added:", planCredits);
          }
        }
        console.log("User premium updated");
      } else if (type === "credits") {
        // Handle credits purchase from topup
        if (topup_id) {
          const topupCredits = await realPurchaseService.getTopupCredits(
            topup_id
          );
          if (topupCredits > 0) {
            await realPurchaseService.addCreditsToUser(user_id, topupCredits);
            console.log("Topup credits added:", topupCredits);
          }
        }
        console.log("Credits purchase processed:", { user_id, type });
      }

      // Commit transaction
      await transaction.commit();

      console.log("Webhook processed successfully:", {
        payment_id: paymentId,
        real_purchase_id,
        user_id,
        type,
        amount,
        currency,
      });

      return ctx.send({ ok: true }, 200);
    } catch (error) {
      // Rollback transaction on error
      await transaction.rollback();

      console.error("Error processing webhook:", {
        error: error.message,
        stack: error.stack,
        // @ts-ignore
        webhookData: ctx.request.body?.data,
        timestamp: new Date().toISOString(),
      });

      // Return success to Razorpay to prevent retries for non-critical errors
      return ctx.send({ ok: true }, 200);
    }
  },

  /**
   * Initiate a real purchase with Razorpay integration
   * @param {Context} ctx - Koa context
   * @returns {Promise<any>} Response with purchase details
   */
  async initiateRealPurchase(ctx) {
    const transaction = await strapi.db.connection.transaction();

    try {
      // @ts-ignore
      const data = ctx.request.body.data;

      // Validate input data
      validateRequiredFields(data);

      // Fetch user to check email domain
      const user = await strapi
        .query("plugin::users-permissions.user")
        .findOne({
          where: { id: data.user_id },
          select: ["email"],
        });

      if (!user) {
        const error = new Error("User not found");
        // @ts-ignore
        error.status = 404;
        throw error;
      }

      // Check if user email contains @spacetopia.in for testing
      const isSpacetopiaUser =
        user.email && user.email.includes("@spacetopia.in");

      // Override amount to 1 rupee for spacetopia.in users
      if (isSpacetopiaUser) {
        data.amount = 1; // Set to 1 rupee for testing
      }

      // Generate unique purchase ID
      const purchaseId = `rt_${Date.now()}_${Math.random()
        .toString(36)
        .substr(2, 9)}`;

      // Create real purchase record
      const realPurchaseData = {
        type: data.type,
        amount: data.amount,
        user_id: data.user_id,
        publishedAt: new Date(),
        purchase_id: purchaseId,
        status: PURCHASE_STATUS.PENDING,
        currency: data.currency.toUpperCase(),
      };

      const realPurchase = await strapi
        .query("api::real-purchase.real-purchase")
        .create({
          data: realPurchaseData,
        });

      // Prepare Razorpay order data
      const rzOrderData = {
        amount: Math.round(data.amount * 100), // Convert to paise and ensure integer
        currency: data.currency.toUpperCase(),
        notes: {
          type: data.type,
          plan_id: data.plan_id,
          user_id: data.user_id,
          topup_id: data.topup_id,
          real_purchase_id: realPurchase.id,
          purchase_id: purchaseId,
        },
        receipt: `receipt_rt_${realPurchase.id}`,
      };

      // Create Razorpay order
      const rzOrder = await razorpay.orders.create(rzOrderData);

      // Update real purchase with Razorpay order metadata
      const updatedRealPurchase = await strapi
        .query("api::real-purchase.real-purchase")
        .update({
          where: { id: realPurchase.id },
          data: {
            metadata: {
              rz_order: rzOrder,
              rz_order_id: rzOrder.id,
            },
          },
        });

      // Commit transaction
      await transaction.commit();

      // Return success response
      return ctx.send(
        {
          success: true,
          data: {
            rz_order: rzOrder,
            real_purchase: updatedRealPurchase,
          },
          message: "Real purchase initiated successfully",
        },
        200
      );
    } catch (error) {
      // Rollback transaction on error
      await transaction.rollback();

      // Handle specific error types
      if (error.status === 400) {
        return ctx.badRequest(error.message);
      }

      // Log error for debugging
      console.error("Error initiating real purchase:", {
        error: error.message,
        stack: error.stack,
        // @ts-ignore
        requestData: ctx.request.body.data,
        timestamp: new Date().toISOString(),
      });

      // Return generic error response
      return ctx.internalServerError(
        "An error occurred while creating real purchase. Please try again."
      );
    }
  },
});

module.exports = controller;
