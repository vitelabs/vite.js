import { AbiCoder, defaultAbiCoder } from './abicoder';
import { Result } from './coder';
import {
    ConstructorFragment,
    EventFragment,
    FormatTypes,
    Fragment,
    FragmentType,
    FunctionFragment,
    FunctionLike,
    JsonFragment,
    JsonParamType,
    OffchainFragment,
    ParamType
} from './fragments';
import {
    blake2bHex,
    isHexString,
    isObject
} from '~@vite/vitejs-utils';
import { arrayify, getArrayDepth, hexlify, rightPadZero, safeParseJson } from './utils';

export { Result };

function checkNames(fragment: Fragment, type: 'input' | 'output', params: Array<ParamType>): void {
    params.reduce((accum, param) => {
        if (param.name) {
            if (accum[param.name]) {
                throw new Error(`duplicate ${ type } parameter ${ JSON.stringify(param.name) } in ${ fragment.format(FormatTypes.Full) }`);
            }
            accum[param.name] = true;
        }
        return accum;
    }, { });
}

export class Abi {
    static from(fragments: string | Fragment | JsonFragment | Array<Fragment | JsonFragment | string>): Abi {
        return new Abi(fragments);
    }

    static getAbiCoder(): AbiCoder {
        return defaultAbiCoder;
    }

    static getSighash(fragment: FunctionLike): string {
        return blake2bHex(fragment.format(), null, 32).slice(0, 8);
    }

    static getEventTopic(eventFragment: EventFragment): string {
        return blake2bHex(eventFragment.format(), null, 32);
    }

    private static _getFunctionLike(nameOrSighash?: string, _fragments?: { [name: string]: FunctionLike }): FunctionLike {
        if (!nameOrSighash) {
            if (Object.keys(_fragments).length !== 1) {
                throw new Error('param(s) missing, methodName or signature or sighash.');
            }
            return _fragments[Object.keys(_fragments)[0]];
        }

        if (isHexString(nameOrSighash)) { // sighash
            for (const name in _fragments) {
                if (nameOrSighash === Abi.getSighash(_fragments[name])) {
                    return _fragments[name];
                }
            }
            throw new Error(`no matching sighash: ${ nameOrSighash }`);
        }

        // It is a bare name, look up the function (will return null if ambiguous)
        if (nameOrSighash.indexOf('(') === -1) {
            const name = nameOrSighash.trim();
            const matching = Object.keys(_fragments).filter(e =>
                (e.split('(')[0] === (_fragments[e].type === FragmentType.Callback ? `${ name }Callback` : name)));
            if (matching.length === 0) {
                throw new Error(`no matching function: ${ name }`);
            } else if (matching.length > 1) {
                throw new Error(`multiple matching functions: ${ name }`);
            }

            return _fragments[matching[0]];
        }

        return undefined;
    }

    readonly fragments: ReadonlyArray<Fragment>;
    readonly events: { [ name: string ]: EventFragment };
    readonly functions: { [ name: string ]: FunctionFragment };
    readonly offchains: { [ name: string ]: OffchainFragment };
    readonly others: { [ name: string ]: Fragment };
    readonly deploy: ConstructorFragment;

    readonly _abiCoder: AbiCoder;

    protected constructor(fragments: string | Fragment | JsonFragment | Array<Fragment | JsonFragment | string>) {
        let abi: ReadonlyArray<Fragment | JsonFragment | string>;

        const jsonParam: JsonParamType = safeParseJson(fragments);
        if (jsonParam) {
            fragments = jsonParam;
        }

        if (!Array.isArray(fragments)) {
            fragments = [fragments];
        }
        abi = fragments;

        this.fragments = abi.map(fragment => Fragment.from(fragment)).filter(fragment => (fragment != null));
        this._abiCoder = Abi.getAbiCoder();
        this.functions = { };
        this.offchains = { };
        this.events = { };
        this.others = { };

        // Add all fragments by their signature
        this.fragments.forEach(fragment => {
            let bucket: { [ name: string ]: Fragment } = null;
            switch (fragment.type) {
            case FragmentType.Constructor:
                if (this.deploy) {
                    console.warn('duplicate definition - constructor');
                    return;
                }
                checkNames(fragment, 'input', fragment.inputs);
                Object.defineProperty(this, 'deploy', {
                    enumerable: true,
                    value: fragment as ConstructorFragment,
                    writable: false
                });
                return;
            case FragmentType.Function:
            case FragmentType.Callback:
                checkNames(fragment, 'input', fragment.inputs);
                checkNames(fragment, 'output', (fragment as FunctionFragment).outputs);
                bucket = this.functions;
                break;
            case FragmentType.Offchain:
                checkNames(fragment, 'input', fragment.inputs);
                checkNames(fragment, 'output', (fragment as OffchainFragment).outputs);
                bucket = this.offchains;
                break;
            case FragmentType.Event:
                checkNames(fragment, 'input', fragment.inputs);
                bucket = this.events;
                break;
            case FragmentType.Variable:
            case FragmentType.Fallback:
            case FragmentType.Receive:
                checkNames(fragment, 'input', fragment.inputs);
                bucket = this.others;
                break;
            default:
                return;
            }

            const signature = fragment.format();
            if (bucket[signature]) {
                console.warn(`duplicate definition - ${ signature }`);
                return;
            }

            bucket[signature] = fragment;
        });

        // If we do not have a constructor add a default
        if (!this.deploy) {
            this.deploy = ConstructorFragment.from({
                payable: false,
                type: 'constructor'
            });
        }
    }

    /**
     * Format the ABI interface
     * @param format
     */
    format(format?: FormatTypes): string | Array<string> {
        if (!format) {
            format = FormatTypes.Full;
        }
        if (format === FormatTypes.Sighash) {
            throw new Error('interface does not support formatting sighash');
        }

        const abi = this.fragments.map(fragment => fragment.format(format));

        if (format === FormatTypes.Json) {
            return JSON.stringify(abi.map(j => JSON.parse(j)));
        }

        return abi;
    }

    /**
     * Find a function by function name, signature or sighash
     * @param nameOrSignatureOrSighash
     */
    getFunction(nameOrSignatureOrSighash?: string): FunctionFragment {
        let result: FunctionFragment = Abi._getFunctionLike(nameOrSignatureOrSighash, this.functions) as FunctionFragment;
        if (result) {
            return result;
        }

        // Normalize the signature and lookup the function
        result = this.functions[FunctionFragment.fromString(nameOrSignatureOrSighash).format()];
        if (!result) {
            throw new Error(`no matching function signature: ${ nameOrSignatureOrSighash }`);
        }
        return result;
    }

    /**
     * Find an offchain method by method name, signature or sighash (0.4.x)
     * @param nameOrSignatureOrSighash
     */
    getOffchain(nameOrSignatureOrSighash?: string): OffchainFragment {
        let result: OffchainFragment = Abi._getFunctionLike(nameOrSignatureOrSighash, this.offchains) as OffchainFragment;
        if (result) {
            return result;
        }

        // Normalize the signature and lookup the function
        result = this.offchains[OffchainFragment.fromString(nameOrSignatureOrSighash).format()];
        if (!result) {
            throw new Error(`no matching offchain signature: ${ nameOrSignatureOrSighash }`);
        }
        return result;
    }

    /**
     * Find an event by event name, signature or topic (non-anonymous)
     * @param nameOrSignatureOrTopic
     */
    getEvent(nameOrSignatureOrTopic?: string): EventFragment {
        if (!nameOrSignatureOrTopic) {
            if (Object.keys(this.events).length !== 1) {
                throw new Error('[Error] Param(s) missing, eventName or signature or topic.');
            }
            return this.events[Object.keys(this.events)[0]];
        }

        if (isHexString(nameOrSignatureOrTopic)) {
            const topichash = nameOrSignatureOrTopic.toLowerCase();
            for (const name in this.events) {
                if (topichash === this.getEventTopic(name)) {
                    return this.events[name];
                }
            }
            throw new Error(`no matching topichash: ${ topichash }`);
        }

        // It is a bare name, look up the function (will return null if ambiguous)
        if (nameOrSignatureOrTopic.indexOf('(') === -1) {
            const name = nameOrSignatureOrTopic.trim();
            const matching = Object.keys(this.events).filter(f => (f.split('(')[0] === name));
            if (matching.length === 0) {
                throw new Error(`no matching event: ${ name }`);
            } else if (matching.length > 1) {
                throw new Error(`multiple matching events: ${ name }`);
            }

            return this.events[matching[0]];
        }

        // Normalize the signature and lookup the function
        const result = this.events[EventFragment.fromString(nameOrSignatureOrTopic).format()];
        if (!result) {
            throw new Error(`no matching event signature: ${ nameOrSignatureOrTopic }`);
        }
        return result;
    }

    /**
     * Get a function's sighash (the first 4 bytes of the 32-byte blake2b hash of the function signature)
     * @param fragment Fragment of a function or an offchain method
     */
    getSighash(fragment: FunctionFragment | string): string {
        return Abi.getSighash(this._getFunction(fragment));
    }

    /**
     * Get the topic of an event (the 32-byte blake2b hash)
     * @param eventFragment
     */
    getEventTopic(eventFragment: EventFragment | string): string {
        return Abi.getEventTopic(this._getEvent(eventFragment));
    }

    /**
     * Encode the data for constructor
     * @param values
     */
    encodeDeploy(values?: ReadonlyArray<any>): string {
        if (Object.keys(this.deploy.inputs).length === 0) {
            throw new Error('abi has no constructor');
        }

        return this._encodeParams(this.deploy.inputs, values || [ ]);
    }

    /**
     * Decode the data from a function call (e.g. tx.data)
     * @param functionFragment - Function fragment or sighash or name
     * @param data
     */
    decodeFunctionData(functionFragment: FunctionFragment | string, data: Buffer | string): Result {
        const _fragment = this._getFunction(functionFragment);

        const bytes = arrayify(data);

        if (hexlify(bytes.slice(0, 4)) !== this.getSighash(_fragment)) {
            throw new Error(`data signature does not match function ${ _fragment.name }: ${ hexlify(bytes.slice(0, 4)) }`);
        }

        return this._decodeParams(_fragment.inputs, bytes.slice(4));
    }

    /**
     * Encode the data for a function call (e.g. tx.data)
     * @param functionFragment
     * @param values
     */
    encodeFunctionData(functionFragment: FunctionFragment | string, values?: ReadonlyArray<any>): string {
        const _fragment = this._getFunction(functionFragment);

        return hexlify(Abi.getSighash(_fragment).concat(this._encodeParams(_fragment.inputs, values || [ ])));
    }

    /**
     * Decode the result from a view function call
     * @param functionFragment Function fragment or method name or sighash or signature
     * @param data Hex-string data or byte array
     */
    decodeFunctionResult(functionFragment: FunctionFragment | string, data: Buffer | string): Result {
        const _fragment = this._getFunction(functionFragment);

        const bytes = arrayify(data);

        if (bytes.length % this._abiCoder._getWordSize() === 0) {
            return this._abiCoder.decode(_fragment.outputs, bytes);
        }

        throw new Error(`decode function output failed: ${ _fragment }`);
    }

    /**
     * Encode the result for a view function call
     * @param functionFragment Function fragment or method name or sighash or signature
     * @param values Input arguments
     */
    encodeFunctionResult(functionFragment: FunctionFragment | string, values?: ReadonlyArray<any>): string {
        const _fragment = this._getFunction(functionFragment);

        return hexlify(this._abiCoder.encode(_fragment.outputs, values || [ ]));
    }

    /**
     * Encode the data for calling an offchain method (e.g. tx.data) in 0.4.x
     * @param offchainFragment Offchain fragment or method name or sighash or signature
     * @param values Input arguments
     */
    encodeOffchainData(offchainFragment: OffchainFragment | string, values?: ReadonlyArray<any>): string {
        const _fragment = this._getOffchain(offchainFragment);

        return hexlify(Abi.getSighash(_fragment).concat(this._encodeParams(_fragment.inputs, values || [ ])));
    }

    /**
     * Decode the result from an offchain method call in 0.4.x
     * @param offchainFragment Offchain fragment or method name or sighash or signature
     * @param data Hex-string data or byte array
     */
    decodeOffchainResult(offchainFragment: OffchainFragment | string, data: Buffer | string): Result {
        const _fragment = this._getOffchain(offchainFragment);

        const bytes = arrayify(data);

        if (bytes.length % this._abiCoder._getWordSize() === 0) {
            return this._abiCoder.decode(_fragment.outputs, bytes);
        }

        throw new Error(`decode offchain output failed: ${ _fragment }`);
    }

    /**
     * Create the filter for the event with search criteria (e.g. for ledger_getVmLogsByFilter)
     * @param eventFragment
     * @param values Array of topics or topic arrays
     */
    encodeFilterTopics(eventFragment: EventFragment | string, values: ReadonlyArray<any>): Array<string | Array<string>> {
        const _fragment = this._getEvent(eventFragment);

        if (values.length > _fragment.inputs.length) {
            throw new Error(`too many arguments for ${ _fragment.format() }: ${ values }`);
        }

        const topics: Array<string | Array<string>> = [];
        if (!_fragment.anonymous) {
            topics.push(this.getEventTopic(_fragment));
        }

        const encodeTopic = (param: ParamType, value: any, _isSubElement?: boolean): string => {
            if (param.type === 'string') {
                if (_isSubElement) {
                    return rightPadZero(Buffer.from(value, 'utf8'), 32);
                }
                return blake2bHex(value, null, 32);
            } else if (param.type === 'bytes') {
                if (_isSubElement) {
                    return rightPadZero(value, 32);
                }
                return blake2bHex((value), null, 32);
            } else if (param.baseType === 'tuple') {
                if (!isObject(value)) {
                    throw new Error(`type error, expect object but got ${ typeof value }`);
                }
                const result = param.components.reduce((accum, item) => accum.concat(encodeTopic(item, value[item.name], true)), '');
                if (_isSubElement) {
                    return result;
                }
                return blake2bHex(arrayify(result), null, 32);
            } else if (param.baseType === 'array') {
                if (!Array.isArray(value)) {
                    throw new Error(`type error, expect array but got ${ typeof value }`);
                }
                // /**EXPERIMENTAL FEATURE**/
                // using arrays (esp. dynamic arrays) as an indexed topic may cause wrong results at the moment
                // if an array must be used, use static array
                const result = value.reduce((accum, item) => accum.concat(encodeTopic(param.arrayChildren, item, true)), '');
                if (_isSubElement) {
                    return result;
                }
                return blake2bHex(arrayify(result), null, 32);
            }
            return this._abiCoder.encode([param.type], [value]);
        };
        // only get indexed inputs
        const _inputs = _fragment.inputs.filter(item => item.indexed);
        values.forEach((value, index) => {
            const param = _inputs[index];

            if (!param.indexed) {
                return;
            }

            if (value == null) {
                topics.push(null);
            } else if (Array.isArray(value) && (param.baseType !== 'array' || getArrayDepth(value) > param.arrayDimension)) { // search for multiple results
                if (getArrayDepth(value) > 1 + param.arrayDimension) {
                    throw new Error(`incorrect filter format, expected input depth: ${ 1 + param.arrayDimension }, actual: ${ getArrayDepth(value) }`);
                }
                topics.push(value.map(value => encodeTopic(param, value)));
            } else {
                topics.push(encodeTopic(param, value));
            }
        });

        // Trim off trailing nulls
        while (topics.length && topics[topics.length - 1] === null) {
            topics.pop();
        }

        return topics;
    }

    /**
     * Encode an event log
     * @param eventFragment
     * @param values
     */
    encodeEventLog(eventFragment: EventFragment | string, values: ReadonlyArray<any>): { data: string, topics: Array<string> } {
        const _fragment = this._getEvent(eventFragment);

        const topics: Array<string> = [ ];
        const dataTypes: Array<ParamType> = [ ];
        const dataValues: Array<string> = [ ];

        if (!_fragment.anonymous) {
            topics.push(this.getEventTopic(_fragment));
        }

        if (values.length !== _fragment.inputs.length) {
            throw new Error(`event arguments/values mismatch: ${ values }`);
        }

        _fragment.inputs.forEach((param, index) => {
            const value = values[index];
            if (param.indexed) {
                if (param.type === 'string') {
                    topics.push(blake2bHex(value, null, 32));
                } else if (param.type === 'bytes') {
                    topics.push(blake2bHex(value, null, 32));
                } else if (param.baseType === 'tuple' || param.baseType === 'array') {
                    throw new Error('encoding event log for tuple or array is not implemented');
                } else {
                    topics.push(this._abiCoder.encode([param.type], [value]));
                }
            } else {
                dataTypes.push(param);
                dataValues.push(value);
            }
        });

        return {
            data: this._abiCoder.encode(dataTypes, dataValues),
            topics: topics
        };
    }

    /**
     * Decode an event log according to data and topics
     * @param eventFragment
     * @param data
     * @param topics
     */
    decodeEventLog(eventFragment: EventFragment | string, data: Buffer | string, topics?: ReadonlyArray<string>): {[key: string]: any} {
        const _fragment = this._getEvent(eventFragment);

        if (topics != null && !_fragment.anonymous) {
            const topicHash = this.getEventTopic(_fragment);
            if (!isHexString(topics[0], 32) || topics[0].toLowerCase() !== topicHash) {
                throw new Error(`fragment/topic mismatch, expected: ${ topicHash }, actual: ${ topics[0] }`);
            }
            topics = topics.slice(1);
        }

        const indexed: Array<ParamType> = [];
        const nonIndexed: Array<ParamType> = [];

        _fragment.inputs.forEach((param, index) => {
            if (param.indexed) {
                if (param.type === 'string' || param.type === 'bytes' || param.baseType === 'tuple' || param.baseType === 'array') {
                    indexed.push(ParamType.fromObject({ type: 'bytes32', name: param.name }));
                } else {
                    indexed.push(param);
                }
            } else {
                nonIndexed.push(param);
            }
        });

        const resultIndexed = (!topics || topics.length === 0) ? null : this._abiCoder.decode(indexed, Buffer.concat(topics.map(item => arrayify(item))));
        const resultNonIndexed = this._abiCoder.decode(nonIndexed, data, true);

        const result = { };
        let nonIndexedIndex = 0, indexedIndex = 0;
        _fragment.inputs.forEach((param, index) => {
            if (param.indexed) {
                if (resultIndexed == null) {
                    result[index] = null;
                } else {
                    result[index] = resultIndexed[indexedIndex++];
                }
            } else {
                result[index] = resultNonIndexed[nonIndexedIndex++];
            }

            // Add the keyword argument if named and safe
            if (param.name && result[param.name] == null) {
                result[param.name] = result[index];
            }
        });

        return Object.freeze(result);
    }

    private _decodeParams(params: ReadonlyArray<ParamType>, data: Buffer | string): Result {
        return this._abiCoder.decode(params, data);
    }

    private _encodeParams(params: ReadonlyArray<ParamType>, values: ReadonlyArray<any>): string {
        return this._abiCoder.encode(params, values);
    }

    private _getFunction(functionFragment: FunctionFragment | string): FunctionFragment {
        if (!functionFragment) {
            functionFragment = this.getFunction();
        }
        if (typeof (functionFragment) === 'string') {
            functionFragment = this.getFunction(functionFragment);
        }

        return functionFragment;
    }

    private _getOffchain(functionFragment: OffchainFragment | string): OffchainFragment {
        if (!functionFragment) {
            functionFragment = this.getOffchain();
        }
        if (typeof (functionFragment) === 'string') {
            functionFragment = this.getOffchain(functionFragment);
        }

        return functionFragment;
    }

    private _getEvent(eventFragment: EventFragment | string): EventFragment {
        if (!eventFragment) {
            eventFragment = this.getEvent();
        }
        if (typeof (eventFragment) === 'string') {
            eventFragment = this.getEvent(eventFragment);
        }

        return eventFragment;
    }
}

