/**==========================
 Chart model
 ==========================*/

class Chart {
    constructor(element, config) {
        this.element = element;
        this.config = config;
    }

    init() {
        this.fill();

        // filling point detail modal list
        let point_modal_list = document.querySelector(this.config.chart_wrapper_selector + ' .point-details-modal ul');
        let list_option = '<li style="color:' + this.config.line_colour + '"><span class="point-value"></span><br><span class="point-chart-name">' + this.config.chart_name + '</span></li>';
        point_modal_list.insertAdjacentHTML('beforeend', list_option);

        let charts_labels_list = document.querySelector(this.config.chart_wrapper_selector + ' .charts-labels-list');
        let input_name = this.config.chart_name.replace(/ /, '-');
        let label = '<li><label class="chart-label">' +
            '<input type="checkbox" class="visually-hidden chart-draw-checkbox" name="' + input_name + '" checked>' +
            '<span style="background-color: ' + this.config.line_colour + '; border-color: ' + this.config.line_colour + '" class="checkbox-indicator"></span>'
            + this.config.chart_name + '</label></li>';

        /* let input = document.createElement('input');
        input.classList.add('visually-hidden');
        input.setAttribute('name', input_name);
        input.checked = true; */

        charts_labels_list.insertAdjacentHTML('beforeend', label);
    }

    fill() {
        for (const key in Default_config) {
            let value = Default_config[key];
            if (!this.config.hasOwnProperty(key) || this.config[key] == null) {
                this.config[key] = Default_config[key];
            }
        }
    }

    autosize(start_index, points_count) {
        let max = this.config.chart_data[start_index];

        for (let i = 1; i < points_count; i++) {
            if (Number(this.config.chart_data[start_index + i]) > max) {
                max = this.config.chart_data[start_index + i];
            }
        }

        this.config.chart_sizing = (this.config.canvas_height - this.config.line_width / 2 - this.config.point_radius) / max;
    }

    draw_chart(canvas_selector = this.config.canvas_selector, draw_full = false) {
        let canvas = document.querySelector(this.config.chart_wrapper_selector + ' ' + canvas_selector);

        if (canvas && canvas.getContext && this.config.draw) {
            let ctx = canvas.getContext('2d');
            if (this.config.chart_data.length > 0) {

                let start_index,
                    end_index,
                    points_count,
                    days_diff;

                if (draw_full) {
                    start_index = 0;
                    points_count = this.config.chart_data.length;
                    days_diff = 0;
                } else {
                    end_index = this.config.end_index;
                    start_index = this.config.start_index;
                    points_count = end_index - start_index + 1 + 2;
                    days_diff = -1;
                }

                // this.config.points_count = points_count;
                // this.config.start_index = start_index;

                // -- GETTING MAX ---
                // this.autosize(start_index, points_count);

                // -----

                // this.config.point_dist = canvas.width / (points_count - 1);

                if (draw_full) {
                    // console.log(this.config.point_dist);
                    // console.log(points_count);
                    // console.log(canvas.width);
                    // console.log('---');
                } else {
                    // console.log(start_index);
                    // console.log(end_index);
                    // console.log(points_count);
                    // console.log('---');
                }

                if (points_count > 0) {

                    ctx.lineWidth = this.config.line_width;
                    ctx.strokeStyle = this.config.line_colour;
                    ctx.fillStyle = this.config.fill_colour;
                    ctx.shadowColor = this.config.shadow_colour;
                    ctx.shadowBlur = this.config.shadow_blur;
                    ctx.shadowOffsetX = this.config.shadow_offset_x;
                    ctx.shadowOffsetY = this.config.shadow_offset_y;
                    ctx.lineJoin = 'round';

                    ctx.beginPath();

                    switch (this.config.chart_type) {
                        case 'line_chart':
                            draw_line_chart(this, ctx, start_index, points_count);
                            // draw_line_chart(this, ctx, start_index, days_diff);
                            break;
                        // case 'bar_chart':
                        //     draw_bar_chart(this, ctx, start_index);
                        //     break;
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
    }

    draw_preview_chart() {
        this.autosize(this.config.preview_canvas_selector);
        this.draw_chart(this.config.preview_canvas_selector, false);
    }


    get_timeflow_start_point() {
        let today = new Date;
        return new Date(today.getFullYear(), today.getMonth(), today.getDate() - this.config.show_since_steps_ago);
    }

    draw_all() {
        this.fill();
        this.autosize();
        this.display_timeflow_axis();
        this.display_vertical_axis();
        this.draw_chart();
    }

    points_to_show_num(start_index) {
        // + 2 side points, + 1 padding-left point
        let max_points_num = Math.floor(this.config.canvas_width / (this.config.timeflow_step * this.config.point_dist)) + 3;
        let all_points_num = this.config.chart_data.length - start_index;
        return (max_points_num < all_points_num ? max_points_num : all_points_num);
    }

    highlight_point(index) {

        if (this.config.draw) {
            let canvas = document.querySelector(this.config.chart_wrapper_selector + ' ' + this.config.canvas_selector);
            let ctx = canvas.getContext('2d');
            let x0 = (index - this.config.start_index) * this.config.point_dist,
                y0 = this.config.canvas_height - this.config.chart_data[index] * this.config.chart_sizing;


            ctx.fillStyle = this.config.background_color;
            ctx.strokeStyle = this.config.line_colour;
            ctx.lineWidth = this.config.line_width;

            ctx.beginPath();
            ctx.arc(~~(x0 + 0.5), ~~(y0 + 0.5), ~~(this.config.point_radius + 0.5), 0, Math.PI * 2, false);
            ctx.fill();
            ctx.stroke();
            ctx.closePath();
        }
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



