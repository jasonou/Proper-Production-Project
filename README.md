# Dev Quick Start

```
cp .env.dev.template .env

openssl req -x509 -sha256 -nodes -newkey rsa:2048 -days 36500 -keyout ./nginx/localhost.selfsigned.key -out ./nginx/localhost.selfsigned.crt -subj "//C=US/ST=/L=/O=/OU=/CN=localhost"

docker-compose -f docker-compose.yml -f docker-compose.dev.yml up <--build> <-d>

docker-compose -f docker-compose.yml -f docker-compose.dev.yml down <--rmi all> <-v>

docker-compose logs -f <service-name>

docker-compose exec <service-name> <command>
```
