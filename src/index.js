"use strict";

import {Chart} from "chart.js"

import {GanttController} from './controllers/gantt';
import {LinearGanttScale} from './scales/linear-gantt'

GanttController(Chart);
LinearGanttScale(Chart);