# build the application using nodejs, image page: <https://hub.docker.com/_/node>
FROM node:16.16-alpine

# install curl, image sources: <https://github.com/tarampampam/curl-docker>
COPY --from=ghcr.io/tarampampam/curl:7.83.1 --chown=0:0 /bin/curl /bin/curl

# use directory with application sources by default
WORKDIR /app

# copy files, that required for the dependencies installing (separate layer is needed for the dependencies caching)
COPY --chown=10001:10001 ./package.json ./package-lock.json ./

COPY patches ./patches

ENV NPM_CONFIG_UPDATE_NOTIFIER=false \
    NPM_CONFIG_AUDIT=false \
    NPM_CONFIG_LOGS_MAX=0 \
    NPM_CONFIG_FUND=false \
    NPM_CONFIG_PREFER_OFFLINE=true \
    NODE_ENV=production

RUN set -x \
    # create an unprivileged user & group
    && echo 'appuser:x:10001:10001::/tmp:/sbin/nologin' > /etc/passwd \
    && echo 'appuser:x:10001:' > /etc/group \
    # detect current architecture
    && export ARCH="$(apk --print-arch)" \
    # install additional dependencies for the `arm64` arch (macbook)
    && if [ "$ARCH" = "aarch64" ]; then apk add --no-cache --virtual .build-deps python3 make gcc g++; fi \
    # install nodejs dependencies
    && npm install \
    && npm cache clean --force \
    # cleanup \
    && if [ "$ARCH" = "aarch64" ]; then apk del .build-deps; fi \
    && find ./node_modules -type f \( -name "*.map" -o -name "*.md" -o -name "LICENSE*" \) -delete \
    # set app directory (but not node_modules) owner
    && chown appuser:appuser .

# copy all application sources
COPY --chown=appuser:appuser . .

# can be passed with any prefix (like `v1.2.3@GITHASH`), e.g.: `docker build --build-arg "APP_VERSION=v1.2.3@abc123" .`
ARG APP_VERSION="undefined@docker"

# use an unprivileged user
USER 10001:10001

# build the application
# TODO for @Nikitulb - read `APPLICATION_VERSION` variable on build and put this value somethere
RUN APPLICATION_VERSION="$APP_VERSION" npm run build


# Docs: <https://docs.docker.com/engine/reference/builder/#healthcheck>
HEALTHCHECK --interval=5s --timeout=2s --retries=2 --start-period=2s CMD [ \
    "curl", "--fail", "--user-agent", "internal/healthcheck", "http://127.0.0.1:3000/api/ping" \
    ]

EXPOSE 3000/tcp

ENTRYPOINT ["npm", "run"]

CMD ["start"]
