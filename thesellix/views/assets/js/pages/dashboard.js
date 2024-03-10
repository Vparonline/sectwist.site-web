$(document).ready(function () {
    var options3 = {
        chart: {
            height: 269,
            type: 'bar',
            toolbar: {
                show: false
            }
        },
        plotOptions: {
            bar: {
                horizontal: false,
                columnWidth: '55%',
                endingShape: 'rounded',
                borderRadius: 10
            },
        },
        dataLabels: {
            enabled: false
        },
        stroke: {
            show: true,
            width: 2,
            colors: ['transparent']
        },
        series: [{
            name: 'Net Profit',
            data: [44, 55, 57, 56, 61, 58, 63, 60, 66]
        }, {
            name: 'Revenue',
            data: [76, 85, 101, 98, 87, 105, 91, 114, 94]
        }, {
            name: 'Free Cash Flow',
            data: [35, 41, 36, 26, 45, 48, 52, 53, 41]
        }],
        xaxis: {
            categories: ['Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'],
            labels: {
                style: {
                    colors: '#9a9cab'
                }
            }
        },
        yaxis: {
            title: {
                text: '$ (thousands)',
                style: {
                    color: '#9a9cab'
                }
            },
            labels: {
                style: {
                    colors: '#9a9cab'
                }
            }
        },
        fill: {
            opacity: 1

        },
        tooltip: {
            y: {
                formatter: function (val) {
                    return "$ " + val + " thousands"
                }
            }
        },
        grid: {
            borderColor: '#9a9cab',
            strokeDashArray: 4
        },
        legend: {
            labels: {
                colors: ['#9a9cab']
            }
        }
    }

    var chart3 = new ApexCharts(
        document.querySelector("#apex3"),
        options3
    );

    chart3.render();
    var DrawSparkline = function() {
        $('#sparkline1').sparkline([0, 23, 43, 35, 44, 45, 56, 37, 40], {
            type: 'line',
            width: '100%',
            height: '165',
            chartRangeMax: 50,
            lineColor: '#83D8AE',
            fillColor: 'rgba(131, 216, 174)',
            highlightLineColor: 'rgba(0,0,0,.1)',
            highlightSpotColor: 'rgba(0,0,0,.2)',
        });
    
        $('#sparkline1').sparkline([25, 23, 26, 24, 25, 32, 30, 24, 19], {
            type: 'line',
            width: '100%',
            height: '165',
            chartRangeMax: 40,
            lineColor: '#86C1ED',
            fillColor: 'rgba(250, 210, 146)',
            composite: true,
            highlightLineColor: 'rgba(0,0,0,.1)',
            highlightSpotColor: 'rgba(0,0,0,.2)',
        });
    
        $('#sparkline2').sparkline([3, 6, 7, 8, 6, 4, 7, 10, 12, 7, 4, 9, 12, 13, 11, 12], {
            type: 'bar',
            height: '165',
            barWidth: '10',
            barSpacing: '3',
            barColor: '#ADA6F2'
        });
        
        $('#sparkline3').sparkline([20, 40, 30, 10], {
            type: 'pie',
            width: '165',
            height: '165',
            sliceColors: ['#ADA6F2', '#86C1ED', '#83D8AE', '#FAD292']
        });    
    };

    DrawSparkline();


    var resizeChart;

    $(window).resize(function(e) {
        clearTimeout(resizeChart);
        resizeChart = setTimeout(function() {
            DrawSparkline();
        }, 300);
    });
});