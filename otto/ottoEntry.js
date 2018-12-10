
import Methods from '../src/Vite/rpcMethods';


if (b_vite) {
    var provider = {
        request(Method, Params = []) {
            try {
                var res = b_vite.send({Method, Params});
            } catch (e) {
                return Promise.reject(e);
            }
            // console.log(JSON.stringify(res));
            return res;
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
vite.help=$vite_docs.helpContent;
for (let namespace in Methods) {
    vite[namespace] = {};
    Methods[namespace].forEach(name => {
        let methodName = `${namespace}_${name}`;
        vite[namespace].help=$vite_docs[namespace].helpContent||'';
        vite[namespace][methodName] = (...params) => {
            return provider.request(methodName, params);
        };
        vite[namespace][methodName].help=$vite_docs[namespace][name]||'';
    });
}

export default vite;