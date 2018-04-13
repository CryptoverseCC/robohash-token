# RoboHashBook

In the previous post we have discussed variety of usages for social layer build on top of erc721 tokens, as well as how such platform might work.
Today we present a short tutorial which shows how to build a social platform for an existing erc721 token.
To make this guide comperhensive the first part of this arcticle describes how to build your own erc721 token. If you know how to do that or you plan to add a social layer to token which already exists you can skip that part.

Building your own ERC721 token:
We are going to use truffle to make your life easier, so if you don't know what truffle is, I encourage you to read about it before moving forward. (http://truffleframework.com/docs/)

The first thing you need to do is to install truffle:
`npm install -g truffle`

Now let's create project. My token is going to be RoboHashToken so I named project's directory 'robohash'.
`mkdir robohash && cd robohash`
`truffle init`

Since the whole standard of erc721 isn't so small we are going to use basic implementation of erc721 token from zeppelin-solidity library. (https://github.com/OpenZeppelin/zeppelin-solidity/blob/master/contracts/token/ERC721/ERC721Token.sol) 
To do that we need to add zeppelin-solidity to our dependencies: 
`npm install zeppelin-solidity --save-dev`

Now, when we have zeppelin we can create our contract:
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
	
	mapping(uint256 => string) internal tokenIdToName;
	mapping(string => uint256) internal nameToTokenId;

	function create(string name) public {
		require(nameToTokenId[name] == 0);
		uint256 tokenId = allTokens.length + 1;
		_mint(msg.sender, tokenId);
		tokenIdToName[tokenId] = name;
		nameToTokenId[name] = tokenId;
	}

``` 


4. implement erc721 7d79236
5. npm install --save-dev dotenv truffle-wallet-provider ethereumjs-wallet
6. configure ropsten 380972e
7. truffle deploy --network ropsten

If you have erc721 already:
1. copy cryptopurr bdcbf16
2. convert to support your erc721 686f0c5
