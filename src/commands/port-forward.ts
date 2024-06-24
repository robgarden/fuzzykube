import {ResourcesManagerClass} from '../resources.js'
import {Resource, ResourceKind} from '../interfaces.js'

export async function portforwardCommand(fuzz: string): Promise<string[]> {
  const resourceManager = new ResourcesManagerClass()

  const regex = new RegExp(fuzz, 'i')

  return resourceManager
    .getResources()
    .filter((s: Resource) => s.kind === ResourceKind.Service)
    .filter(s => regex.test(s.metadata.name))
    .map(service => {
      const {metadata: {name, namespace}} = service
      const ports = service.spec.ports.map(({port}) => port)
      return `kubectl -n ${namespace} port-forward svc/${name} ${ports.join(" ")}`
    })
}
