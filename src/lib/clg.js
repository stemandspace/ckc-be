const clg = (...arg) => {
  if (process.env.NODE_ENV === "production") return;
  console.log(...arg);
};

module.exports = clg;
