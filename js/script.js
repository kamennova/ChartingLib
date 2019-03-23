let theme_switcher = new ThemeSwitcher();

// --- loading JSON file ---

function loadJSON(callback) {
    let xobj = new XMLHttpRequest();
    xobj.overrideMimeType("application/json");
    xobj.open('GET', 'chart_js/CHART_DATA.json', true);
    xobj.onreadystatechange = function () {
        if (xobj.readyState == 4 && xobj.status == "200") {
            callback(xobj.responseText);
        }
    };
    xobj.send(null);
}

loadJSON(function (response) {
    let charts_data = JSON.parse(response);

    for (let i = 0; i < charts_data.length; i++) {
        let config = {};
        config.data = {};
        config.data.charts = [];
        config.data.timeflow = [];

        for (const key in charts_data[i].types) {
            if (charts_data[i].types[key] === 'line') {
                let chart = {};
                chart.chart_name = charts_data[i].names[key];
                chart.line_colour = charts_data[i].colors[key];

                let data_col_index = 0;

                for (let c = 0; c < charts_data[i].columns.length; c++) {
                    if (charts_data[i].columns[c][0] === key) {
                        data_col_index = c;
                        break;
                    }
                }

                charts_data[i].columns[data_col_index].shift();
                chart.chart_data = charts_data[i].columns[data_col_index];

                config.data.charts.push(chart); // todo push all??
            } else {
                let data_col_index = 0;
                for (let c = 0; c < charts_data[i].columns.length; c++) {
                    if (charts_data[i].columns[c][0] === key) {
                        data_col_index = c;
                        break;
                    }
                }

                charts_data[i].columns[data_col_index].shift();
                config.data.timeflow = charts_data[i].columns[data_col_index];
            }
        }

        let chart_container_input_selector = '.chart-container-wrapper-' + (i + 1);
        // new ChartContainer(chart_container_input_selector, config);
        theme_switcher.chart_containers.push(new ChartContainer(chart_container_input_selector, config)); // todo ???
    }
});

/*let chart_container3 = new ChartContainer('.chart-container-wrapper-4', {
        name: 'Followers',
        canvas_width: 400,
        canvas_height: 400,

        /*timeflow_labels_date_func: (element) => {
            let full_date = new Date(element * 1000);
            return full_date.toLocaleDateString('en-US', {month: 'short', })
        },*/

/*point_modal_date_func: (element) => {
    let full_date = new Date(element * 1000);
    return full_date.toLocaleDateString('en-US', {month: 'short', })
},*/

/*        data: {
            timeflow: [1542412800000, 1542499200000, 1542585600000, 1542672000000, 1542758400000, 1542844800000,
                1542931200000, 1543017600000, 1543104000000, 1543190400000, 1543276800000, 1543363200000, 1543449600000,
                1543536000000, 1543622400000, 1543708800000, 1543795200000, 1543881600000, 1543968000000, 1544054400000,
                1544140800000, 1544227200000, 1544313600000, 1544400000000, 1544486400000, 1544572800000, 1544659200000,
                1544745600000, 1544832000000, 1544918400000, 1545004800000, 1545091200000, 1545177600000, 1545264000000,
                1545350400000, 1545436800000, 1545523200000,
            ],
            charts: [
                {
                    chart_name: 'Joined',
                    line_colour: '#3cc23f',

                    chart_data: [
                        100, 90, 120, 130, 180, 170, 100, 120, 204, 125, 77, 182, 69, 97, 139, 160, 89, 60, 68, 222, 135,
                        52, 217, 147, 74, 202, 42, 232, 175, 224, 244, 220, 148, 133, 60, 109, 190],
                },
                {
                    chart_name: 'Left',
                    line_colour: '#f34c44',

                    chart_data: [
                        78, 103, 40, 105, 68, 105, 43, 69, 56, 52, 91, 41, 89, 109, 61, 86, 118, 117, 73, 82, 95, 116, 109,
                        51, 86, 55, 66, 118, 61, 88, 117, 84, 95, 88, 57, 84, 69
                    ],
                }
            ]
        }
    },
);*/