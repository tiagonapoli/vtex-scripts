vtex-scripts
==============

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/@tiagonapoli/vtex-scripts.svg)](https://npmjs.org/package/@tiagonapoli/vtex-scripts)
[![Downloads/week](https://img.shields.io/npm/dw/@tiagonapoli/vtex-scripts.svg)](https://npmjs.org/package/@tiagonapoli/vtex-scripts)
[![License](https://img.shields.io/npm/l/@tiagonapoli/vtex-scripts.svg)](https://github.com/tiagonapoli/vtex-scripts/blob/master/package.json)

<!-- toc -->
* [Usage](#usage)
<!-- tocstop -->

# Usage
<!-- usage -->
```sh-session
$ npm install -g @tiagonapoli/vtex-scripts
$ vtex-dev COMMAND
running command...
$ vtex-dev (-v|--version|version)
@tiagonapoli/vtex-scripts/0.0.7 linux-x64 node-v12.16.2
$ vtex-dev --help [COMMAND]
USAGE
  $ vtex-dev COMMAND
...
```
<!-- usagestop -->

<!-- commands -->
* [`vtex-dev app:bundle APPID`](#vtex-dev-appbundle-appid)
* [`vtex-dev app:types APPID`](#vtex-dev-apptypes-appid)
* [`vtex-dev help [COMMAND]`](#vtex-dev-help-command)

## `vtex-dev app:bundle APPID`

Download app bundle

```
USAGE
  $ vtex-dev app:bundle APPID

OPTIONS
  -d, --dir=dir  [default: .] Directory to save
  -h, --help     show CLI help
  -l, --linked   App is linked

EXAMPLES
  vtex-dev app:bundle vtex.builder-hub@0.x
  vtex-dev app:bundle vtex.builder-hub@0.200.1
  vtex-dev app:bundle vtex.builder-hub@0.200.1-beta
  vtex-dev app:bundle vtex.render-server@8.x --linked
```

## `vtex-dev app:types APPID`

Download app types

```
USAGE
  $ vtex-dev app:types APPID

OPTIONS
  -d, --dir=dir  [default: .] Directory to save
  -h, --help     show CLI help
  -l, --linked   App is linked
```

## `vtex-dev help [COMMAND]`

display help for vtex-dev

```
USAGE
  $ vtex-dev help [COMMAND]

ARGUMENTS
  COMMAND  command to show help for

OPTIONS
  --all  see all commands in CLI
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v2.2.3/src/commands/help.ts)_
<!-- commandsstop -->
