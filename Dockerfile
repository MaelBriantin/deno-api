FROM denoland/deno:alpine
WORKDIR /app
COPY . .
CMD ["run", "--allow-net", "--allow-env", "--allow-read", "--watch", "src/main.ts"]
