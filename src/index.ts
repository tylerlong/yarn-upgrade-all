#!/usr/bin/env node
/* eslint-disable no-console */
import { existsSync } from 'fs';
import { resolve } from 'path';
import { execSync } from 'child_process';
import { Command } from 'commander';

import pkg from '../package.json';

const commander: Command & { global?: boolean; ignoreScripts?: boolean } = new Command();

commander
  .version(pkg.version)
  .option('-g --global', 'upgrade packages globally', false)
  .option('-i --ignore-scripts', 'ignore postinstall script', false)
  .parse(process.argv);

const logError = (message: string) => {
  console.log('\x1b[31m', '[Error]:', message);
};
const logInfo = (message: string) => {
  console.log('\x1b[34m', '[Start]:', message);
};
const logSuccess = (message: string) => {
  console.log('\x1b[32m', '[Done]:', message);
};

let packagePath = null;
let global = '';
if (commander.global) {
  global = ' global';
  packagePath = resolve(
    process.env[process.platform === 'win32' ? 'USERPROFILE' : 'HOME']!,
    '.config',
    'yarn',
    'global',
    'package.json',
  );
} else {
  packagePath = resolve(process.cwd(), 'package.json');
}

let params = '';
if (commander.ignoreScripts) {
  params += ' --ignore-scripts';
}

if (!existsSync(packagePath)) {
  logError('Cannot find package.json file in the current directory');
  process.exit(1);
}

// eslint-disable-next-line import/no-dynamic-require
const packageJson = require(packagePath);
const options: { [key: string]: string } = {
  dependencies: '',
  devDependencies: ' --dev',
  peerDependencies: ' --peer',
};
let ignorePkgs = [];
if (packageJson['yarn-upgrade-all'] && packageJson['yarn-upgrade-all'].ignore) {
  ignorePkgs = packageJson['yarn-upgrade-all'].ignore;
}

/**
 * @Gorniaky - you don't need to uninstall packages to update them. Now updates much faster.
 */
['dependencies', 'devDependencies', 'peerDependencies'].forEach((element) => {
  if (!packageJson[element]) {
    return;
  }
  const option = options[element];
  const deps = Object.keys(packageJson[element]);
  let command = `yarn${global} add${option}`;

  deps.forEach((dep) => {
    if (ignorePkgs.indexOf(dep) > -1) {
      return;
    }
    command = `${command} ${dep}`;
  });
  command = `${command} ${params}`;

  try {
    logInfo(command);
    execSync(command, { stdio: [] });
    logSuccess(command);
  } catch (e) {
    logError(`${command} - ${e}`);
  }
});
