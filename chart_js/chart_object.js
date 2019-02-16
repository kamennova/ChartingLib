/**==========================
       Chart model
==========================*/

class Chart {
    constructor(element, config) {
        this.element = element;
        this.config = config;
    }

    // destroying old labels, if they exist
    destroy_old_labels(axis_type) {
        let old_labels = document.getElementsByClassName(axis_type + '-axis-label');

        if (old_labels) {
            let old_labels_count = old_labels.length;

            for (let i = 0; i < old_labels_count; i++) {
                if (!old_labels[0].parentNode.removeChild(old_labels[0])) return false;
            }
        }

        return true;
    }

    display_timeflow_axis() {
        let timeflow_axis_labels_container = document.getElementById('timeflow-axis-labels-container');
        let timeflow_axis_labels = '';
        let start_point = new Date(this.config.timeflow_start_point);

        let labels_measure;

        // getting timeflow labels measure

        if (this.config.timeflow_axis_labels_measure_input_id) {
            let measure_input = document.querySelector('#' + this.config.timeflow_axis_labels_measure_input_id);
            labels_measure = measure_input.options[measure_input.selectedIndex].id;
        } else {
            labels_measure = this.config.timeflow_axis_labels_measure;
        }

        let value_measure = this.config.timeflow_measure;

        if (labels_measure === 'day' || labels_measure === 'week') {
            // display dates axises
            let step = this.config.timeflow_axis_labels_step;
            let steps_count = this.config.canvas_width / (this.config.timeflow_axis_labels_step * this.config.point_dist);

            if (labels_measure === 'week') {
                steps_count /= translate_measure(labels_measure);
                // step *= 7;
            }

            let index = translate_measure(labels_measure) / translate_measure(value_measure);

            steps_count = Math.floor(steps_count);

            for (let i = 0; i <= steps_count; i++) {
                let left_pos = this.config.point_dist * index * (i * step) + this.config.padding_left - 12;
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

    display_vertical_axis() {
        // TODO scale labels axis
        let steps_count = Math.ceil((this.config.canvas_height / this.config.chart_sizing) / this.config.vertical_axis_labels_step);
        let vertical_axis_labels_container = document.getElementById('vertical-axis-labels-container');
        let vertical_axis_labels = '';

        for (let i = 1; i <= steps_count; i++) {
            let bottom_pos = this.config.chart_sizing * i * this.config.vertical_axis_labels_step;

            vertical_axis_labels += "<span class='axis-label vertical-axis-label' style='bottom: " + bottom_pos + "px'>" + this.config.vertical_axis_labels_step * (i) + "</span>";
        }
        vertical_axis_labels_container.insertAdjacentHTML('afterbegin', vertical_axis_labels);
    }

    draw_chart() {
        okk();
        let canvas = document.getElementById(this.config.canvas_selector);

        if (canvas && canvas.getContext && this.config.chart_data) {
            let ctx = canvas.getContext('2d');
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            this.draw_timeflow_gridlines(ctx);

            ctx.lineWidth = this.config.line_width;
            ctx.strokeStyle = this.config.line_colour;
            ctx.fillStyle = this.config.fill_colour;
            ctx.shadowColor = 'rgba(65, 88, 208, 0.6)';
            ctx.shadowBlur = 7;
            ctx.shadowOffsetX = 0;
            ctx.shadowOffsetY = 0;

            let labels_start_point = new Date(this.config.timeflow_start_point);

            let value_start_point = new Date;
            if (this.config.configurable) {
                value_start_point = new Date(document.getElementById('timeflow-chart-breakpoint[0]').value);
            }

            let days_diff = Math.floor((value_start_point - labels_start_point) / (1000 * 60 * 60 * 24));

            ctx.beginPath();

            switch (this.config.chart_type) {
                case 'line_chart':
                    draw_curve_chart(this, ctx, days_diff, this.config.point_dist / 2);
                    break;
                case 'bar_chart':
                    draw_bar_chart(this, ctx, days_diff);
                    break;
                case 'curve_chart':
                    draw_curve_chart(this, ctx, days_diff, this.config.smoothing);
                    break;
                case 'point_chart':
                    draw_point_chart(this, ctx, days_diff);
                    break;
            }
        }
    }

    draw_timeflow_gridlines(ctx) {
        // destroying old labels, if they exist
        let old_gridline_labels = document.getElementsByClassName('timeflow-gridline-label');

        if (old_gridline_labels) {
            let old_gridline_labels_count = old_gridline_labels.length;
            for (let i = 0; i < old_gridline_labels_count; i++) {
                if (!old_gridline_labels[0].parentNode.removeChild(old_gridline_labels[0])) return false;
            }
        }

        let steps_count = Math.floor(this.config.canvas_width / this.config.point_dist);
        let start_point = new Date(this.config.timeflow_start_point);

        if (this.config.timeflow_axis_labels_measure !== 0) {
            for (let i = 0; i <= steps_count; i++) {
                let full_date = new Date(start_point.getFullYear(), start_point.getMonth(), start_point.getDate() + i);
                let date = full_date.getDate();

                if (date === 1) {
                    // draw month start gridline
                    ctx.lineWidth = 1;
                    ctx.strokeStyle = '#e0e0e0';
                    ctx.beginPath();
                    ctx.moveTo(this.config.point_dist * i + this.config.padding_left, this.config.canvas_height);
                    ctx.lineTo(this.config.point_dist * i + this.config.padding_left, 30);
                    ctx.stroke();
                    ctx.closePath();

                    // add month label
                    let labels_container = document.getElementById('timeflow-gridlines-labels-container');
                    let month_name = short_month_names[full_date.getMonth()];
                    let pos = this.config.point_dist * i + this.config.padding_left;
                    labels_container.insertAdjacentHTML('beforeend', "<span class='timeflow-gridline-label month-label' style='left:" + pos + "px'>" + month_name + "</span>")
                }
            }
        }
    }

    draw() {
        console.log('my config:', this.config);
    }
}

let chart1 = new Chart(document.getElementById(this.canvas_id), {

    // default data array
    chart_data: [2, 5, 3, 9, 6, 2, 9],

    data_table_id: 'timeflow-chart-data-input-tbody',

    // default values
    chart_type: 'curve_chart',
    // chart_type_input_selector: 'chart-type-id',

    // vertical axis parameters
    // ??? measure_value_step: document.getElementById('measure-value-step').value,
    measure_value_step: 1,
    // measure_value_step_input_selector: 'measure-value-step',

    vertical_axis_labels_step: 2,
    // vertical_axis_labels_step_input_selector: 'vertical-axis-labels-step',

    // horizontal axis parameters
    horizontal_axis_type: 'timeflow',

    timeflow_step: 1,
    timeflow_measure: 'day',

    timeflow_axis_labels_step: 1,

    timeflow_axis_labels_measure: 'day',
    // timeflow_start_point: document.getElementById('timeflow-start-point').value,

    // chart display parameters
    canvas_id: 'chart-canvas',
    canvas: document.getElementById(this.canvas_id),

    chart_sizing: 30,
    canvas_width: 1400,
    chart_col_width: 45,
    chart_col_dist: 15,
    // point_dist: this.chart_col_dist + this.chart_col_width,

    canvas_height: 500,
    padding_left: 30,

    // chart styles and colours
    line_colour: '#4158D0',
    fill_colour: '#e2e6f9',

    // inputs_to_monitor: ['vertical-axis-labels-step', 'timeflow-start-point', 'timeflow-axis-labels-measure-id', 'timeflow-axis-labels-step']
});