const path = require("path");

module.exports = {
  stories: [
    "../src/**/*.stories.mdx",
    "../src/**/*.stories.@(js|jsx|ts|tsx)"
  ],
   // Add any Storybook addons you want here: https://storybook.js.org/addons/
  addons: [
    '@storybook/addon-postcss',
    '@storybook/addon-essentials',
  ],
  core: {
    builder: "webpack5",
  },
  typescript: { reactDocgen: false }, // because webpack 5 incompatibility issue
  webpackFinal: async (config) => {
    config.module.rules.push({
      test: /\.scss$/,
      use: ["style-loader",
        {
          loader: "css-loader",
          options: {
            modules: {
              auto: true
            },
          },
        },
        "postcss-loader", "sass-loader"],
      include: path.resolve(__dirname, "../")
    });

    config.module.rules.push({
      test: /\.(ts|tsx)$/,
      loader: require.resolve("babel-loader"),
      options: {
        presets: [["react-app", { flow: false, typescript: true }]]
      }
    });
    config.resolve.extensions.push(".ts", ".tsx");

    config.resolve.modules = [
      path.resolve(__dirname, "..", 'src'),
      "node_modules",
    ]

    return config;
  },
  features: {
    postcss: false,
  },
};
