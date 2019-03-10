/**==========================
 Chart model
 ==========================*/

class Chart {
    constructor(element, config) {
        this.element = element;
        this.config = config;
    }

    init() {
        // console.log(this.config);
        // console.log('---');

        this.fill();
        // console.log(this);
        // console.log('---');
        this.draw_chart();

        // filling point detail modal list
        let point_modal_list = document.querySelector(this.config.chart_wrapper_selector + ' .point-details-modal ul');
        let list_option = '<li style="color:' + this.config.line_colour + '"><span class="point-value"></span><br><span class="point-chart-name">' + this.config.chart_name + '</span></li>';
        point_modal_list.insertAdjacentHTML('beforeend', list_option);
    }

    fill() {
        // console.log(this);
        // console.log('---');
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

        // console.log(this.config.chart_sizing);
    }

    // destroying old labels, if they exist
    /* destroy_old_labels(axis_type) {
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

        let labels_measure = this.config.timeflow_axis_labels_measure;
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
        this.destroy_old_labels('vertical');

        // TODO scale labels axis
        let steps_count = Math.ceil((this.config.canvas_height / this.config.chart_sizing) / this.config.vertical_axis_labels_step);
        let vertical_axis_labels_container = document.querySelector(this.config.chart_wrapper_selector + ' .vertical-axis-labels-container');
        let vertical_axis_labels = '';

        for (let i = 0; i <= steps_count; i++) {
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
    }*/

    draw_chart(draw_grid = true, draw_full = false) {
        let canvas = document.querySelector(this.config.chart_wrapper_selector + ' ' + this.config.canvas_selector);

        if (canvas && canvas.getContext) {
            let ctx = canvas.getContext('2d');
            // ctx.clearRect(0, 0, canvas.width, canvas.height);


            if (draw_grid) {
                // this.draw_horizontal_grid(ctx);
            }

            if (this.config.chart_data.length > 0) {


                let start_index,
                    end_index;
                let last_breakpoint = true;

                if (draw_full) {
                    this.config.start_index = 0;
                    this.config.end_index = this.config.chart_data.length - 1;
                }


                // console.log(start_index);

                // console.log(document.data_start);

                let days_diff = 0;

                let points_count = this.config.end_index - this.config.start_index + 1;
                // this.config.points_count = points_count;
                // this.config.start_index = start_index;

                // -- GETTING MAX ---
                // this.autosize(start_index, points_count);

                // -----

                this.config.point_dist = this.config.canvas_width / points_count;
                //
                // if ((this.config.chart_type === 'line_chart' || this.config.chart_type === 'curve_chart') && last_breakpoint) {
                //     // start_index--;
                //     // days_diff--;
                // }

                if (points_count > 0) {

                    ctx.lineWidth = this.config.line_width;
                    ctx.strokeStyle = this.config.line_colour;
                    ctx.fillStyle = this.config.fill_colour;
                    ctx.shadowColor = this.config.shadow_colour;
                    ctx.shadowBlur = this.config.shadow_blur;
                    ctx.shadowOffsetX = this.config.shadow_offset_x;
                    ctx.shadowOffsetY = this.config.shadow_offset_y;

                    ctx.beginPath();


                    switch (this.config.chart_type) {
                        case 'line_chart':
                            draw_curve_chart(this, ctx, this.config.start_index, days_diff, this.config.point_dist / 2);
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

    /*    show_point_details() {
            let canvas = document.querySelector(this.config.chart_wrapper_selector + ' ' + this.config.canvas_selector);
            let rect = canvas.getBoundingClientRect();

            let obj_config = this.config;
            let obj = this;
            console.log(this);
            // let start_index = this.config.start_index;
            // let points_count = this.con

            canvas.addEventListener('mousemove', function (e) {
                document.querySelector('.point-details-modal').classList.add('show');

                let percentage = (e.pageX - rect.left) / canvas.width;
                let point_index = Math.floor(obj_config.start_index + obj_config.points_count * percentage);

                if(document.curr_point_index !== point_index){
                    obj.draw_chart();
                    document.curr_point_index = point_index;
                    obj.highlight_point(canvas, point_index);
                    obj.show_point_modal(point_index);
                }
            });

            canvas.addEventListener('mouseleave', function(){
                document.querySelector('.point-details-modal').classList.remove('show');
            })
        }

        highlight_point(canvas, index) {
            let ctx = canvas.getContext('2d');
            let x0 = (index - this.config.start_index) * this.config.point_dist,
                y0 = this.config.canvas_height - this.config.chart_data[index] * this.config.chart_sizing;

            ctx.lineWidth = 1;
            ctx.strokeStyle = this.config.grid_accent_colour;

            ctx.beginPath();
            ctx.moveTo(x0, 0);
            ctx.lineTo(x0, this.config.canvas_height);
            ctx.stroke();
            ctx.closePath();

            ctx.fillStyle = this.config.background_color;
            ctx.strokeStyle = this.config.line_colour;
            ctx.lineWidth = this.config.line_width;

            ctx.beginPath();
            ctx.arc(~~(x0 + 0.5), ~~(y0 + 0.5), ~~(this.config.point_radius + 0.5), 0, Math.PI * 2, false);
            ctx.fill();
            ctx.stroke();
            ctx.closePath();
        }

        show_point_modal(index){
            let modal = document.querySelector('.point-details-modal');
            modal.style.left = ((index - this.config.start_index) * this.config.point_dist - 32) + 'px';

            let date = str_to_date(this.config.chart_breakpoints[index], 'day');
            date = date.toLocaleDateString('en-US', { weekday: 'short',  month: 'short', day: 'numeric' });

            modal.querySelector('.point-value').textContent = this.config.chart_data[index];
            modal.querySelector('.breakpoint-date').textContent = date;
        } */


    highlight_point(index) {
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



