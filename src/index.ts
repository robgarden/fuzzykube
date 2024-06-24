#!/usr/bin/env node

import {exec} from 'child_process'

import {loadResourcesFromCluster} from './load.js'
import {pasteCommand} from './paste-command.js'
import {getCommandToRun} from './commands/get-command-to-run.js'
import {commands} from './commands/commands.js'

process.on('SIGINT', () => {
  process.exit(0)
})

process.on('unhandledRejection', () => {
  process.exit(0)
})

if (process.argv[2] === 'load') {
  await loadResourcesFromCluster()
}

let [, , command, fuzz] = process.argv

if (!command || !fuzz) {
  const commandNames = commands.map(_ => _.name).join(",")
  console.log(`Usage: fuzzykube <${commandNames}> fuzzy-resource`)
  process.exit(0)
}

const denyList = [
  'delete',
]

function validateIsAllowed(commandToRun: string) {
  const allowed = denyList.every(deny => !new RegExp(deny, 'i').test(commandToRun))
  if (!allowed) {
    console.log('Not allowed!')
    process.exit(1)
  }
}

try {
  const lucky = fuzz.endsWith("!")
  const commandToRun = await getCommandToRun(command, fuzz.replaceAll("!", ""), lucky)
  if (commandToRun) {
    validateIsAllowed(commandToRun)
    const sanitizedCommand = commandToRun.replaceAll("'", '\\"')
    const readyScript = pasteCommand(sanitizedCommand, lucky)
    exec(`osascript -e '${readyScript}'`);
  }
  process.exit(0)
} catch (e) {
  if (e instanceof Error) console.log(e.message)
  process.exit(1)
}
