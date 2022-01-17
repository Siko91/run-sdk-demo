const runUtils = require("./run-utils");
const settings = require("./settings");

main();

async function main() {
  const contract = await runUtils.initialize(settings.contract_location || undefined);
  const result = await runUtils.mintNftBulk(settings.external_addr);
  console.log("DONE: " + result);
}
