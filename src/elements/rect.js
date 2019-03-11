"use strict";

import {Chart} from "chart.js"

const Rect = Chart.Element.extend() {
    draw: function () {
        const me = this;
        const vm = me._view;
        const ctx = me._chart.ctx;
        const spanGaps = vm.spanGaps;
        const points = me._children.slice(); // clone array
        const globalOptionLineElements = globalDefaults.elements.line;
        const lastDrawnIndex = -1;
        const index, current, previous, currentVM;

        // If we are looping, adding the first point again
        if (me._loop && points.length) {
            points.push(points[0]);
        }

        ctx.save();

        // Stroke Line Options
        ctx.lineCap = vm.borderCapStyle || globalOptionLineElements.borderCapStyle;

        // IE 9 and 10 do not support line dash
        if (ctx.setLineDash) {
            ctx.setLineDash(vm.borderDash || globalOptionLineElements.borderDash);
        }

        ctx.lineDashOffset = vm.borderDashOffset || globalOptionLineElements.borderDashOffset;
        ctx.lineJoin = vm.borderJoinStyle || globalOptionLineElements.borderJoinStyle;
        ctx.lineWidth = vm.borderWidth || globalOptionLineElements.borderWidth;
        ctx.strokeStyle = vm.borderColor || globalDefaults.defaultColor;

        // Stroke Line
        ctx.beginPath();
        lastDrawnIndex = -1;

        for (index = 0; index < points.length; ++index) {
            current = points[index];
            previous = helpers.previousItem(points, index);
            currentVM = current._view;

            // First point moves to it's starting position no matter what
            if (index === 0) {
                if (!currentVM.skip) {
                    ctx.moveTo(currentVM.x, currentVM.y);
                    lastDrawnIndex = index;
                }
            } else {
                previous = lastDrawnIndex === -1 ? previous : points[lastDrawnIndex];

                if (!currentVM.skip) {
                    if ((lastDrawnIndex !== (index - 1) && !spanGaps) || lastDrawnIndex === -1) {
                        // There was a gap and this is the first point after the gap
                        ctx.moveTo(currentVM.x, currentVM.y);
                    } else {
                        // Line to next point
                        helpers.canvas.lineTo(ctx, previous._view, current._view);
                    }
                    lastDrawnIndex = index;
                }
            }
        }

        ctx.stroke();
        ctx.restore();
    }

});