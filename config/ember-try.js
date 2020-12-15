'use strict';

module.exports = {
  command: './node_modules/.bin/jest --config=config/jest.config.js',
  scenarios: [
    {
      name: 'ts-3.7',
      npm: {
        devDependencies: { typescript: '3.7' },
      },
    },
  ],
};
