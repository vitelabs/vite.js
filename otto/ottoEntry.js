
import Vite from '../src/Vite/index.js';

if (b_vite) {
    var provider = {
        request(Method, Params = []) {
            try {
                var res = b_vite.send(Method, Params);
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
var vite = new Vite(provider);

export default vite;