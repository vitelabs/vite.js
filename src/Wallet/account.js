// const loopTime = 2000;

class Account {
    constructor(Vite) {
        this.Vite = Vite;
        this.addrList = [];
    }

    getunLockAddrList () {
        return this.addrList;
    }

    unlock(address, privKey) {
        this.addrList.push(address);
        this._loopAddr(address, privKey);
    }

    lock(address) {
        let i = this.addrList.indexOf(address);
        if (i < 0) {
            return;
        }
        this.addrList = this.addrList.splice(i, 1);
    }

    _loopAddr(address, privKey) {
        if (this.addrList.indexOf(address) < 0) {
            return;
        }

        // let loop = ()=>{
        //     let loopTimeout = setTimeout(()=>{
        //         clearTimeout(loopTimeout);
        //         loopTimeout = null;
        //         this._loopAddr(address, privKey);
        //     }, loopTime);
        // };

        this.Vite.Ledger.getReceiveBlock(address).then((accountBlock)=>{
            if (!accountBlock) {
                return;
            }

            let { hash, signature } = this.Vite.Account.signTX(accountBlock, privKey);
            accountBlock.hash = hash;
            accountBlock.signature = signature;

            // [TODO]
            console.log(accountBlock);
            this.Vite.Ledger.sendTx(accountBlock).then((data)=>{
                console.log(data);
            }).catch((err)=>{
                console.log(err);
            });
            // loop();
        }).catch((err)=>{
            console.error(err);
            // loop();
        });
    }

    // signTX() {

    // }
}

export default Account;