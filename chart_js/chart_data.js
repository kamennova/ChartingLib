
/* ===============================
  Getting chart data from upload
=============================== */

// ----Getting data from uploaded data table----
if (typeof(table_data) !== "undefined") {
    Configurable.config.chart_data = table_data.split(',');

    let data_table = document.getElementById(Configurable.config.data_table_id);
    let data_rows_count = document.querySelectorAll('#' + Configurable.config.data_table_id + ' tr').length;
    let upload_points_count = Configurable.config.chart_data.length;

    if (data_rows_count < upload_points_count) {
        let rows_to_delete = data_rows_count - upload_points_count;

        for (let i = 0; i < rows_to_delete; i++) {
            delete_data_input_row(data_rows_count - i)
        }
    }

    Configurable.draw_chart();
}

/* ==========================
  Getting chart parameters
========================== */

function prepare_default_chart_data() {
    let row_count = document.querySelectorAll('#' + Configurable.config.data_table_id + ' tr').length;

    monitor_data_row_input(0);
    document.getElementById('timeflow-chart-breakpoint[0]').value = Configurable.config.timeflow_start_point;

    let start_point = new Date(Configurable.config.timeflow_start_point);

    for (let i = 1; i < row_count; i++) {
        // setting breakpoint date
        let breakpoint_val = new Date(start_point.getFullYear(), start_point.getMonth(), start_point.getDate() + Configurable.config.timeflow_step * i);
        document.getElementById('timeflow-chart-breakpoint[' + i + ']').value = breakpoint_val.toLocaleDateString('fr-CA');

        monitor_data_row_input(i);
    }
}

// adding onchange event to data row to track the change of data row value nad update the chart_data[]
function monitor_data_row_input(row_pos) {
    let data_input_row = document.getElementById('timeflow-chart-value[' + row_pos + ']');
    data_input_row.addEventListener("change", function () {
        Configurable.config.chart_data[row_pos] = data_input_row.value;
        Configurable.draw_chart(); // redrawing the chart according to updated chart_data
    });
}

// adding rows to chart data table
function add_data_input_row() {
    let data_table = document.getElementById(Configurable.config.data_table_id);
    let row_count = document.querySelectorAll('#' + Configurable.config.data_table_id + ' tr').length;

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

        Configurable.config.chart_data.push(input_value);
        monitor_data_row_input(row_count);
        Configurable.draw_chart();
    }
}

function delete_last_data_input_row() {
    let data_table = document.getElementById(Configurable.config.data_table_id);
    let row_count = document.querySelectorAll('#' + Configurable.config.data_table_id + ' tr').length;

    if (data_table) {
        data_table.deleteRow(row_count - 1);
    }

    Configurable.config.chart_data.pop();
    Configurable.draw_chart();
}

function delete_data_input_row(r) {
    let data_table = document.getElementById(Configurable.config.data_table_id);
    let i = r.parentNode.parentNode.rowIndex - 1;

    data_table.deleteRow(i);
    delete Configurable.config.chart_data[i];
    Configurable.draw_chart();
}