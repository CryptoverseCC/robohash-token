var RoboHashToken = artifacts.require("RoboHashToken.sol");

contract('RoboHashToken', () => {
	it("total supply should be zero at the begging", async () => {
		const instance = await RoboHashToken.deployed();
		const totalSupply = await instance.totalSupply();
		assert.equal(totalSupply, 0);
	});

	it("first created token has id 1", async () => {
		const instance = await RoboHashToken.deployed();
		await instance.create("Userfeeds");
		const tokenId = await instance.getTokenId("Userfeeds");
		assert.equal(tokenId, 1)
	});
	
	it("totalSupply should be 1 after token creation", async () => {
		const instance = await RoboHashToken.deployed();
		const totalSupply = await instance.totalSupply();
		assert.equal(totalSupply, 1);
	});
	
	it("token should have name with which it was created", async () => {
		const instance = await RoboHashToken.deployed();
		const tokenName = await instance.getTokenName(1);
		assert.equal(tokenName, "Userfeeds");
	});
	
	it("returns zero as tokenId for unclaimed tokens", async () => {
		const instance = await RoboHashToken.deployed();
		const tokenId = await instance.getTokenId("not-claimed");
		assert.equal(tokenId, 0);
	});
});