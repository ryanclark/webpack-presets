const merge = require('webpack-merge');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');

module.exports = (env) => {
  const overrides = {
    development: {
      plugins: [new ForkTsCheckerWebpackPlugin()],
    },
    production: {},
  };

  return merge(overrides[env], {
    resolve: {
      extensions: ['.tsx', '.ts', '.js', '.json'],
    },
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: {
            loader: require.resolve('ts-loader'),
            options: {
              transpileOnly: env === 'development',
            },
          },
        },
      ],
    },
  });
};
