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

Or upgrade global packages:

```
yarn-upgrade-all --global
```


## How does it work?

For every package in `package.json`, run `yarn remove <package-name> && yarn add <package-name>`.


## Why not simply `yarn upgrade --latest` ?

Most of the time `yarn upgrade --latest` works. But I did meet some cases when it didn't work. I am not sure of the reason, maybe it's yarn's bug.

This library is very robust because it goes the hard way.
