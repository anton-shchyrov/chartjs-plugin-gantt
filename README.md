# Gantt plugin
plugin for draw gantt series in [Chart.js](https://www.chartjs.org/) library

## Sample chart

![](pic/main.png)

## Features

+ Setting color, border color, border width for:
  + all elements,
  + dataset,
  + some elements of dataset
  
  ![](pic/styles.png)
  
+ Setting height/width elements

![](pic/sizes.png)

+ Supports time scale 

![](pic/time.png)

## Install

```
npm install chartjs-plugin-gantt --save
```
 
## Usage

### Basic

```javascript
const chart = new Chart("chart", {
    type: "gantt",
    data: {
        datasets: [{
            label: "Gantt series",
            data: [
                {x: {from: 0, to: 8}, y: 0},
                {x: {from: 10, to: 18}, y: 5},
                {x: {from: 20, to: 28}, y: 10},
            ]
        }]
    },
});
```