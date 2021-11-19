pragma solidity >=0.6.0 <0.9.0;

interface IMasset {
    function redeem(
        address _output,
        uint256 _mAssetQuantity,
        uint256 _minOutputQuantity,
        address _recipient
    ) external returns (uint256 outputQuantity);
}
