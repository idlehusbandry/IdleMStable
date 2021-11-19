import { Signer } from 'ethers';

import { Address } from 'hardhat-deploy/dist/types';

import { IdleMStable, IdleMStable__factory } from '../../typechain';

export default class Core {
    private _deployerSigner: Signer;
    constructor(deployerSigner: Signer) {
        this._deployerSigner = deployerSigner;
    }

    public async deployIdleMStable(
        _underlyingToken: Address,
        _saveWrapper: Address,
        _idleToken: Address,
        _mUSD: Address,
        _imUSD: Address
    ): Promise<IdleMStable> {
        return await new IdleMStable__factory(this._deployerSigner).deploy(_underlyingToken, _saveWrapper, _idleToken, _mUSD, _imUSD);
    }

    public async getIdleMStable(contractAddress: Address): Promise<IdleMStable> {
        return await new IdleMStable__factory(this._deployerSigner).attach(contractAddress);
    }
}
