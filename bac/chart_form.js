const hide = function (elem) {
    elem.classList.add('hidden');
};

const show = function (elem) {
    elem.classList.remove('hidden');
};

const toggle = function (elem) {
    elem.classList.toggle('hidden');
};

const array_bind_event = function (array, event_name, event_func) {
    let array_length = array.length;
    for (let i = 0; i < array_length; i++) {
        array[i].addEventListener(event_name, event_func);
    }
};

const short_month_names = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];

function ok() {
    alert('ok');
}

function get_parent_by_level(elem, level) {
    let parent = elem;
    for (let i = 1; i <= level; i++) {
        parent = parent.parentNode;
    }
    return parent;
}

function remove_element(elementId) {
    let element = document.getElementById(elementId);
    element.parentNode.removeChild(element);
}

function get_random_int(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
}

// Day object to yyyy-MM-dd format
function format_date(date) {
    let year = date.getFullYear();

    let month = date.getMonth();
    if (++month < 10) month = '0' + month;
    let day = date.getDate();
    if (date < 10) day = '0' + day;

    return year + '-' + month + '-' + day;
}

/*==========================
       Chart model
==========================*/


let Config = {

    chart_data: [2, 5, 3, 9, 6, 2, 9],
    data_table_id: 'timeflow-chart-data-input-tbody',

    // default values
    chart_type: 'curve_chart',
    chart_type_input: document.getElementById('chart-type-id'),

    // vertical axis parameters
    measure_value_step_input_id: 'measure-value-step',
    measure_value_step: document.getElementById('measure-value-step').value,
    vertical_axis_labels_step_input_id: 'vertical-axis-labels-step',
    vertical_axis_labels_step: document.getElementById('vertical-axis-labels-step').value,

    // horizontal axis parameters
    horizontal_axis_type: 'timeflow',

    timeflow_axis_labels_step_input_id: 'timeflow-axis-labels-step',
    timeflow_axis_labels_step: 1,

    timeflow_axis_labels_measure: 'day',
    timeflow_axis_labels_measure_input_id: 'timeflow_axis_labels_measure_id',

    timeflow_step: 1,
    timeflow_measure: 'day',
    // timeflow_step_input: document.getElementById()
    timeflow_start_point: document.getElementById('timeflow-start-point').value,

    // chart display parameters
    canvas_id: 'chart-canvas',
    canvas: document.getElementById(this.canvas_id),

    chart_sizing: 30,
    canvas_width: 1400,
    chart_col_width: 45,
    chart_col_dist: 15,
    // chart_point_dist: this.chart_col_dist + this.chart_col_width,

    canvas_height: 500,
    chart_left_padding: 30,

    // chart styles and colours
    line_colour: '#4158D0',
    fill_colour: '#e2e6f9',

    'inputs_to_monitor': ['vertical-axis-labels-step', 'timeflow-start-point', 'timeflow-axis-labels-step']
};


Object.defineProperty(Config, 'chart_point_dist', {
    value: Config.chart_col_width + Config.chart_col_dist,
    enumerable: true,
    configurable: true
});

/*==========================
     Displaying form
==========================*/

let pie_chart_fields = document.getElementById('pie-chart-fields');
let plane_chart_fields = document.getElementById('plane-chart-fields');

// default chart type is 'plane'
hide(pie_chart_fields);

// displaying chart fields according to the chart type selected
Config.chart_type_input.onchange = function () {
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

/* ==========================
  Getting chart parameters
========================== */

function prepare_default_chart_data() {
    let row_count = document.querySelectorAll('#' + Config.data_table_id + ' tr').length;

    monitor_data_row_input(0);
    document.getElementById('timeflow-chart-breakpoint[0]').value = Config.timeflow_start_point;

    let start_point = new Date(Config.timeflow_start_point);

    for (let i = 1; i < row_count; i++) {
        // setting breakpoint date
        let breakpoint_val = new Date(start_point.getFullYear(), start_point.getMonth(), start_point.getDate() + Config.timeflow_step * i);
        document.getElementById('timeflow-chart-breakpoint[' + i + ']').value = breakpoint_val.toLocaleDateString('fr-CA');

        monitor_data_row_input(i);
    }
}

prepare_default_chart_data();

// adding onchange event to data row to track the change of data row value nad update the chart_data[]
function monitor_data_row_input(row_pos) {
    let data_input_row = document.getElementById('timeflow-chart-value[' + row_pos + ']');
    data_input_row.addEventListener("change", function () {
        Config.chart_data[row_pos] = data_input_row.value;
        draw_chart(); // redrawing the chart according to updated chart_data
    });
}

// adding rows to chart data table
function add_data_input_row() {
    let data_table = document.getElementById(Config.data_table_id);
    let row_count = document.querySelectorAll('#' + Config.data_table_id + ' tr').length;

    if (data_table) {
        let new_row = data_table.insertRow(row_count);
        let breakpoint_cell = new_row.insertCell(0);
        let value_cell = new_row.insertCell(1);
        let actions_cell = new_row.insertCell(2);

        let value_input_id = 'timeflow-chart-value[' + row_count + ']';
        let input_value = 0;

        value_cell.insertAdjacentHTML('beforeend', "<input class='table-input' type='number' value='" + input_value + "' name='" + value_input_id + "' id='" + value_input_id + "'>");
        breakpoint_cell.insertAdjacentHTML('beforeend', "<input class='table-input' type='date' id='timeflow-chart-breakpoint[" + row_count + "]' name='timeflow_chart_breakpoint[" + row_count + "]'>");
        actions_cell.insertAdjacentHTML('beforeend', "<input type='button' onclick='delete_data_input_row(this)' value='Delete' />");

        Config.chart_data.push(input_value);
        monitor_data_row_input(row_count);
        draw_chart();
    }
}

function delete_last_data_input_row() {
    let data_table = document.getElementById(Config.data_table_id);
    let row_count = document.querySelectorAll('#' + Config.data_table_id + ' tr').length;

    if (data_table) {
        data_table.deleteRow(row_count - 1);
    }

    Config.chart_data.pop();
    draw_chart();
}

function delete_data_input_row(r) {
    let data_table = document.getElementById(Config.data_table_id);
    let i = r.parentNode.parentNode.rowIndex - 1;

    data_table.deleteRow(i);
    delete Config.chart_data[i];
    draw_chart();
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


// ----Getting data from uploaded data table----
if (typeof(table_data) !== "undefined") {
    Config.chart_data = table_data.split(',');

    let data_table = document.getElementById(Config.data_table_id);
    let data_rows_count = document.querySelectorAll('#' + Config.data_table_id + ' tr').length;
    let upload_points_count = Config.chart_data.length;

    if (data_rows_count < upload_points_count) {
        let rows_to_delete = data_rows_count - upload_points_count;

        for (let i = 0; i < rows_to_delete; i++) {
            delete_data_input_row(data_rows_count - i)
        }
    }

    draw_chart();
}


/* =========================
   Displaying the axises
========================= */

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

function display_vertical_axis() {
    // TODO scale labels axis
    let steps_count = Math.ceil((Config.canvas_height / Config.chart_sizing) / Config.vertical_axis_labels_step);
    let vertical_axis_labels_container = document.getElementById('vertical-axis-labels-container');
    let vertical_axis_labels = '';

    for (let i = 1; i <= steps_count; i++) {
        let bottom_pos = Config.chart_sizing * i * Config.vertical_axis_labels_step;

        vertical_axis_labels += "<span class='axis-label vertical-axis-label' style='bottom: " + bottom_pos + "px'>" + Config.vertical_axis_labels_step * (i) + "</span>";
    }
    vertical_axis_labels_container.insertAdjacentHTML('afterbegin', vertical_axis_labels);
}

function display_timeflow_axis() {
    let steps_count = Math.floor(Config.canvas_width / (Config.timeflow_axis_labels_step * Config.chart_point_dist));
    let timeflow_axis_labels_container = document.getElementById('timeflow-axis-labels-container');
    let timeflow_axis_labels = '';

    let start_point = new Date(Config.timeflow_start_point);

    if (Config.timeflow_axis_labels_step !== 0) {

        alert(Config.timeflow_axis_labels_measure_input.value);

        for (let i = 0; i <= steps_count; i++) {
            let left_pos = Config.chart_point_dist * (i * Config.timeflow_axis_labels_step) + Config.chart_left_padding - 12;
            let full_date = new Date(start_point.getFullYear(), start_point.getMonth(), start_point.getDate() + Config.timeflow_axis_labels_step * (i));

            let date_ending = 'th';
            let date_length = full_date.getDate().toString().length;

            switch (full_date.getDate().toString()[date_length - 1]) {
                case '1':
                    date_ending = 'st';
                    break;
                case '2':
                    date_ending = 'nd';
                    break;
                case '3':
                    date_ending = 'rd';
                    break;
            }

            let date = full_date.getDate() + date_ending;

            timeflow_axis_labels += "<span class='axis-label timeflow-axis-label' style='left: " + left_pos + "px'>" + date + "</span>";
        }
    }
    timeflow_axis_labels_container.insertAdjacentHTML('afterbegin', timeflow_axis_labels);
}

display_timeflow_axis();
display_vertical_axis();

for (let i = 0; i < Config.inputs_to_monitor.length; i++) {
    monitor_input_field(Config.inputs_to_monitor[i]);
}

/* =========================
    Drawing the gridlines
========================= */

function draw_timeflow_gridlines(ctx) {
    // destroying old labels, if they exist
    let old_gridline_labels = document.getElementsByClassName('timeflow-gridline-label');

    if (old_gridline_labels) {
        let old_gridline_labels_count = old_gridline_labels.length;
        for (let i = 0; i < old_gridline_labels_count; i++) {
            if (!old_gridline_labels[0].parentNode.removeChild(old_gridline_labels[0])) return false;
        }
    }

    let steps_count = Math.floor(Config.canvas_width / Config.chart_point_dist);
    let start_point = new Date(Config.timeflow_start_point);




    if (Config.timeflow_axis_labels_measure !== 0) {
        for (let i = 0; i <= steps_count; i++) {
            let full_date = new Date(start_point.getFullYear(), start_point.getMonth(), start_point.getDate() + i);
            let date = full_date.getDate();

            if (date === 1) {
                // draw month start gridline
                ctx.lineWidth = 1;
                ctx.strokeStyle = '#e0e0e0';
                ctx.beginPath();
                ctx.moveTo(Config.chart_point_dist * i + Config.chart_left_padding, Config.canvas_height);
                ctx.lineTo(Config.chart_point_dist * i + Config.chart_left_padding, 30);
                ctx.stroke();
                ctx.closePath();

                // add month label
                let labels_container = document.getElementById('timeflow-gridlines-labels-container');
                let month_name = short_month_names[full_date.getMonth()];
                let pos = Config.chart_point_dist * i + Config.chart_left_padding;
                labels_container.insertAdjacentHTML('beforeend', "<span class='timeflow-gridline-label month-label' style='left:" + pos + "px'>" + month_name + "</span>")
            }
        }
    }
}


/* =========================
     Drawing the chart
========================= */

// ???
// let canvas = document.getElementById('chart-canvas');

Config.chart_type_input.addEventListener('change', function () {
    Config.chart_type = Config.chart_type_input[Config.chart_type_input.selectedIndex].id;
    draw_chart();
});

function draw_chart() {
    let canvas = document.getElementById('chart-canvas');

    if (canvas && canvas.getContext && Config.chart_data) {
        let ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        draw_timeflow_gridlines(ctx);

        ctx.lineWidth = 2;
        ctx.strokeStyle = Config.line_colour;
        ctx.fillStyle = Config.fill_colour;
        ctx.shadowColor = 'rgba(65, 88, 208, 0.6)';
        ctx.shadowBlur = 7;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;

        ctx.beginPath();

        switch (Config.chart_type) {
            case 'line_chart':
                draw_curve_chart(ctx, Config.chart_point_dist / 2);
                break;
            case 'bar_chart':
                draw_bar_chart(ctx);
                break;
            case 'curve_chart':
                draw_curve_chart(ctx);
                break;
            case 'point_chart':
                draw_point_chart(ctx);
                break;
        }


    }
}

function draw_bar_chart(ctx) {
    // ok();
    let bar_chart_left_padding = Config.chart_left_padding - Config.chart_col_width / 2;

    ctx.moveTo(bar_chart_left_padding, Config.canvas_height);
    Config.chart_data.forEach(function (item, i, arr) {
        ctx.moveTo(Config.chart_point_dist * i + bar_chart_left_padding, Config.canvas_height);
        ctx.lineTo(Config.chart_point_dist * i + bar_chart_left_padding, Config.canvas_height - Config.chart_sizing * item);
        ctx.lineTo(Config.chart_point_dist * i + bar_chart_left_padding + Config.chart_col_width, Config.canvas_height - Config.chart_sizing * item);
        ctx.lineTo(Config.chart_point_dist * i + bar_chart_left_padding + Config.chart_col_width, Config.canvas_height);
    });

    ctx.stroke();
}

function draw_line_chart(ctx) {
    ctx.moveTo(Config.chart_left_padding, Config.canvas_height - Config.chart_sizing * Config.chart_data[0]);
    Config.chart_data.forEach(function (item, i, arr) {
        ctx.lineTo(Config.chart_point_dist * i + Config.chart_left_padding, Config.canvas_height - Config.chart_sizing * item);
    });
    // ctx.fill();
    ctx.stroke();
}

function draw_curve_chart(ctx,
                          k = 2 /* curve coefficient*/) {
    let points_count = Config.chart_data.length;

    ctx.shadowColor = 'rgba(0, 0, 0, 0)';
    ctx.moveTo(Config.chart_left_padding, Config.canvas_height);
    ctx.lineTo(Config.chart_left_padding, Config.canvas_height - Config.chart_data[0] * Config.chart_sizing);

    // ctx.shadowColor = 'rgba(65, 88, 208, 0.6)';
    ctx.strokeStyle = Config.line_colour;
    for (let i = 1; i < points_count; i++) {
        let pt_x = Config.chart_left_padding + Config.chart_point_dist * i;
        let pt_y = Config.canvas_height - Config.chart_data[i] * Config.chart_sizing;
        let control_pt_x = pt_x - Config.chart_point_dist / 2;
        let control_pt_y1 = Config.canvas_height - Config.chart_data[i - 1] * Config.chart_sizing;
        let control_pt_y2 = Config.canvas_height - Config.chart_data[i] * Config.chart_sizing;

        ctx.bezierCurveTo(control_pt_x - k, control_pt_y1, control_pt_x + k, control_pt_y2, pt_x, pt_y);
        if (i === (points_count - 1)) {
            ctx.stroke();
            ctx.strokeStyle = ctx.fillStyle;
            ctx.shadowColor = 'rgba(0, 0, 0, 0)';
            ctx.lineTo(pt_x, Config.canvas_height);
        }
    }

    ctx.fill();

    // redrawing the first line
    ctx.beginPath();
    ctx.moveTo(Config.chart_left_padding, Config.canvas_height);
    ctx.lineTo(Config.chart_left_padding, Config.canvas_height - Config.chart_data[0] * Config.chart_sizing);
    ctx.stroke();
    ctx.closePath();
}

function draw_point_chart(ctx) {
    ctx.moveTo(Config.chart_left_padding, Config.canvas_height - Config.chart_sizing * Config.chart_data[0]);
    Config.chart_data.forEach(function (item, i, arr) {
        ctx.shadowColor = 'rgba(65, 88, 208, 0)';
        // ctx.shadowBlur = 7;
        // ctx.shadowOffsetX = 0;
        // ctx.shadowOffsetY = 0;

        ctx.fillStyle = '#4158D0';
        ctx.moveTo(Config.chart_point_dist * i + Config.chart_left_padding, Config.canvas_height - Config.chart_sizing * item);
        ctx.arc(Config.chart_point_dist * i + Config.chart_left_padding, Config.canvas_height - Config.chart_sizing * item, 4, 0, Math.PI * 2, true);
        ctx.fill();

        // ctx.shadowColor = 'rgba(0, 0, 0, 0)';
        // ctx.arc(Config.chart_point_dist * i + Config.chart_left_padding - 10, Config.canvas_height - Config.chart_sizing * item, 5, 0, Math.PI * 2, true);
        // ctx.fill();
    });
    // ctx.stroke();
}

// -----

draw_chart();


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