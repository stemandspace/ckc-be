const token = process.env.SHOPIFY_ADMIN_ACCESS_TOKEN;
const domain = process.env.SHOPIFY_STORE_DOMAIN;

const shopifyFetchInstance = () => {
  return async (endpoint, method = "GET", body = null) => {
    const url = `https://${domain}/admin/api/2025-01/${endpoint}`;

    const defaultOptions = {
      method,
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Access-Token": token || "",
      },
      ...(body ? { body: JSON.stringify(body) } : {}),
    };

    try {
      const response = await fetch(url, defaultOptions);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error("Fetch error:", error);
      throw error;
    }
  };
};

module.exports = { shopifyFetchInstance };

// Usage Example

