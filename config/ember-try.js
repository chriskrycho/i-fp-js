'use strict';

module.exports = {
  command: 'yarn jest',
  scenarios: [
    {
      name: 'ts-3.7',
      npm: {
        devDependencies: { typescript: '3.7' },
      },
    },
  ],
};
