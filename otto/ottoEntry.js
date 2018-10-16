
import Vite from '../src/Vite/index.js';

if (b_vite) {
    var provider = {
        request(Method, Params = []) {
            try {
                var res = b_vite.send(Method, Params);
            } catch (e) {
                return Promise.reject(e);
            }
            return Promise.resolve(res);
        },
        batch(batchedReq) {
            try {
                var res = b_vite.send(batchedReq);
            } catch (e) {
                return Promise.reject(e);
            }
            return Promise.resolve(res);
        }
    };
}else{
    throw new Error('no global var "b_vite"' );
}
var vite = new Vite(provider);

export default vite;