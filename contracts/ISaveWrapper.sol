pragma solidity >=0.6.0 <0.8.0;

interface ISaveWrapper {
    function saveViaMint(
        address _mAsset,
        address _save,
        address _vault,
        address _bAsset,
        uint256 _amount,
        uint256 _minOut,
        bool _stake
    ) external;

    function saveViaSwap(
        address _mAsset,
        address _save,
        address _vault,
        address _feeder,
        address _fAsset,
        uint256 _fAssetQuantity,
        uint256 _minOutputQuantity,
        bool _stake
    ) external;

    function saveViaUniswapETH(
        address _mAsset,
        address _save,
        address _vault,
        address _uniswap,
        uint256 _amountOutMin,
        address[] calldata _path,
        uint256 _minOutMStable,
        bool _stake
    ) external payable;
}
