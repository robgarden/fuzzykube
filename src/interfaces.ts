export enum ResourceKind {
  Secret = 'Secret',
  Deployment = 'Deployment',
  Service = 'Service',
}

interface BaseResource {
  apiVersion: string
  kind: string
  metadata: {
    name: string,
    namespace: string,
    labels: {
      [key: string]: string,
    }
  }
}

export type Service = BaseResource & {
  kind: ResourceKind.Service,
  spec: {
    ports: {
      name: string,
      port: number
    }[],
    type: 'ClusterIP'
  }
}

type Volume = {
  name: string
  secret?: {
    secretName: string
  }
}

export type Deployment = BaseResource & {
  kind: ResourceKind.Deployment
  spec: {
    template: {
      spec: {
        volumes?: Volume[]
      }
    }
  }
}

export type Secret = BaseResource & {
  kind: ResourceKind.Secret
}

export  type Resource =
  | Service
  | Deployment
  | Secret
