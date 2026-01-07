# =========================
# 1️⃣ BUILD STAGE
# =========================
FROM node:22 AS build

# install dependencies
RUN apt-get update && apt-get install -y \
    bash \
    gettext-base \
    --no-install-recommends \
    && rm -rf /var/lib/apt/lists/*

# create app directory
WORKDIR /app

# copy everthing
COPY . .

# Clone submodule
RUN git submodule update --progress --init --recursive
RUN git -C ./bifi_app checkout angularv20

# Run config.library.sh
RUN sh ./bifi_app/tools/config/config-library.sh --libs all --title=APP --prebuild=http://localhost:8080/api

# =========================
# 2️⃣ NGINX STAGE
# =========================
FROM nginx:stable AS deploy

# Clean default config
RUN rm /etc/nginx/conf.d/default.conf

# copy nginx
COPY --from=build /app/bifi_app/nginx.conf /etc/nginx/conf.d/default.conf

# copy dist
COPY --from=build /app/dist/*/browser /usr/share/nginx/html

# expose port
EXPOSE 8080

# run nginx
CMD ["nginx", "-g", "daemon off;"]