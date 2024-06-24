import {Command} from './Command.js'
import {podsCommand} from './pods.js'
import {portforwardCommand} from './port-forward.js'
import {logsCommand} from './logs.js'
import {imageCommand} from './image.js'
import {editEnvCommand, viewEnvCommand} from './env.js'
import {config} from '../config.js'

const registerCommand = (name: string, aliases: string[], run: (fuzz: string) => Promise<string[]>) =>
  new class extends Command {
    run = run
  }(name, aliases)

export const commands: Command[] = [
  // pod, pods
  registerCommand('pod', ['pods'], podsCommand),

  // pf, port-forward
  registerCommand('pf', ['port-forward'], portforwardCommand),

  // log, logs, l
  registerCommand('log', ['logs', 'l'], logsCommand),

  // img, image
  registerCommand('img', ['image'], imageCommand),

  // view-env, ve
  !!config.viewEnvAlias && registerCommand('view-env', ['ve'], viewEnvCommand),

  // view-env, ve
  !!config.editEnvAlias && registerCommand('edit-env', ['ee'], editEnvCommand),
].filter(_ => _ !== false)
