pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

contract Abilities is ERC1155, AccessControl {
    bytes32 public constant ADMIN = keccak256("ADMIN");

    constructor() ERC1155("https://game.example/api/item/{id}.json") {
        
    }

    function mint(uint256 id, uint256 amount) onlyAdmin external {
        bytes memory data;
        _mint(msg.sender, id, amount, data);
    }

    function burn(uint256 id, uint256 amount) onlyAdmin external {
        _burn(msg.sender, id, amount);
    }

    modifier onlyAdmin {
        require(hasRole(ADMIN, msg.sender));
        _;
    }

    function supportsInterface(bytes4 interfaceId) public view virtual override(ERC1155, AccessControl) returns (bool) {
        return super.supportsInterface(interfaceId);
    }
}