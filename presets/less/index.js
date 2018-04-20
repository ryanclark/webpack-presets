const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = () => {
  return {
    module: {
      rules: [
        {
          test: /\.less$/,
          use: [MiniCssExtractPlugin.loader, require.resolve('css-loader'), require.resolve('less-loader')],
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
