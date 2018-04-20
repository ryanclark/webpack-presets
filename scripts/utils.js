const Listr = require('listr');

const { exec } = require('child_process');

function run(command, cwd) {
  return new Promise((resolve, reject) => {
    exec(command, { encoding: 'utf8', cwd }, (error, stdout, stderr) => {
      if (error) {
        return reject(error);
      }

      resolve({ stdout: stdout.trim(), stderr: stderr.trim() });
    });
  });
}

async function runInParallel(number, inputs, use) {
  const list = new Listr([], { concurrent: true });

  let nextIndex = 0;

  initArray(number, async () => {
    while (nextIndex !== inputs.length) {
      const index = nextIndex;
      nextIndex += 1;

      const task = use(inputs[index]);

      list.add(
        {
          title: inputs[index],
          task: async () => await task,
        }
      );

      await task;
    }
  });

  return list;
}

function initArray(length, makeElement) {
  const arr = new Array(length);

  for (let i = 0; i < length; i++) {
    arr[i] = makeElement(i);
  }

  return arr;
}

module.exports = { run, runInParallel };
