#!/usr/bin/env node
import {execSync} from 'child_process';
import {Command} from 'commander';
import {existsSync} from 'fs';
import {resolve} from 'path';
import {version} from '../package.json';

new (class Commander extends Command {
  global?: string;
  ignorePkgs!: string[];
  ignoreScripts?: string;
  packageJson!: PackageJson;
  packagePath!: string;

  constructor() {
    super();
    this.version(version)
      .option('-g --global', 'upgrade packages globally', false)
      .option('-i --ignore-scripts', 'ignore postinstall script', false)
      .parse(process.argv);

    this.global = this.getOptionValue('global') ? 'global' : '';
    this.ignoreScripts = this.getOptionValue('--ignore-scripts')
      ? '--ignore-scripts'
      : '';

    this.packagePath = this.getPackagePath();

    if (!existsSync(this.packagePath)) {
      this.logError('Cannot find package.json file in the current directory');
      return;
    }

    this.packageJson = require(this.packagePath);

    this.ignorePkgs = this.packageJson['yarn-upgrade-all']?.ignore || [];

    this.execute();
  }

  execute() {
    for (const dependenciesType of this.dependenciesTypes) {
      if (!this.packageJson[dependenciesType]) continue;

      const elements = this.packageJson[dependenciesType];

      const option = this.dependenciesOptions[dependenciesType];

      const packages = Object.keys(elements).filter(
        pkg => !this.pattern.fixedVersion.test(elements[pkg])
      );

      const commandArray = ['yarn', this.global, 'add', option];

      for (const pkg of packages) {
        if (this.ignorePkgs.includes(pkg)) continue;

        if (this.pattern.updateVersion.test(elements[pkg])) {
          commandArray.push(pkg);

          continue;
        }

        commandArray.push(`${pkg}@${elements[pkg]}`);
      }

      commandArray.push(this.ignoreScripts);

      const command = commandArray.join(' ');

      try {
        this.logInfo(command);

        execSync(command, {stdio: []});

        this.logSuccess(command);
      } catch (e) {
        this.logError(`${command} - ${e}`);
      }
    }

    console.log('\x1b[0m'); // clear console color
  }

  get dependenciesTypes() {
    return ['dependencies', 'devDependencies', 'peerDependencies'];
  }

  get dependenciesOptions(): {[key: string]: string} {
    return {
      dependencies: '',
      devDependencies: '--dev',
      peerDependencies: '--peer',
    };
  }

  get pattern() {
    return {
      fixedVersion: /^(\d|~)([.\d]+)$/,
      updateVersion: /^(\^)([\d.]+)$/,
    };
  }

  getPackagePath(global = this.getOptionValue('global')) {
    if (global)
      return resolve(
        process.env[process.platform === 'win32' ? 'USERPROFILE' : 'HOME']!,
        '.config',
        'yarn',
        'global',
        'package.json'
      );

    return resolve(process.cwd(), 'package.json');
  }

  logError(message: string) {
    console.log('\x1b[31m', '[Error]:', message);
  }

  logInfo(message: string) {
    console.log('\x1b[34m', '[Start]:', message);
  }

  logSuccess(message: string) {
    console.log('\x1b[32m', '[Done]:', message);
  }
})();

type PackageJson = {[key: string]: {[key: string]: string}} & {
  dependencies?: {[key: string]: string};
  devDependencies?: {[key: string]: string};
  peerDependencies?: {[key: string]: string};
  'yarn-upgrade-all'?: {[key: string]: string} & {ignore: string[]};
};
