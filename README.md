# Dev Quick Start

```
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up <--build> <-d>

docker-compose -f docker-compose.yml -f docker-compose.dev.yml down <--rmi all> <-v>

docker-compose logs -f <service-name>

docker-compose exec <service-name> <command>
```
