const Run = require("run-sdk");
const bsv = require("bsv");

const settings = require("./settings");

const run = new Run({
  network: "main",
  app: "run-demo",
  owner: settings.admin_pk.toString(),
  purse: settings.admin_pk.toString(),
});

run.trust("*"); // TODO: Do not trust "*" in production !!!

const contracts = {};

/**
 * Inititalizes all contracts used in this example file.
 *
 * NOTE:
 * THIS IS EXAMPLE CODE.
 * IT IS MEANT ONLY TO DEMONSTRATE HOW TOKENS WORK.
 * IT IS NOT MEANT FOR PRODUCTION!
 *
 * @param {undefined} undefined // Used when the contract doesn't exist. Will create a new one. (costs money)
 * @param {string} winnerNftLocation // Used when the contract exists, but you don't know the presets. (does some API requests)
 */
async function initialize(winnerNftLocation = undefined) {
  const RelayNFT = await run.load(
    "cdea2c203af755cd9477ca310c61021abaafc135a21d8f93b8ebfc6ca5f95712_o1"
  );

  class WinnerNFT extends RelayNFT {}

  if (winnerNftLocation) {
    WinnerNFT = await run.load(winnerNftLocation);
    await WinnerNFT.sync();
  } else {
    WinnerNFT.metadata = {
      description: "An NFT for the winners",
      image:
        "9cbf55138bd452509993480e4b71f6ee63f434f3721066980d2d9cf586704133_o1",
      isCollection: false,
      name: "WinnerNFT",
      numbered: true,
      symbol: "UFWIN",
    };
    await deployContract(WinnerNFT);
  }

  console.log("Loaded WinnerNFT");

  contracts.RelayNFT = RelayNFT;
  contracts.WinnerNFT = WinnerNFT;

  return WinnerNFT;
}

async function deployContract(ContractClass) {
  contracts[ContractClass.name] = ContractClass;
  const contract = run.deploy(ContractClass);
  await contract.sync();
}

async function mintNft(recepientAddr) {
  const jig = contracts.WinnerNFT.mint(recepientAddr, {});
  await jig.sync();
  return jig.location;
}

async function mintNftBulk(...addressList) {
  let counter = 0;
  const jigs = await bulkOperation(
    () => counter <= addressList.length,
    () => {
      return contracts.WinnerNFT.mint(addressList[counter++], {});
    }
  );
  return jigs.map((i) => i.location);
}

async function bulkOperation(loopCondition, callbackOnEachItteration) {
  const tx = new Run.Transaction();
  let counter = 0;
  const callbackResults = [];
  while (loopCondition(counter++)) {
    tx.update(() => {
      callbackResults.push(callbackOnEachItteration());
    });
  }
  await tx.publish();
  return callbackResults;
}

module.exports = {
  initialize,
  deployContract,
  mintNft,
  mintNftBulk,
  contracts: () => contracts,
};
