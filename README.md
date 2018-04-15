# RoboHashBook

In the previous post we have discussed variety of usages for social layer build on top of erc721 tokens, as well as how such platform might work.
Today we present a short tutorial which shows how to build a social platform for an existing erc721 token.
To make this guide comperhensive the first part of this arcticle describes how to build your own erc721 token.
Next we will try to figure out how to add unique avatars to our token.
If you know how to do that or you plan to add a social layer to token which already exists you can skip that part.
Last but not least we will modify cryptokittes code inorder to add tokens issuing page.

#1 Building your own ERC721 token:
We are going to use truffle to make your life easier, so if you don't know what truffle is, I encourage you to read about it before moving forward. (http://truffleframework.com/docs/)

The first thing you need to do is to install truffle:
`npm install -g truffle`

Now let's create project. My token is going to be RoboHashToken so I named project's directory 'robohash'.
`mkdir robohash && cd robohash`
`truffle init`

Since the whole standard of erc721 isn't so small we are going to use basic implementation of erc721 token from zeppelin-solidity library. (https://github.com/OpenZeppelin/zeppelin-solidity/blob/master/contracts/token/ERC721/ERC721Token.sol) 
To do that we need to add zeppelin-solidity to our dependencies: 
`npm install zeppelin-solidity --save-dev`

Now, when we have zeppelin, we can create our contract:
`mkdir contracts`
`cd contracts && touch RoboHashToken.sol`

First let's inherit from ERC721Token
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

#2 Token's avatar:
It is much more pleasent for the user if your token can be visualized. Cryptokitties tokens are represented by their png/svg images served from backend. 
The same story is with almost all collectibles. In order not to be worse, we will use https://robohash.org/ website to generate images from strings. Since we want all future website to display us in the same way we will add this logic to our contract. To do that we will have to concatenate robohash website with our token name and with '.png' postfix. Unfortunatelly solidity doesn't provide any built-in way to join strings, so we will do it manually. 

```
	function getTokenUrl(string tokenName) view public returns (string) {
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

Ok, so let's summarize what we have by now. Users can claim their identities which are implemented as NFT and see their visual representation thanks to http://robohash.org. Isn't that great?

4. implement erc721 7d79236
5. npm install --save-dev dotenv truffle-wallet-provider ethereumjs-wallet
6. configure ropsten 380972e
7. truffle deploy --network ropsten

If you have erc721 already:
1. copy cryptopurr bdcbf16
2. convert to support your erc721 686f0c5
