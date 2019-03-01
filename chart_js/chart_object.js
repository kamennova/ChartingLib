/**==========================
 Chart model
 ==========================*/

class Chart {
    constructor(element, config) {
        this.element = element;
        this.config = config;
        // this.init = true;
    }

    // destroying old labels, if they exist
    destroy_old_labels(axis_type) {
        let old_labels = document.querySelector(this.config.chart_wrapper_selector + ' .' + axis_type + '-axis-labels-container');

        if (old_labels) {
            while (old_labels.firstChild) {
                old_labels.removeChild(old_labels.firstChild);
            }
        }

        return true;
    }

    display_timeflow_axis() {
        this.destroy_old_labels('timeflow');

        let timeflow_axis_labels_container = document.querySelectorAll(this.config.chart_wrapper_selector + ' .timeflow-axis-labels-container')[0];
        let start_point = this.get_timeflow_start_point();

        // console.log(start_point);

        let labels_measure = this.config.timeflow_axis_labels_measure;
        let value_measure = this.config.timeflow_measure;

        if (labels_measure === 'day' || labels_measure === 'week') {
            // display dates axises
            let step = this.config.timeflow_axis_labels_step;
            let steps_count = this.config.canvas_width / (this.config.timeflow_axis_labels_step * this.config.point_dist);

            // console.log(steps_count);

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
                let label = document.createElement('span');
                label.classList.add('axis-label', 'timeflow-axis-label');
                label.style.left = left_pos + 'px';
                label.innerText = date;

                timeflow_axis_labels_container.appendChild(label);
            }

        } else if (labels_measure === 'month') {
            // display month axises
        } else if (labels_measure === 'year' || labels_measure === 'decade') {
            // display year axis
        } else if (labels_measure === 'season') {
            // display season axis
        }
        // }


        if (!this.config.horizontal_axis_show_line) {
            timeflow_axis_labels_container.classList.add('no-line');
        }

        if (!this.config.horizontal_axis_show_ticks) {
            timeflow_axis_labels_container.classList.add('no-ticks');
        }
    }

    display_vertical_axis() {
        // TODO scale labels axis
        let steps_count = Math.ceil((this.config.canvas_height / this.config.chart_sizing) / this.config.vertical_axis_labels_step);
        let vertical_axis_labels_container = document.querySelector(this.config.chart_wrapper_selector + ' .vertical-axis-labels-container');
        let vertical_axis_labels = '';

        for (let i = 1; i <= steps_count; i++) {
            let bottom_pos = this.config.chart_sizing * i * this.config.vertical_axis_labels_step;

            vertical_axis_labels += "<span class='axis-label vertical-axis-label' style='bottom: " + bottom_pos + "px'>" + this.config.vertical_axis_labels_step * (i) + "</span>";
        }
        vertical_axis_labels_container.insertAdjacentHTML('afterbegin', vertical_axis_labels);

        if (!this.config.vertical_axis_show_line) {
            vertical_axis_labels_container.classList.add('no-line');
        }

        if (!this.config.vertical_axis_show_ticks) {
            vertical_axis_labels_container.classList.add('no-ticks');
        }
    }

    draw_chart() {
        let canvas = document.querySelector(this.config.canvas_selector);

        if (canvas && canvas.getContext && this.config.chart_data) {
            let ctx = canvas.getContext('2d');
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            this.draw_timeflow_gridlines(ctx);
            this.draw_horizontal_grid(ctx);

            // --- preparing chart data ---

            let timeflow_start_point = this.get_timeflow_start_point();
            let timeflow_start_point_str = date_to_str(timeflow_start_point);
            let start_index,
                last_breakpoint;

            for (let i = 0, count = this.config.chart_data.length; i < count; i++) {
                if (this.config.chart_breakpoints[i] >= timeflow_start_point_str) {
                    start_index = i;
                    last_breakpoint = !!this.config.chart_breakpoints[i - 1];
                    break;
                }
            }

            let closest_breakpoint = str_to_date(this.config.chart_breakpoints[start_index], 'day');
            // console.log("Closest: " + closest_breakpoint);
            // console.log("Is last: " + last_breakpoint);
            // console.log(start_index);
            let days_diff = Math.floor((closest_breakpoint - timeflow_start_point) / (1000 * 60 * 60 * 24));

            if ((this.config.chart_type === 'line_chart' || this.config.chart_type === 'curve_chart') && last_breakpoint) {
                start_index--;
                days_diff--;
            }


            if (days_diff < this.points_to_show_num(start_index)) {
                ctx.lineWidth = this.config.line_width || 1;
                ctx.strokeStyle = this.config.line_colour || 'black';
                ctx.fillStyle = this.config.fill_colour || "blue";
                ctx.shadowColor = this.config.shadow_colour || "rgba(0, 0, 0, 0)";
                ctx.shadowBlur = this.config.shadow_blur || 0;
                ctx.shadowOffsetX = this.config.shadow_offset_x || 0;
                ctx.shadowOffsetY = this.config.shadow_offset_y || 0;

                ctx.beginPath();

                switch (this.config.chart_type) {
                    case 'line_chart':
                        draw_curve_chart(this, ctx, start_index, days_diff, this.config.point_dist / 2);
                        break;
                    case 'bar_chart':
                        draw_bar_chart(this, ctx, start_index, days_diff);
                        break;
                    case 'curve_chart':
                        draw_curve_chart(this, ctx, start_index, days_diff, this.config.smoothing);
                        break;
                    case 'point_chart':
                        draw_point_chart(this, ctx, start_index, days_diff);
                        break;
                }
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
        let start_point = this.get_timeflow_start_point();

        for (let i = 0; i <= steps_count; i++) {
            let full_date = new Date(start_point.getFullYear(), start_point.getMonth(), start_point.getDate() + i);
            let date = full_date.getDate();

            if (date === 1) {
                // draw month start gridline
                ctx.lineWidth = 1;
                ctx.strokeStyle = this.config.grid_colour;
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

    draw_horizontal_grid(ctx) {
        let gridlines_count = Math.floor(this.config.canvas_height / (this.config.vertical_axis_labels_step * this.config.chart_sizing));

        ctx.lineWidth = 1;
        ctx.strokeStyle = this.config.grid_colour;

        let y0 = this.config.canvas_height;

        for (let i = 0; i < gridlines_count; i++) {
            y0 -= this.config.chart_sizing * this.config.vertical_axis_labels_step;

            ctx.beginPath();
            ctx.moveTo(0, y0);
            ctx.lineTo(this.config.canvas_width, y0);
            ctx.stroke();
            ctx.closePath();
        }
    }

    get_timeflow_start_point() {
        let today = new Date;
        let start_point = new Date(today.getFullYear(), today.getMonth(), today.getDate() - this.config.show_since_steps_ago);

        return start_point;
    }

    draw_all() {
        this.display_timeflow_axis();
        this.display_vertical_axis();
        this.draw_chart();
    }

    get_start_breakpoint() {

    }

    points_to_show_num(start_index) {
        // + 2 side points, + 1 padding-left point
        let max_points_num = Math.floor(this.config.canvas_width / (this.config.timeflow_step * this.config.point_dist)) + 3;
        let all_points_num = this.config.chart_data.length - start_index;
        return (max_points_num < all_points_num ? max_points_num : all_points_num);
    }
}

function str_to_date(str, accuracy) {
    let year = str.substr(0, 4);
    // if (accuracy !== 'year') {
    let month = Number(str.substr(5, 2)) - 1;
    if (accuracy !== 'month') {
        let day = str.substr(8, 2);
        if (accuracy !== 'day') {
            // hours...
        }
        return new Date(year, month, day);
    }
    // }
    return new Date(year, month);
}