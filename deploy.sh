#! /bin/bash
# exit script when any command ran here returns with non-zero exit code
set -e

mkdir -p ./ops/.kube

for f in ./ops/*.yml
do
    filename=$(basename $f)
    envsubst < $f > ./ops/.kube/$filename
done

kubectl --token=$KUBERNETES_TOKEN apply -f ./ops/.kube/

