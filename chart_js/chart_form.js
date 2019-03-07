/*==========================
     Displaying form
==========================*/

let pie_chart_fields = document.getElementById('pie-chart-fields');
let plane_chart_fields = document.getElementById('plane-chart-fields');
let chart_type_input = document.querySelector(Configurable_fields.chart_type.input_selector);

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

function fill_default(param) {
    // let param_input = get_param_input();
    // param_input.value(Configurable.config[param]);
}

// function get_param_input(param) {
//     let param_selector,
//         param_input;
//
//     if (Configurable.config[param + '_input_selector'] !== undefined) {
//         param_selector = Configurable.config[param + '_input_selector'];
//         param_input = document.querySelector(param_selector);
//     } else {
//         param_selector = param.replace(/_| /g, '-');
//         param_input = document.getElementById(param_selector);
//
//         if (!param_input) {
//             param_selector += '-input';
//             param_input = document.getElementById(param_selector);
//         }
//     }
//
//     return param_input;
// }

function get_param_input(param) {
    let param_selector,
        param_input;

    if (Configurable_fields[param].hasOwnProperty('input_selector')) {
        param_selector = Configurable_fields[param]['input_selector'];
        param_input = document.querySelector(param_selector);
    } else {
        param_selector = param.replace(/_| /g, '-');
        param_input = document.getElementById(param_selector);

        if (!param_input) {
            param_selector += '-input';
            param_input = document.getElementById(param_selector);
        }
    }

    return param_input;
}

for (const key in Configurable_fields) {
    let value = Configurable_fields[key];
    if (Configurable_fields.hasOwnProperty(key)) {
        let input = get_param_input(key);

        if (input) {
            // setting input default value, min, max
            if (value.input_type === 'select') {
                if (value.val === 'id') {
                    let val_id = document.getElementById(Configurable.config[key]);
                    if(val_id){
                        input.value = val_id.value;
                    }
                }
            } else {
                input.value = Configurable.config[key];
            }

            let depends = value.hasOwnProperty('depends');

            if (value.input_type === 'slider') {
                let slider_input = $(input).prev(".form-field-slider");

                $(slider_input).slider({
                    min: value.min || 0,
                    max: value.max || 10,
                    value: Configurable.config[key],

                    slide: function Total(event, ui) {
                        $(input).val(ui.value).trigger('change');
                        update_values(key, input);
                    }
                });

                if (depends) {
                    // console.log(key);

                    $(slider_input).slider('option', value.depends.attr, Configurable.config[value.depends.prop] * value.depends.koef);

                    let dep_input = get_param_input(value.depends.prop);

                    if (Configurable_fields[value.depends.prop].input_type === 'slider') {
                        $(dep_input).change(function () {
                            let old_span = $(slider_input).slider('option', 'max') - $(slider_input).slider('option', 'min');
                            let old_value = $(slider_input).slider('option', 'value');
                            let percentage = old_value / old_span;

                            $(slider_input).slider('option', value.depends.attr, Configurable.config[value.depends.prop] * value.depends.koef);

                            let new_span = $(slider_input).slider('option', 'max') - $(slider_input).slider('option', 'min');
                            let new_value = new_span * percentage;

                            if(key === 'smoothing'){
                                // console.log(value);
                            }

                            if(new_value < value.min){
                                new_value = Number(value.min);
                            } else if(new_value > value.max){
                                new_value = value.max;
                            }

                            // TODO: Infinity bug
                            /*console.log(new_span);
                            console.log(percentage);
                            console.log(new_value);
                            console.log('----');*/

                            Configurable.config[key] = new_value;

                            $(slider_input).slider('option', 'value', new_value);
                        });
                    } else {
                        dep_input.addEventListener('change', function () {
                            $(slider_input).slider('option', value.depends.attr, Configurable.config[value.depends.prop] * value.depends.koef);
                        });
                    }
                }

            } else {
                if (value.hasOwnProperty('min')) {
                    input.min = value.min;
                }

                if (value.hasOwnProperty('max')) {
                    input.max = value.max;
                }

                if (depends) {
                    input[value.depends.attr] = Configurable.config[value.depends.prop] * value.depends.koef;

                    let dep_input = get_param_input(value.depends.prop);
                    dep_input.addEventListener('change', function () {
                        input[value.depends.attr] = Configurable.config[value.depends.prop] * value.depends.koef;
                    })
                }
            }

            // listening to input change
            input.addEventListener('change', () => {
                update_values(key, input)
            });
        }
    }
}

function update_values(key, input) {
    Configurable.config[key] = Number(input.value);

    // TODO: destroy_old_labels call 2 times ???
    if (Configurable_fields[key].hasOwnProperty('update_horizontal_axis')) {
        destroy_old_labels('horizontal');
        Configurable.display_timeflow_axis();
    }

    if (Configurable_fields[key].hasOwnProperty('update_vertical_axis')) {
        destroy_old_labels('vertical');
        Configurable.display_vertical_axis();
    }

    if (Configurable_fields[key].hasOwnProperty('update_chart')) {
        Configurable.draw_chart();
    }
}

function update_slider_attr() {
// TODO: ????
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
/*
document.getElementById('bar-width-input').addEventListener('change', function () {
    Configurable.config.bar_width = Number(this.value);
    set_bar_border_radius();
    Configurable.draw_chart();
});
*/
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

/*

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
*/