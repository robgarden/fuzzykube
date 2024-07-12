# fuzzykube

Cache kubernetes cluster manifests and get command suggestions based on fuzzy terms

## Limitations

Currently only works on macos as command suggestions are inserted into the terminal application via applescript. The default terminal application is set to Warp.

## Install

```shell
git clone https://github.com/robgarden/fuzzykube.git
npm i
npm install:local
```

## Config

Available configuration options (environment variables) and defaults:

```shell
FUZZYCUBE_CONFIG_DIR=~/.config/fuzzykube/
FUZZYKUBE_TERMINAL_APP=Warp
FUZZYKUBE_VIEW_ENV_ALIAS=
FUZZYKUBE_EDIT_ENV_ALIAS=
```

`FUZZYKUBE_VIEW_ENV_ALIAS` and `FUZZYKUBE_EDIT_ENV_ALIAS` can be set to any script/application that will be passed a namespace and secret name, when the `view-env` or `edit-env` command is used.


## First use, loading manifests 

Make sure to set the environment variable `FUZZY_TERMINAL_APP` to match your terminal application name.

Run the `load` command to fetch all deployment and service manifests from the current context and store them in the config directory, default `~/.config/fuzzykube`

Warning: this can take a while.

```shell
$ fuzzykube load
```

## List commands

```shell
$ fuzzykube
Usage: fuzzykube <pod,pf,log,img> fuzzy-resource
```

## Pod

Get command suggestions to list pods in namespace that matches term.

```shell
$ fuzzykube pod app
1) kubectl -n app-website get pod
2) kubectl -n app-server get pod
3) kubectl -n app-proxy get pod
```

## Port forward

Alias: `pf`

Get command suggestions to port-forward to deployments and services that match term.

```shell
$ fuzzykube pf app
1) kubectl -n app-website port-forward deploy/app-website 80
2) kubectl -n app-server port-forward deploy/pp-server 8080 8081
3) kubectl -n app-website port-forward svc/app-proxy 80 443
```

## Log

Get command suggestions to view logs for deployments that match term.

```shell
$ fuzzykube log app
1) kubectl -n app-website logs deploy/app-website
2) kubectl -n app-server logs deploy/pp-server
```

## Img

Get command suggestions to view the current image for a deployment that matches term.

```shell
$ fuzzykube img app
1) kubectl -n app-website get deploy/app-website -o json | jq -r ".spec.template.spec.containers[].image"
2) kubectl -n app-website get deploy/app-server -o json | jq -r ".spec.template.spec.containers[].image"
```

## I'm feeling lucky

Use a `!` to execute the first command suggestion immediately without prompting for confirmation

```shell
$ fuzzykube log app!
$ kubectl -n app-website logs deploy/app-website # executed immediately
# logs
```

## Disclaimer

fuzzykube only supports the above commands but can obviously be extended. Additionally, there is a safeguard to prevent running any commands that contain `delete`. 

Since fuzzykube was hacked together rather hurriedly and can execute commands automatically on your behalf, USE AT YOUR OWN RISK!
