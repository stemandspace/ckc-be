"use strict";

const clg = require("../../../lib/clg.js");

const calculateDiscount = (amount, discountType, discountValue) => {
  if (discountType === "percentage") {
    return amount * (discountValue / 100);
  } else if (discountType === "fixed") {
    return discountValue;
  }
};

/**
 * promocode service
 */

const { createCoreService } = require("@strapi/strapi").factories;

module.exports = createCoreService("api::promocode.promocode", () => ({
  // if transactionId is not provided, it means the promocode is just validating.
  applicable: async (code, userId, amount) => {
    let reason = "";
    let applicable = true;

    clg("applyPromocode", code, userId);
    // validation;
    if (!code || !userId || !amount) {
      return {
        reason: "Missing parameters",
        applicable: false,
      };
    }
    // find promocode
    const promocode = await strapi.query("api::promocode.promocode").findOne({
      where: {
        code,
      },
      populate: {
        users: {
          select: ["id"],
        },
      },
    });

    if (!promocode) {
      return {
        reason: "Promocode not found",
        applicable: false,
      };
    }

    const promocode_usage = await strapi
      .query("api::promocode-usage.promocode-usage")
      .count({
        where: {
          promocode: promocode?.id,
          user: userId,
        },
      });

    const promocode_used = promocode_usage > 0;

    // check if promocode is valid
    const currentDate = +new Date();
    const discount = calculateDiscount(
      amount,
      promocode.discount_type,
      promocode.discount_value
    );
    const discounted_price = amount - discount;

    switch (true) {
      case promocode?.users?.length > 0 &&
        !promocode.users.find((user) => user.id === parseInt(userId)):
        reason = "User not allowed to use this promocode";
        applicable = false;
        break;
      case !promocode.is_active:
        reason = "Promocode is not active";
        applicable = false;
        break;
      case discount > promocode?.max_discount:
        reason = "Discount exceeds the maximum discount limit";
        applicable = false;
        break;
      case promocode.min_purchase_amount >= amount:
        reason = "Minimum purchase amount not met";
        applicable = false;
        break;
      case currentDate < +new Date(promocode.valid_from):
        reason = "Promocode is not valid yet";
        applicable = false;
        break;
      case currentDate > +new Date(promocode.valid_until):
        reason = "Promocode has expired";
        applicable = false;
        break;
      case promocode_used:
        reason = "Promocode has already been used";
        applicable = false;
        break;
      default:
        break;
    }
    clg("promocode", promocode);
    return {
      data: promocode,
      reason,
      discount,
      applicable,
      discounted_price,
    };
  },
  // attach promocode to user
  attach: async (userId, promocodeId, transactionId) => {
    await strapi.query("api::promocode-usage.promocode-usage").create({
      data: {
        user: userId,
        promocode: promocodeId,
        transaction: transactionId,
        publishedAt: new Date(),
      },
    });
  },
}));
