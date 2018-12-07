import { paramsMissing, paramsFormat } from "const/error";

export function checkParams(params, requiredP:Array<string> = [], validFunc:Array<{ name, func, msg? }> =[]) {
    if (!params) {
        return null;
    }

    let isHave = (name) => {
        return params.hasOwnProperty(name) && 
            typeof params[name] !== 'undefined' &&
            params[name] !== null
    }

    for (let i=0; i<requiredP.length; i++) {
        let name = requiredP[i];
        if ( !isHave(name) ) {
            return {
                code: paramsMissing.code,
                message: `${paramsMissing.msg} ${name}.`
            }
        }
    }

    for (let i=0; i<validFunc.length; i++) {
        let { name, func, msg } = validFunc[i];
        if (!name || !func || !isHave(name)) {
            continue;
        }

        if ( !func(params[name]) ) {
            return {
                code: paramsFormat.code,
                message: `${paramsFormat.msg} Illegal ${name}. ${msg || ''}`
            }
        }
    }

    return null;
}

export function getRawTokenid(tokenId: string) {
    let err = checkParams({ tokenId }, ['tokenId'], [{
        name: 'tokenId',
        func: (_t) => {
            return tokenId.indexOf('tti_') === 0;
        }
    }]);

    if (err) {
        console.error(new Error(err.message));
        return null;
    }

    return tokenId.slice(4, tokenId.length - 4);
}

export function validNodeName(nodeName) {
    return /^[a-zA-Z0-9_\.]+(\s{1}[a-zA-Z0-9_\.]+)*$/g.test(nodeName) && nodeName.length <= 40;
}

export function validInteger(num) {
    return num && (/(^[1-9]\d*$)/g.test(num) || num === '0');
}
