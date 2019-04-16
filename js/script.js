let theme_switcher = new ThemeSwitcher();

// --- loading JSON file ---

function loadJSON(callback) {
    let xobj = new XMLHttpRequest();
    xobj.overrideMimeType("application/json");
    xobj.open('GET', 'js/CHART_DATA.json', true);
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

                config.data.charts.push(chart);
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
        theme_switcher.chart_containers.push(new ChartContainer(chart_container_input_selector, config));
    }
});