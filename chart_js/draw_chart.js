
/* =========================
   Displaying the axises
========================= */

function translate_measure(val) {
    let price = 0;
    switch (val) {
        // case 'hour':
        //     price = 1;
        //     break;
        case 'day':
            price = 1;
            break;
        case 'week':
            price = 7;
            break;
    }

    return price;
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
    let timeflow_axis_labels_container = document.getElementById('timeflow-axis-labels-container');
    let timeflow_axis_labels = '';
    let start_point = new Date(Config.timeflow_start_point);

    // getting timeflow labels measure
    let measure_input = document.querySelector('#' + Config.timeflow_axis_labels_measure_input_id);
    let labels_measure = measure_input.options[measure_input.selectedIndex].id;
    let value_measure = Config.timeflow_measure;


    if (labels_measure === 'day' || labels_measure === 'week') {
        // display dates axises

        let step = Config.timeflow_axis_labels_step;
        let steps_count = Config.canvas_width / (Config.timeflow_axis_labels_step * Config.chart_point_dist);

        if (labels_measure === 'week') {
            steps_count /= translate_measure(labels_measure);
            // step *= 7;
        }

        let index = translate_measure(labels_measure) / translate_measure(value_measure);

        steps_count = Math.floor(steps_count);

        for (let i = 0; i <= steps_count; i++) {
            let left_pos = Config.chart_point_dist * index * (i * step) + Config.chart_left_padding - 12;
            let full_date = new Date(start_point.getFullYear(), start_point.getMonth(), start_point.getDate() + step * (i));

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

    } else if (labels_measure === 'month') {
        // display month axises
    } else if (labels_measure === 'year' || labels_measure === 'decade') {
        // display year axis
    } else if (labels_measure === 'season') {
        // display season axis
    }


    // }
    timeflow_axis_labels_container.insertAdjacentHTML('afterbegin', timeflow_axis_labels);
}

display_timeflow_axis();
display_vertical_axis();


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

        let labels_start_point = new Date(Config.timeflow_start_point);
        let value_start_point = new Date(document.getElementById('timeflow-chart-breakpoint[0]').value);
        let days_diff = Math.floor((value_start_point - labels_start_point) / (1000 * 60 * 60 * 24));

        ctx.beginPath();

        switch (Config.chart_type) {
            case 'line_chart':
                draw_curve_chart(ctx, days_diff, Config.chart_point_dist / 2);
                break;
            case 'bar_chart':
                draw_bar_chart(ctx, days_diff);
                break;
            case 'curve_chart':
                draw_curve_chart(ctx, days_diff);
                break;
            case 'point_chart':
                draw_point_chart(ctx, days_diff);
                break;
        }
    }
}

function draw_bar_chart(ctx, days_diff) {
    // ok();
    ctx.shadowColor = 'rgba(0, 0, 0, 0)';
    let bar_chart_left_padding = Config.chart_left_padding - Config.chart_col_width / 2;

    ctx.moveTo(bar_chart_left_padding + Config.chart_point_dist * days_diff, Config.canvas_height);
    Config.chart_data.forEach(function (item, i, arr) {
        ctx.moveTo(Config.chart_point_dist * (i + days_diff) + bar_chart_left_padding, Config.canvas_height);
        ctx.lineTo(Config.chart_point_dist * (i + days_diff) + bar_chart_left_padding, Config.canvas_height - Config.chart_sizing * item);
        ctx.lineTo(Config.chart_point_dist * (i + days_diff) + bar_chart_left_padding + Config.chart_col_width, Config.canvas_height - Config.chart_sizing * item);
        ctx.lineTo(Config.chart_point_dist * (i + days_diff) + bar_chart_left_padding + Config.chart_col_width, Config.canvas_height);
    });

    ctx.stroke();
    ctx.fill();
}

function draw_line_chart(ctx, days_diff) {
    ctx.moveTo(Config.chart_left_padding + Config.chart_point_dist * days_diff, Config.canvas_height - Config.chart_sizing * Config.chart_data[0]);

    Config.chart_data.forEach(function (item, i, arr) {
        ctx.lineTo(Config.chart_point_dist * (i + days_diff) + Config.chart_left_padding, Config.canvas_height - Config.chart_sizing * item);
    });
    // ctx.fill();
    ctx.stroke();
}

function draw_curve_chart(ctx, days_diff, k = 2 /* curve coefficient */) {
    let points_count = Config.chart_data.length;

    ctx.shadowColor = 'rgba(0, 0, 0, 0)';
    ctx.moveTo(Config.chart_left_padding + Config.chart_point_dist * days_diff, Config.canvas_height);
    ctx.lineTo(Config.chart_left_padding + Config.chart_point_dist * days_diff, Config.canvas_height - Config.chart_data[0] * Config.chart_sizing);

    ctx.strokeStyle = Config.line_colour;

    // Config.chart_data.forEach()
    for (let i = 1; i < points_count; i++) {
        let pt_x = Config.chart_left_padding + Config.chart_point_dist * (i + days_diff);
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
    ctx.moveTo(Config.chart_left_padding + Config.chart_point_dist * days_diff, Config.canvas_height);
    ctx.lineTo(Config.chart_left_padding + Config.chart_point_dist * days_diff, Config.canvas_height - Config.chart_data[0] * Config.chart_sizing);
    ctx.stroke();
    ctx.closePath();
}

function draw_point_chart(ctx, days_diff) {

    ctx.moveTo(Config.chart_left_padding + Config.chart_point_dist * days_diff, Config.canvas_height - Config.chart_sizing * Config.chart_data[0]);
    Config.chart_data.forEach(function (item, i, arr) {
        ctx.shadowColor = 'rgba(65, 88, 208, 0)';
        // ctx.shadowBlur = 7;
        // ctx.shadowOffsetX = 0;
        // ctx.shadowOffsetY = 0;

        ctx.fillStyle = '#4158D0';
        ctx.moveTo(Config.chart_point_dist * (i + days_diff) + Config.chart_left_padding, Config.canvas_height - Config.chart_sizing * item);
        ctx.arc(Config.chart_point_dist * (i + days_diff) + Config.chart_left_padding, Config.canvas_height - Config.chart_sizing * item, 4, 0, Math.PI * 2, true);
        ctx.fill();

        // ctx.shadowColor = 'rgba(0, 0, 0, 0)';
        // ctx.arc(Config.chart_point_dist * i + Config.chart_left_padding - 10, Config.canvas_height - Config.chart_sizing * item, 5, 0, Math.PI * 2, true);
        // ctx.fill();
    });
    // ctx.stroke();
}

// -----

draw_chart();