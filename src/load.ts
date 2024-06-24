import fs from "fs"
import path from "path"

import yaml from "yaml"
import {Resource} from './interfaces.js'
import {getCurrentContext, getNamespacesFromCluster, getResourcesForNamespace} from './kubectl/helpers.js'
import {ResourcesManagerClass} from './resources.js'

const manifestRegex = /(\.yml|\.yaml)$/

async function walk(dirPath: string): Promise<string[]> {
  async function inner(current: string, acc: string[]): Promise<string[]> {
    const dir = fs.readdirSync(current, {withFileTypes: true})
    const next = [...acc]
    for (const entry of dir) {
      const entryPath = path.join(current, entry.name)
      if (entry.isDirectory()) {
        next.push(...(await inner(entryPath, acc)))
      } else if (entry.isFile() && entry.name.match(manifestRegex)) {
        next.push(entryPath)
      }
    }
    return next
  }

  return await inner(dirPath, [])
}

function parseManifest(manifestPath: string, kinds: string[]): Resource | undefined {
  const contents = fs.readFileSync(manifestPath)
  try {
    const parsed = yaml.parse(contents.toString(), {strict: false, logLevel: 'error'}) as Resource
    if (kinds.includes(parsed.kind) && parsed.metadata?.namespace) {
      return parsed
    }
  } catch (error) {
  }
}

function generateHash(resource: Resource) {
  return `${resource.kind}${resource.metadata.namespace}${resource.metadata.name}`
}

async function loadResources(loadDir: string, kinds: string[]): Promise<Resource[]> {
  const manifests = await walk(loadDir)
  const seen: Set<string> = new Set()
  return manifests.reduce<Resource[]>((resources, manifest) => {
    const parsed = parseManifest(manifest, kinds)
    if (parsed) {
      const hash = generateHash(parsed)
      if (!seen.has(hash)) {
        seen.add(hash)
        return [...resources, parsed]
      }
    }
    return resources
  }, [])
}

export async function loadResourcesFromCluster() {
  const context = await getCurrentContext()
  const namespaces = await getNamespacesFromCluster(context)

  console.log(`Found ${namespaces.length} namespaces in ${context}`)

  const resources: Resource[] = []
  for (const namespace of namespaces) {
    const rsrcs = await getResourcesForNamespace(context, namespace)
    console.log(`Got ${rsrcs.length} resources in ${namespace}`)
    resources.push(...rsrcs)
  }

  const resourceManager = new ResourcesManagerClass()
  resourceManager.setResources(resources)
  process.exit(0)
}
