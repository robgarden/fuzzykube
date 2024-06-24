import {ResourcesManagerClass} from '../resources.js'
import {Resource, ResourceKind} from '../interfaces.js'

export async function imageCommand(fuzz: string): Promise<string[]> {
  const resourceManager = new ResourcesManagerClass()

  const regex = new RegExp(fuzz, 'i')

  return resourceManager
    .getResources()
    .filter((r: Resource) => r.kind === ResourceKind.Deployment)
    .filter(s => regex.test(s.metadata.name))
    .map(deployment => {
      const {metadata: {name, namespace}} = deployment
      return `kubectl -n ${namespace} get deploy/${name} -o json | jq -r '.spec.template.spec.containers[].image'`
    })
}
