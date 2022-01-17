# Run SDK NFT Minting Demo

Before running the code, create `settings.js` file similar to the `settings.example.js` file.

- `admin_pk` - the private key which will be used both for funding and signing of all RUN transactions
- `external_addr` - the address of a recepient wallet (to test if you can receive tokens)
- `contract_location` - will be used to load the same contract instead of broadcasting a brand new one.

Exposed functions:

- `initialize` - loads the WinnerNFT contract (or deploys a new one).
- `deployContract` - a function for deploying new RUN contracts
- `mintNft` - mints 1 NFT from the WinnerNFT contract and send it to an address.
- `mintNftBulk` - mints 1 NFT from the WinnerNFT contract for each of the provided recipient addresses.

Additional information:

- To explore created tokens, use [this transaction explorer](https://run.network/explorer)
- If you want to use a simple wallet to hold your testing tokens, try [the Tique web wallet](https://tique.run/index.html)
- If you want to use a more advanced wallet, try [the RelayX wallet](https://relayx.com/wallet)