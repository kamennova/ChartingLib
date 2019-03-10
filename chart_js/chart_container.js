class Chart_container {
    constructor(container, container_config, charts) {
        this.container = container;
        this.config = container_config;
        this.charts = charts;

        if (document.querySelector(this.container)) {
            this.init();
        }
    }

    autosize() {
        let all_points_count = this.charts[0].chart_data.length;
        this.config.start_index = Math.floor(this.config.data_start * all_points_count);
        this.config.end_index = Math.floor(this.config.data_end * all_points_count);

        let max = this.charts[0].chart_data[this.config.start_index];

        for (let a = 0; a < this.charts.length; a++) {
            for (let i = 0; i < all_points_count; i++) {
                if (this.charts[a].chart_data[this.config.start_index + i] > max) {
                    max = this.charts[a].chart_data[this.config.start_index + i];
                }
            }
        }

        // TODO let max_line_width = get_max()
        let max_line_width = 2;
        let max_point_radius = 4;

        this.config.chart_sizing = (this.config.canvas_height - max_line_width / 2 - max_point_radius) / max;
    }

    destroy_old_labels(axis_type) {
        let old_labels = document.querySelector(this.config.chart_wrapper_selector + ' .' + axis_type + '-axis-labels-container');

        if (old_labels) {
            while (old_labels.firstChild) {
                old_labels.removeChild(old_labels.firstChild);
            }
        }
    }

    /*display_timeflow_axis() {
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
    }*/

    display_vertical_axis() {
        this.destroy_old_labels('vertical');

        // TODO scale labels axis
        let steps_count = Math.ceil((this.config.canvas_height / this.config.chart_sizing) / this.config.vertical_axis_labels_step);
        let vertical_axis_labels_container = document.querySelector(this.container + ' .vertical-axis-labels-container');
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
    }

    draw_horizontal_grid() {
        let canvas = document.querySelector(this.container + ' .chart-canvas');

        if (canvas && canvas.getContext) {
            let ctx = canvas.getContext('2d');

            let gridlines_count = Math.floor(this.config.canvas_height / (this.config.vertical_axis_labels_step * this.config.chart_sizing));

            ctx.lineWidth = 1;
            ctx.strokeStyle = this.config.grid_colour;

            let y0 = this.config.canvas_height;

            for (let i = 0; i < gridlines_count; i++) {
                y0 -= this.config.chart_sizing * this.config.vertical_axis_labels_step;
                y0 = ~~y0 + 0.5;

                ctx.beginPath();
                ctx.moveTo(0, y0);
                ctx.lineTo(this.config.canvas_width, y0);
                ctx.stroke();
                ctx.closePath();
            }
        }
    }

    fill() {
        for (const key in Default_container_config) {
            let value = Default_container_config[key];

            if (!this.config.hasOwnProperty(key) || this.config[key] == null) {
                this.config[key] = Default_container_config[key];
            }
        }
    }

    init() {
        this.insert_HTML();
        this.fill();
        this.autosize(); // get chart sizing
        this.display_vertical_axis();
        this.draw_horizontal_grid();

        // preview_box_init();

        // ----- charts drawing ---

        let basic_chart_config = {
            draw: true,

            chart_wrapper_selector: this.container,
            canvas_selector: '.chart-canvas',
            canvas_width: this.config.canvas_width,
            canvas_height: this.config.canvas_height,

            chart_sizing: this.config.chart_sizing,
            data_start: this.config.data_start,
            data_end: this.config.data_end,
            start_index: this.config.start_index,
            end_index: this.config.end_index,
        };


        for (let i = 0; i < this.charts.length; i++) {
            let chart_config = Object.assign({}, basic_chart_config, this.charts[i]);
            this.charts[i] = new Chart(undefined, chart_config);
            this.charts[i].init();
        }

        // ---
        // this.display_timeflow_axis();


        this.show_point_details();

    }

    insert_HTML() {
        let container_wrapper = document.querySelector(this.container);

        // insert name
        container_wrapper.insertAdjacentHTML('beforeend', '<h2 class="chart-container-name">' + this.config.name + '</h2>');

        let wrapper = document.createElement('div');
        wrapper.classList.add('chart-wrapper');
        container_wrapper.appendChild(wrapper);
        //container_wrapper.insertAdjacentHTML('afterbegin', '<div class="chart-wrapper"></div>');

        // insert main chart canvas
        let canvas = "<canvas class='chart-canvas' width='" + this.config.canvas_width + "' height='" + this.config.canvas_height + "' ></canvas>";
        wrapper.insertAdjacentHTML('beforeend', '<div class="chart-canvas-wrapper">' + canvas + '</div>');
        // this.elem.insertAdjacentHTML('beforeend', canvas);

        let vertical_axis = document.createElement('div');
        vertical_axis.classList.add('vertical-axis-labels-container', 'axis-labels-container');
        vertical_axis.style.height = this.config.canvas_height + 'px';
        wrapper.appendChild(vertical_axis);
        // wrapper.insertAdjacentHTML('beforeend', vertical_axis);

        // console.log(vertical_axis.nodeType);

        let timeflow_axis = '<div id="timeflow-axis-labels-container" class="timeflow-axis-labels-container horizontal-axis-labels-container axis-labels-container"></div>';
        wrapper.insertAdjacentHTML('beforeend', timeflow_axis);

        let point_modal = document.createElement('div');
        point_modal.classList.add('point-details-modal');
        wrapper.appendChild(point_modal);

        point_modal.insertAdjacentHTML('afterbegin', '<p class="breakpoint-date"></p>');

        point_modal.insertAdjacentHTML('beforeend', '<ul class="points"></ul>');

        /*label.style.left = left_pos + 'px';
        label.innerText = date;
            <li>
            <span class="point-value">142</span><br>
            <span class="point-chart-name">Joined</span>
            </li>
            <li>
            <span class="point-value">67</span><br>
            <span class="point-chart-name">Left</span>
            </li>
            */

    }

    show_point_details() {
        let canvas = document.querySelector(this.container + ' .chart-canvas');
        let rect = canvas.getBoundingClientRect();

        let obj = this;
        let charts = this.charts;
        let start_index = this.config.start_index;
        let end_index = this.config.end_index;

        canvas.addEventListener('mousemove', function (e) {
            document.querySelector('.point-details-modal').classList.add('show');

            let percentage = (e.pageX - rect.left) / canvas.width;
            let point_index = Math.round(start_index + (end_index - start_index + 1) * percentage);

            if (obj.config.curr_point_index !== point_index) {
                obj.config.curr_point_index = point_index;
                obj.clear_canvas();
                obj.draw_horizontal_grid();
                obj.highlight_line();
                for (let i = 0; i < charts.length; i++) {
                    charts[i].draw_chart();
                    charts[i].highlight_point(point_index);
                }

                obj.show_point_modal(point_index);
            }
        });

        canvas.addEventListener('mouseleave', function () {
            document.querySelector('.point-details-modal').classList.remove('show');
            obj.clear_canvas();
            obj.draw_horizontal_grid();
            for (let i = 0; i < charts.length; i++) {
                charts[i].draw_chart();
            }

        })
    }

    /*highlight_point(canvas, index) {
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
    } */

    highlight_line() {
        let ctx = this.get_ctx();

        ctx.lineWidth = 1;
        ctx.strokeStyle = this.config.grid_accent_colour;

        let x0 = (this.config.curr_point_index - this.config.start_index) * this.charts[0].config.point_dist;

        ctx.beginPath();
        ctx.moveTo(x0, 0);
        ctx.lineTo(x0, this.config.canvas_height);
        ctx.stroke();
        ctx.closePath();
    }

    show_point_modal(index) {
        let modal = document.querySelector('.point-details-modal');
        modal.style.left = ((index - this.config.start_index) * this.charts[0].config.point_dist - 32) + 'px'; // TODO

        let date = 'Sat 12, Feb';
        /*let date = str_to_date(this.config.chart_breakpoints[index], 'day');
        date = date.toLocaleDateString('en-US', {weekday: 'short', month: 'short', day: 'numeric'});*/

        for (let i = 0; i < this.charts.length; i++) {
            modal.querySelectorAll('.point-value')[i].textContent = this.charts[i].config.chart_data[index];
        }

        modal.querySelector('.breakpoint-date').textContent = date;
    }

    clear_canvas() {
        let canvas = document.querySelector(this.container + ' .chart-canvas');

        if (canvas && canvas.getContext) {
            let ctx = canvas.getContext('2d');
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
    }

    get_ctx(){
        let canvas = document.querySelector(this.container + ' .chart-canvas');
        return canvas.getContext('2d');
    }

}

let Default_container_config = {
    canvas_height: 400,
    canvas_width: 400,

    chart_sizing: 20,

    data_start: 0.7,
    data_end: 1,

    grid_colour: '#f2f4f5',
    grid_accent_colour: '#dfe6eb',
};