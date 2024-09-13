// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;
contract MusicNoteNFT is ERC721, ERC721Enumerable, ERC721URIStorage, ERC721Burnable, ERC721Pausable, Ownable, ReentrancyGuard {
    using Address for address;

    uint public MAX_PER_MINT = 5;
    string public baseTokenURI;

    constructor(address initialOwner) ERC721("MusicNoteNFT", "MNFT") Ownable (initialOwner){
    }

    function _baseURI() internal view virtual override returns (string memory) {
        return baseTokenURI;
    }

    function setBaseURI(string memory _baseTokenURI) public onlyOwner {
        baseTokenURI = _baseTokenURI;
    }

    function mintNFTs(uint _count, string[] memory uris) public nonReentrant payable {
        require(_count > 0 && _count <= MAX_PER_MINT, "Cannot mint specified number of NFTs.");
        for (uint i = 0; i < _count; i++) {
            _mintSingleNFT(msg.sender, uris[i]);
        }
    }

    function _mintSingleNFT(address to, string memory uri) private {
        uint newTokenId = totalSupply();
        _safeMint(to, newTokenId);
        _setTokenURI(newTokenId, uri);
    }

    function tokensOfOwner(address _owner) external view returns (uint[] memory) {
        uint tokenCount = balanceOf(_owner);
        uint[] memory tokensId = new uint[](tokenCount);
        for (uint i = 0; i < tokenCount; i++) {
            tokensId[i] = tokenOfOwnerByIndex(_owner, i);
        }
        return tokensId;
    }

    function withdraw() public onlyOwner {
        uint balance = address(this).balance;
        payable(msg.sender).transfer(balance);
    }

       function mergeNFTs(uint256 tokenId1, uint256 tokenId2) external onlyOwner {
        // Ensure both tokens exist and are owned by the caller
        require(ownerOf(tokenId1) == msg.sender, "Caller does not own token 1");
        require(ownerOf(tokenId2) == msg.sender, "Caller does not own token 2");

        // Create new token metadata by combining URIs
        string memory uri1 = tokenURI(tokenId1);
        string memory uri2 = tokenURI(tokenId2);
        string memory newUri = string(abi.encodePacked(uri1, ", ", uri2)); // Example combining URIs

        // Mint new token
        _mintSingleNFT(msg.sender, newUri);

        // Burn old tokens
        _burn(tokenId1);
        _burn(tokenId2);
    }

    // Override functions from multiple base contracts
       function _update(address to, uint256 tokenId, address auth) internal virtual override (ERC721, ERC721Enumerable, ERC721Pausable) returns (address) {
        return super._update(to,tokenId,auth);
    }

     function supportsInterface(bytes4 interfaceId) public view virtual override(ERC721, ERC721Enumerable, ERC721URIStorage) returns (bool) {
        return super.supportsInterface(interfaceId);
    }

        function _increaseBalance(address account, uint128 value) internal virtual override(ERC721, ERC721Enumerable) {
        unchecked {
        super._increaseBalance(account,value);
        }
    }

    function tokenURI(uint256 tokenId) public view virtual override(ERC721, ERC721URIStorage) returns (string memory) {
        return super.tokenURI(tokenId);
    }
}
