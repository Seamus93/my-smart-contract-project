// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

contract VulnerableContract {
    // Mappatura per tenere traccia degli saldi degli utenti
    mapping(address => uint256) public balances;
    
    // Variabile per tenere traccia del proprietario del contratto
    address public owner;
    
    // Costruttore che imposta il proprietario del contratto
    constructor() {
        owner = msg.sender;
    }

    // Funzione per depositare Ether nel contratto
    function deposit() public payable {
        balances[msg.sender] += msg.value;
    }

    // Funzione per prelevare Ether dal contratto
    function withdraw(uint256 amount) public {
        require(balances[msg.sender] >= amount, "Insufficient balance");
        balances[msg.sender] -= amount;
        payable(msg.sender).transfer(amount);
    }

    // Funzione per trasferire Ether a un altro indirizzo
    function transfer(address to, uint256 amount) public {
        require(balances[msg.sender] >= amount, "Insufficient balance");
        balances[msg.sender] -= amount;
        balances[to] += amount;
    }

    // Funzione per ritirare tutto il saldo del contratto (vulnerabile a reentrancy)
    function withdrawAll() public {
        require(msg.sender == owner, "Only owner can withdraw all funds");
        uint256 balance = address(this).balance;
        payable(owner).transfer(balance);
    }

    // Funzione per modificare il proprietario del contratto (vulnerabile a un attacco di cambio di proprietà)
    function changeOwner(address newOwner) public {
        require(msg.sender == owner, "Only owner can change ownership");
        owner = newOwner;
    }
}
