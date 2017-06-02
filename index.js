#!/usr/bin/env node

const fs = require('fs')
const chalk = require('chalk')

const error = (message) => {
  console.log(chalk.red('Error: ') + message)
}

if(!fs.existsSync('./package.json')) {
  error('Cannot find package.json file in the current directory');
  return;
}

const s = fs.readFileSync('./package.json', 'utf-8')
console.log(s)
