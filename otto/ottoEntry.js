
import Methods from '../src/Vite/rpcMethods';
import docs from './docs';


if (b_vite) {
    var provider = {
        request(Method, Params = []) {
            if (!(Params instanceof Array)){
                Params=[Params];
            }
            try {
                var res = b_vite.send({ Method, Params });
            } catch (e) {
                console.log(e);
                return Promise.reject(e);
            }
            console.log(res);
            return Promise.resolve(res);
        },
        // batch(batchedReq) {
        //     try {
        //         var res = b_vite.send(batchedReq);
        //     } catch (e) {
        //         return Promise.reject(e);
        //     }
        //     return Promise.resolve(res);
        // }
    };
} else {
    throw new Error('no global var "b_vite"');
}
const vite = {};
vite.help=docs.helpContent;
for (let namespace in Methods) {
    vite[namespace] = {};
    Methods[namespace].forEach(name => {
        let methodName = `${namespace}_${name}`;
        vite[namespace].help=docs[namespace].helpContent||'';
        vite[namespace][methodName] = (...params) => {
            return provider.request(methodName, params);
        };
        vite[namespace][methodName].help=docs[namespace][methodName]||'';
    });
}

export default vite;