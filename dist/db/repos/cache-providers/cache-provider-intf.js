"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function hashCode(str) {
    let hash = 0, i = 0;
    const len = str.length;
    while (i < len) {
        /* tslint:disable:no-bitwise */
        hash = ((hash << 5) - hash + str.charCodeAt(i++)) << 0;
        /* tslint:enable:no-bitwise */
    }
    return hash;
}
exports.hashCode = hashCode;
;
//# sourceMappingURL=cache-provider-intf.js.map