In this directory, create a file called `.env`.  It should contain the following text.

```
PRIVATE_KEY=< Private wallet key here >
RINKBY_URL=< HTTP Rinkyby node URL >
```

Ensure the private wallet for the private key contains at least 1 testnet LINK on Rinkby.

Run it using `npx hardhat run ./scripts/UniversalAdapter/universalAdapterTest.ts.`
