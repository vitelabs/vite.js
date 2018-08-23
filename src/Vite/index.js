class Vite {
    constructor(provider) {
        this._currentProvider = provider;
    }

    setProvider(provider) {
        this._currentProvider = provider;
    }
}

export default Vite;