/* eslint-disable no-console */
export const logError = (message: string) => {
  console.log('\x1b[31m', '[Error]:', message, '\x1b[0m');
};

export const logInfo = (message: string) => {
  console.log('\x1b[34m', '[Start]:', message, '\x1b[0m');
};

export const logSuccess = (message: string) => {
  console.log('\x1b[32m', '[Done]:', message, '\x1b[0m');
};
