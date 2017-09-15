#!/usr/bin/env node
const fs = require('fs')
const path = require('path')
const childProcess = require('child_process')
const chalk = require('chalk')

const logError = (message) => {
  console.log(chalk.red('[Error]: ' + message))
}
const logInfo = (message) => {
  console.log(chalk.blue('[Start]: ' + message))
}
const logSuccess = (message) => {
  console.log(chalk.green('[Done]: ' + message))
}

const packagePath = path.resolve(process.cwd(), 'package.json')
if (!fs.existsSync(packagePath)) {
  logError('Cannot find package.json file in the current directory')
  process.exit(1)
}

const packageJson = require(packagePath)
const options = {
  dependencies: '',
  devDependencies: ' --dev',
  peerDependencies: ' --peer'
}
for (let element of ['dependencies', 'devDependencies', 'peerDependencies']) {
  if (packageJson[element]) {
    const option = options[element]
    const packages = Object.keys(packageJson[element])
    for (let pkg of packages) {
      const command = `yarn remove ${pkg} && yarn add${option} ${pkg}`
      try {
        logInfo(command)
        childProcess.execSync(command, { stdio: [] })
        logSuccess(command)
      } catch (e) {
        logError(`${command} - ${e}`)
      }
    }
  }
}
