import {exec} from "child_process"
import {promisify} from "node:util"
import {Resource} from '../interfaces.js'

const execPromise = promisify(exec)

async function execWithOutput(command: string): Promise<string> {
  const { stdout } = await execPromise(command)
  return stdout.replace(/\n$/,"")
}

export async function getCurrentContext(): Promise<string> {
  return execWithOutput('kubectl config current-context')
}

export async function getNamespacesFromCluster(context?: string): Promise<string[]> {
  const ctx = context ?? await getCurrentContext()
  const namespaceStr = await execWithOutput(`kubectl --context ${ctx} get namespace -o json | jq -r '.items[].metadata.name'`)
  return namespaceStr.split("\n")
}

export async function getResourcesForNamespace(context: string, namespace: string, kinds = ['Deployment', 'Service']): Promise<Resource[]> {
  const resources: Resource[] = []
  for (const kind of kinds) {
    const cmd = `kubectl --context ${context} -n ${namespace} get -o json ${kind} | jq -r '.items[].metadata.name'`
    const resourcesToFetchStr = await execWithOutput(cmd)
    const resourcesToFetch = resourcesToFetchStr.split("\n")

    for (const resourceToFetch of resourcesToFetch) {
      const resourceJson = await execWithOutput(`kubectl --context ${context} -n ${namespace} get ${kind} ${resourceToFetch} -o json`)
      resources.push(JSON.parse(resourceJson))
    }
  }
  return resources
}
