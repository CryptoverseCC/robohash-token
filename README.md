# RoboHashBook

In the previous post we have discussed variety of usages for social layer build on top of erc721 tokens, as well as how such platform might work.
Today we present a short tutorial which shows how to build a social platform for an existing erc721 token.
To make this guide comperhensive the first part of this arcticle describes how to build your own erc721 token.
Next we will try to figure out how to add unique avatars to our token.
If you know how to do that or you plan to add a social layer to token which already exists you can skip that part.

## 1. Building your own ERC721 token
We are going to use truffle to make your life easier, so if you don't know what truffle is, I encourage you to read about it before moving forward. (http://truffleframework.com/docs/)

The first thing you need to do is to install truffle:
`npm install -g truffle`

Now let's create project. 
My token is going to be RoboHashToken so I named project's directory 'robohash'.
 - `mkdir robohash && cd robohash`
 - `truffle init`
 - `npm init` (confirm all default values)

Since the whole standard of erc721 isn't so small we are going to use basic implementation of erc721 token from zeppelin-solidity library. (https://github.com/OpenZeppelin/zeppelin-solidity/blob/master/contracts/token/ERC721/ERC721Token.sol) 
To do that we need to add zeppelin-solidity to our dependencies: 

`npm install zeppelin-solidity --save-dev`

Now, when we have zeppelin, we can create our contract:

`touch contracts/RoboHashToken.sol`

To be compatible with truffle's development pipeline let's also create migration file:

`touch migrations/2_deploy_contracts.js` 

and fill it as following:

```
var RoboHashToken = artifacts.require("RoboHashToken");

module.exports = function(deployer) {
	deployer.deploy(RoboHashToken);	
};
```
For more info about truffle migrations click here(http://truffleframework.com/docs/getting_started/migrations).

Going back to contract. First let's inherit from ERC721Token
```
pragma solidity ^0.4.21;

import 'zeppelin-solidity/contracts/token/ERC721/ERC721Token.sol';

contract RoboHashToken is ERC721Token("RoboHashToken", "RHT") {
	...
```

These two arguments of base class constructor are respectively token's name and token's symbol.
Next we have to figure out how these tokens will be issued. Because I want to make it as simple as possible I will create my token in a such way that everybody will be able to create their own unique instance of this token. 

```
contract RoboHashToken is ERC721Token("RoboHashToken", "RHT") {
	
	function create() public {
		uint256 tokenId = allTokens.length + 1;
		_mint(msg.sender, tokenId);
	}

``` 
As you can see all we need to do is to invoke internal function `_mint` which will do the whole creation for us.
Congratulations you have just implement your own ERC721 token!

But let's face it, this token is extremly tedius. 
Luckly, it doesn't take much more work to turn it into a naming service. Thanks to this users will be able to claim their names, identifiers, emails etc.
All we need to do is to allow users to pass their identifiers to `create` function and store them into some kind of mapping.

```
contract RoboHashToken is ERC721Token("RoboHashToken", "RHT") {
	
	mapping(uint256 => string) internal tokenIdToName;
	mapping(string => uint256) internal nameToTokenId;

	function create(string name) public {
		require(nameToTokenId[name] == 0);
		uint256 tokenId = allTokens.length + 1;
		_mint(msg.sender, tokenId);
		tokenIdToName[tokenId] = name;
		nameToTokenId[name] = tokenId;
	}

	function getTokenName(uint256 tokenId) view public returns (string) {
		return tokenIdToName[tokenId];
	}

	function getTokenId(string name) view public returns (uint) {
		return nameToTokenId[name];
	}
``` 
I have also created a reversed mapping, so it would be easy to check the identifier of the particular tokenId.

## 2. Token's avatar
It is much more pleasent for the user if your token can be visualized. Cryptokitties tokens are represented by their png/svg images served from backend. The same story is with almost all collectibles. In order not to be worse, we will use https://robohash.org/ website to generate images from strings. Since we want all future website to display us in the same way we will add this logic to our contract. To do that we will have to concatenate robohash website with our token name and with '.png' postfix. Unfortunatelly solidity doesn't provide any built-in way to join strings, so we will do it manually. 

```
	function getTokenUrl(string tokenName) pure public returns (string) {
		return strConcat("http://robohash.org/", tokenName, ".png");
	}

	function strConcat(string first, string second, string third) internal pure returns (string) {
	    bytes memory firstBytes = bytes(first);
	    bytes memory secondBytes = bytes(second);
	    bytes memory thirdBytes = bytes(third);
	    string memory result = new string(firstBytes.length + secondBytes.length + thirdBytes.length);
	    bytes memory resultBytes = bytes(result);
	    uint k = 0;
	    for (uint i = 0; i < firstBytes.length; i++) resultBytes[k++] = firstBytes[i];
	    for (i = 0; i < secondBytes.length; i++) resultBytes[k++] = secondBytes[i];
	    for (i = 0; i < thirdBytes.length; i++) resultBytes[k++] = thirdBytes[i];
	    return string(resultBytes);
	}
``` 

Ok, so let's summarize what we have by now. 

Users can claim their identities which are implemented as NFT and see their visual representation thanks to http://robohash.org. Isn't that great?

Full contract code: (link)

If you want to see how I wrote tests for this contract you can check it out here(link).
 
## 3. Deploying contract
Deploying contracts with truffle is easy and all we need to do is to configure our network of destination.

To access ethereum network we will use infura(https://infura.io/).

Because deploying contracts costs some amount of ethereum we have to provide truffle access to our wallet. To prevent leaking our private key into the source code we are going to use `dotenv` module.

Let’s install all of the modules we’ll need for deploying to Infura.

`npm install --save-dev dotenv truffle-wallet-provider ethereumjs-wallet`

Now edit `truffle.js` and add the following:
```
require('dotenv').config({path: '.env.local'});
const Web3 = require("web3");
const web3 = new Web3();
const WalletProvider = require("truffle-wallet-provider");
const Wallet = require('ethereumjs-wallet');

module.exports = {
	networks: {
		ropsten: {
		    provider: function(){
		    	var ropstenPrivateKey = new Buffer(process.env["ROPSTEN_PRIVATE_KEY"], "hex")
				var ropstenWallet = Wallet.fromPrivateKey(ropstenPrivateKey);
		    	return new WalletProvider(ropstenWallet, "https://ropsten.infura.io/");
		    },
		    gas: 4600000,
	      	gasPrice: web3.toWei("20", "gwei"),
		    network_id: '3',
		}
	}
};
``` 
Next open your up `.env.local` and paste in your private key like so:
`ROPSTEN_PRIVATE_KEY="123YourPrivateKeyHere"`
Do not forget to add `.env.local` to your `.gitignore`!

The Ethereum test networks are networks which you can use to test your contracts. There’s also Kovan and Rinkeby. I chose Ropsten for this tutorial because it’s the easiest to get Ropsten ETH at the moment. All are fairly similar and you can use whichever testnet you like but for the remainder of the tutorial I’ll assume you’re using ropsten. Visit https://faucet.metamask.io/ to request some test ETH. Once you get some ETH from the faucet you should be ready to deploy!

Ok, now we are ready to deploy our contract:
`truffle deploy --network ropsten`

Copy and paste relevant address from the output into the Ropsten Etherscan search box and you should see your newly deployed contract!

For more info about ruffle networks configuration click here.(http://truffleframework.com/docs/advanced/networks)

If you want to claim your token you can go to https://remix.ethereum.org/ 
Remove all the existing code. And paste following:
```
pragma solidity ^0.4.21;

contract RoboHashToken  {
    function create(string name) public;	
}
```
Having contract interaface is enough to be able to call its methods.
Next on the right you need to paste your contract address to <<OBRAZEK>> and click "At address".
Now, below of "At address" button you should see our create method which takes one parameter. 
If you call it and everything passes you will become an owner of your unique ERC721 token instance.

## 4. Building social layer
To build our website we will use an existing one `https://userfeeds.github.io/cryptopurr/`. I'm not going to explain how this website works under the hood in details, rather then I will focus on changes we need to make to support our robohashTokens. 

First let's clone cryptopurr to new directory:

`git clone git@github.com:Userfeeds/cryptopurr.git`

We will be particualry intersted in following files: (#todo: maybe high level overview of those files here)
1. `.env` 
2. `package.json`
3. `public/index.html`
4. `src/entityApi.js`

Ad 1. `.env`

Set following properties:
- `REACT_APP_NAME` - Your app name (in my case RoboHash).
- `REACT_APP_INTERFACE_VALUE` - Url where your website will be hosted. Although it is not neccessary you may benefit from it in the future.
- `REACT_APP_ERC_721_NETWORK` - Name of the network where your ERC721 contract is deployed. Please note that even that your address is deployed on particular network the users will be able to create messages also on other networks.
- `REACT_APP_ERC_721_ADDRESS` - Address of your ERC721 contract. 
- `REACT_APP_BASENAME` - Base url (in my case `/robohash/`)

Ad 2. `package.json`

Change `name` and `home_page` and put there same values as you did above.

Ad 3. `public/index.html`

In line 23 change the title.

Ad 4. `src/entityApi.js`

The colors map from line 4 is used to display proper backgrund behind the kitty. Since we will have only one background color you can remove it entirely. 

Next thing we need to change is the `getEntityData` function. It is used to fetch details about particular entity from backend. It takes tokenId as a paramter and returns custom object which is used to display our enity on the page. Since we don't have backend we will have to connect it to our contract on ethereum network. For this we will again reach for our well known infura. 

First thing we need to do is to import web3 and our token's abi `robohash/build/contracts/RoboHashToken.json` (note: react doesn't allow to import files from outside of the src directory, you can copy your abi file to src directory or simlink it)

```
import Web3 from 'web3';
const roboHashTokenArtifacts = require('./abi/RoboHashToken.json');

const web3 = new Web3(new Web3.providers.HttpProvider('https://ropsten.infura.io/zMyYPjYpS74gHWKz5ILQ'));
const contractInstance = new web3.eth.Contract(roboHashTokenArtifacts.abi, '0xfa9d471300b0a4cc40ad4dfa5846864973520f45');
```

Now we have an api for our contract, so we can impelment `getEntityData` function.

We will invoke `getTokenName` with entityId to obtain name of that token and later `getTokenUrl` to get the robohash image of our token.
```
export const getEntityData = async entityId => {
  try {
    const responseTokenName = await contractInstance.methods.getTokenName(entityId).call();
    const tokenName = responseTokenName.valueOf();
    const responseTokenUrl = await contractInstance.methods.getTokenUrl(tokenName).call();
    const tokenUrl = responseTokenUrl.valueOf();
    return {
      id: entityId,
      name: tokenName,
      image_url: tokenUrl, // image of our entity
      url: `https://robohash.org`, // website with details about particular entity
      color: '#333333' // background color 
    };
  } catch (e) {
    console.error(e);
    return undefined;
  }
};
```

Next we have `entityTranslations` which defines the copies across whole application. You can change them as you like.
I changed it as following:
```
export const entityTranslations = {
  commentPlaceholder: 'Hash your story',
  replyPlaceholder: 'Hash your reply',
  noEntitiesError: 'No robohashes found',
  entityName: 'RoboHash'
};
```
Last we need to adjust `avatarSizes`. The best approach to do that is to open our application, find the right values using web brower console and write them to file. Yes, by now your application should be ready to launch. 

To start the application:
1. `yarn`
2. `yarn start`

For me the right values for avatarSizes were following:
```
export const avatarSizes = {
  verySmall: { containerSize: '32px', imgSize: '32px', imgTopOffset: '50%', imgLeftOffset: '50%' },
  small: { containerSize: '44px', imgSize: '44px', imgTopOffset: '50%', imgLeftOffset: '50%' },
  medium: { containerSize: '54px', imgSize: '54px', imgTopOffset: '50%', imgLeftOffset: '50%' },
  large: { containerSize: '64px', imgSize: '64px', imgTopOffset: '50%', imgLeftOffset: '50%' }
};
```

Congratulations, you have built your own social platform for your collectibles!
Because the application consists only of frontend you can deploy it even using github pages!
