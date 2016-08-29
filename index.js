'use strict'

const path = require('path')
const debug = require('debug')('regname')
const stripIndent = require('common-tags').stripIndent
const logSymbols = require('log-symbols')
const shelljs = require('shelljs')
const argv = require('minimist')(process.argv.slice(2))

const version = require('./package.json').version
const defaultDir = process.cwd()

let baseDir = argv.b || defaultDir
let dryrun = argv.d || false
let regIn = argv.r
let templateOut = argv.t

function printHelp () {
  console.log(stripIndent`
    A basic CLI utility for dumping daily data from a WhatsApp database.

    Version
      ${version}

    Usage
      regnameit <options>

    Options
      TODO

    Example
      TODO
  `)
}

if (regIn == null || templateOut == null) {
  printHelp()
} else {
  let inPaths = shelljs.ls(path.join(baseDir, '*.*'))
  let reg = new RegExp(regIn)
  debug(`RegExp: ${regIn}`)

  let targetMap = inPaths
    .filter(path => {
      let isValid = reg.test(path)
      debug(isValid ? logSymbols.succes : logSymbols.error, path)
      return isValid
    })
    .map(path => {
      let src = path
      let dest = path.replace(reg, templateOut)
      debug(`${src} -> ${dest}`)
      return {
        src,
        dest
      }
    })

  if (!dryrun) {
    targetMap.forEach(target => {
      let destDir = path.dirname(target.dest)
      shelljs.mkdir('-p', destDir)
      shelljs.cp(target.src, target.dest)
    })
  }
}
