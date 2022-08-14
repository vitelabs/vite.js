import { isArray, isObject } from '~@vite/vitejs-utils';

import { defaultAbiCoder } from './abicoder';
import { Abi } from './abi';
import { Fragment, JsonFragment, JsonParamType, ParamType } from './fragments';
import * as utils from './utils';

export type AbiFragment = Fragment | JsonFragment | string;
export type AbiParam = ParamType | JsonParamType | string;
export { Abi, utils };

export function encodeLogSignature(abiFragment: Array<AbiFragment> | AbiFragment, eventName?: string): string {
    return Abi.from(abiFragment).getEventTopic(eventName);
}

export function encodeFunctionSignature(abiFragment: Array<AbiFragment> | AbiFragment, methodName?: string) {
    return Abi.from(abiFragment).getSighash(methodName);
}
export function encodeFunctionCall(abiFragment: Array<AbiFragment> | AbiFragment, params?: Array<any>, methodName?: string) {
    return Abi.from(abiFragment).encodeFunctionData(methodName, params);
}

export function decodeFunctionCall(abiFragment: Array<AbiFragment> | AbiFragment, data: string, methodName?: string) {
    return Abi.from(abiFragment).decodeFunctionData(methodName, data);
}

export function decodeFunctionOutput(abiFragment: Array<AbiFragment> | AbiFragment, data: string, methodName?: string) {
    return Abi.from(abiFragment).decodeFunctionResult(methodName, data);
}

export function encodeOffchainCall(abiFragment: Array<AbiFragment> | AbiFragment, params?: Array<any>, methodName?: string) {
    return Abi.from(abiFragment).encodeOffchainData(methodName, params);
}

export function decodeOffchainOutput(abiFragment: Array<AbiFragment> | AbiFragment, data: string, methodName?: string) {
    return Abi.from(abiFragment).decodeOffchainResult(methodName, data);
}

export function encodeConstructor(abiFragment: Array<AbiFragment> | AbiFragment, params?: Array<any>) {
    return Abi.from(abiFragment).encodeDeploy(params);
}

export function encodeParameter(type: AbiParam, param: any) {
    return defaultAbiCoder.encode([ParamType.from(type)], [param]);
}

export function decodeParameter(type: AbiParam, data: string) {
    return defaultAbiCoder.decode([ParamType.from(type)], data)[0];
}

export function encodeParameters(types: Array<AbiParam | AbiFragment> | AbiParam | AbiFragment, params?: Array<any>, methodName?: string) {
    return defaultAbiCoder.encode(getTypes(types, methodName), params || []);
}
export function decodeParameters(types: Array<AbiParam | AbiFragment> | AbiParam | AbiFragment, data: string, methodName?: string) {
    return defaultAbiCoder.decode(getTypes(types, methodName), data);
}

export function decodeLog(abiFragment: Array<AbiFragment> | AbiFragment, data = '', topics: Array<string>, eventName?: string) {
    return Abi.from(abiFragment).decodeEventLog(eventName, data, topics);
}

export function encodeLogFilter(abiFragment: Array<AbiFragment> | AbiFragment, values: Array<any>, eventName?: string) {
    return Abi.from(abiFragment).encodeFilterTopics(eventName, values);
}

/**
 * Return matched JSON fragment according to type, or return null if the type is not found
 * @param jsonFragment
 * @param type
 * @return JsonFragment
 */
export function getAbiByType(jsonFragment: Array<JsonFragment> | JsonFragment, type: string): JsonFragment {
    if (!jsonFragment || !type) {
        return null;
    }

    if (!(isArray(jsonFragment) || isObject(jsonFragment))) {
        throw new Error('jsonFragment should be an array or object');
    }

    // jsonFragment is an object
    if (!Array.isArray(jsonFragment)) {
        return (jsonFragment.type === type) ? jsonFragment : null;
    }

    // jsonFragment is an array
    return jsonFragment.find(item => item.type === type) || null;
}

/**
 * Return matched JSON fragment according to method name, or return null if the method is not found
 * @param jsonFragment
 * @param methodName
 * @return JsonFragment
 */
export function getAbiByName(jsonFragment: Array<JsonFragment> | JsonFragment, methodName: string): JsonFragment {
    if (!jsonFragment || !methodName) {
        return null;
    }

    if (!(isArray(jsonFragment) || isObject(jsonFragment))) {
        throw new Error('jsonFragment should be an array or object');
    }

    // jsonFragment is an object
    if (!Array.isArray(jsonFragment)) {
        return (jsonFragment.name === methodName) ? jsonFragment : null;
    }

    // jsonFragment is an array
    return jsonFragment.find(item => item.name === methodName) || null;
}

// Parse input fragments or types and return matched type array
function getTypes(types: Array<ParamType | AbiFragment> | ParamType | AbiFragment, methodName?: string): Array<ParamType> {
    const _types: Array<ParamType> = [ ];
    const _frags: Array<Fragment> = [ ];

    const _parseInput = (inputs: any, _types: Array<ParamType>, _frags: Array<Fragment>): void => {
        if (typeof (inputs) === 'string') {
            const jsonParam: JsonParamType = utils.safeParseJson(inputs);
            if (jsonParam) { // is json
                inputs = jsonParam;
            }
        }
        if (!Array.isArray(inputs)) {
            try {
                _types.push(ParamType.from(inputs));
                return;
            } catch (e) {
                try {
                    _frags.push(Fragment.from(inputs));
                    return;
                } catch (e) {
                    throw new Error(`invalid type or fragment ${ inputs }`);
                }
            }
        }
        inputs.forEach(item => _parseInput(item, _types, _frags));
    };

    _parseInput(types, _types, _frags);

    if (methodName) { // fragment array + methodName
        const result = _frags.find(item => item.name === (item.type === 'callback' ? `${ methodName }Callback` : methodName))?.inputs;
        return result ? result : [];
    }
    if (_frags.length === 1) {
        return _frags[0].inputs;
    } else if (_frags.length > 1) {
        throw new Error('missing method name');
    }
    return _types;
}
