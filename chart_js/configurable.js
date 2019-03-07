let Configurable = new Chart(1, {
    configurable: true,
    autosize: true,

    chart_wrapper_selector: '.chart-wrapper',
    data_table_id: 'timeflow-chart-data-input-tbody',

    canvas_selector: '#chart-canvas',

    canvas_width: 1050,
    canvas_height: 400,
    padding_left: 30,
});

Configurable.config = Object.assign(Configurable.config, Chart_vals);

let Configurable_fields = {

    show_since_steps_ago: {
        // input_selector: 'timeflow-axis',
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