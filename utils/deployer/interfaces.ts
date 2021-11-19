import { Signer } from 'ethers';
import { Address } from 'hardhat-deploy/dist/types';

import {
    IIdleToken__factory,
    IIdleToken,
    IERC3156FlashBorrower,
    IERC3156FlashBorrower__factory,
    ILendingProtocol,
    ILendingProtocol__factory,
    IMasset,
    IMasset__factory,
    ISaveWrapper,
    ISaveWrapper__factory,
    ISavingsContractV2,
    ISavingsContractV2__factory,
    IERC20,
    IERC20__factory,
} from '../../typechain';

export default class Interfaces {
    private _deployerSigner: Signer;
    constructor(deployerSigner: Signer) {
        this._deployerSigner = deployerSigner;
    }

    public async getIdleTokenInterface(contractAddress: Address): Promise<IIdleToken> {
        return IIdleToken__factory.connect(contractAddress, this._deployerSigner);
    }

    public async getIERC3156FlashBorrower(contractAddress: Address): Promise<IERC3156FlashBorrower> {
        return IERC3156FlashBorrower__factory.connect(contractAddress, this._deployerSigner);
    }

    public async getIILendingProtocol(contractAddress: Address): Promise<ILendingProtocol> {
        return ILendingProtocol__factory.connect(contractAddress, this._deployerSigner);
    }

    public async getIMasset(contractAddress: Address): Promise<IMasset> {
        return IMasset__factory.connect(contractAddress, this._deployerSigner);
    }

    public async getISaveWrapper(contractAddress: Address): Promise<ISaveWrapper> {
        return ISaveWrapper__factory.connect(contractAddress, this._deployerSigner);
    }

    public async getISavingsContractV2(contractAddress: Address): Promise<ISavingsContractV2> {
        return ISavingsContractV2__factory.connect(contractAddress, this._deployerSigner);
    }

    public async getIERC20(contractAddress: Address): Promise<IERC20> {
        return IERC20__factory.connect(contractAddress, this._deployerSigner);
    }
}
