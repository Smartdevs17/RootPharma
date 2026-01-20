// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

library LabelPrinter {
    function generateZPL(string memory content) internal pure returns (string memory) {
        return string(abi.encodePacked("^XA^FD", content, "^XZ"));
    }
}
