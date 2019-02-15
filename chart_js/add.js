document.getElementsByClassName('vertical-axis-labels-container')[0].style.height = Configurable.config.canvas_height + 'px';
document.getElementsByClassName('chart-canvas-wrapper')[0].style.height = Configurable.config.canvas_height + 'px';

Configurable.display_timeflow_axis();
Configurable.display_vertical_axis();
Configurable.draw_chart();