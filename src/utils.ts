/* eslint-disable no-console */
export const logError = (message: string) => {
  console.log('\x1b[31m', '[Error]:', message);
};

export const logInfo = (message: string) => {
  console.log('\x1b[34m', '[Start]:', message);
};

export const logSuccess = (message: string) => {
  console.log('\x1b[32m', '[Done]:', message);
};
