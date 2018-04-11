pragma solidity ^0.4.21;

import 'zeppelin-solidity/contracts/token/ERC721/ERC721Token.sol';

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
}