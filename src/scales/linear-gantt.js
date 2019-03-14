'use strict';

import {Utils} from "../core/utils";

export function LinearGanttScale(Chart) {

    const helpers = Chart.helpers;

    const scaleOptions = Chart.scaleService.getScaleDefaults('linear');

    const scale = Chart.scaleService.getScaleConstructor('linear').extend({
        getRightValue: function (rawValue) {
            if (Utils.isRange(rawValue))
                return Utils.getMiddle(rawValue);
            return this.__proto__.__proto__.getRightValue.call(this, rawValue);
        },

        determineDataLimits: function () {
            const self = this;
            const chart = this.chart;
            const defaults = Chart.defaults.gantt;
            const isHorizontal = this.isHorizontal();

            function IDMatches(meta) {
                return isHorizontal ? meta.xAxisID === self.id : meta.yAxisID === self.id;
            }

            this.min = null;
            this.max = null;

            helpers.each(chart.data.datasets, function (dataset, datasetIndex) {
                const meta = chart.getDatasetMeta(datasetIndex);
                if (chart.isDatasetVisible(datasetIndex) && IDMatches(meta)) {
                    const size = (isHorizontal) ?
                        Utils.convertSize(self, helpers.valueOrDefault(dataset.width, defaults.width)) :
                        Utils.convertSize(self, helpers.valueOrDefault(dataset.height, defaults.height));

                    helpers.each(dataset.data, function (rawValue, index) {
                        if (meta.data[index].hidden) {
                            return;
                        }

                        const value = Utils.extendValue(Utils.getValue(rawValue, self), size);

                        if (typeof value !== "object" && isNaN(value))
                            return;

                        Utils.normalize(value);

                        if (self.min === null || self.min > value.from)
                            self.min = value.from;

                        if (self.max === null || self.max < value.to)
                            self.max = value.to;
                    });
                }
            });

            this.handleTickRangeOptions();
        },

        getLabelForIndex: function (index, datasetIndex) {
            const data = this.chart.data.datasets[datasetIndex].data[index];
            const val = (this.isHorizontal()) ? data.x : data.y;
            if (Utils.isRange(val))
                return val.from + "~" + val.to
            return val;
        }

    });
    Chart.scaleService.registerScaleType('linear-gantt', scale, scaleOptions);

}
