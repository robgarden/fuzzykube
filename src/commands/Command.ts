export abstract class Command {
  readonly name: string
  private readonly aliases: string[]

  constructor(name: string, aliases: string[]) {
    this.name = name
    this.aliases = aliases
  }

  match(commandFromUser: string) {
    const regex = new RegExp(`^${commandFromUser}$`, 'i')
    return [
      this.name,
      ...this.aliases
    ].some(x => regex.test(x))
  }


  abstract run(fuzz: string): Promise<string[]>
}
