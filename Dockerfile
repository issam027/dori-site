FROM node:24-alpine AS runtime
ENV NODE_ENV=production PORT=8080 HOST=0.0.0.0 DATA_DIR=/app/data
WORKDIR /app
COPY --chown=node:node package.json server.js site.js captcha.js captcha-image.js ./
COPY --chown=node:node mail ./mail
COPY --chown=node:node public ./public
COPY --chown=node:node tools/export-requests.js ./tools/export-requests.js
RUN mkdir -p /app/data && chown node:node /app/data
USER node
EXPOSE 8080
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 CMD node -e "fetch('http://127.0.0.1:8080/healthz').then(r=>{if(!r.ok)process.exit(1)}).catch(()=>process.exit(1))"
CMD ["node", "server.js"]
