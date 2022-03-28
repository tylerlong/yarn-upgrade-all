# yarn-upgrade-all

This is a command line utility program to upgrade all the packages in your `package.json` to the latest version
(potentially upgrading packages across major versions).


## Installation

```sh
yarn add --dev yarn-upgrade-all
```


## Usage

```sh
yarn yarn-upgrade-all
```




## How does it work?

For every type of dependencies in `package.json`, run

```
yarn add [--dev|--peer] <package-names>`.
```


## Additional options

You may pass additional options to the `yarn add` command:

```
yarn yarn-upgrade-all --option-1 --option-2
```

Which will invoke:

```
yarn add [--dev|--peer] <package-names> --option-1 --option-2
```


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


## Installation globally

```sh
yarn global add yarn-upgrade-all
```

#### Installation on Windows

```sh
npm install -g yarn-upgrade-all
```

:exclamation: Don't use `yarn` to install it on Windows because there is a bug: [yarnpkg/yarn#2224](https://github.com/yarnpkg/yarn/issues/2224).

#### Upgrade global packages


`yarn-upgrade-all --global` or `yarn-upgrade-all -g`
