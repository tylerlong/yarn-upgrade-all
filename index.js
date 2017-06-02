#!/usr/bin/env node
const fs = require('fs')
const chalk = require('chalk')
const child_process = require('child_process')

const error = (message) => {
  console.log(chalk.red('Error: ') + message)
}
const info = (message) => {
  console.log(chalk.blue('Info: ') + message)
}

if(!fs.existsSync('./package.json')) {
  error('Cannot find package.json file in the current directory');
  return;
}

const packageJson = require('./package.json')
for(let element of ['dependencies', 'devDependencies', 'peerDependencies']) {
  if(packageJson[element]) {
    const packages = Object.keys(packageJson[element])
    for(let package of packages) {
      info(`yarn upgrade ${package}`)
      child_process.execSync(`yarn upgrade ${package}`, { stdio: [] })
    }
  }
}
