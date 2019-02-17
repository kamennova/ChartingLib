document.getElementsByClassName('chart-canvas-wrapper')[0].style.height = Configurable.config.canvas_height + 'px';

// prepare axises

document.getElementsByClassName('vertical-axis-labels-container')[0].style.height = Configurable.config.canvas_height + 'px';

if(!Configurable.config.vertical_axis_show_line){
    document.getElementById('vertical-axis-labels-container').classList.add('no-line');
}

if(!Configurable.config.vertical_axis_show_ticks){
    document.getElementById('vertical-axis-labels-container').classList.add('no-ticks');
}

if(!Configurable.config.horizontal_axis_show_line){
    document.getElementById('timeflow-axis-labels-container').classList.add('no-line');
}

if(!Configurable.config.horizontal_axis_show_ticks){
    document.getElementById('timeflow-axis-labels-container').classList.add('no-ticks');
}

// prepare form fields
hide(category_axis_fields);

prepare_default_chart_data();

Configurable.display_timeflow_axis();
Configurable.display_vertical_axis();
Configurable.draw_chart();

monitor_measure_value();