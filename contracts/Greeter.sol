// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "hardhat/console.sol";

contract Greeter {
    struct GreetingMessage {
        string greetingText;
        string greetingImageHash;
    }

    GreetingMessage public greeting;

    constructor(string memory _greeting) {
        console.log("Deploying a Greeter with greeting:", _greeting);
        greeting.greetingText = _greeting;
    }

    function greet() public view returns (string memory, string memory) {
        string memory _greetingText = greeting.greetingText;
        string memory _greetingImageHash = greeting.greetingImageHash;

        return (_greetingText, _greetingImageHash);
    }

    function setGreeting(
        string memory _greetingText,
        string memory _greetingImageHash
    ) public {
        console.log(
            "Changing greeting from '%s' to '%s'",
            greeting.greetingText,
            _greetingText
        );
        greeting.greetingText = _greetingText;
        greeting.greetingImageHash = _greetingImageHash;
    }
}
