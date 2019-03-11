class Chart_container {
    constructor(container, container_config, charts) {
        this.container = container;
        this.config = container_config;
        this.charts = charts;

        if (document.querySelector(this.container)) {
            this.init();
        }
    }

    init() {
        this.fill(); // filling empty fields with default values
        this.insert_HTML();
        // preview_box_init();

        // --- initialize charts ---

        let basic_chart_config = {
            draw: true,

            chart_wrapper_selector: this.container,
            canvas_selector: '.chart-canvas',
            canvas_width: this.config.canvas_width,
            canvas_height: this.config.canvas_height,

            // chart_sizing: this.config.chart_sizing,
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

        this.charts_toggle_init();

        // this.display_timeflow_axis()
        this.display_all();
        this.init_point_details_show();
        this.preview_box_init();
    }

    display_all() {
        this.preview_chart_init();
        this.update_main_chart();
    }

    preview_chart_init() {
        this.clear_preview_canvas();
        this.autosize(true); // get chart sizing

        for (let i = 0; i < this.charts.length; i++) {
            this.charts[i].draw_chart('.chart-preview-canvas', true);
        }
    }

    update_main_chart() {
        this.autosize(); // get chart sizing
        this.display_vertical_axis();

        this.clear_canvas();
        this.draw_horizontal_grid();

        for (let i = 0; i < this.charts.length; i++) {
            this.charts[i].config.start_index = this.config.start_index;
            this.charts[i].config.end_index = this.config.end_index;
            this.charts[i].draw_chart();

        }
    }

    autosize(preview = false) {
        let all_points_count = this.charts[0].config.chart_data.length; // all charts contains same number of points
        this.config.start_index = Math.floor(this.config.data_start * all_points_count);
        this.config.end_index = Math.floor(this.config.data_end * all_points_count);

        let max = this.charts[0].config.chart_data[this.config.start_index];

        for (let a = 0; a < this.charts.length; a++) {
            for (let i = 0; i < all_points_count; i++) {
                if (this.charts[a].config.chart_data[this.config.start_index + i] > max) {
                    max = this.charts[a].config.chart_data[this.config.start_index + i];
                }
            }
        }

        // TODO let max_line_width = get_max()
        let max_line_width = 2;
        let max_point_radius = 4;

        let canvas_height = (preview ? this.config.preview_canvas_height : this.config.canvas_height);
        this.config.chart_sizing = (canvas_height - max_line_width / 2 - max_point_radius) / max;

        for (let i = 0; i < this.charts.length; i++) {
            this.charts[i].config.chart_sizing = this.config.chart_sizing;
        }
    }

    destroy_old_labels(axis_type) {
        let old_labels = document.querySelector(this.container + ' .' + axis_type + '-axis-labels-container');

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

        // --- preview chart HTML ---

        let preview_wrapper = document.createElement('div');
        preview_wrapper.classList.add('chart-preview-wrapper');
        container_wrapper.appendChild(preview_wrapper);

        let preview_canvas = "<canvas class='chart-preview-canvas' width='" + this.config.preview_canvas_width + "' height='" + this.config.preview_canvas_height + "'></canvas>";
        let show_area_box = '<div class="show-area-container chart-area-container"><div class="area-border-right area-border" id="area-border-left"><div class="layer"></div></div>' +
            '<div class="area-border-left area-border" id="area-border-right"><div class="layer"></div></div></div>';
        preview_wrapper.insertAdjacentHTML('beforeend', preview_canvas);
        preview_wrapper.insertAdjacentHTML('beforeend', show_area_box);

        // --- labels list ---

        let labels_form = document.createElement('form');
        labels_form.classList.add('charts-draw-form');
        labels_form.setAttribute('name', this.config.name + '_charts_draw_form');
        container_wrapper.appendChild(labels_form);
        let list = document.createElement('ul');
        list.classList.add('charts-labels-list');
        labels_form.appendChild(list);
    }

    init_point_details_show() {
        let canvas = document.querySelector(this.container + ' .chart-canvas');
        let rect = canvas.getBoundingClientRect();

        let obj = this;
        let charts = this.charts;
        // let start_index = this.config.start_index;
        // let end_index = this.config.end_index;

        canvas.addEventListener('mousemove', function (e) {
            document.querySelector('.point-details-modal').classList.add('show');

            let percentage = (e.pageX - rect.left) / canvas.width;
            let point_index = Math.round(obj.config.start_index + (obj.config.end_index - obj.config.start_index + 1) * percentage);

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

    clear_preview_canvas() {
        let canvas = document.querySelector(this.container + ' .chart-preview-canvas');

        if (canvas && canvas.getContext) {
            let ctx = canvas.getContext('2d');
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
    }

    get_ctx() {
        let canvas = document.querySelector(this.container + ' .chart-canvas');
        return canvas.getContext('2d');
    }

    // --- preview box functions ---

    preview_box_init() {
        document._show_area_move = true;

        let area_border_width = 5;
        area_border_width += 2;

        let container = document.querySelector(this.container);
        let chart_preview_container = container.querySelector('.chart-preview-wrapper');
        let show_area_container = container.querySelector('.show-area-container');

        let x_pos_left = chart_preview_container.getBoundingClientRect().left;
        let x_pos_right = chart_preview_container.getBoundingClientRect().right;
        let preview_box_width = x_pos_right - x_pos_left;

        let area_borders = container.querySelectorAll('.area-border');

        let obj = this; // link to current chart container TODO

        for (let i = 0; i < 2; i++) {
            area_borders[i].addEventListener("mousedown", function () {
                document.curr_area_border = get_border_side(this);
                document._show_area_move = false;

                let rect = show_area_container.getBoundingClientRect();
                let old_pos,
                    other_side = 'right';

                if (document.curr_area_border === 'left') {
                    old_pos = x_pos_right - rect.right;
                } else {
                    other_side = 'left';
                    old_pos = rect.left - x_pos_left;
                }

                show_area_container.style[other_side] = old_pos + 'px';
                show_area_container.style[document.curr_area_border] = 'auto';

                document.addEventListener("mousemove", chart_preview_listener);
                document.addEventListener("mouseup", cancel_listener);
                // chart_preview_container.addEventListener("mouseleave", cancel_listener); // TODO
            });
        }

        let chart_preview_listener = function (e) {
            let rect = show_area_container.getBoundingClientRect(); // TODO 2 rects
            e = e || window.event;
            let mouse_x = e.pageX;

            if (document.curr_area_border === 'left') {
                if (!(mouse_x <= x_pos_left || mouse_x >= rect.right - area_border_width)) { // inside the preview box

                    let dist_to_left = mouse_x - x_pos_left; // TODO const dist pass ???
                    let dist_to_right = x_pos_right - rect.right;

                    let new_width = preview_box_width - dist_to_left - dist_to_right;
                    show_area_container.style.width = new_width + 'px';

                    obj.config.data_start = (mouse_x - x_pos_left) / preview_box_width; // TODO -data-start
                    obj.config.start_index = Math.floor(obj.config.data_start * obj.charts[0].config.chart_data.length); // percentage

                    obj.update_main_chart();
                }
            } else {
                if (!(mouse_x <= rect.left + area_border_width || mouse_x >= x_pos_right)) { // inside the preview box
                    let dist_to_left = rect.left - x_pos_left;
                    let dist_to_right = x_pos_right - mouse_x;

                    let new_width = preview_box_width - dist_to_left - dist_to_right;
                    show_area_container.style.width = new_width + 'px';

                    obj.config.data_end = (mouse_x - x_pos_left) / preview_box_width;
                    obj.config.end_index = Math.floor(obj.config.data_start * obj.charts[0].config.chart_data.length); // percentage

                    obj.update_main_chart();
                }
            }
        };

        let cancel_listener = function () {
            document.removeEventListener("mousemove", chart_preview_listener); // TODO
            document._show_area_move = true;
        };

        // --- box moving ---

        show_area_container.addEventListener("mousedown", function (e) {
            let rect = show_area_container.getBoundingClientRect();

            document.curr_preview_box_pos = rect.right - e.pageX; // TODO obj.config...
            document.curr_show_area_width = rect.right - rect.left; // TODO

            document.addEventListener("mousemove", move_show_area);
            document.addEventListener("mouseup", cancel_move_show_area);

        });

        let cancel_move_show_area = function () {
            document.removeEventListener("mousemove", move_show_area);
        };


        let move_show_area = function (e) {
            if (document._show_area_move) {
                e = e || window.event;
                let mouse_x = e.pageX;

                if (!(mouse_x - document.curr_show_area_width + document.curr_preview_box_pos <= x_pos_left || mouse_x + document.curr_preview_box_pos >= x_pos_right)) {
                    let new_pos_right = x_pos_right - mouse_x - document.curr_preview_box_pos;
                    show_area_container.style.right = new_pos_right + 'px';
                } else {
                    // out of the box
                }

                get_data_range();
                obj.update_main_chart();
                // Configurable.draw_chart();
                // Configurable.display_vertical_axis();
            }
        };

        get_data_range();


        function get_data_range() {
            // TODO: wrong left pos
            let rect = show_area_container.getBoundingClientRect();
            let data_len = obj.charts[0].config.chart_data.length;
            // console.log(obj.config.;
            // let ercen

            obj.config.data_start = (rect.left - x_pos_left) / preview_box_width;
            obj.config.data_end = (rect.right - x_pos_left) / preview_box_width;
            obj.config.start_index = Math.floor(obj.config.data_start * data_len); // 9.5
            obj.config.end_index = Math.floor(obj.config.data_end * data_len);
        }

        function get_border_side(elem) {
            for (let i = 0, count = elem.classList.length; i < count; i++) {
                if (elem.classList[i].includes('left')) {
                    return 'left';
                } else if (elem.classList[i].includes('right')) {
                    return 'right';
                }
            }
        }
    }

    charts_toggle_init() {
        let inputs = document.querySelectorAll(this.container + ' .chart-draw-checkbox');
        let obj = this;
        for (let i = 0; i < inputs.length; i++) {
            inputs[i].addEventListener('change', function () {
                obj.charts[i].config.draw = !obj.charts[i].config.draw;
                obj.display_all();
            });
        }

    }

}

let Default_container_config = {
    canvas_height: 400,
    canvas_width: 400,

    preview_canvas_height: 60,
    preview_canvas_width: 400,

    chart_sizing: 20,

    data_start: 0.7,
    data_end: 1,

    grid_colour: '#f2f4f5',
    grid_accent_colour: '#dfe6eb',
};