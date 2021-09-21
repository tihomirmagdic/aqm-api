"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const Joi = __importStar(require("@hapi/joi"));
exports.shTypeCreate = Joi.string().required().valid("full", "id", "fast");
exports.shTypeUpdate = Joi.string().required().valid("full", "fast");
exports.shTypeUpdate2 = Joi.string().required().valid("full", "id", "fast");
exports.shNumber = Joi.number().required();
// generics
exports.shID = Joi.object().keys({
    id: Joi.number()
});
exports.shText = Joi.object().keys({
    id: Joi.string()
});
exports.shDefaultIDs = Joi.object().keys({
    ids: Joi.array().items(exports.shID).required()
});
exports.shDefaultIDsAsText = Joi.object().keys({
    ids: Joi.array().items(exports.shText).required()
});
// create
exports.shDefaultTypeCreate = Joi.object().keys({
    type: exports.shTypeCreate
});
// update
exports.shDefaultTypeUpdate = Joi.object().keys({
    type: exports.shTypeUpdate
});
exports.shDefaultTypeUpdate2 = Joi.object().keys({
    type: exports.shTypeUpdate2
});
//# sourceMappingURL=default-schemas.js.map