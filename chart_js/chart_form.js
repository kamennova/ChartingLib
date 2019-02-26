/*==========================
     Displaying form
==========================*/

let pie_chart_fields = document.getElementById('pie-chart-fields');
let plane_chart_fields = document.getElementById('plane-chart-fields');
let chart_type_input = document.getElementById(Configurable.config.chart_type_input_selector);

// default chart type is 'plane'
hide(pie_chart_fields);

let bar_chart_fields = document.getElementsByClassName('bar-chart-fields');
for (let a = 0; a < bar_chart_fields.length; a++) {
    hide(bar_chart_fields[a]);
}

// displaying chart fields according to the chart type selected
chart_type_input.onchange = function () {
    // let chart_type_input = document.getElementById(Configurable.config.chart_type_input_selector);
    let selected_chart_type_id = chart_type_input[chart_type_input.selectedIndex].id;
    if (selected_chart_type_id === 'pie_chart') {
        show(pie_chart_fields);
        hide(plane_chart_fields);
    } else {
        hide(pie_chart_fields);
        show(plane_chart_fields)
    }
};

// displaying horizontal axis fieldsets depending on axis type: 'timeflow' (default) or 'category'
let horizontal_axis_types = document.getElementsByName('horizontal_axis_type'); // array of axis type
let category_axis_fields = document.getElementById('category_axis_options_fields');
let timeflow_axis_fields = document.getElementById('timeflow_axis_options_fields');

function bind_type_change(selected) {
    return function () {
        Configurable.config.horizontal_axis_type = 'timeflow';
        if (selected === 'timeflow') {
            show(timeflow_axis_fields);
            hide(category_axis_fields);
        } else {
            show(category_axis_fields);
            hide(timeflow_axis_fields);
        }
    };
}

for (let i = 0; i < horizontal_axis_types.length; i++) {
    horizontal_axis_types[i].addEventListener("change", bind_type_change(horizontal_axis_types[i].value));
}

// displaying timeflow fields according to options chosen
if (Configurable.config.horizontal_axis_type === 'timeflow') {
    let timeflow_measure_select = document.getElementById('timeflow_measure_id');

    // let timeflow_measure_display = document.getElementById('timeflow-measure-display');
    // timeflow_measure_display.innerText = Configurable.config.timeflow_measure;

    // timeflow_measure_select.onchange = function () {
    //     Configurable.config.timeflow_measure = timeflow_measure_select[timeflow_measure_select.selectedIndex].id;
    //     timeflow_measure_display.innerText = Configurable.config.timeflow_measure;
    // }
}

function monitor_measure_value(input_id) {
    let value_input = document.getElementById('vertical-axis-value-step');
    value_input.addEventListener('change', function () {
        Configurable.config.vertical_axis_value_step = value_input.value;

        let data_rows_count = document.querySelectorAll('#' + Configurable.config.data_table_id + ' tr').length;

        for (let i = 0; i < data_rows_count; i++) {
            if (Configurable.config.chart_data[i] < Configurable.config.vertical_axis_value_step) {
                Configurable.config.chart_data[i] = Configurable.config.vertical_axis_value_step;
                document.getElementById('timeflow-chart-value[' + i + ']').value = Configurable.config.vertical_axis_value_step;
            } else if ((Configurable.config.chart_data[i] % Configurable.config.vertical_axis_value_step) !== 0) {
                Configurable.config.chart_data[i] = parseInt(Configurable.config.chart_data[i]);
                Configurable.config.chart_data[i] += parseInt(Configurable.config.vertical_axis_value_step - Configurable.config.chart_data[i] % Configurable.config.vertical_axis_value_step);
                document.getElementById('timeflow-chart-value[' + i + ']').value = Configurable.config.chart_data[i];
            }
        }
    })
}

/* ============================================
   Updating chart, the axises and gridlines
============================================ */

// destroying old labels, if they exist
function destroy_old_labels(axis_type) {
    let old_labels = document.getElementsByClassName(axis_type + '-axis-label');

    if (old_labels) {
        let old_labels_count = old_labels.length;

        for (let i = 0; i < old_labels_count; i++) {
            if (!old_labels[0].parentNode.removeChild(old_labels[0])) return false;
        }
    }

    return true;
}


// ----

function monitor_input_field(param) {
    let param_name = param;
    let param_selector = param.replace(/_/g, '-').replace(/ /g, '-');

    if (typeof Configurable.config[param_selector + '_input_selector'] !== undefined) {
        param_selector = param_selector + '_input_selector';
    } else if(document.getElementById(param)) {
        let param_selector = '#' + param_name;
    }

    let param_input = document.querySelector(param_selector);
    let second_level_parent = get_parent_by_level(param_input, 2);

    let axis_type = '';

    if (param_name.includes('timeflow') || param_name.includes('category')) {
        axis_type = 'horizontal';
    } else if (param_name.includes('vertical_axis')) {
        axis_type = 'vertical';
    } else {

        // TODO: replace timeflow -> horizontal
        let grandparent_class;
        if (grandparent_class = second_level_parent.className && grandparent_class.includes('-axis-fields')) {
            if (grandparent_class.includes('timeflow') || grandparent_class.includes('category')) {
                axis_type = 'horizontal';
            } else {
                axis_type = 'vertical';
            }
        } else if (second_level_parent.parentNode.className && second_level_parent.parentNode.className.includes('-axis-fields')) {
            // param_axis_type = second_level_parent.parentNode.className
            axis_type = second_level_parent.parentNode.className.includes('timeflow') ? 'horizontal' : 'vertical';
        }
    }

    param_input.addEventListener('change', function () {
        Configurable.config[param_name] = param_input.value;
        if (destroy_old_labels(axis_type)) {
            if (axis_type === 'horizontal') {
                Configurable.display_timeflow_axis()
            } else {
                Configurable.display_vertical_axis();
            }
        }

        if (param_name === 'timeflow_start_point' || param_name === 'vertical_axis_labels_step' || param_name === 'vertical_axis_value_step') {
            Configurable.draw_chart();
        }
    });
}

for (let i = 0; i < Configurable.config.inputs_to_monitor.length; i++) {
    monitor_input_field(Configurable.config.inputs_to_monitor[i]);
}


// ----

chart_type_input.addEventListener('change', function () {
    // hiding previous chart type fields
    let fields_to_hide_classname = (Configurable.config.chart_type + '_fields').replace(/_/g, '-').replace(/ /, '-');
    let fields_to_hide = document.getElementsByClassName(fields_to_hide_classname);

    for (let a = 0; a < fields_to_hide.length; a++) {
        hide(fields_to_hide[a]);
    }

    Configurable.config.chart_type = this[this.selectedIndex].id;

    // showing new chart type fields
    let fields_to_show_classname = (Configurable.config.chart_type + '_fields').replace(/_/g, '-').replace(/ /, '-');
    let fields_to_show = document.getElementsByClassName(fields_to_show_classname);

    for (let a = 0; a < fields_to_show.length; a++) {
        show(fields_to_show[a]);
    }

    Configurable.draw_chart();
});


// colorpicker
$.minicolors.defaults = $.extend($.minicolors.defaults, {
    defaultValue: '#4158D0',
    // control: 'wheel',
    animationSpeed: 200,
    // changeDelay: 200,
    theme: 'bootstrap',
    format: 'rgb',
    opacity: true,
});

$('#line-colour-input.minicolors-input').minicolors({
    change: function (value, opacity) {
        Configurable.config.line_colour = value;
        Configurable.draw_chart();
    }
});

$('#fill-colour-input.minicolors-input').minicolors({
    change: function (value, opacity) {
        Configurable.config.fill_colour = value;
        Configurable.draw_chart();
    }
});

// Style onchange

document.getElementById('bar-width-input').addEventListener('change', function () {
    Configurable.config.bar_width = Number(this.value);
    set_bar_border_radius();
    Configurable.draw_chart();
});

// let points_dist_input = document.getElementById('points-dist-input');
// points_dist_input.addEventListener('change', update_points_dist(points_dist_input));


// ----

let bar_border_radius_input = document.getElementById('bar-border-radius-input');
set_bar_border_radius();

function set_bar_border_radius() {
    let max_radius = Math.floor(Configurable.config.bar_width / 2);

    if (Configurable.config.bar_border_radius > max_radius) {
        bar_border_radius_input.value = max_radius;
        Configurable.config.bar_border_radius = max_radius;
    }

    bar_border_radius_input.max = max_radius;
}

bar_border_radius_input.addEventListener('change', function () {
    Configurable.config.bar_border_radius = Number(this.value);
    Configurable.draw_chart();
});

document.getElementById('line-width-input').addEventListener('change', function () {
    Configurable.config.line_width = Number(this.value);
    Configurable.draw_chart();
});

document.getElementById('smoothing-input').addEventListener('change', function () {
    Configurable.config.smoothing = Number(this.value);
    Configurable.draw_chart();
});

// ----

let timeflow_measure_span = document.getElementsByClassName('timeflow-measure')[0];
timeflow_measure_span.insertAdjacentText("afterbegin", Configurable.config.timeflow_measure);
// TODO: event listener change timeflow_measure