#!/usr/bin/env node
/* eslint-disable no-console */
import { existsSync } from 'fs';
import { resolve } from 'path';
import { execSync } from 'child_process';

const argv = new Set(process.argv);

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
if (argv.has('-g') || argv.has('--global')) {
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

const params = Array.from(argv).filter((arg) => arg.startsWith('-') && arg !== '-g' && arg !== '--global').join(' ');

if (!existsSync(packagePath)) {
  logError(`Cannot find ${packagePath}`);
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
