.PHONY: install build test run docker docker-run docker-build docker-up docker-down

install:
	npm install

build:
	npm run build

test:
	npm run test

start: build
	npm start

run:
	docker-compose up --build

docker-run:
	docker-compose up

docker-build:
	docker-compose build

docker-up:
	docker-compose up -d

docker-down:
	docker-compose down
