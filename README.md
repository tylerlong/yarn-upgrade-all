# yarn-upgrade-all

This is a command line utility program to upgrade all the packages in your `package.json` to the latest version
(potentially upgrading packages across major versions).


## Installation

```
yarn add --dev yarn-upgrade-all
```


## Usage

```
npx yarn-upgrade-all
```


## Installation globally

```
yarn global add yarn-upgrade-all
```

#### Installation on Windows

```
npm install -g yarn-upgrade-all
```

:exclamation: Don't use `yarn` to install it on Windows because there is a bug: [yarnpkg/yarn#2224](https://github.com/yarnpkg/yarn/issues/2224).


#### Upgrade global packages

```
yarn-upgrade-all --global
```


## How does it work?

For every package in `package.json`, run `yarn remove <package-name> && yarn add [--dev|--peer] <package-name>`.


## Why not simply `yarn upgrade --latest` ?

Most of the time `yarn upgrade --latest` works. But I did meet some cases when it didn't work. I am not sure of the reason, maybe it's yarn's bug.

This library is very robust because it goes the hard way.


## What if a package failed to install?

In that case, that package will be skipped and an error message will be printed.

You need to read the error message and manually install that package.

It is the recommended flow. Because if a package failed to install, most of the time, you need to manually troubleshoot the issue and fix the issue.


## Ignore some packages

You can add the following to `package.json` file:

```json
...
"yarn-upgrade-all": {
    "ignore": [
        "react"
    ]
}
...
```

With configuration above, `yarn-upgrade-all` won't upgrade `react` for you.
