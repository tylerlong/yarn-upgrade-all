# yarn-upgrade-all

This is a command line utility program to upgrade all the packages in your `package.json` to the latest version
(potentially upgrading packages across major versions).


## How does it work?

For every package in `package.json`, run `yarn upgrade <package-name>`.


## Why not `yarn upgrade` ?

According to [the doc](https://yarnpkg.com/lang/en/docs/cli/upgrade/), `yarn upgrade` respects version ranges specified in the `package.json` file. Use it if it's the expected behavior.

Use `yarn-upgrade-all` to upgrade your packages to the latest version, regardless of the version ranges specified in the `package.json` file.
