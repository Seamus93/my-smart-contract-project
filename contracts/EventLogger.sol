// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract EventLogger {
    struct Event {
        uint256 timestamp;
        address from;
        address to;
        string eventType;
        uint256 value;
    }

    Event[] public events;

    function logEvent(address from, address to, string memory eventType, uint256 value) public {
        Event memory newEvent = Event({
            timestamp: block.timestamp,
            from: from,
            to: to,
            eventType: eventType,
            value: value
        });
        events.push(newEvent);
    }

    function getEvent(uint256 index) public view returns (Event memory) {
        return events[index];
    }
}
