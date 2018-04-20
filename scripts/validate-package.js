const os = require('os');
const path = require('path');
const validateSchema = require('webpack/lib/validateSchema');
const webpackOptionsSchema = require('webpack/schemas/WebpackOptions.json');
const WebpackOptionsValidationError = require('webpack/lib/WebpackOptionsValidationError');
const chalk = require('chalk');
const Listr = require('listr');

const { run, runInParallel } = require('./utils');

const NUMBER_OF_PROCESSES = os.cpus().length;

const packages = ['less', 'sass', 'typescript'];

async function init() {
  const tasks = new Listr([
    {
      title: 'Install dependencies',
      task: installPackages,
    },
  ]);

  for (const pkg of packages) {
    tasks.add(
      {
        title: `Validating ${pkg}`,
        task: () => validatePackage(pkg),
      }
    );
  }

  tasks
    .run()
    .catch((err) => {
      const message = err.message.split('\n');
      message.pop();

      console.error(chalk.red(message.join('\n')));
    });
}

async function installPackages() {
  const install = async (pkg) => {
    const cwd = path.join(process.cwd(), 'presets', pkg);
    await run('yarn install', cwd);
  };

  return await runInParallel(NUMBER_OF_PROCESSES, packages, install);
}

function validatePackage(pkg) {
  const cwd = path.join(process.cwd(), 'presets', pkg);
  const config = require(path.join(cwd, 'webpack.config.js'));

  const development = config('development');

  checkSchema(development, 'development');

  const production = config('production');

  checkSchema(production, 'production');
}

function checkSchema(schema, name) {
  const webpackOptionsValidationErrors = validateSchema(webpackOptionsSchema, schema);

  if (webpackOptionsValidationErrors.length) {
    const error = new WebpackOptionsValidationError(webpackOptionsValidationErrors);

    error.message += `\nFailed on ${name} config`;

    throw error;
  }
}

(async () => await init())();
