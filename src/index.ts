#!/usr/bin/env node
import { execSync } from "child_process";
import type { PathLike } from "fs";
import { existsSync } from "fs";
import { resolve } from "path";
import { Blue, Green, Red } from "color-loggers";
import process from "node:process";

const error = new Red("[Error]: ");
const info = new Blue("[Start]: ");
const success = new Green("[Done]: ");

const inputs = new Set(process.argv);

let packagePath: PathLike;
let global = "";
if (inputs.has("-g") || inputs.has("--global")) {
  global = "global";
  packagePath = resolve(
    process.env[process.platform === "win32" ? "USERPROFILE" : "HOME"]!,
    ".config",
    "yarn",
    "global",
    "package.json",
  );
} else {
  packagePath = resolve(process.cwd(), "package.json");
}
if (!existsSync(packagePath)) {
  error.log(`Cannot find ${packagePath}`);
  process.exit(1);
}

const packageJson = require(packagePath);
let ignorePkgs = new Set();
if (packageJson["yarn-upgrade-all"] && packageJson["yarn-upgrade-all"].ignore) {
  ignorePkgs = new Set(packageJson["yarn-upgrade-all"].ignore);
}

const depTypes: { [key: string]: string } = {
  dependencies: "",
  devDependencies: "--dev",
  peerDependencies: "--peer",
};
const params = Array.from(inputs).filter((arg) =>
  arg.startsWith("-") && arg !== "-g" && arg !== "--global"
);
Object.keys(depTypes).forEach((depType) => {
  if (!packageJson[depType]) {
    return;
  }
  const deps = Object.keys(packageJson[depType])
    .filter((dep) => !ignorePkgs.has(dep))
    .filter((dep) => !packageJson[depType][dep].startsWith(".")) // relative path
    .filter((dep) => !packageJson[depType][dep].startsWith("file:")); // file path
  if (deps.length === 0) {
    return;
  }
  const argv = ["yarn", global, "add", ...deps, depTypes[depType], ...params];
  const command = argv.filter((c) => c !== "").join(" ");
  try {
    info.log(command);
    execSync(command, { stdio: [] });
    success.log(command);
  } catch (e) {
    error.log(`${command} - ${e}`);
  }
});
