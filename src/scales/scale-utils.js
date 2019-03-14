'use strict';

import {Utils} from "../core/utils";

const helpers = Chart.helpers;

export const ScaleUtils = {
    getRightValue: function (scale, rawValue) {
        if (Utils.isRange(rawValue))
            return Utils.getMiddle(rawValue);
        return scale.__proto__.__proto__.getRightValue.call(scale, rawValue);
    },

    determineDataLimits: function (scale) {
        const chart = scale.chart;
        const defaults = Chart.defaults.gantt;
        const isHorizontal = scale.isHorizontal();

        function IDMatches(meta) {
            return isHorizontal ? meta.xAxisID === scale.id : meta.yAxisID === scale.id;
        }

        scale.min = null;
        scale.max = null;

        helpers.each(chart.data.datasets, function (dataset, datasetIndex) {
            const meta = chart.getDatasetMeta(datasetIndex);
            if (chart.isDatasetVisible(datasetIndex) && IDMatches(meta)) {
                const size = (isHorizontal) ?
                    Utils.convertSize(scale, helpers.valueOrDefault(dataset.width, defaults.width)) :
                    Utils.convertSize(scale, helpers.valueOrDefault(dataset.height, defaults.height));

                helpers.each(dataset.data, function (rawValue, index) {
                    if (meta.data[index].hidden) {
                        return;
                    }

                    const value = Utils.extendValue(Utils.getValue(rawValue, scale), size);

                    if (typeof value !== "object" && isNaN(value))
                        return;

                    Utils.normalize(value);

                    if (scale.min === null || scale.min > value.from)
                        scale.min = value.from;

                    if (scale.max === null || scale.max < value.to)
                        scale.max = value.to;
                });
            }
        });
    },

    getLabelForIndex: function (scale, index, datasetIndex) {
        const data = scale.chart.data.datasets[datasetIndex].data[index];
        const val = (scale.isHorizontal()) ? data.x : data.y;
        if (Utils.isRange(val))
            return val.from + "~" + val.to
        return val;
    },

    extendScale: function (Chart, base, newName, scaleClass) {
        const service = Chart.scaleService;
        const options = service.getScaleDefaults(base);
        service.registerScaleType(newName, scaleClass, options);
    }
};


