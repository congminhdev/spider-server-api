"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const options = {
    id: true,
    _id: true,
    minimize: false,
    versionKey: false,
    strict: true,
    validateBeforeSave: true,
    timestamps: true,
    toObject: {
        virtuals: true,
        transform: function (doc, ret) {
            delete ret._id;
        }
    },
    toJSON: {
        virtuals: true,
        transform: function (doc, ret) {
            delete ret.__v;
            delete ret._id;
        }
    }
};
exports.options = options;
function validateMinLength(value, len) {
    return value.length >= len;
}
exports.validateMinLength = validateMinLength;
function validateMaxLength(value, len) {
    return value.length <= len;
}
exports.validateMaxLength = validateMaxLength;
//# sourceMappingURL=root.schema.js.map