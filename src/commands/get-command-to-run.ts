import readline from 'readline'
import {commands} from './commands.js'

export async function getCommandToRun(command: string, fuzz: string, lucky: boolean): Promise<string | undefined> {
  const foundCommand = commands.find(cmd => cmd.match(command))
  const options = await foundCommand?.run(fuzz) ?? []

  if (!options.length) {
    return
  }

  if (lucky) {
    return options[0]
  }

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  options.slice(0, 10).forEach((option, i) => {
    console.log(`${i + 1}) ${option}`)
  })

  try {
    return await new Promise<string>((resolve, reject) => {
      rl.on('close', reject)
      rl.question('> ', (answer) => {
        if (options.length === 1 && answer === '') {
          answer = '1'
        }
        const option = options[Number(answer) - 1]
        if (!option) {
          return reject(new Error('Invalid option'))
        }
        resolve(option)
      })
    })
  } finally {
    rl.close()
  }
}
