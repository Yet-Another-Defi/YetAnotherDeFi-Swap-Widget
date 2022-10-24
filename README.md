## YAD

### 🌳 Create `.env`

copy `.evn.example` to `.env` and fill all keys

`GOOGLE_ANALYTICS =` google analytics id `expamle: G-VZAYDU4FIE`

`BACKEND_API_URL =` API backend URL `expamle: https://api.yetanotherdefi.com/`

`SENTRY_DSN =` SENTRY DSN (url for integration. eg.`https://b5ff6edc59b527cdb3563def435b5b2e@o133538.ingest.sentry.io/2143785`)

`NODE_ENV=` mode: can be 'production' or 'development' (default = production)

`COINGECKO_KEY=` coingecko api key

### 🏭 Install dependencies

`npm i`

### 💫 dev

`npm run build:server` - build server

`npm run dev` - run dev mode

### 🌟 prod

`npm run build` - create js bundle

`npm run start` - start node server

### 🐨 DEX image build

`npm run generate-img-dex-paths` - update json file with dex images paths. Run it if new DEXES are added.
