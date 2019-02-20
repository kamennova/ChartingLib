let Configurable = new Chart(1, {
    configurable: true,

    chart_name: "My super chart",

    // default data array
    chart_data: [0, 5, 3, 9, 6, 2, 9, 4, 0],
    data_table_id: 'timeflow-chart-data-input-tbody',

    chart_wrapper_selector: '.chart-wrapper',

    // default values
    chart_type: 'curve_chart',
    chart_type_input_selector: 'chart-type-id',

    // vertical axis parameters
    // ??? measure_value_step: document.getElementById('measure-value-step').value,
    vertical_axis_value_step: 1,
    vertical_axis_value_step_input_selector: 'vertical-axis-value-step',

    vertical_axis_labels_step: 3,
    vertical_axis_labels_step_input_selector: 'vertical-axis-labels-step',

    // horizontal axis parameters
    horizontal_axis_type: 'timeflow',

    timeflow_step: 1,
    timeflow_measure: 'day',

    timeflow_axis_labels_step: 1,
    timeflow_axis_labels_step_input_selector: 'timeflow-labels-step',

    timeflow_axis_labels_measure: 'day',
    timeflow_axis_labels_measure_input_id: 'timeflow-labels-measure-id',

    // timeflow_step_input: document.getElementById()
    timeflow_start_point: document.getElementById('timeflow-start-point').value,

    inputs_to_monitor: ['vertical-axis-labels-step', 'timeflow-start-point', 'timeflow-labels-measure-id', 'timeflow-labels-step'],

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
});