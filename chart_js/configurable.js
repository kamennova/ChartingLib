
let Configurable = new Chart(document.getElementById(this.canvas_id), {
    configurable: true,

    // default data array
    chart_data: [2, 5, 3, 9, 6, 2, 9],

    data_table_id: 'timeflow-chart-data-input-tbody',

    // default values
    chart_type: 'curve_chart',
    chart_type_input_selector: 'chart-type-id',

    // vertical axis parameters
    // ??? measure_value_step: document.getElementById('measure-value-step').value,
    measure_value_step: 1,
    measure_value_step_input_selector: 'measure-value-step',

    vertical_axis_labels_step: 2,
    vertical_axis_labels_step_input_selector: 'vertical-axis-labels-step',

    // horizontal axis parameters
    horizontal_axis_type: 'timeflow',

    timeflow_step: 1,
    timeflow_measure: 'day',

    timeflow_axis_labels_step: 1,
    timeflow_axis_labels_step_input_selector: 'timeflow-axis-labels-step',

    timeflow_axis_labels_measure: 'day',
    timeflow_axis_labels_measure_input_id: 'timeflow-axis-labels-measure-id',

    // timeflow_step_input: document.getElementById()
    timeflow_start_point: document.getElementById('timeflow-start-point').value,

    // chart display parameters
    canvas_selector: 'chart-canvas',
    canvas_width: 1400,
    canvas_height: 400,
    padding_left: 30,

    chart_sizing: 30,
    point_dist: 60,
    line_width: 2,

    // bar chart
    bar_width: 44,
    bar_border_radius: 5,

    // curve chart
    smoothing: 2,

    // colours
    line_colour: '#4158D0',
    fill_colour: '#e2e6f9',

    inputs_to_monitor: ['vertical-axis-labels-step', 'timeflow-start-point', 'timeflow-axis-labels-measure-id', 'timeflow-axis-labels-step']
});