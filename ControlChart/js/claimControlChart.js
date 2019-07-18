let xData = [];
let yData = [];
let xViolation = [];
let yViolation = [];
let dateAndTimeArray = [];
let timeArray = [];
let dataSize;
let mean;
let UCL;
let LCL;
let maxView;
let minView;

$(() => {
    $graphDiv = $("#controlGraphDiv");

    let date = new Date();

    let dateString = date.toDateString();
    console.log(dateString);

    let localDateString = date.toLocaleDateString();
    console.log(localDateString);

    let localTimeString = date.toLocaleTimeString();
    console.log(localTimeString);

    console.log(xData);
    console.log(yData);

    getYData();
    addViolation();
    dataSize = (yData.length - 1);
    setTimeStampArray();
    getXData();
    getControlMean(yData);
    calcUpperAndLowerLimits();
    findViolationData(yData);
    minView = Math.min(...yData) - 300;
    maxView = Math.max(...yData) + 300;


    var mainData = {
        type: 'scatter',
        x: xData,
        y: yData,
        text: dateAndTimeArray,
        mode: 'lines+markers',
        name: 'Preformance (ms)',
        showlegend: true,
        hoverinfo: 'text',
        hoverlabel: {
            bgcolor: '#595959'
        },
        line: {
            color: '#1a8cff',
            width: 2
        },
        marker: {
            color: '#1a8cff',
            size: 7,
            symbol: 'circle'
        }
    }

    var violationData = {
        type: 'scatter',
        x: xViolation,
        y: yViolation,
        mode: 'markers',
        name: 'Violation',
        showlegend: true,
        hoverinfo: 'none',
        marker: {
            color: 'rgb(255,65,54)',
            // line: { width: 3 },
            // opacity: 0.5,
            size: 9,
            symbol: 'circle'
        }
    }

    var controlLimitData = {
        type: 'scatter',
        x: [(dataSize * -2), (dataSize * 2), null, (dataSize * -2), (dataSize * 2)],
        y: [parseFloat(LCL), parseFloat(LCL), null, parseFloat(UCL), parseFloat(UCL)],
        mode: 'lines',
        name: 'LCL/UCL',
        text: 'LCL: ' + LCL.toFixed(2) + '\n\nUCL: ' + UCL.toFixed(2) ,
        showlegend: true,
        hoverinfo: 'text',
        line: {
            color: 'red',
            width: 2,
            dash: 'dash'
        }
    }

    var centralLineData = {
        type: 'scatter',
        x: [(dataSize * -2), (dataSize * 2)],
        y: [parseFloat(mean), parseFloat(mean)],
        mode: 'lines',
        name: 'Mean',
        showlegend: true,
        hoverinfo: 'name',
        line: {
            color: 'grey',
            width: 2
        }
    }


    tickStart = timeArray[0];
    tickEnd = timeArray[timeArray.length - 1];

    var layout = {
        title: 'Claim Control Chart',
        xaxis: {
            range: [(dataSize / 2 - .5), (dataSize + 3)],
            title: {
                font: {
                    size: 18,
                    color: '#7f7f7f'
                }
            },
            showgrid: true,
            zeroline: true,
            showline: true,
            mirror: 'ticks',
            gridcolor: '#bdbdbd',
            gridwidth: 1,
            zerolinecolor: '#969696',
            zerolinewidth: 4,
            linecolor: '#636363',
            showticklabels: false
        },
        yaxis: {
            range: [minView, maxView],
            zeroline: false,
            title: {
                text: 'Preformance (ms)',
                font: {
                    size: 18,
                    color: '#7f7f7f'
                }
            }
        }
    }

    var allGraphData = [mainData, violationData, controlLimitData, centralLineData]

    Plotly.plot('controlGraphDiv', allGraphData, layout);

});

function getXData() {
    for (i = 0; i <= dataSize; i++) {
        xData.push(i);
    }
}

function getYData() {
    for (i = 0; i <= 144; i++) {
        yData[i] = parseFloat(((Math.random() * 123) + 4000).toFixed(2));
    }
}

function findViolationData(data) {
    for (i = 0; i < data.length; i++) {
        if (data[i] <= parseFloat(LCL) || data[i] >= parseFloat(UCL)) {
            xViolation.push(i);
            yViolation.push(data[i]);
        }
    }

}

function setTimeStampArray() {
    let date = new Date();
    for (i = 0; i <= 144; i++) {
        if (i !== 0) {
            // mocking different time stamps
            date.setMinutes(date.getMinutes() + 5);
            date.setSeconds(date.getSeconds() + 13);
        }
        timeArray.push(date.toLocaleTimeString());
        dateAndTimeArray.push("Time: " + yData[i] + "\n\nDate: " + date.toLocaleDateString() + " " + date.toLocaleTimeString());
    }
}

function getControlMean(data) {
    let totalAmount = 0;
    data.forEach(function(data) {
        totalAmount += parseFloat(data);
    });
    mean = (totalAmount / data.length).toFixed(2);
}

//Calculation based on C Chart equations
function calcUpperAndLowerLimits() {
    let x = parseFloat(mean);
    UCL = (x + (3 * (Math.sqrt(x))));
    LCL = (x - (3 * (Math.sqrt(x))));
}

function addViolation() {
    let maxValue = Math.max(...yData);
    yData[124] = parseFloat(maxValue + 200);
    yData[125] = parseFloat(maxValue + 220);
    yData[126] = parseFloat(maxValue + 195);
}

