#!/usr/bin/env node
const fs = require('fs')
const path = require('path')
const childProcess = require('child_process')
const chalk = require('chalk')

const logError = (message) => {
  console.log(chalk.red('Error: ') + message)
}
const logDone = (message) => {
  console.log(chalk.green('Done: ') + message)
}

const packagePath = path.resolve(process.cwd(), 'package.json')
if (!fs.existsSync(packagePath)) {
  logError('Cannot find package.json file in the current directory')
  process.exit()
}

const packageJson = require(packagePath)
for (let element of ['dependencies', 'devDependencies', 'peerDependencies']) {
  if (packageJson[element]) {
    const packages = Object.keys(packageJson[element])
    for (let pkg of packages) {
      try {
        childProcess.execSync(`yarn upgrade ${pkg}`, { stdio: [] })
        logDone(`yarn upgrade ${pkg}`)
      } catch (e) {
        logError(e)
      }
    }
  }
}
