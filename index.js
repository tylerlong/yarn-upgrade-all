#!/usr/bin/env node
const fs = require('fs')
const path = require('path')
const childProcess = require('child_process')
const chalk = require('chalk')
const commander = require('commander')

const pkg = require('./package.json')

commander.version(pkg.version)
  .option('-g --global', 'upgrade packages globally', false)
  .parse(process.argv)

const logError = (message) => {
  console.log(chalk.red('[Error]: ' + message))
}
const logInfo = (message) => {
  console.log(chalk.blue('[Start]: ' + message))
}
const logSuccess = (message) => {
  console.log(chalk.green('[Done]: ' + message))
}

let packagePath = null
let global = ''
if (commander.global) {
  global = ' global'
  packagePath = path.resolve(process.env[process.platform === 'win32' ? 'USERPROFILE' : 'HOME'], '.config', 'yarn', 'global', 'package.json')
} else {
  packagePath = path.resolve(process.cwd(), 'package.json')
}

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
      const command = `yarn${global} remove ${pkg} && yarn${global} add${option} ${pkg}`
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
