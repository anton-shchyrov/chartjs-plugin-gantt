"use strict";

import {Chart} from "chart.js"

import {GanttController} from './controllers/gantt';
import {LinearGanttScale} from './scales/linear-gantt'
import {TimeGanttScale} from "./scales/time-gantt";

GanttController(Chart);
LinearGanttScale(Chart);
TimeGanttScale(Chart);