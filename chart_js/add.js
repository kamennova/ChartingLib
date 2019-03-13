function charts_init() {
    document.getElementsByClassName('chart-canvas-wrapper')[0].style.height = Configurable.config.canvas_height + 'px';

    // prepare axises
    let vertical_axis = document.getElementsByClassName('vertical-axis-labels-container')[0];
    let horizontal_axis = document.getElementsByClassName('horizontal-axis-labels-container')[0];

    vertical_axis.style.height = Configurable.config.canvas_height + 'px';
    vertical_axis.style.borderColor = Configurable.config.grid_colour;
    horizontal_axis.style.width = Configurable.config.canvas_width + 'px';
    horizontal_axis.style.borderColor = Configurable.config.grid_colour;

    preview_box_init();

    // Configurable.autosize();
    Configurable.draw_chart();
    Configurable.display_timeflow_axis();
    Configurable.display_vertical_axis();
    Configurable.show_point_details();

    // Preview.autosize();
    Preview.draw_chart(false, true);
}

// charts_init();

if (document.body.classList.contains('theme-bright')) {
    // theming
}


// loading JSON file
/*
 loadJSON(function(response) {
    // Parse JSON string into object
    let actual_JSON = JSON.parse(response);
    console.log(actual_JSON);

    for(let i =1; i< 5; i++){
        let unix_timestamp = actual_JSON[0]["columns"][0][i];
        console.log(unix_timestamp);
        console.log(new Date(unix_timestamp*1000));
    }
}); */

// -----

let chart_container = new Chart_container('.chart-container-wrapper-2', {
        name: 'Followers',
        canvas_width: 400,
        canvas_height: 400,

        vertical_axis_labels_step: 50,
    },
    [1542412800000, 1542499200000, 1542585600000, 1542672000000, 1542758400000, 1542844800000,
        1542931200000, 1543017600000, 1543104000000, 1543190400000, 1543276800000, 1543363200000, 1543449600000,
        1543536000000, 1543622400000, 1543708800000, 1543795200000, 1543881600000, 1543968000000, 1544054400000,
        1544140800000, 1544227200000, 1544313600000, 1544400000000, 1544486400000, 1544572800000, 1544659200000,
        1544745600000, 1544832000000, 1544918400000, 1545004800000, 1545091200000, 1545177600000, 1545264000000,
        1545350400000, 1545436800000, 1545523200000, 1545609600000,
    ],
    [
        {
            chart_name: 'Joined',
            chart_data: [
                100, 90, 120, 130, 180, 170, 100, 120, 204, 125, 77, 182, 69, 97, 139, 160, 89, 60, 68, 222, 135, 52, 217, 147, 74, 202, 42, 232, 175, 224, 244, 220, 148, 133, 60, 109, 190],
            line_colour: '#3cc23f',
        },
        {
            chart_name: 'Left',
            line_colour: '#f34c44',

            chart_data: [
                78, 103, 40, 105, 68, 105, 43, 69, 56, 52, 91, 41, 89, 109, 61, 86, 118, 117, 73, 82, 95, 116, 109, 51, 86, 55, 66, 118, 61, 88, 117, 84, 95, 88, 57, 84, 69],
        }
    ],
);

