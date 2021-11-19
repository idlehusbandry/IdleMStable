pragma solidity >=0.6.0 <0.8.0;

import './ISaveWrapper.sol';
import './ILendingProtocol.sol';
import './IdleTokenInterface.sol';
import './ISavingsContractV2.sol';
import './IMasset.sol';
import '@openzeppelin/contracts/token/ERC20/IERC20.sol';
import '@openzeppelin/contracts/access/Ownable.sol';
import '@openzeppelin/contracts/math/SafeMath.sol';

contract IdleMStable is ILendingProtocol, Ownable {
    using SafeMath for uint256;

    IERC20 public underlyingToken; // USDC
    ISavingsContractV2 public imUSD; // interest bearing token
    ISaveWrapper public saveWrapper;
    IIdleToken public idleToken;
    IMasset public mUSD;

    uint256 public minReceiveFraction = 950000; //1000000 means 100%

    constructor(
        address _underlyingToken,
        address _saveWrapper,
        address _idleToken,
        address _mUSD,
        address _imUSD
    ) {
        underlyingToken = IERC20(_underlyingToken);
        saveWrapper = ISaveWrapper(_saveWrapper);
        idleToken = IIdleToken(_idleToken);
        imUSD = ISavingsContractV2(_imUSD);
        mUSD = IMasset(_mUSD);
    }

    modifier onlyIdle() {
        require(msg.sender == address(idleToken), 'Ownable: caller is not IdleToken');
        _;
    }

    function setIdleToken(address _idleToken) external onlyOwner {
        require(address(idleToken) == address(0), 'idleToken addr already set');
        require(_idleToken != address(0), '_idleToken addr is 0');
        idleToken = IIdleToken(_idleToken);
    }

    function changeMinReceiveFraction(uint256 _minFraction) external onlyOwner {
        require(_minFraction <= 1000000, 'Value should be less than or equal to 1000000');
        minReceiveFraction = _minFraction;
    }

    function mint() external override onlyIdle returns (uint256) {
        uint256 balance = underlyingToken.balanceOf(address(this));
        // uint256 balance = 121; // some random amount
        if (balance == 0) {
            return 0;
        }
        underlyingToken.approve(address(saveWrapper), balance);
        uint256 minOut = minReceiveFraction.mul(balance).mul(10**6); // changes based on underlying token
        uint256 balanceBefore = IERC20(address(imUSD)).balanceOf(address(this));
        saveWrapper.saveViaMint(address(mUSD), address(imUSD), address(1), address(underlyingToken), balance, minOut, false);
        uint256 balanceAfter = IERC20(address(imUSD)).balanceOf(address(this));
        return balanceAfter.sub(balanceBefore);
    }

    function redeem(address _account) public override onlyIdle returns (uint256) {
        uint256 redeemableTokens = IERC20(address(imUSD)).balanceOf(address(this));

        uint256 balanceBefore = IERC20(address(mUSD)).balanceOf(address(this));
        imUSD.redeemCredits(redeemableTokens);
        uint256 balanceAfter = IERC20(address(mUSD)).balanceOf(address(this));
        uint256 mUSDReceived = balanceAfter.sub(balanceBefore);
        require(mUSDReceived != 0, 'Error in getting mUSD');

        uint256 minOut = minReceiveFraction.mul(mUSDReceived).div(10**18); // changes based on underlying token, 6 for fraction and 12 for usdc

        uint256 underlyingTokenBalanceBefore = underlyingToken.balanceOf(address(this));

        mUSD.redeem(address(underlyingToken), mUSDReceived, minOut, address(this));
        uint256 underlyingTokenBalanceAfter = underlyingToken.balanceOf(address(this));

        uint256 underlyingTokenReceived = underlyingTokenBalanceAfter.sub(underlyingTokenBalanceBefore);
        require(underlyingTokenReceived != 0, 'Error in converting to underlying token');
        underlyingToken.transfer(_account, underlyingTokenReceived);

        return underlyingTokenReceived;
    }

    // TO-DO
    function nextSupplyRate(uint256 amount) public view override returns (uint256) {
        return 50000000;
    }

    // TO-DO
    function getAPR() public view override returns (uint256) {
        return 400000;
    }

    // TO-DO
    function availableLiquidity() public view override returns (uint256) {
        return 3000000;
    }

    // TO-DO
    function getPriceInToken() public view override returns (uint256) {
        return 10**18;
    }

    function token() public view override returns (address) {
        return address(imUSD);
    }

    function underlying() public view override returns (address) {
        return address(underlyingToken);
    }
}
