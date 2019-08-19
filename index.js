#!/usr/bin/env node
const fs = require('fs')
const path = require('path')
const childProcess = require('child_process')
const chalk = require('chalk')
const commander = require('commander')

const pkg = require('./package.json')

commander.version(pkg.version)
  .option('-g --global', 'upgrade packages globally', false)
  .option('-i --ignore-scripts', 'ignore postinstall script', false)
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

let params = ''
if (commander.ignoreScripts) {
  params += ' --ignore-scripts'
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
let ignorePkgs = []
if (packageJson['yarn-upgrade-all'] && packageJson['yarn-upgrade-all'].ignore) {
  ignorePkgs = packageJson['yarn-upgrade-all'].ignore
}
for (const element of ['dependencies', 'devDependencies', 'peerDependencies']) {
  if (packageJson[element]) {
    const option = options[element]
    const packages = Object.keys(packageJson[element])
    for (const pkg of packages) {
      if (ignorePkgs.indexOf(pkg) > -1) {
        continue
      }
      if (element === 'peerDependencies' && packageJson.devDependencies && packageJson.devDependencies[pkg]) {
        continue
      }
      let command = `yarn${global} remove ${pkg} && yarn${global} add${option} ${pkg} ${params}`
      if (element === 'devDependencies' && packageJson.peerDependencies && packageJson.peerDependencies[pkg]) {
        command = `yarn${global} remove ${pkg} && yarn${global} add --peer ${pkg} ${params}&& yarn${global} add --dev ${pkg} ${params}`
      }
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
