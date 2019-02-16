document.getElementsByClassName('vertical-axis-labels-container')[0].style.height = Configurable.config.canvas_height + 'px';
document.getElementsByClassName('chart-canvas-wrapper')[0].style.height = Configurable.config.canvas_height + 'px';

hide(category_axis_fields);

prepare_default_chart_data();

Configurable.display_timeflow_axis();
Configurable.display_vertical_axis();
Configurable.draw_chart();

monitor_measure_value();