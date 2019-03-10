let Configurable = new Chart(1, {
    configurable: true,
    autosize: true,

    chart_data: [
        100, 90, 120, 130, 180, 170, 100, 120, 204, 125, 77, 182, 69, 97, 139, 160, 89, 60, 68, 222, 135, 52, 217, 147, 74, 202, 42, 232, 175, 224, 244, 220, 148, 133, 60, 109, 190],
    chart_breakpoints: [
        "2019-02-02", "2019-02-03", "2019-02-04", "2019-02-05", "2019-02-06", "2019-02-07", "2019-02-08", "2019-02-09", "2019-02-10", "2019-02-11", "2019-02-12", "2019-02-13", "2019-02-14", "2019-02-15", "2019-02-16", "2019-02-17", "2019-02-18", "2019-02-19", "2019-02-20", "2019-02-21", "2019-02-22", "2019-02-23", "2019-02-24", "2019-02-25", "2019-02-26", "2019-02-27", "2019-02-28", "2019-03-01", "2019-03-02", "2019-03-03", "2019-03-04", "2019-03-05", "2019-03-06", "2019-03-07", "2019-03-08", "2019-03-09", "2019-03-10"]
    ,

    chart_wrapper_selector: '.chart-wrapper',
    data_table_id: 'timeflow-chart-data-input-tbody',

    canvas_selector: '#chart-canvas',
    preview_canvas_selector: '#chart-preview-canvas',

    canvas_width: 400,
    canvas_height: 400,
    padding_left: 0,
});

let Preview = new Chart(1, {
    autosize: true,
    canvas_selector: '#chart-preview-canvas',

    chart_data: Configurable.config.chart_data,
    chart_breakpoints: Configurable.config.chart_breakpoints,

    canvas_width: 400,
    canvas_height: 60,
    padding_left: 0,

    // point_dist: 10,
});

if (typeof User_config !== "undefined") {
    Configurable.config = Object.assign(Configurable.config, User_config);
    Preview.config = Object.assign(Preview.config, User_config);
} else {
    // config = Object.assign(Configurable.config, Default_config);
}

Configurable.fill();
Preview.fill();

let Configurable_fields = {

    show_since_steps_ago: {
        // input_selector: 'timeflow-axis',
        update_horizontal_axis: true,
        update_chart: true,
    },

    default_data: {
        input_selector: "#default-data-num-input",
        update_horizontal_axis: true,
        update_chart: true,
    },

    chart_type: {
        input_type: 'select',
        val: 'id',
        input_selector: '#chart-type-id',
        update_chart: true,
    },

    // vertical axis parameters
    vertical_axis_value_step: {
        update_chart: true,
    },

    vertical_axis_labels_step: {
        update_vertical_axis: true,
    },

    // horizontal axis parameters
    horizontal_axis_type: {
        input_selector: 'input[name="horizontal_axis_type"]',
        update_horizontal_axis: true,
        update_chart: true,
    },

    timeflow_step: {
        update_horizontal_axis: true,
        update_chart: true,
    },

    timeflow_measure: {
        input_type: 'select',
        val: 'id',
        input_selector: '#timeflow-measure-id',
        update_horizontal_axis: true,
        update_chart: true,
    },
    timeflow_axis_labels_step: {
        input_selector: '#timeflow-labels-step',
        update_horizontal_axis: true,
    },
    timeflow_axis_labels_measure: {
        input_type: 'select',
        val: 'id',
        input_selector: '#timeflow-labels-measure-id',
        update_horizontal_axis: true,
    },

    // ----- style -----

    chart_sizing: {
        input_type: 'slider',
        min: 2,
        max: 200,
        update_vertical_axis: true,
        update_chart: true,
    },
    point_dist: {
        input_type: 'slider',
        min: 2,
        max: 300,
        update_horizontal_axis: true,
        update_chart: true,
    },
    line_width: {
        input_type: 'slider',
        min: 1,
        max: 10,
        update_chart: true,
    },
    shadow_colour: {
        update_chart: true,
    },
    shadow_blur: {
        min: 0,
        max: 20,
    },
    shadow_offset_x: {
        min: 0,
        max: 20,
    },
    shadow_offset_y: {
        min: 0,
        max: 20,
    },

    // axises & labels
    vertical_axis_show_ticks: {
        update_vertical_axis: true,
    },
    vertical_axis_show_line: {
        update_vertical_axis: true,
    },
    horizontal_axis_show_ticks: {
        update_horizontal_axis: true,
    },
    horizontal_axis_show_line: {
        update_horizontal_axis: true,
    },
    grid_colour: {
        update_chart: true,
    },

    // points
    draw_points: {
        input_selector: '#show-breakpoints',
        update_chart: true,
    },
    point_radius: {
        input_type: 'slider',
        min: 1,
        max: 10,
    },
    point_border_colour: {
        update_chart: true,
    },
    point_fill_colour: {
        update_chart: true,
    },

    // bar chart
    bar_width: {
        input_type: 'slider',
        min: 1,
        max: 100,
        update_chart: true,
    },
    bar_border_radius: {
        input_type: 'slider',
        min: 0,
        depends: {
            attr: 'max',
            prop: 'bar_width',
            koef: 0.5,
        },
        update_chart: true,
    },

    // curve chart
    smoothing: {
        input_type: 'slider',
        min: 1,
        depends: {
            attr: 'max',
            prop: 'point_dist',
            koef: 0.5,
        },
        update_chart: true,
    },

    // colours
    line_colour: {
        update_chart: true,
    },
    fill_colour: {
        update_chart: true,
    },
};