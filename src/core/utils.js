"use strict";

export const Utils = {
    _parseInterval: function (value) {
        if (typeof value === "number")
            return value;
        if (typeof value === "string") {
            const parsed = value.trim().toLowerCase().split(/\s*(\d+)\s*/);
            let cur = "ms";
            const obj = {};
            for (let i = parsed.length - 1; i > 0; i--) {
                const num = parseFloat(parsed[i])
                if (isFinite(num))
                    obj[cur] = num;
                else
                    cur = parsed[i]
            }
            value = obj;
        }
        const coefs = {
            ms: 1,
            s: 1000,
            m: 1000 * 60,
            h: 1000 * 60 * 60,
            d: 1000 * 60 * 60 * 24
        };
        let res = 0;
        for (let key in value) {
            if (coefs[key])
                res += value[key] * coefs[key];
        }
        return res;
    },

    isRange: function(value) {
        return typeof value.from !== "undefined" && typeof value.to !== "undefined";
    },

    getValue: function (rawValue, scale) {
        if (typeof rawValue === 'string')
            return +rawValue;

        // Null and undefined values first
        if (typeof rawValue === "undefined" || rawValue === null)
            return NaN;
        // isNaN(object) returns true, so make sure NaN is checking for a number; Discard Infinite values
        if (typeof rawValue === 'number' && !isFinite(rawValue)) {
            return NaN;
        }
        // If it is in fact an object, dive in one more level
        if (rawValue) {
            const nested = (scale.isHorizontal()) ? rawValue.x : rawValue.y;
            if (nested !== undefined)
                return this.getValue(nested, scale);
        }

        // Value is good, return it
        return rawValue;
    },

    _incMilliseconds: function(date, addend) {
        const res = new Date(date);
        res.setMilliseconds(res.getMilliseconds() + addend);
        return res;
    },

    extendValue: function (value, defSize) {
        if (this.isRange(value))
            return value;
        if (!isFinite(value))
            return NaN;

        const delta = defSize / 2;
        if (value instanceof Date) {
            return {
                from: this._incMilliseconds(value, -delta),
                to: this._incMilliseconds(value, delta),
            };
        }
        return {
            from: value - delta,
            to: value + delta,
        }
    },

    isTimeScale: function(scale) {
        return scale.isTime || scale.type === "time";
    },

    convertSize: function (scale, size) {
        return (this.isTimeScale(scale)) ? this._parseInterval(size) : size;
    },

    normalize: function (value) {
        if (value.from > value.to) {
            const tmp = value.from;
            value.from = value.to;
            value.to = tmp;
        }
        return value;
    },

    getMiddle: function(value) {
        return (value.from + value.to) / 2;
    }
};