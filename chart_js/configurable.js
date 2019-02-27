let Configurable = new Chart(1, {
    configurable: true,

    chart_name: "My super chart",

    // default data array
    chart_data: [0, 5, 3, 9, 6, 2, 9, 4, 0],
    show_breakpoints: 7,
    data_table_id: 'timeflow-chart-data-input-tbody',

    chart_wrapper_selector: '.chart-wrapper',

    // default values
    chart_type: 'curve_chart',
    chart_type_input_selector: 'chart-type-id',

    // vertical axis parameters
    // ??? measure_value_step: document.getElementById('measure-value-step').value,
    vertical_axis_value_step: 1,
    vertical_axis_value_step_input_selector: '#vertical-axis-value-step',

    vertical_axis_labels_step: 3,
    vertical_axis_labels_step_input_selector: '#vertical-axis-labels-step',

    // horizontal axis parameters
    horizontal_axis_type: 'timeflow',

    timeflow_step: 1,
    timeflow_measure: 'day',

    timeflow_axis_labels_step: 1,
    timeflow_axis_labels_step_input_selector: '#timeflow-labels-step',

    timeflow_axis_labels_measure: 'day',
    timeflow_axis_labels_measure_input_selector: '#timeflow-labels-measure-id',

    // timeflow_step_input: document.getElementById()
    timeflow_start_point: 9,

    /* ====================
        Style parameters
    ===================== */

    canvas_selector: '#chart-canvas',
    canvas_width: 1400,
    canvas_height: 400,
    padding_left: 30,

    chart_sizing: 30,
    point_dist: 60,
    line_width: 2,
    shadow_colour: 'rgba(0, 0, 0, 0)',
    shadow_blur: 7,
    shadow_offset_x: 0,
    shadow_offset_y: 0,

    // axises & labels
    vertical_axis_show_ticks: false,
    vertical_axis_show_line: false,
    horizontal_axis_show_ticks: false,
    horizontal_axis_show_line: true,
    grid_colour: '#e0e0e0',

    draw_points: true,
    point_radius: 3,
    point_border_colour: '#4158D0',
    point_fill_colour: '#4158D0',

    // bar chart
    bar_width: 44,
    bar_border_radius: 5,

    // curve chart
    smoothing: 2,

    // colours
    line_colour: '#4158D0',
    fill_colour: 'rgba(0, 0, 0, 0)',

    // ---------

    inputs_to_monitor: ['vertical_axis_labels_step', 'vertical_axis_value_step',
        'timeflow_step', 'timeflow_axis_labels_measure', 'timeflow_axis_labels_step', 'timeflow_measure',
        'timeflow_start_point',
        'chart_sizing',
        'point_dist', 'line_width', 'shadow_colour', 'shadow_blur', 'shadow_offset_x', 'shadow_offset_y', 'vertical_axis_show_ticks',
        'vertical_axis_show_line', 'horizontal_axis_show_ticks', 'horizontal_axis_show_line', 'grid_colour', 'draw_points',
        'point_radius', 'point_border_colour', 'point_fill_colour', 'bar_width', 'bar_border_radius', 'smoothing', 'line_colour',
        'fill_colour'
    ],
});

let Configurable_fields = {

    show_breakpoints: {
        // input_selector:
        update_horizontal_axis: true,
        update_chart: true,
    },

    timeflow_start_point: {
        update_horizontal_axis: true,
        update_chart: true,
    },

    // default values
    chart_type: {
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
        update_horizontal_axis: true,
        update_chart: true,
    },

    timeflow_step: {
        update_horizontal_axis: true,
        update_chart: true,
    },

    timeflow_measure: {
        update_horizontal_axis: true,
        update_chart: true,
    },
    timeflow_axis_labels_step: {
        update_horizontal_axis: true,
    },
    timeflow_axis_labels_measure: {
        update_horizontal_axis: true,
    },

    // ----- style -----

    chart_sizing: {
        min: 2,
        max: 200,
        update_vertical_axis: true,
        update_chart: true,
    },
    point_dist: {
        min: 2,
        max: 300,
        update_horizontal_axis: true,
        update_chart: true,
    },
    line_width: {
        min: 1,
        max: 20,
    },
    shadow_colour: {},
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
    grid_colour: {},

    // points
    draw_points: {},
    point_radius: {
        min: 1,
        max: 10,
    },
    point_border_colour: {},
    point_fill_colour: {},

    // bar chart
    bar_width: {
        min: 1,
        max: 100,
    },
    bar_border_radius: {
        min: 0,
        max: this.bar_width / 2,
    },

    // curve chart
    smoothing: {
        min: 1,
        max: this.point_dist / 2,
    },

    // colours
    line_colour: {},
    fill_colour: {},
};