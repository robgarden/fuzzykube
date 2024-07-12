#!/usr/bin/env bash

set -e

CONTEXT="$1"

if [[ -z ${CONTEXT} ]]; then
  echo "Usage: $0 KUBE-CONTEXT"
  exit 1
fi

NAMESPACES=$(kubectl --context ${CONTEXT} get -o json namespaces|jq -r '.items[].metadata.name')
RESOURCES="secret deployment service"

for ns in ${NAMESPACES};do
  for resource in ${RESOURCES};do
    rsrcs=$(kubectl --context ${CONTEXT} -n ${ns} get -o json ${resource} | jq -r '.items[].metadata.name')
    for r in ${rsrcs};do
      dir="${CONTEXT}/${ns}/${resource}"
      mkdir -p "${dir}"
      kubectl --context ${CONTEXT} -n ${ns} get -o yaml ${resource} ${r} > "${dir}/${r}.yaml"
    done
  done
done
