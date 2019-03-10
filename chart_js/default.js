let Default_config = {
    chart_name: "My super chart",
    chart_type: 'line_chart',
    chart_data: [0, 5, 3, 9, 6, 2, 9, 4, 0],
    chart_breakpoints: [],
    default_data: 0,
    show_since_steps_ago: 9,

    // vertical axis parameters
    vertical_axis_value_step: 1,
    vertical_axis_labels_step: 50,

    // horizontal axis parameters
    horizontal_axis_type: 'timeflow',

    timeflow_step: 1,
    timeflow_measure: 'day',
    timeflow_axis_labels_step: 2,
    timeflow_axis_labels_measure: 'day',

    /* ====================
        Style parameters
    ===================== */

    chart_sizing: 30,
    point_dist: 60,
    line_width: 2,

    //shadow
    shadow_colour: 'rgba(0, 0, 0, 0)',
    shadow_blur: 7,
    shadow_offset_x: 0,
    shadow_offset_y: 0,

    // axises & labels
    vertical_axis_show_ticks: false,
    vertical_axis_show_line: false,
    horizontal_axis_show_ticks: false,
    horizontal_axis_show_line: true,

    grid_colour: '#f2f4f5',
    grid_accent_colour: '#dfe6eb',

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
    background_color: 'white',
    line_colour: '#3cc23f',
    fill_colour: 'rgba(0, 0, 0, 0)',
};