# yarn-upgrade-all

This is a command line utility program to upgrade all the packages in your `package.json` to the latest version
(potentially upgrading packages across major versions).


## Installation

```
yarn global add yarn-upgrade-all
```

#### Installation locally

```
yarn add yarn-upgrade-all
```

Usage: `./node_modules/.bin/yarn-upgrade-all`

#### Installation on Windows

```
npm install -g yarn-upgrade-all
```

:exclamation: Don't use `yarn` to install it on Windows because there is a bug: [yarnpkg/yarn#2224](https://github.com/yarnpkg/yarn/issues/2224).


## Usage

```
cd <your-node-js-project>
yarn-upgrade-all
```


## How does it work?

For every package in `package.json`, run `yarn upgrade <package-name>`.


## Why not simply `yarn upgrade` ?

According to [the doc](https://yarnpkg.com/lang/en/docs/cli/upgrade/), `yarn upgrade` respects version ranges specified in the `package.json` file. Use it if it's the expected behavior.

Use `yarn-upgrade-all` to upgrade your packages to the latest version, regardless of the version ranges specified in the `package.json` file.
