import Methods from '../src/Vite/rpcMethods';

var provider=null;
if (b_vite) {
    provider = {
        request(Method, Params = []) {
            try {
                var res = b_vite.send({Method, Params});
            } catch (e) {
                return JSON.stringify(e);
            }
            return JSON.stringify(res);
        },
        batch(batchedReq) {
            try {
                var res = b_vite.send(batchedReq);
            } catch (e) {
                return JSON.stringify(e);
            }
            return JSON.stringify(res);
        }
    };
}else{
    throw new Error('no global var "b_vite"' );
}
class Vite {
    constructor(provider) {
        this._currentProvider = provider;
        const pretty = $vite_docs.help||{};
        this.help=pretty;
        for (let namespace in Methods) {
            Methods[namespace].forEach(name => {
                let methodName = `${namespace}_${name}`;
                this[methodName] = (...params) => {
                    return this._currentProvider.request(methodName, params);
                };
                this[methodName].help=$vite_docs[namespace]&&$vite_docs[namespace][name]||'';
            });
        }
    }
}

export default new Vite(provider);