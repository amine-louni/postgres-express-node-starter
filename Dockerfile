FROM node:16.0.0-alpine AS development
ENV NODE_ENV development

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package.json .
COPY yarn.lock  .
RUN yarn

# Copy in the source
COPY . .

RUN yarn install
# Don't use root user
USER node

# Expose Port
EXPOSE 4000
CMD ["yarn", "watch:all"]



FROM node:14.0.0-alpine AS builder
ENV NODE_ENV development

# Create app directory
WORKDIR /usr/src/app


# Install app dependencies
COPY package.json .
COPY yarn.lock .
RUN yarn


# Copy in the source
COPY . .

RUN yarn install

RUN yarn build

# Don't use root user
USER node

# Expose Port
EXPOSE 4000
CMD ["yarn", "build"]


FROM node:14.0.0-alpine AS production
COPY  --from=builder usr/src/app/dist .
EXPOSE 80
CMD ["node", "dist/index.js"]

