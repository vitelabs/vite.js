const loopTime = 2000;

class Account {
    constructor(Vite) {
        this.Vite = Vite;

        this.addrList = [];
        // this._loopAddrList();
    }

    unlock(address) {
        this.addrList.push(address);
        this._loopAddr(address);
    }

    lock(address) {
        let i;
        for (i=0; i<this.addrList.length; i++) {
            if (this.addrList[i] === address) {
                break;
            }
        }

        if (i >= this.addrList.length) {
            return;
        }
        this.addrList = this.addrList.splice(i, 1);
    }

    _loopAddr(address) {
        if (this.addrList.indexOf(address) < 0) {
            return;
        }

        let loop = ()=>{
            let loopTimeout = setTimeout(()=>{
                clearTimeout(loopTimeout);
                loopTimeout = null;
                this._loopAddr(address);
            }, loopTime);
        };

        this.Vite.Ledger.receiveBlock(address).then((data)=>{
            console.log(data);
            loop();
        });
    }

    // signTX() {

    // }
}

export default Account;
