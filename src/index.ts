#!/usr/bin/env node
/* eslint-disable no-console */
import { execSync } from 'child_process';
import { existsSync, PathLike } from 'fs';
import { resolve } from 'path';
import { logError, logInfo, logSuccess } from './utils';

const inputs = new Set(process.argv);

let packagePath: PathLike;
let global = '';
if (inputs.has('-g') || inputs.has('--global')) {
  global = 'global';
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
if (!existsSync(packagePath)) {
  logError(`Cannot find ${packagePath}`);
  process.exit(1);
}

// eslint-disable-next-line import/no-dynamic-require
const packageJson = require(packagePath);
let ignorePkgs = new Set();
if (packageJson['yarn-upgrade-all'] && packageJson['yarn-upgrade-all'].ignore) {
  ignorePkgs = new Set(packageJson['yarn-upgrade-all'].ignore);
}

const depTypes: { [key: string]: string } = {
  dependencies: '',
  devDependencies: '--dev',
  peerDependencies: '--peer',
};
const params = Array.from(inputs).filter((arg) => arg.startsWith('-') && arg !== '-g' && arg !== '--global');
Object.keys(depTypes).forEach((depType) => {
  if (!packageJson[depType]) {
    return;
  }
  const deps = Object.keys(packageJson[depType]).filter((dep) => !ignorePkgs.has(dep));
  if (deps.length === 0) {
    return;
  }
  const argv = ['yarn', global, 'add', ...deps, depTypes[depType], ...params];
  const command = argv.filter((c) => c !== '').join(' ');
  try {
    logInfo(command);
    execSync(command, { stdio: [] });
    logSuccess(command);
  } catch (e) {
    logError(`${command} - ${e}`);
  }
});
