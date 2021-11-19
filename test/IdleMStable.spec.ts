import { ethers, network } from 'hardhat';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import { BigNumber, BigNumberish } from '@ethersproject/bignumber';
import { expect } from 'chai';

import DeployHelper from '../utils/deployer';
import { tokens, contracts as contractAddresses, impersonatedAccounts } from '../utils/addresses';

import { IdleMStable, IIdleToken, IMasset, ISaveWrapper, ISavingsContractV2, IERC20 } from '../typechain';

describe('Deploy Idle MStable Protocol Wrapper', () => {
    let idleMStable: IdleMStable;
    let mockIdleToken: IIdleToken;
    let mAsset: IMasset;
    let saveWrapper: ISaveWrapper;
    let savingsAccount: ISavingsContractV2;
    let usdcContract: IERC20;
    let imUSDContract: IERC20;

    let account1: SignerWithAddress;
    let account2: SignerWithAddress;

    before(async () => {
        await network.provider.request({
            method: 'hardhat_impersonateAccount',
            params: [impersonatedAccounts.usdc],
        });

        let usdcImpersonatedAccount: SignerWithAddress = await ethers.getSigner(impersonatedAccounts.usdc);
        let [account1]: SignerWithAddress[] = await ethers.getSigners();
        let deployHelper = new DeployHelper(usdcImpersonatedAccount);
        usdcContract = await deployHelper.interfaces.getIERC20(tokens.usdc);
        imUSDContract = await deployHelper.interfaces.getIERC20(tokens.imUSD);

        // 1 million usdc
        let amountToTransfer = BigNumber.from(1000000).mul(BigNumber.from(10).pow(6)); // usdc is 6 decimals in polygon
        await usdcContract.transfer(account1.address, amountToTransfer);
    });

    beforeEach(async () => {
        [account1, account2] = await ethers.getSigners();
        let deployHelper = new DeployHelper(account1);

        mockIdleToken = await deployHelper.interfaces.getIdleTokenInterface(account1.address);
        mAsset = await deployHelper.interfaces.getIMasset(tokens.mUSD);
        saveWrapper = await deployHelper.interfaces.getISaveWrapper(contractAddresses.SaveWrapper);
        savingsAccount = await deployHelper.interfaces.getISavingsContractV2(tokens.imUSD);

        idleMStable = await deployHelper.core.deployIdleMStable(
            tokens.usdc,
            saveWrapper.address,
            mockIdleToken.address,
            mAsset.address,
            savingsAccount.address
        );
    });

    it('mint function can only be called by idle token contract', async () => {
        await expect(idleMStable.connect(account2).mint()).to.be.revertedWith('Ownable: caller is not IdleToken');
    });

    it('transfer tokens to IdleMstableContract and call mint function', async () => {
        let amountToTransfer = BigNumber.from(10).mul(BigNumber.from(10).pow(6)); // usdc is 6 decimals in polygon

        let balanceBefore = await imUSDContract.balanceOf(idleMStable.address);
        await usdcContract.connect(account1).transfer(idleMStable.address, amountToTransfer);
        await idleMStable.connect(account1).mint();
        let balanceAfter = await imUSDContract.balanceOf(idleMStable.address);
        expect(balanceAfter).gt(balanceBefore); // print balance if required to be seen
    });

    it('Redeem imUSD', async () => {
        let amountToTransfer = BigNumber.from(10).mul(BigNumber.from(10).pow(6)); // usdc is 6 decimals in polygon
        let balanceBefore = await imUSDContract.balanceOf(idleMStable.address);
        await usdcContract.connect(account1).transfer(idleMStable.address, amountToTransfer);
        await idleMStable.connect(account1).mint();
        let balanceAfter = await imUSDContract.balanceOf(idleMStable.address);

        let imUSDReceived = balanceAfter.sub(balanceBefore);

        let usdcBalanceBefore = await usdcContract.balanceOf(account1.address);
        await idleMStable.redeem(account1.address);
        let usdcBalanceAfter = await usdcContract.balanceOf(account1.address);

        let usdcReceived = usdcBalanceAfter.sub(usdcBalanceBefore);
        console.log({ usdcReceived: usdcReceived.toString() });
    });
});
