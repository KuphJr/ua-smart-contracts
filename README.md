# [Check out the demo!](https://adapter-ui.vercel.app/)  Judges and Chainlink Labs team members, DM me via Slack or @KuphJr#5887 on Discord.

Currently, only a single Chainlink node is fulfilling requests for the Universal Adapter, however adding additional nodes is simply a matter of infrastructure (and having the dough to rent more than one virtual machine).  You can test out the direct request aggregator contract locally, which simulates the response of Chainlink nodes to test the logic of the smart contract.  In the root directory, run
`npx hardhat run ./scripts/localTestDirectRequestAggregator.ts`

## Example Contract

Check out the ExampleRequester.sol contract to see a basic example of how to make a request to the Universal Adapter DirectRequestAggregator.sol contract.  Requests can be sent to the DirectRequestAggregator contract deployed on Polygon Mumbai at the address 0x543838263CD6a67E3836eB3BC8f45cfB6c09CD19.

See the files `./scripts/deployExampleRequester.sol` and `./scripts/callExampleRequester.sol` for examples of how to work with the `ExampleRequester.sol` contract.

For simulating a request, uploading JavaScript code to IPFS or uploading private variables to the Chainlink node's database, check out [AdapterJS.link](https://adapterjs.link/simulator.html).

Address of OfferRegistry contract on Mumbai: '0xb9a8e44D214E30004c54D253ed484A13Fb5381b5'
Address of DirectRequestAggregator contract on Mumbai: '0x543838263CD6a67E3836eB3BC8f45cfB6c09CD19'
Address of AggregatorOperator contract on Mumbai: '0xA0B18C7363989Ac72eAb8C778aE1f6De67802700'
Owner/deployer of all the above contracts: '0xB7aB5555BB8927BF16F8496da338a3033c12F8f3'