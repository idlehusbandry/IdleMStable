import { Signer } from 'ethers';

import Core from './core';
import Interfaces from './interfaces';

export default class DeployHelper {
    public core: Core;
    public interfaces: Interfaces;

    constructor(deployerSigner: Signer) {
        this.core = new Core(deployerSigner);
        this.interfaces = new Interfaces(deployerSigner);
    }
}
