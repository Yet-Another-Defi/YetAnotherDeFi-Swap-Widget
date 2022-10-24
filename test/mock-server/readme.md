# Mock server

Mock servers allow emulating remote servers working without caring about the network connection, quotas, response format, etc. Additionally, mock servers allow you to emulate additional scenarios, like a large response time, remote errors, and others.

This directory contains configurations for the following services:

- [Dex-router](https://github.com/sophus-router/dex-router) [here](dex-router)

## How to use

We use [MMock](https://github.com/jmartin82/mmock#readme) server for this. First, install `mmock` [binary file](https://github.com/jmartin82/mmock/releases) in you system (or use [docker image](https://hub.docker.com/r/jordimartin/mmock/) instead that). After that you can run mock server.

For the binary file:

```shell
$ mmock -server-statistics=false -config-path ./test/mock-server/dex-router
```

And for docker image:

```shell
$ docker run --rm \
  -v "$(pwd):/rootfs:ro" \
  -w "/rootfs" \
  -p "8082:8082/tcp" \
  -p "8083:8083/tcp" \
    jordimartin/mmock \
      -server-statistics=false -config-path ./test/mock-server/dex-router
```

> Directory `dex-router` can be changed to any another, of course
