host := 'uname -a'

default:
	just --list

build:
	docker compose build

up:
	docker compose up

run:
	just build
	just up

test:
    cd back
    yarn test
    cd ..
    cd front
    yarn test
    cd ..
