FROM node:22-alpine3.19 AS builder

# Create app directory
WORKDIR /app
COPY package.json yarn.lock ./
RUN \
    if [ -f yarn.lock ]; then yarn --frozen-lockfile; \
    else yarn install; \
    fi
COPY . .
RUN yarn build

FROM builder AS runner
ENV NODE_ENV=production

# Copy built files
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/yarn.lock ./yarn.lock

RUN apk update && apk add --no-cache openssl && \
    yarn install --production && \
    yarn cache clean

# Expose port
EXPOSE 3000

# Start the app
CMD ["yarn", "start"]