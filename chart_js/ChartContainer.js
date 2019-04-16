class ChartContainer {
    constructor(container_selector, container_config) {
        this.container_selector = container_selector;
        this.config = container_config;
        this.charts = container_config.data.charts;
        this.timeflow_data = container_config.data.timeflow;
        this.data_len = this.timeflow_data.length;

        this.init();
    }

    init() {
        this.container = document.querySelector(this.container_selector);
        this.config.container_width = this.container.style.width || 0;

        this.fill();
        this.insert_HTML();
        this.theme_switch_init();
        this.charts_init();

        if (this.config.show_preview) {
            this.get_data_range();
        } else {
            this.get_initial_data_range();
        }

        this.get_curr_timeflow_step();
        this.move_timeflow_axis();
        this.handle_empty_state();

        setTimeout(() => {
            if (this.config.show_preview) {
                this.get_preview_coords();
                this.preview_box_init();
            }

            if (this.config.show_labels) {
                this.charts_toggle_draw_init(); // todo other funcs disable
            }

            this.init_point_details_show();
            window.addEventListener('resize', this.resize);
        }, 0);
    }

    fill() {
        if (this.config.data.charts.length < 2 && typeof(this.config.show_labels) === 'undefined') {
            this.config.show_labels = false;
        }

        this.config = Object.assign({}, this.Default_container_config, this.config); // fill empty config fields with default vals
        this.dpi = window.devicePixelRatio;
        this.timeflow_start_offset = (this.data_len - 1) % 2;

        this.get_size();
        this.set_chart_config();
        this.set_preview_chart_config();
        this.bind_event_listeners();
    }

    handle_empty_state() {
        if (this.data_len > 0) {
            this.prepare_autosize_animation(true);
            return;
        }

        this.config.data_start = 0;
        this.config.data_end = 1;
        this.no_data = true;
        this.container.querySelector('.no-data-message').classList.remove('hidden');
    }

    bind_event_listeners() {
        this.catch_box_move = this.catch_box_move.bind(this);
        this.move_show_area = this.move_show_area.bind(this);
        this.cancel_move_show_area = this.cancel_move_show_area.bind(this);

        this.chart_preview_resize = this.chart_preview_resize.bind(this);
        this.cancel_chart_preview_resize = this.cancel_chart_preview_resize.bind(this);

        this.resize = this.resize.bind(this);
    }

    // --- Chart params ---

    get_data_len() {
        this.data_len = this.timeflow_data.length;
    }

    set_preview_chart_config() {
        // let

        this.preview_chart_config = {
            chart_sizing: this.config.chart_sizing, // changable

            point_dist: this.config.preview_canvas_width / (this.data_len - 1),
            start_index: 0,
            points_count: this.data_len,
            offset_left: 0,
            side_padding: 0,
            padding_top: 5,
        };
    }

    set_chart_config() {
        this.chart_config = {
            chart_sizing: this.config.chart_sizing, // changable

            point_dist: this.config.preview_canvas_width / (this.data_len - 1),
            start_index: 0,
            end_index: 0,
            points_count: this.data_len,
            offset_left: 0,
            side_padding: this.config.side_padding,
            padding_top: 18,
        };
    }

    set_chart_params(is_preview = false) {
        const prefix = is_preview ? 'preview_' : '';
        let config = this[prefix + 'chart_config'];

        for (let chart of this.charts) {
            chart.config = Object.assign(chart.config, config);
        }
    }

    set_basic_chart_config() {
        this.basic_chart_config = {
            draw: true,
            show_label: this.config.show_labels,

            dpi: this.dpi,

            chart_wrapper_selector: this.container_selector,
            canvas_selector: '.chart-canvas',
            canvas_width: this.config.canvas_width,
            canvas_height: this.config.canvas_height,

            bg_color: this.config.bg_color,

            opacity: 1,
        };
    }

    charts_init() {
        this.set_basic_chart_config();

        for (let i = 0; i < this.charts.length; i++) {
            let chart_config = Object.assign({}, this.basic_chart_config, this.charts[i]);
            this.charts[i] = new ChartLine(chart_config);
        }

        this.preview_chart_config.content_height = this.config.preview_canvas_height - this.preview_chart_config.padding_top;
        this.chart_config.content_height = this.config.canvas_height - this.chart_config.padding_top;
        this.assign_max_line_width();
    }

    update_point_dist() {
        this.preview_chart_config.point_dist = this.config.preview_canvas_width / (this.data_len - 1);
    }

    assign_max_line_width() {
        let max = 0;

        for (let chart of this.charts) {
            if (chart.config.line_width > max) {
                max = chart.config.line_width;
            }
        }

        this.config.max_line_width = max;
    }

    // --- Adjust container width ---

    get_size() {
        this.container.style.width = this.config.container_width + "px";

        this.config.canvas_width = Math.max(this.container.clientWidth, 320);
        this.container.style.width = this.config.canvas_width + 'px';

        if (this.config.canvas_width < this.config.min_adjust_width) {
            this.container.style.width = '100%';
            this.config.canvas_width = this.container.clientWidth;
        }

        this.content_width = this.config.canvas_width - 2 * this.config.side_padding;
        this.config.preview_canvas_width = this.content_width;
    }

    adjust_widths() {
        let temp = (this.chart_config.start_index) / (this.data_len - 1);
        let width = (this.chart_config.end_index - this.chart_config.start_index) / (this.data_len);

        if (!(this.config.hasOwnProperty('adjustable') && !this.config.adjustable)) {
            this.get_size();
        }

        // style
        if (this.config.show_name) {
            this.container.querySelector('.chart-container-name').style.width = this.content_width + 'px';
        }

        this.container.querySelector('.canvas-layer').style.width = this.content_width + 'px';
        this.timeflow_axis.style.width = this.config.canvas_width + 'px';
        this.show_area_box.style.left = (temp * this.content_width) + 'px';
        this.show_area_box.style.width = (width * this.content_width) + 'px';

        this.container.querySelector('.chart-preview-wrapper').style.width = this.content_width + 'px';

        this.canvas.style.width = this.config.canvas_width + 'px';
        this.canvas.style.height = this.config.canvas_height + 'px';
        this.canvas.setAttribute('width', this.config.canvas_width * this.dpi + 'px');
        this.canvas.setAttribute('height', this.config.canvas_height * this.dpi + 'px');

        this.preview_canvas.style.width = this.content_width + 'px';
        this.preview_canvas.setAttribute('width', this.content_width * this.dpi + 'px');

        if (this.config.show_labels)
            this.container.querySelector('.charts-labels-list').style.width = this.content_width + 'px';
    }

    resize() {
        this.highlight = false;
        this.cancel_point_details_show();

        if (this.config.adjustable) {
            this.adjust_widths();
        } else {
            // this.get_preview_coords();
        }

        this.get_preview_coords();

        let width = (this.chart_config.end_index - this.chart_config.start_index) / (this.data_len);
        let temp = (this.chart_config.start_index) / (this.data_len - 1);
        this.layer_left.style.width = (temp * this.content_width) + 'px';
        this.layer_right.style.width = ((1 - temp - width) * this.content_width) + 'px';

        // redraw
        this.update_point_dist();
        for (let chart of this.charts) {
            this.set_chart_params(true);
            if (chart.config.draw) {
                chart.draw_chart('.chart-preview-canvas');
            }
        }

        this.get_data_range();
        this.update_main_chart();
    }

    highlight_check() {
        if (this.highlight) {
            this.curr_point_index = this.get_point_index(this.curr_mouse_pos);
            this.show_point_modal(this.curr_point_index);
            let point_coord = this.get_point_x_coord(this.curr_point_index);
            this.highlight_line(point_coord);
        }
    }

    // --- Canvas manipulation ---

    clear_canvas() {
        let ctx = this.canvas.getContext('2d');
        ctx.clearRect(0, 0, this.config.canvas_width * this.dpi, this.config.canvas_height * this.dpi);
    }

    clear_preview_canvas() {
        let ctx = this.preview_canvas.getContext('2d');
        ctx.clearRect(0, 0, this.config.preview_canvas_width * this.dpi, this.config.preview_canvas_height * this.dpi);
    }

    get_ctx() {
        return this.canvas.getContext('2d');
    }

    update_preview_chart() {
        this.autosize(true);
        this.update_point_dist();
        this.set_chart_params(true);
        this.clear_preview_canvas();

        for (let chart of this.charts) {
            if (chart.config.draw) {
                chart.draw_chart('.chart-preview-canvas');
            }
        }
    }

    update_main_chart() {
        this.autosize(); // get chart sizing
        this.get_data_range();
        this.display_vertical_axis();
        this.update_main_chart_canvas();
        this.get_curr_timeflow_step();
        this.move_timeflow_axis();
    }

    update_main_chart_canvas() {
        this.clear_canvas();
        this.draw_horizontal_grid();
        this.highlight_check();

        for (let chart of this.charts) {
            this.set_chart_params();

            if (chart.config.draw) {
                chart.draw_chart();
                if (this.highlight) chart.highlight_point(this.curr_point_index);
            }
        }
    }

    draw_gridline(y) {
        this.ctx.beginPath();
        this.ctx.moveTo(this.config.side_padding * this.dpi, (this.config.canvas_height - y) * this.dpi);
        this.ctx.lineTo((this.content_width + this.config.side_padding) * this.dpi, (this.config.canvas_height - y) * this.dpi);
        this.ctx.stroke();
        this.ctx.closePath();
    }

    highlight_line(x0) {
        this.ctx.lineWidth = 1;
        this.ctx.strokeStyle = this.config.grid_accent_colour;
        this.ctx.globalAlpha = 1;

        this.ctx.beginPath();
        this.ctx.moveTo(~~(x0 * this.dpi) + 0.5, this.chart_config.padding_top * this.dpi);
        this.ctx.lineTo(~~(x0 * this.dpi) + 0.5, this.config.canvas_height * this.dpi);
        this.ctx.stroke();
        this.ctx.closePath();
    }

    draw_horizontal_grid() {
        this.set_vertical_axis_step();

        this.ctx.lineWidth = 1;
        this.ctx.strokeStyle = this.config.grid_colour;
        this.ctx.globalAlpha = 1;

        let y0 = -this.chart_config.chart_sizing * this.chart_config.vertical_axis_val_step + 1;

        for (let i = 0; i < this.config.vertical_axis_steps_count; i++) {
            y0 += this.chart_config.chart_sizing * this.chart_config.vertical_axis_val_step;
            y0 = ~~y0 + 0.5;

            this.draw_gridline(y0);
        }
    }

// --- Theme settings ---

    set_theme_colors() {
        this.config.theme_colors = {
            night: {
                bg_color: '#242f3e',
                grid_accent_colour: '#394858',
                grid_colour: '#3d4a5d',
            },
            day: {
                bg_color: '#ffffff',
                grid_colour: '#f2f4f5',
                grid_accent_colour: '#dfe6eb',
            }
        };
    }

    theme_switch_init() {
        this.set_theme_colors();
        this.set_colours();
    }

    set_colours() {
        this.config.bg_color = this.config.theme_colors[this.config.mode].bg_color;
        this.config.grid_accent_colour = this.config.theme_colors[this.config.mode].grid_accent_colour;
        this.config.grid_colour = this.config.theme_colors[this.config.mode].grid_colour;

        this.chart_config.bg_color = this.config.bg_color;
    }

    set_mode(mode) {
        this.config.mode = mode;

        this.set_colours();
        this.update_main_chart_canvas();
    }

// --- Vertical axis step ---

    autosize(is_preview = false) {
        const prefix = is_preview ? 'preview_' : '';
        let config = this[prefix + 'chart_config'];

        let max = 0,
            start_point = config.start_index;
        if (config.start_index !== 0) {
            start_point--;
        }

        for (let a = 0; a < this.charts.length; a++) {
            if (this.charts[a].config.draw) {
                for (let i = 0; i < config.points_count; i++) {
                    if (this.charts[a].config.chart_data[start_point + i] > max) {
                        max = this.charts[a].config.chart_data[start_point + i];
                    }
                }
            }
        }

        // console.log(this.charts[0].config.chart_data);
        // console.log(max);

        if (!this.no_data && max !== 0) {
            this.config.chart_max = max;
        } else {
            max = this.config.chart_max;
        }

        config.chart_sizing = (config.content_height - this.config.max_line_width / 2) / max;
        // console.log(max);
        // console.log(config.chart_sizing);
        // console.log('----');
    }


// --- Display axises ---

    get_curr_timeflow_step() {
        let step = 1;

        while (this.chart_config.points_count / step > this.config.timeflow_steps_count) {
            step *= 2;
        }

        this.curr_timeflow_step = step;
    }

    resize_timeflow_axis() {
        this.destroy_old_labels('timeflow');

        let k = this.curr_area_border === 'right' ? 1 : -1;

        this.get_curr_timeflow_step();

        // -- getting start point --
        let start_point = this.curr_area_border === 'right' ? this.chart_config.start_index :
            this.chart_config.end_index;
        let iteration_step = (this.curr_timeflow_step > 1 ? this.curr_timeflow_step / 2 : 1);

        if (start_point !== 0 && start_point !== this.data_len - 1) {
            start_point -= k;
        }

        let opacity = (this.curr_timeflow_step * this.config.timeflow_steps_count) / this.chart_config.timeflow_points_count - 1;
        // -- making labels list --

        let labels_list = '';

        for (let i = 0; i < this.chart_config.timeflow_points_count; i++) {
            if ((start_point - this.timeflow_start_offset + k * i) % iteration_step === 0) {
                let left_pos = this.get_point_x_coord(start_point + k * i);
                let date = this.timeflow_labels_date_wrapper(this.timeflow_data[start_point + k * i]);

                let class_list = 'axis-label timeflow-axis-label ';
                let style = 'left: ' + left_pos + 'px; ';

                if ((start_point - this.timeflow_start_offset + k * i) % this.curr_timeflow_step !== 0) {
                    class_list += ' faded';
                    style += ' opacity: ' + opacity;
                }

                labels_list += "<span class='" + class_list + "' style='" + style + "' >" + date + "</span>";
            }
        }

        this.timeflow_axis.insertAdjacentHTML('beforeend', labels_list);
    }

    move_timeflow_axis() {
        this.destroy_old_labels('timeflow');

        let step = this.curr_timeflow_step;

        let steps_count = this.chart_config.timeflow_points_count;
        let start_point = this.chart_config.start_index;

        if (this.chart_config.start_index !== 0) {
            start_point--;
        }

        // const offset = (step - (start_point - this.timeflow_start_offset) % step) % step;
        while ((start_point - this.timeflow_start_offset) % step !== 0) {
            start_point++;
            steps_count--;
        }

        let labels_list = '';

        for (let i = 0; i < steps_count; i += step) {
            let left_pos = this.get_point_x_coord(start_point + i);
            let date = this.timeflow_labels_date_wrapper(this.timeflow_data[start_point + i]);

            let class_list = 'axis-label timeflow-axis-label ';
            let style = 'left: ' + left_pos + 'px';
            labels_list += "<span class='" + class_list + "' style='" + style + "' >" + date + "</span>";
        }

        this.timeflow_axis.insertAdjacentHTML('beforeend', labels_list);
    }

    timeflow_labels_date_wrapper(timestamp) {
        if (this.timeflow_data_cahce[timestamp] == undefined) {
            this.timeflow_data_cahce[timestamp] = this.config.timeflow_labels_date_func(timestamp);
        }

        return this.timeflow_data_cahce[timestamp];
    }

    display_vertical_axis() {
        this.destroy_old_labels('vertical');

        let vertical_axis_labels = '';
        this.set_vertical_axis_step();

        for (let i = 0; i < this.config.vertical_axis_steps_count; i++) {
            let val = i * this.chart_config.vertical_axis_val_step;
            let bottom_pos = this.chart_config.chart_sizing * val;

            vertical_axis_labels += "<span class='axis-label vertical-axis-label' style='bottom: " + bottom_pos + "px'>" +
                ChartContainer.round_val(val) + "</span>";
        }

        this.vertical_axis_labels_container.insertAdjacentHTML('afterbegin', vertical_axis_labels);
    }

    static round_val(val) {
        if ((val - ~~val) / val < 0.1) {
            return Math.round(val);
        }

        return val.toPrecision(2);
    }

    destroy_old_labels(axis_type) {
        let old_labels = this.container.querySelector(' .' + axis_type + '-axis-labels-container');

        if (old_labels) {
            while (old_labels.firstChild) {
                old_labels.removeChild(old_labels.firstChild);
            }
        }
    }

    set_vertical_axis_step(chart_sizing = this.chart_config.chart_sizing) {
        let grid_padding_top = 15;
        this.chart_config.vertical_axis_val_step = (this.chart_config.content_height - grid_padding_top) /
            (this.config.vertical_axis_steps_count - 1) / chart_sizing;
    }

    get_vertical_axis_step(chart_sizing = this.chart_config.chart_sizing) {
        let grid_padding_top = 15;
        return (this.chart_config.content_height - grid_padding_top) / (this.config.vertical_axis_steps_count - 1) / chart_sizing;
    }

    // --- Point functions ---

    get_point_x_coord(index) {
        return ~~((index - this.chart_config.start_index) * this.chart_config.point_dist + this.chart_config.offset_left) + 0.5;
    }

    get_point_index() {
        let canvas_pos = this.curr_mouse_pos - this.canvas.getBoundingClientRect().left;
        return this.chart_config.start_index +
            Math.round((canvas_pos - this.chart_config.offset_left) / this.chart_config.point_dist);
    }

    static get_border_side(border_index) {
        return border_index === 0 ? 'left' : 'right';
    }

    // --- Get data range ---

    get_initial_data_range() {
        this.config.data_show_percentage = this.config.data_end - this.config.data_start;
        let precise_point_distances_count = this.config.data_show_percentage * (this.data_len - 1);
        this.chart_config.point_dist = this.content_width / precise_point_distances_count; // horizontal distance btw points

        this.config.unrounded_start_index = this.chart_config.data_start * (this.data_len - 1);
        this.config.unrounded_end_index = this.chart_config.data_end * (this.data_len - 1);

        this.chart_config.start_index = Math.ceil(this.config.unrounded_start_index); // indexes of side content point
        this.chart_config.end_index = Math.floor(this.config.unrounded_end_index);

        this.set_offsets();
        this.set_points_count();
    }

    get_data_range() {
        this.set_point_dist();
        this.set_data_show_percentage();
        this.set_content_point_indexes();
        this.set_offsets();
        this.set_points_count();
    }

    set_point_dist() {
        this.config.data_show_percentage = this.show_area_box.offsetWidth / this.config.preview_canvas_width;
        let precise_point_distances_count = this.config.data_show_percentage * (this.data_len - 1);
        this.chart_config.point_dist = this.content_width / precise_point_distances_count; // horizontal distance btw points
    }

    set_data_show_percentage() {
        this.chart_config.data_start = this.show_area_box.offsetLeft / this.config.preview_canvas_width;
        this.chart_config.data_end = this.chart_config.data_start + this.config.data_show_percentage;
    }

    set_content_point_indexes() {
        this.config.unrounded_start_index = this.chart_config.data_start * (this.data_len - 1);
        this.config.unrounded_end_index = this.chart_config.data_end * (this.data_len - 1);

        this.chart_config.start_index = Math.ceil(this.config.unrounded_start_index); // indexes of side content point
        this.chart_config.end_index = Math.floor(this.config.unrounded_end_index);
    }

    // ---

    set_offsets() {
        this.calculate_offset_left();
        this.calculate_offset_right();
    }

    calculate_offset_left() {
        // distance btw canvas left side -> first content point
        let offset_left = (this.chart_config.start_index - this.config.unrounded_start_index) * this.chart_config.point_dist;

        // get dist canvas left edge -> first point
        let total_offset = offset_left + this.chart_config.side_padding;
        let steps_diff = Math.floor(total_offset / this.chart_config.point_dist);

        if (steps_diff > 0) {
            if (steps_diff > this.chart_config.start_index) { // left edge is reached && padding left contains 1+steps
                steps_diff = this.chart_config.start_index;
            }
            this.chart_config.start_index -= steps_diff; // index of side canvas point
        }

        this.chart_config.steps_diff_left = steps_diff;
        this.chart_config.offset_left = total_offset - this.chart_config.point_dist * steps_diff;
    }

    calculate_offset_right() {
        let offset_right = this.chart_config.point_dist * (this.config.unrounded_end_index - this.chart_config.end_index);

        this.chart_config.content_end_index = this.chart_config.end_index;

        let total_offset_r = offset_right + this.chart_config.side_padding;
        let steps_diff_right = Math.floor(total_offset_r / this.chart_config.point_dist);

        if (steps_diff_right > 0) {
            if (steps_diff_right > this.data_len - this.chart_config.end_index - 1) {
                steps_diff_right = this.data_len - this.chart_config.end_index - 1;
            }

            this.chart_config.end_index += steps_diff_right; // index of side canvas point
        }
        this.chart_config.steps_diff_right = steps_diff_right;
    }

    // ---

    set_points_count() { // number of all visible points + max2 outside
        this.chart_config.points_count = this.chart_config.end_index - this.chart_config.start_index + 1; // number of all visible points

        if (this.chart_config.end_index !== this.data_len - 1) {
            this.chart_config.points_count++;
        }

        if (this.chart_config.start_index !== 0) {
            this.chart_config.points_count++;
        }

        // ----

        this.chart_config.timeflow_points_count = this.chart_config.points_count;

        let additional_steps = Math.ceil(this.config.timeflow_label_width / this.chart_config.point_dist) - 1;
        if (additional_steps > 0) {
            if (additional_steps + this.chart_config.end_index > this.data_len - 2) {
                additional_steps = this.data_len - 2 - this.chart_config.end_index;
            }
            this.chart_config.timeflow_points_count += additional_steps;
        }
    }

    static other_side(side) {
        return side === 'left' ? 'right' : 'left';
    }

    // --- Chart toggle draw ---

    charts_toggle_draw_init() {
        this.animate_chart_labels();

        let inputs = this.container.querySelectorAll('.chart-draw-checkbox');

        for (let i = 0; i < inputs.length; i++) {
            inputs[i].addEventListener('change', this.toggle_chart_draw.bind(this, i));
        }
    }

    toggle_chart_draw(i) {
        this.charts[i].config.draw = !this.charts[i].config.draw;
        if (!this.charts[i].config.draw) {
            this.no_data = true;
            for (let chart of this.charts) {
                if (chart.config.draw) {
                    this.no_data = false;
                }
            }
        } else {
            this.no_data = false;
        }

        if (!this.no_data) {
            this.container.querySelector('.no-data-message').classList.add('hidden');
        }

        let temp = this.preview_chart_config.chart_sizing;
        this.autosize(true);
        this.config.preview_chart_sizing_diff = this.preview_chart_config.chart_sizing - temp;

        this.point_modal.querySelectorAll('li')[i].classList.toggle('hidden');

        this.autosize();
        this.config.chart_sizing_diff = this.chart_config.chart_sizing - this.charts[0].config.chart_sizing;

        if (this.config.animation_end) {
            let k = this.charts[i].config.draw ? 1 : -1;
            window.requestAnimationFrame(this.animate_cancel_draw.bind(this, i, k));
        }
    }
}

// ----

ChartContainer.prototype.Default_container_config = {
    adjustable: true,
    is_mobile: false,
    min_adjust_width: 500,

    name: '',
    show_name: true,
    name_link: null,

    show_labels: true,
    show_preview: true,

    canvas_height: 400,
    preview_canvas_height: 55,
    preview_canvas_width: undefined,

    side_padding: 15,
    padding_top: 10,

    data_start: 0.7,
    data_end: 1,

    vertical_axis_steps_count: 6,
    timeflow_steps_count: 6,
    timeflow_labels_step: 1,

    timeflow_label_width: 42,

    mode: 'day',

    duration: 180,
    autosize_duration: 100,
    animation_end: true,

    // no_data: false,
    no_data_message: 'No data to display',

    timeflow_labels_date_func: (timestamp) => {
        return new Date(timestamp * 1000)
            .toLocaleDateString('en-US', {month: 'short', day: 'numeric'})
    },

    point_modal_date_func: (timestamp) => {
        return new Date(timestamp * 1000)
            .toLocaleDateString('en-US', {weekday: 'short', month: 'short', day: 'numeric'});
    }
};

ChartContainer.prototype.no_data = false;
ChartContainer.prototype.timeflow_data_cahce = [];
ChartContainer.prototype.point_modal_date_cahce = [];

// todo change font color with line color
// todo last point show point modal
// todo different side padding values
// todo first last lines redraw fix
// todo preview box resize bug
// todo update breakpoints data cash

/*
* - number
* - average
* - no data
*
* 1) Prefill array
*
* -- fill timeflow
*
* - num: just fill all numbers
* - average: count+fill all numbers
* - no data:
**
* */