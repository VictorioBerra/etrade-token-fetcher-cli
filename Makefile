REGISTRY=registry.digitalocean.com/options-cash
IMAGE_NAME=etrade-token-fetcher

CIRCLE_SHA1?=latest

build:
	docker build -t ${IMAGE_NAME}:latest -f ./Dockerfile .

push:
	docker tag ${IMAGE_NAME}:latest ${REGISTRY}/${IMAGE_NAME}:${CIRCLE_SHA1}
	docker tag ${IMAGE_NAME}:latest ${REGISTRY}/${IMAGE_NAME}:latest
	docker push ${REGISTRY}/${IMAGE_NAME}:latest
	docker push ${REGISTRY}/${IMAGE_NAME}:${CIRCLE_SHA1}

deploy:
	./deploy.sh

build_and_push: build push


