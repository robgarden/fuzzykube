import {ResourcesManagerClass} from '../resources.js'

export async function podsCommand(fuzz: string): Promise<string[]> {
  const resourceManager = new ResourcesManagerClass()

  const regex = new RegExp(fuzz, 'i')

  return resourceManager
    .getNamespaces()
    .filter(namespace => regex.test(namespace))
    .map(namespace => {
      return `kubectl -n ${namespace} get pods`
    })
}
