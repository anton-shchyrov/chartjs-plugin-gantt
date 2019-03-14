"use strict";

import {Rect} from "../elements/rect";
import {Utils} from "../core/utils";

const defaults = Chart.defaults;

defaults.gantt = {
    height: 5,
    width: 5,
    scales: {
        xAxes: [{
            id: 'x-axis-1',
            type: 'linear-gantt',
            position: 'bottom'
        }],
        yAxes: [{
            id: 'y-axis-1',
            type: 'linear-gantt',
            position: 'left'
        }]
    },
    tooltips: {
        callbacks: {
            title: function() {
                return '';
            },
            label: function(item) {
                return '(' + item.xLabel + ', ' + item.yLabel + ')';
            }
        }
    }
};

defaults.global.elements.gantt = {
    borderWidth: 1,
    borderColor: defaults.global.defaultColor,
    backgroundColor: defaults.global.defaultColor,
};

export function GanttController(Chart) {
    Chart.controllers.gantt = Chart.DatasetController.extend({
        dataElementType: Rect,

        _prepareData: function (data, dataset) {
            return {
                x: Utils.extendValue(data.x, dataset._width),
                y: Utils.extendValue(data.y, dataset._height),
            }
        },

        _calcBounds: function (scale, scaleValue, index, datasetIndex) {
            const from = scale.getPixelForValue(scaleValue.from, index, datasetIndex);
            const to = scale.getPixelForValue(scaleValue.to, index, datasetIndex);
            const res = {
                from: from,
                to: to,
            };
            Utils.normalize(res);
            res.size = res.to - res.from;
            return res;
        },

        update: function (reset) {
            const meta = this.getMeta();
            const dataset = this.getDataset();
            const xScale = this.getScaleForId(meta.xAxisID);
            const yScale = this.getScaleForId(meta.yAxisID);
            dataset._width = Utils.convertSize(xScale, Chart.helpers.valueOrDefault(dataset.width, defaults.gantt.width));
            dataset._height = Utils.convertSize(yScale, Chart.helpers.valueOrDefault(dataset.height, defaults.gantt.height));

            const globalOptionGantt = defaults.global.elements.gantt;

            dataset._view = {
                borderWidth: this.borderWidth || globalOptionGantt.borderWidth,
                borderColor: this.borderColor || globalOptionGantt.borderColor,
                backgroundColor: this.backgroundColor || globalOptionGantt.backgroundColor,
            };

            const data = meta.data || [];
            for (let i = 0; i < data.length; i++)
                this.updateElement(data[i], i, reset);
        },

        updateElement: function (point, index, reset) {
            const meta = this.getMeta();
            const dataset = this.getDataset();
            const datasetIndex = this.index;
            const xScale = this.getScaleForId(meta.xAxisID);
            const yScale = this.getScaleForId(meta.yAxisID);
            const vm = dataset._view;
            const value = dataset.data[index];

            // Utility
            point._xScale = xScale;
            point._yScale = yScale;
            point._datasetIndex = datasetIndex;
            point._index = index;

            const fullPoint = this._prepareData(value, dataset);

            point._model = {
                rect: {
                    x: this._calcBounds(xScale, fullPoint.x, index, datasetIndex),
                    y: this._calcBounds(yScale, fullPoint.y, index, datasetIndex),
                },
                borderWidth: value.borderWidth || vm.borderWidth,
                borderColor: value.borderColor || vm.borderColor,
                backgroundColor: value.backgroundColor || vm.backgroundColor,
            };
            point._model.x = Utils.getMiddle(point._model.rect.x);
            point._model.y = Utils.getMiddle(point._model.rect.y);
            point.pivot();
        }
    });
}