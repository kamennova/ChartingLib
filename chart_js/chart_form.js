
/*==========================
     Displaying form
==========================*/

let pie_chart_fields = document.getElementById('pie-chart-fields');
let plane_chart_fields = document.getElementById('plane-chart-fields');
let chart_type_input = document.getElementById(Config.chart_type_input_selector);

// default chart type is 'plane'
hide(pie_chart_fields);

// displaying chart fields according to the chart type selected
chart_type_input.onchange = function () {
    let selected_chart_type_id = Config.chart_type_input[Config.chart_type_input.selectedIndex].id;
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

hide(category_axis_fields);

function bind_type_change(selected) {
    return function () {
        Config.horizontal_axis_type = 'timeflow';
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
if (Config.horizontal_axis_type === 'timeflow') {
    let timeflow_measure_select = document.getElementById('timeflow_measure_id');

    // let timeflow_measure_display = document.getElementById('timeflow-measure-display');
    // timeflow_measure_display.innerText = Config.timeflow_measure;

    // timeflow_measure_select.onchange = function () {
    //     Config.timeflow_measure = timeflow_measure_select[timeflow_measure_select.selectedIndex].id;
    //     timeflow_measure_display.innerText = Config.timeflow_measure;
    // }
}


function monitor_measure_value(input_id) {
    let value_input = document.getElementById('measure-value-step');
    value_input.addEventListener('change', function () {
        Config.measure_value_step = value_input.value;

        let data_rows_count = document.querySelectorAll('#' + Config.data_table_id + ' tr').length;

        for (let i = 0; i < data_rows_count; i++) {
            if (Config.chart_data[i] < Config.measure_value_step) {
                Config.chart_data[i] = Config.measure_value_step;
                document.getElementById('timeflow-chart-value[' + i + ']').value = Config.measure_value_step;
            } else if ((Config.chart_data[i] % Config.measure_value_step) !== 0) {
                Config.chart_data[i] = parseInt(Config.chart_data[i]);
                Config.chart_data[i] += parseInt(Config.measure_value_step - Config.chart_data[i] % Config.measure_value_step);
                document.getElementById('timeflow-chart-value[' + i + ']').value = Config.chart_data[i];
            }
        }
    })
}

monitor_measure_value();

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

function monitor_input_field(param) {
    let param_input = document.getElementById(param);
    let param_name = param.replace(/-/g, '_').replace(/ /g, '_');
    let second_level_parent = get_parent_by_level(param_input, 2);

    let axis_type = '';

    // TODO: replace timeflow -> horizontal
    if (second_level_parent.className && second_level_parent.className.includes('-axis-fields')) {
        // param_axis_type = second_level_parent.className;
        axis_type = second_level_parent.className.includes('timeflow') ? 'timeflow' : 'vertical';

    } else if (second_level_parent.parentNode.className && second_level_parent.parentNode.className.includes('-axis-fields')) {
        // param_axis_type = second_level_parent.parentNode.className
        axis_type = second_level_parent.parentNode.className.includes('timeflow') ? 'timeflow' : 'vertical';
    }

    param_input.addEventListener('change', function () {
        Config[param_name] = param_input.value;
        if (destroy_old_labels(axis_type)) {
            if (axis_type === 'timeflow') {
                display_timeflow_axis()
            } else {
                display_vertical_axis();
            }
        }
    });
}

for (let i = 0; i < Config.inputs_to_monitor.length; i++) {
    monitor_input_field(Config.inputs_to_monitor[i]);
}

chart_type_input.addEventListener('change', function () {
    Config.chart_type = Config.chart_type_input[Config.chart_type_input.selectedIndex].id;
    draw_chart();
});


/*
* 1) getting default value(max/min value) for config Obj: form / js default
* 2) global vars reducing amount of search requests for elem
* 3) get parent?? производительность
* 4) object not getting input value ??? dynamic properties
* 5) object array length???
* 6) row count.length inside ()
* 7) переопределение , напр. line to
* 8) chart drawing 2 times??
* 9) line chart as curve chart with k?????
* 10) caching non-dynamic functions
* */