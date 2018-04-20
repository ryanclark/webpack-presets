const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = () => {
  return {
    module: {
      rules: [
        {
          test: /\.scss$/,
          use: [MiniCssExtractPlugin.loader, require.resolve('css-loader'), require.resolve('sass-loader')],
        },
      ],
    },
    plugins: [
      new MiniCssExtractPlugin({
        filename: '[name].[contenthash].css',
      }),
    ],
  };
};
