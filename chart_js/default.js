let Default_config = {
    chart_name: "My super chart",
    chart_type: 'curve_chart',
    chart_data: [0, 5, 3, 9, 6, 2, 9, 4, 0],
    chart_breakpoints: [],
    show_since_steps_ago: 9,

    // vertical axis parameters
    vertical_axis_value_step: 1,
    vertical_axis_labels_step: 3,

    // horizontal axis parameters
    horizontal_axis_type: 'timeflow',

    timeflow_step: 1,
    timeflow_measure: 'day',
    timeflow_axis_labels_step: 1,
    timeflow_axis_labels_measure: 'day',

    /* ====================
        Style parameters
    ===================== */

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
    grid_colour: '#eef0f4',

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
};