import {ResourcesManagerClass} from '../resources.js'
import {ResourceKind} from '../interfaces.js'
import {config} from '../config.js'

async function viewOrEditEnvCommand(fuzz: string, edit = false): Promise<string[]> {
  const resourceManager = new ResourcesManagerClass()

  const regex = new RegExp(fuzz, 'i')

  const deployments = resourceManager.getResources()
    .filter(resource => resource.kind === ResourceKind.Deployment)
    .filter(deploy => regex.test(deploy.metadata.name))

  return deployments.flatMap(({metadata, spec}) => {
    const secrets: string[] = []
    if (spec.template.spec.volumes?.length) {
      for (const volume of spec.template.spec.volumes) {
        if (volume.secret) {
          secrets.push(volume.secret.secretName)
        }
      }
    }
    const envCmd = edit ? config.editEnvAlias : config.viewEnvAlias
    return secrets.map(secret => {
      return `${envCmd} ${metadata.namespace} ${secret}`
    })
  })
}

export async function viewEnvCommand(fuzz: string): Promise<string[]> {
  return viewOrEditEnvCommand(fuzz, false)
}

export async function editEnvCommand(fuzz: string): Promise<string[]> {
  return viewOrEditEnvCommand(fuzz, true)
}
