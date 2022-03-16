const withTM = require("next-transpile-modules")(["@next-auth/prisma-adapter"]);

module.exports = withTM({
  reactStrictMode: true,
  images: {
    domains: ["crmyoupzsrsqqvmhrcvp.supabase.in", "lh3.googleusercontent.com"],
  },
});
