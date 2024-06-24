import fs from "fs"
import path from "path"

import {config} from './config.js'
import {Resource} from './interfaces.js'


const resourcesPath = path.join(config.configDir, 'resources.json')

export class ResourcesManagerClass {
  private resources: Resource[] = []

  public getResources() {
    try {
      if (!fs.existsSync(resourcesPath)) {
        throw new Error('Resources does not exist')
      }
      const resourcesContents = fs.readFileSync(resourcesPath)
      this.resources = JSON.parse(resourcesContents.toString())
    } catch (error) {
      console.log(`Error parsing ${resourcesPath}.`, error)
      console.log('Please reload resources:')
      console.log('fuzzykube load <infra_dir>')
      process.exit(1)
    }
    return this.resources
  }

  public getNamespaces(): string[] {
    const r = this.getResources()
    // return [...new Set(r.map(({ metadata: { namespace }}) => namespace))]
    return [...new Set(r.map((resource) => {
      try {
        return resource.metadata.namespace
      } catch (e) {
        console.log(resource)
        throw e
      }
    }))]
  }

  setResources(resources: Resource[]) {
    try {
      if (!fs.existsSync(config.configDir)) {
        fs.mkdirSync(config.configDir)
      }
      fs.writeFileSync(resourcesPath, JSON.stringify(resources))
      this.resources = resources
      console.log(`Saved resources to ${resourcesPath}`)
    } catch (error) {
      console.log(`Error saving resources to: ${resourcesPath}`, error)
      process.exit(1)
    }
  }
}
