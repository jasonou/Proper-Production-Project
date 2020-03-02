```
docker run -v $(pwd):/app -w /app node:12.16.1-alpine npm install <package>

docker run -v $(pwd):/app -w /app node:12.16.1-alpine npm outdated

docker run -v $(pwd):/app -w /app node:12.16.1-alpine npm update <package>
```
