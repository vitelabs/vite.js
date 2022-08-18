import { safeParseJson } from './utils';

export interface JsonParamType {
    readonly name?: string;
    readonly indexed?: boolean;
    readonly type?: string;
    readonly internalType?: any;
    readonly components?: Array<JsonParamType>;
}

export interface JsonFragment {
    readonly name?: string;
    readonly type?: string;

    readonly anonymous?: boolean;

    readonly payable?: boolean;
    readonly constant?: boolean;
    readonly stateMutability?: string;

    readonly inputs?: Array<JsonParamType>;
    readonly outputs?: Array<JsonParamType>;
}

// AST Node parser state
type ParseState = {
    allowArray?: boolean,
    allowName?: boolean,
    allowParams?: boolean,
    allowType?: boolean,
    readArray?: boolean,
};

// AST Node
type ParseNode = {
    parent?: any,
    type?: string,
    name?: string,
    state?: ParseState,
    indexed?: boolean,
    components?: Array<ParseNode>
};

const ModifiersBytes: { [name: string]: boolean } = {calldata: true, memory: true, storage: true};
const ModifiersNest: { [name: string]: boolean } = {calldata: true, memory: true};

function checkModifier(type: string, name: string): boolean {
    if (type === 'bytes' || type === 'string') {
        if (ModifiersBytes[name]) {
            return true;
        }
    } else if (type === 'address') {
        if (name === 'payable') {
            return true;
        }
    } else if (type.indexOf('[') >= 0 || type === 'tuple') {
        if (ModifiersNest[name]) {
            return true;
        }
    }
    if (ModifiersBytes[name] || name === 'payable') {
        throw new Error(`invalid modifier ${ name }`);
    }
    return false;
}

function parseParamType(param: string, allowIndexed: boolean): ParseNode {
    const originalParam = param;

    function throwError(i: number) {
        throw new Error(`unexpected character at position ${ i } of ${ param }`);
    }

    param = param.replace(/\s/g, ' ');

    function newNode(parent: ParseNode): ParseNode {
        const node: ParseNode = {type: '', name: '', parent: parent, state: {allowType: true}};
        if (allowIndexed) {
            node.indexed = false;
        }
        return node;
    }

    const parent: ParseNode = {type: '', name: '', state: {allowType: true}};
    let node = parent;

    for (let i = 0; i < param.length; i++) {
        const c = param[i];
        switch (c) {
        case '(':
            if (node.state.allowType && node.type === '') {
                node.type = 'tuple';
            } else if (!node.state.allowParams) {
                throwError(i);
            }
            node.state.allowType = false;
            node.type = verifyType(node.type);
            node.components = [newNode(node)];
            node = node.components[0];
            break;

        case ')': {
            delete node.state;

            if (node.name === 'indexed') {
                if (!allowIndexed) {
                    throwError(i);
                }
                node.indexed = true;
                node.name = '';
            }

            if (checkModifier(node.type, node.name)) {
                node.name = '';
            }

            node.type = verifyType(node.type);

            const child = node;
            node = node.parent;
            if (!node) {
                throwError(i);
            }
            delete child.parent;
            node.state.allowParams = false;
            node.state.allowName = true;
            node.state.allowArray = true;
            break;
        }
        case ',':
            delete node.state;

            if (node.name === 'indexed') {
                if (!allowIndexed) {
                    throwError(i);
                }
                node.indexed = true;
                node.name = '';
            }

            if (checkModifier(node.type, node.name)) {
                node.name = '';
            }

            node.type = verifyType(node.type);

            // eslint-disable-next-line no-case-declarations
            const sibling: ParseNode = newNode(node.parent);
            // { type: "", name: "", parent: node.parent, state: { allowType: true } };
            node.parent.components.push(sibling);
            delete node.parent;
            node = sibling;
            break;

            // Hit a space...
        case ' ':
            // If reading type, the type is done and may read a param or name
            if (node.state.allowType) {
                if (node.type !== '') {
                    node.type = verifyType(node.type);
                    delete node.state.allowType;
                    node.state.allowName = true;
                    node.state.allowParams = true;
                }
            }

            // If reading name, the name is done
            if (node.state.allowName) {
                if (node.name !== '') {
                    if (node.name === 'indexed') {
                        // eslint-disable-next-line max-depth
                        if (!allowIndexed) {
                            throwError(i);
                        }
                        // eslint-disable-next-line max-depth
                        if (node.indexed) {
                            throwError(i);
                        }
                        node.indexed = true;
                        node.name = '';
                    } else if (checkModifier(node.type, node.name)) {
                        node.name = '';
                    } else {
                        node.state.allowName = false;
                    }
                }
            }

            break;

        case '[':
            if (!node.state.allowArray) {
                throwError(i);
            }

            node.type += c;

            node.state.allowArray = false;
            node.state.allowName = false;
            node.state.readArray = true;
            break;

        case ']':
            if (!node.state.readArray) {
                throwError(i);
            }

            node.type += c;

            node.state.readArray = false;
            node.state.allowArray = true;
            node.state.allowName = true;
            break;

        default:
            if (node.state.allowType) {
                node.type += c;
                node.state.allowParams = true;
                node.state.allowArray = true;
            } else if (node.state.allowName) {
                node.name += c;
                delete node.state.allowArray;
            } else if (node.state.readArray) {
                node.type += c;
            } else {
                throwError(i);
            }
        }
    }

    if (node.parent) {
        throw new Error(`unexpected eof param ${ param }`);
    }

    delete parent.state;

    if (node.name === 'indexed') {
        if (!allowIndexed) {
            throwError(originalParam.length - 7);
        }
        if (node.indexed) {
            throwError(originalParam.length - 7);
        }
        node.indexed = true;
        node.name = '';
    } else if (checkModifier(node.type, node.name)) {
        node.name = '';
    }

    parent.type = verifyType(parent.type);

    return parent;
}

function populate(object: any, params: any) {
    for (const key in params) {
        Object.defineProperty(object, key, {
            enumerable: true,
            value: params[key],
            writable: false
        });
    }
}

export enum FormatTypes {
    Sighash = 'sighash', // Bare formatting, as is needed for computing a sighash of an event or function
    Minimal = 'minimal', // Human-Readable with Minimal spacing and without names (compact human-readable)
    Full = 'full', // Human-Readable with nice spacing, including all names
    Json = 'json' // JSON-format
}

const paramTypeArray = new RegExp(/^(.*)\[([0-9]*)\]$/);

export class ParamType {
    static from(value: string | JsonParamType | ParamType, allowIndexed?: boolean): ParamType {
        if (typeof (value) === 'string') {
            const jsonParam: JsonParamType = safeParseJson(value);
            if (jsonParam) {
                value = jsonParam;
            } else {
                return ParamType.fromString(value, allowIndexed);
            }
        }
        return ParamType.fromObject(value);
    }

    static fromObject(value: JsonParamType | ParamType): ParamType {
        if (ParamType.isParamType(value)) {
            return value;
        }

        return new ParamType({
            name: (value.name || null),
            type: verifyType(value.type),
            indexed: ((value.indexed == null) ? null : !!value.indexed),
            components: (value.components ? value.components.map(ParamType.fromObject) : null)
        });
    }

    static fromString(value: string, allowIndexed?: boolean): ParamType {
        function ParamTypify(node: ParseNode): ParamType {
            return ParamType.fromObject({
                name: node.name,
                type: node.type,
                indexed: node.indexed,
                components: node.components
            });
        }
        return ParamTypify(parseParamType(value, !!allowIndexed));
    }

    static isParamType(value: any): value is ParamType {
        return !!(value != null && value._isParamType);
    }

    // The local name of the parameter (of null if unbound)
    readonly name: string;

    // The fully qualified type (e.g. "address", "tuple(address)", "uint256[3][]"
    readonly type: string;

    // The base type (e.g. "address", "tuple", "array")
    readonly baseType: string;

    // Indexable Paramters ONLY (otherwise null)
    readonly indexed: boolean;

    // Tuples ONLY: (otherwise null)
    //  - sub-components
    readonly components: Array<ParamType>;

    // Arrays ONLY: (otherwise null)
    //  - length of the array (-1 for dynamic length)
    //  - child type
    readonly arrayLength: number;
    readonly arrayChildren: ParamType;
    readonly arrayDimension: number;

    readonly _isParamType: boolean;

    constructor(params: any) {
        populate(this, params);

        const match = this.type.match(paramTypeArray);
        if (match) {
            populate(this, {
                arrayLength: parseInt(match[2] || '-1'),
                arrayChildren: ParamType.fromObject({
                    type: match[1],
                    components: this.components
                }),
                arrayDimension: this.type.match(/\[([0-9]*)\]/g).length,
                baseType: 'array'
            });
        } else {
            populate(this, {
                arrayLength: null,
                arrayChildren: null,
                arrayDimension: null,
                baseType: ((this.components == null) ? this.type : 'tuple')
            });
        }

        this._isParamType = true;

        Object.freeze(this);
    }

    // Format the parameter fragment
    //   - sighash: "(uint256,address)"
    //   - minimal: "tuple(uint256,address) indexed"
    //   - full:    "tuple(uint256 foo, address bar) indexed baz"
    format(format?: FormatTypes): string {
        if (!format) {
            format = FormatTypes.Sighash;
        }

        if (format === FormatTypes.Json) {
            const result: any = {
                type: ((this.baseType === 'tuple') ? 'tuple' : this.type),
                name: (this.name || undefined)
            };
            if (typeof (this.indexed) === 'boolean') {
                result.indexed = this.indexed;
            }
            if (this.components) {
                result.components = this.components.map(comp => JSON.parse(comp.format(format)));
            }
            return JSON.stringify(result);
        }

        let result = '';

        // Array
        if (this.baseType === 'array') {
            result += this.arrayChildren.format(format);
            result += `[${ this.arrayLength < 0 ? '' : String(this.arrayLength) }]`;
        } else if (this.baseType === 'tuple') {
            if (format !== FormatTypes.Sighash) {
                result += this.type;
            }
            result += `(${ this.components.map(comp => comp.format(format)).join((format === FormatTypes.Full) ? ', ' : ',') })`;
        } else {
            result += this.type;
        }

        if (format !== FormatTypes.Sighash) {
            if (this.indexed === true) {
                result += ' indexed';
            }
            if (format === FormatTypes.Full && this.name) {
                result += ` ${ this.name }`;
            }
        }

        return result;
    }
}

function parseParams(value: string, allowIndex: boolean): Array<ParamType> {
    return splitNesting(value).map(param => ParamType.fromString(param, allowIndex));
}

type TypeCheck<T> = { -readonly [K in keyof T]: T[K] };

interface _Fragment {
    readonly type: string;
    readonly name: string;
    readonly inputs: ReadonlyArray<ParamType>;
}

export enum FragmentType {
    Function = 'function',
    Event = 'event',
    Constructor = 'constructor',
    Offchain = 'offchain',
    Callback = 'callback',
    Variable = 'variable',
    Fallback = 'fallback',
    Receive = 'receive'
}

export abstract class Fragment implements _Fragment {
    /**
     * Parse fragment from existing Fragment instance, json object, json string or Solidity signatures
     * @param value
     */
    static from(value: Fragment | JsonFragment | string): Fragment {
        if (Fragment.isFragment(value)) {
            return value;
        }

        if (typeof (value) === 'string') {
            const jsonFragment: JsonFragment = safeParseJson(value);
            if (jsonFragment) {
                value = jsonFragment;
            } else {
                return Fragment.fromString(value); // parse signature
            }
        }

        return Fragment.fromObject(value);
    }

    /**
     * Parse fragment from existing Fragment instance or json
     * @param value
     */
    static fromObject(value: Fragment | JsonFragment): Fragment {
        if (Fragment.isFragment(value)) {
            return value;
        }

        switch (value.type) {
        case FragmentType.Function:
        case FragmentType.Callback:
            return FunctionFragment.fromObject(value);
        case FragmentType.Event:
            return EventFragment.fromObject(value);
        case FragmentType.Constructor:
            return ConstructorFragment.fromObject(value);
        case FragmentType.Offchain:
            return OffchainFragment.fromObject(value);
        case FragmentType.Variable:
        case FragmentType.Fallback:
        case FragmentType.Receive:
            return DefaultFragment.fromObject(value);
        }

        throw new Error(`invalid fragment object ${ value }`);
    }

    /**
     * Parse fragment from Solidity ABI string
     * @param value
     */
    static fromString(value: string): Fragment {
        // Make sure the "returns" is surrounded by a space and all whitespace is exactly one space
        value = value.replace(/\s/g, ' ');
        value = value.replace(/\(/g, ' (').replace(/\)/g, ') ').replace(/\s+/g, ' ');
        value = value.trim();

        if (value.split(' ')[0] === FragmentType.Event) {
            return EventFragment.fromString(value.substring(5).trim());
        } else if (value.split(' ')[0] === FragmentType.Function
            || value.split(' ')[0] === FragmentType.Callback) {
            return FunctionFragment.fromString(value.substring(8).trim(), value.split(' ')[0]);
        } else if (value.split('(')[0].trim() === FragmentType.Constructor) {
            return ConstructorFragment.fromString(value.trim());
        } else if (value.split(' ')[0] === FragmentType.Offchain) {
            return OffchainFragment.fromString(value.substring(8).trim());
        } else if (value.split(' ')[0] === 'getter') {
            return OffchainFragment.fromString(value.substring(6).trim());
        } else if (value.split('(')[0].trim() === FragmentType.Receive
            || value.split('(')[0].trim() === FragmentType.Fallback
            || value.split(' ')[0] === FragmentType.Variable) {
            return DefaultFragment.fromString(value.trim());
        }

        throw new Error(`unsupported fragment ${ value }`);
    }

    static isFragment(value: any): value is Fragment {
        return !!(value && value._isFragment);
    }

    readonly type: string;
    readonly name: string;
    readonly inputs: Array<ParamType>;

    readonly _isFragment: boolean;

    constructor(params: any) {
        populate(this, params);

        this._isFragment = true;

        Object.freeze(this);
    }

    abstract format(format?: FormatTypes): string;
}

interface _EventFragment extends _Fragment {
    readonly anonymous: boolean;
}

export class EventFragment extends Fragment implements _EventFragment {
    static from(value: EventFragment | JsonFragment | string): EventFragment {
        if (typeof (value) === 'string') {
            return EventFragment.fromString(value);
        }
        return EventFragment.fromObject(value);
    }

    static fromObject(value: JsonFragment | EventFragment): EventFragment {
        if (EventFragment.isEventFragment(value)) {
            return value;
        }

        if (value.type !== FragmentType.Event) {
            throw new Error(`invalid event object ${ value }`);
        }

        const params: TypeCheck<_EventFragment> = {
            name: verifyIdentifier(value.name),
            anonymous: value.anonymous,
            inputs: (value.inputs ? value.inputs.map(ParamType.fromObject) : []),
            type: FragmentType.Event
        };
        if (params.inputs.filter(item => item.indexed).length > 3) {
            throw new Error(`only up to 3 params can be indexed: ${ params.name }`);
        }

        return new EventFragment(params);
    }

    static fromString(value: string): EventFragment {
        const match = value.match(regexParen);
        if (!match) {
            throw new Error(`invalid event string ${ value }`);
        }

        let anonymous = false;
        match[3].split(' ').forEach(modifier => {
            switch (modifier.trim()) {
            case 'anonymous':
                anonymous = true;
                break;
            case '':
                break;
            default:
                console.warn(`unknown modifier: ${ modifier }`);
            }
        });

        return EventFragment.fromObject({
            name: match[1].trim(),
            anonymous: anonymous,
            inputs: parseParams(match[2], true),
            type: FragmentType.Event
        });
    }

    static isEventFragment(value: any): value is EventFragment {
        return (value && value._isFragment && value.type === FragmentType.Event);
    }

    readonly anonymous: boolean;

    format(format?: FormatTypes): string {
        if (!format) {
            format = FormatTypes.Sighash;
        }

        if (format === FormatTypes.Json) {
            return JSON.stringify({
                type: FragmentType.Event,
                anonymous: this.anonymous,
                name: this.name,
                inputs: this.inputs.map(input => JSON.parse(input.format(format)))
            });
        }

        let result = '';

        if (format !== FormatTypes.Sighash) {
            result += 'event ';
        }

        result += `${ this.name }(${ this.inputs.map(input => input.format(format)).join((format === FormatTypes.Full) ? ', ' : ',') }) `;

        if (format !== FormatTypes.Sighash) {
            if (this.anonymous) {
                result += 'anonymous ';
            }
        }

        return result.trim();
    }
}

function parseModifiers(value: string, params: any): void {
    params.constant = false;
    params.payable = false;
    params.stateMutability = 'nonpayable';

    value.split(' ').forEach(modifier => {
        switch (modifier.trim()) {
        case 'constant':
            params.constant = true;
            break;
        case 'payable':
            params.payable = true;
            params.stateMutability = 'payable';
            break;
        case 'nonpayable':
            params.payable = false;
            params.stateMutability = 'nonpayable';
            break;
        case 'pure':
            params.constant = true;
            params.stateMutability = 'pure';
            break;
        case 'view':
            params.constant = true;
            params.stateMutability = 'view';
            break;
        case 'external':
        case 'public':
        case '':
            break;
        default:
            console.log(`unknown modifier: ${ modifier }`);
        }
    });
}

type StateInputValue = {
    constant?: boolean;
    payable?: boolean;
    stateMutability?: string;
    type?: string;
};

type StateOutputValue = {
    constant: boolean;
    payable: boolean;
    stateMutability: string;
};

function verifyState(value: StateInputValue): StateOutputValue {
    const result: any = {
        constant: false,
        payable: false,
        stateMutability: 'nonpayable'
    };
    if (value.type === FragmentType.Offchain) {
        result.constant = true;
        result.stateMutability = 'view';
    } else if (value.stateMutability != null) {
        result.stateMutability = value.stateMutability;

        // Set (and check things are consistent) the constant property
        result.constant = (result.stateMutability === 'view' || result.stateMutability === 'pure');
        if (value.constant != null) {
            if ((!!value.constant) !== result.constant) {
                throw new Error(`cannot have constant function with mutability ${ result.stateMutability } ${ value }`);
            }
        }

        // Set (and check things are consistent) the payable property
        result.payable = (result.stateMutability === 'payable');
        if (value.payable != null) {
            if ((!!value.payable) !== result.payable) {
                throw new Error(`cannot have payable function with mutability ${ result.stateMutability } ${ value }`);
            }
        }
    } else if (value.payable != null) {
        result.payable = !!value.payable;

        // If payable we can assume non-constant; otherwise we can't assume
        // if (value.constant == null && !result.payable && value.type !== 'constructor') {
        //     throw new Error(`unable to determine stateMutability ${ value }`);
        // }

        result.constant = !!value.constant;

        if (result.constant) {
            result.stateMutability = 'view';
        } else {
            result.stateMutability = (result.payable ? 'payable' : 'nonpayable');
        }

        if (result.payable && result.constant) {
            throw new Error(`cannot have constant payable function ${ value }`);
        }
    } else if (value.constant != null) {
        result.constant = !!value.constant;
        result.payable = !result.constant;
        result.stateMutability = (result.constant ? 'view' : 'payable');
    }

    return result;
}

interface _ConstructorFragment extends _Fragment {
    stateMutability: string;
    payable: boolean;
}

export class ConstructorFragment extends Fragment implements _ConstructorFragment {
    static from(value: ConstructorFragment | JsonFragment | string): ConstructorFragment {
        if (typeof (value) === 'string') {
            return ConstructorFragment.fromString(value);
        }
        return ConstructorFragment.fromObject(value);
    }

    static fromObject(value: ConstructorFragment | JsonFragment): ConstructorFragment {
        if (ConstructorFragment.isConstructorFragment(value)) {
            return value;
        }

        if (value.type !== FragmentType.Constructor) {
            throw new Error(`invalid constructor object ${ value }`);
        }

        const state = verifyState(value);
        if (state.constant) {
            throw new Error(`constructor cannot be constant ${ value }`);
        }

        const params: TypeCheck<_ConstructorFragment> = {
            name: null,
            type: value.type,
            inputs: (value.inputs ? value.inputs.map(ParamType.fromObject) : []),
            payable: state.payable,
            stateMutability: state.stateMutability
        };

        return new ConstructorFragment(params);
    }

    static fromString(value: string): ConstructorFragment {
        const params: any = {type: FragmentType.Constructor};

        const parens = value.match(regexParen);
        if (!parens || parens[1].trim() !== 'constructor') {
            throw new Error(`invalid constructor string ${ value }`);
        }

        params.inputs = parseParams(parens[2].trim(), false);

        parseModifiers(parens[3].trim(), params);

        return ConstructorFragment.fromObject(params);
    }

    static isConstructorFragment(value: any): value is ConstructorFragment {
        return (value && value._isFragment && value.type === FragmentType.Constructor);
    }

    stateMutability: string;
    payable: boolean;

    format(format?: FormatTypes): string {
        if (!format) {
            format = FormatTypes.Sighash;
        }

        if (format === FormatTypes.Json) {
            return JSON.stringify({
                type: FragmentType.Constructor,
                stateMutability: ((this.stateMutability === 'nonpayable') ? undefined : this.stateMutability),
                payable: this.payable,
                inputs: this.inputs.map(input => JSON.parse(input.format(format)))
            });
        }

        if (format === FormatTypes.Sighash) {
            throw new Error('cannot format a constructor for sighash');
        }

        let result = `constructor(${ this.inputs.map(input => input.format(format)).join((format === FormatTypes.Full) ? ', ' : ',') }) `;

        if (this.stateMutability && this.stateMutability !== 'nonpayable') {
            result += `${ this.stateMutability } `;
        }

        return result.trim();
    }
}

export type FunctionLike = FunctionFragment | OffchainFragment;

interface _FunctionFragment extends _Fragment {
    stateMutability: string;
    payable: boolean;
    constant: boolean;
    outputs?: Array<ParamType>;
}

export class FunctionFragment extends Fragment implements _FunctionFragment {
    static from(value: FunctionFragment | JsonFragment | string): FunctionFragment {
        if (typeof (value) === 'string') {
            return FunctionFragment.fromString(value);
        }
        return FunctionFragment.fromObject(value);
    }

    static fromObject(value: FunctionFragment | JsonFragment): FunctionFragment {
        if (FunctionFragment.isFunctionFragment(value)) {
            return value;
        }

        if (value.type !== FragmentType.Function && value.type !== FragmentType.Callback) {
            throw new Error(`invalid function object ${ value }`);
        }

        const state = verifyState(value);

        const params: TypeCheck<_FunctionFragment> = {
            type: value.type,
            name: verifyIdentifier(value.type === FragmentType.Callback ? `${ value.name }Callback` : value.name),
            constant: state.constant,
            inputs: (value.inputs ? value.inputs.map(ParamType.fromObject) : []),
            outputs: (value.outputs ? value.outputs.map(ParamType.fromObject) : []),
            payable: state.payable,
            stateMutability: state.stateMutability
        };

        return new FunctionFragment(params);
    }

    static fromString(value: string, type?: string): FunctionFragment {
        if (!type) {
            type = FragmentType.Function;
        }
        const params: any = {type: type};

        const comps = value.split(' returns ');
        if (comps.length > 2) {
            throw new Error(`invalid function string ${ value }`);
        }

        const parens = comps[0].match(regexParen);
        if (!parens) {
            throw new Error(`invalid function signature ${ value }`);
        }

        params.name = parens[1].trim();
        if (params.name) {
            verifyIdentifier(params.name);
        }

        params.inputs = parseParams(parens[2], false);

        parseModifiers(parens[3].trim(), params);

        // We have outputs
        if (comps.length > 1) {
            const returns = comps[1].match(regexParen);
            if (returns[1].trim() !== '' || returns[3].trim() !== '') {
                throw new Error(`unexpected tokens ${ value }`);
            }
            params.outputs = parseParams(returns[2], false);
        } else {
            params.outputs = [];
        }

        return FunctionFragment.fromObject(params);
    }

    static isFunctionFragment(value: any): value is FunctionFragment {
        return (value && value._isFragment && (value.type === FragmentType.Function || value.type === FragmentType.Callback));
    }

    stateMutability: string;
    payable: boolean;
    constant: boolean;
    outputs?: Array<ParamType>;

    format(format?: FormatTypes): string {
        if (!format) {
            format = FormatTypes.Sighash;
        }

        let _name = this.name;
        if (format !== FormatTypes.Sighash && this.type === FragmentType.Callback) {
            _name = this.name.replace(/Callback$/, '');
        }

        if (format === FormatTypes.Json) {
            return JSON.stringify({
                type: this.type,
                name: _name,
                constant: this.constant,
                stateMutability: ((this.stateMutability === 'nonpayable') ? undefined : this.stateMutability),
                payable: this.payable,
                inputs: this.inputs.map(input => JSON.parse(input.format(format))),
                outputs: this.outputs.map(output => JSON.parse(output.format(format)))
            });
        }

        let result = '';

        if (format !== FormatTypes.Sighash) {
            result += `${ this.type } `;
        }

        result += `${ _name }(${ this.inputs.map(input => input.format(format)).join((format === FormatTypes.Full) ? ', ' : ',') }) `;

        if (format !== FormatTypes.Sighash) {
            if (this.stateMutability) {
                if (this.stateMutability !== 'nonpayable') {
                    result += (`${ this.stateMutability } `);
                }
            } else if (this.constant) {
                result += 'view ';
            }

            if (this.outputs && this.outputs.length) {
                result += `returns (${ this.outputs.map(output => output.format(format)).join(', ') }) `;
            }
        }

        return result.trim();
    }
}

interface _OffchainFragment extends _Fragment {
    outputs?: Array<ParamType>;
}

export class OffchainFragment extends Fragment implements _OffchainFragment {
    static from(value: OffchainFragment | JsonFragment | string): OffchainFragment {
        if (typeof (value) === 'string') {
            return OffchainFragment.fromString(value);
        }
        return OffchainFragment.fromObject(value);
    }

    static fromObject(value: OffchainFragment | JsonFragment): OffchainFragment {
        if (OffchainFragment.isOffchainFragment(value)) {
            return value;
        }

        if (value.type !== FragmentType.Offchain) {
            throw new Error(`invalid offchain object ${ value }`);
        }

        const params: TypeCheck<_OffchainFragment> = {
            type: value.type,
            name: verifyIdentifier(value.name),
            inputs: (value.inputs ? value.inputs.map(ParamType.fromObject) : []),
            outputs: (value.outputs ? value.outputs.map(ParamType.fromObject) : [])
        };

        return new OffchainFragment(params);
    }

    static fromString(value: string): OffchainFragment {
        const functionParams: FunctionFragment = FunctionFragment.fromString(value);
        const params: TypeCheck<_OffchainFragment> = {
            type: FragmentType.Offchain,
            name: functionParams.name,
            inputs: functionParams.inputs,
            outputs: functionParams.outputs
        };

        return new OffchainFragment(params);
    }

    static isOffchainFragment(value: any): value is OffchainFragment {
        return (value && value._isFragment && value.type === FragmentType.Offchain);
    }

    outputs?: Array<ParamType>;

    format(format?: FormatTypes): string {
        if (!format) {
            format = FormatTypes.Sighash;
        }

        if (format === FormatTypes.Json) {
            return JSON.stringify({
                type: FragmentType.Offchain,
                name: this.name,
                inputs: this.inputs.map(input => JSON.parse(input.format(format))),
                outputs: this.outputs.map(output => JSON.parse(output.format(format)))
            });
        }

        let result = '';

        if (format !== FormatTypes.Sighash) {
            result += 'getter ';
        }

        result += `${ this.name }(${ this.inputs.map(input => input.format(format)).join((format === FormatTypes.Full) ? ', ' : ',') }) `;

        if (format !== FormatTypes.Sighash) {
            if (this.outputs && this.outputs.length) {
                result += `returns (${ this.outputs.map(output => output.format(format)).join(', ') }) `;
            }
        }

        return result.trim();
    }
}

interface _DefaultFragment extends _Fragment {
    stateMutability: string;
    payable: boolean;
}

export class DefaultFragment extends Fragment implements _DefaultFragment {
    static from(value: Fragment | JsonFragment | string): Fragment {
        if (typeof (value) === 'string') {
            return DefaultFragment.fromString(value);
        }
        return DefaultFragment.fromObject(value);
    }

    static fromObject(value: Fragment | JsonFragment): Fragment {
        if (Fragment.isFragment(value)) {
            return value;
        }

        if (!Object.values(FragmentType).includes(value.type as FragmentType)) {
            throw new Error(`invalid fragment object ${ value }`);
        }

        const state = verifyState(value);

        const params: TypeCheck<_DefaultFragment> = {
            type: value.type,
            name: value.name ? value.name : undefined,
            inputs: (value.inputs ? value.inputs.map(ParamType.fromObject) : []),
            payable: state.payable,
            stateMutability: state.stateMutability
        };

        return new DefaultFragment(params);
    }

    static fromString(value: string): Fragment {
        const params: any = {};

        const parens = value.match(regexParen);
        const type = parens && parens[1].trim();

        if (!Object.values(FragmentType).includes(type as FragmentType)) {
            throw new Error(`invalid fragment object ${ value }`);
        }

        params.type = type;
        params.inputs = parseParams(parens[2].trim(), false);

        parseModifiers(parens[3].trim(), params);

        return DefaultFragment.fromObject(params);
    }

    stateMutability: string;
    payable: boolean;

    format(format?: FormatTypes): string {
        if (!format) {
            format = FormatTypes.Sighash;
        }

        if (format === FormatTypes.Json) {
            return JSON.stringify({
                type: this.type,
                name: this.name ? this.name : undefined,
                stateMutability: ((this.stateMutability === 'nonpayable') ? undefined : this.stateMutability),
                payable: this.payable,
                inputs: this.inputs.map(input => JSON.parse(input.format(format)))
            });
        }

        let result = '';

        if ([ FragmentType.Receive, FragmentType.Fallback, FragmentType.Constructor ].includes(this.type as FragmentType)) {
            // allow sighash
            result = `${ this.type }(${ this.inputs.map(input => input.format(format)).join((format === FormatTypes.Full) ? ', ' : ',') }) `;
        } else {
            if (format !== FormatTypes.Sighash) {
                result += `${ this.type } `;
            }

            result += `${ this.name }(${ this.inputs.map(input => input.format(format)).join((format === FormatTypes.Full) ? ', ' : ',') }) `;
        }

        if (format !== FormatTypes.Sighash) {
            if (this.stateMutability) {
                if (this.stateMutability !== 'nonpayable') {
                    result += (`${ this.stateMutability } `);
                }
            }
        }

        return result.trim();
    }
}

function verifyType(type: string): string {
    // These need to be transformed to their full description
    if (type.match(/^uint($|[^1-9])/)) {
        type = `uint256${ type.substring(4) }`;
    } else if (type.match(/^int($|[^1-9])/)) {
        type = `int256${ type.substring(3) }`;
    }

    const isArray = /^\w+(\[\d*\])+$/g.test(type);
    const isPrimitive = /^\w+\d*$/g.test(type);
    if (!isArray && !isPrimitive) {
        throw new Error(`illegal type: ${ type }`);
    }

    const _type = type.match(/^[a-zA-Z]+/g);
    const baseType = _type && _type[0];
    if (!baseType || typePrefix.indexOf(baseType) === -1) {
        throw new Error(`illegal type: ${ type }`);
    }

    let _size;
    if (isArray) {
        _size = type.split('[')[0].match(getNum);
    } else {
        _size = type.match(getNum);
    }
    const size = _size ? _size[0] : 0;

    // bytes
    if (baseType === 'bytes' && size && !(size > 0 && size <= 32)) {
        throw new Error(`illegal type: ${ type }. Binary type of M bytes, 0 < M <= 32. Or dynamic sized byte sequence.`);
    }

    // int
    if ((baseType === 'int' || baseType === 'uint') && size && !(size > 0 && size <= 256 && size % 8 === 0)) {
        throw new Error(`illegal type: ${ type }. Unsigned integer type of M bits, 0 < M <= 256, M % 8 == 0. e.g. uint32, uint8, uint256.`);
    }

    return type;
}

const typePrefix = [ 'uint', 'int', 'address', 'bool', 'bytes', 'string', 'tokenId', 'gid', 'tuple' ];
const getNum = new RegExp(/(\d+)/g);
const regexIdentifier = new RegExp('^[a-zA-Z$_][a-zA-Z0-9$_]*$');

function verifyIdentifier(value: string): string {
    if (!value || !value.match(regexIdentifier)) {
        throw new Error(`invalid identifier: ${ value }`);
    }
    return value;
}

const regexParen = new RegExp('^([^)(]*)\\((.*)\\)([^)(]*)$');

function splitNesting(value: string): Array<any> {
    value = value.trim();

    const result = [];
    let accum = '';
    let depth = 0;
    for (let offset = 0; offset < value.length; offset++) {
        const c = value[offset];
        if (c === ',' && depth === 0) {
            result.push(accum);
            accum = '';
        } else {
            accum += c;
            if (c === '(') {
                depth++;
            } else if (c === ')') {
                depth--;
                if (depth === -1) {
                    throw new Error(`unbalanced parenthesis ${ value }`);
                }
            }
        }
    }
    if (accum) {
        result.push(accum);
    }

    return result;
}
