class ChartContainer {
    constructor(container_selector, container_config) {
        this.container_selector = container_selector;
        this.config = container_config;
        this.charts = container_config.data.charts;
        this.timeflow_data = container_config.data.timeflow;

        this.data_len = this.timeflow_data.length; // Todo
        this.init();
    }

    init() {
        this.container = document.querySelector(this.container_selector);
        this.fill();
        this.get_size();
        this.insert_HTML();

        // setTimeout(function () {
        this.theme_switch_init();
        this.charts_init();
        this.preview_chart_init();
        this.preview_box_init();
        this.update_main_chart();

        this.charts_toggle_draw_init();
        this.init_point_details_show();
        window.addEventListener('resize', this.resize);
        // }.bind(this), 100);
    }


    get_size() {
        if (this.config.hasOwnProperty('adjustable') && !this.config.adjustable) {
            return;
        }

        this.config.canvas_width = this.container.clientWidth < 320 ? 320 : this.container.clientWidth;
        this.content_width = this.config.canvas_width - 2 * this.config.side_padding;
        this.config.preview_canvas_width = this.content_width;
    }

    adjust_widths() {
        let temp = (this.chart_config.start_index) / (this.data_len - 1);
        let width = (this.chart_config.end_index - this.chart_config.start_index) / (this.data_len);

        this.get_size();

        // style
        this.container.querySelector('.chart-container-name').style.width = this.content_width + 'px';
        this.container.querySelector('.canvas-layer').style.width = this.content_width + 'px';
        this.timeflow_axis.style.width = this.config.canvas_width + 'px';
        this.show_area_box.style.left = (temp * this.content_width) + 'px';
        this.show_area_box.style.width = (width * this.content_width) + 'px';

        this.container.querySelector('.chart-preview-wrapper').style.width = this.content_width + 'px';

        this.canvas.setAttribute('width', this.config.canvas_width + 'px');
        this.preview_canvas.setAttribute('width', this.content_width + 'px');

        this.container.querySelector('.charts-labels-list').style.width = this.content_width + 'px';

        this.get_preview_coords();

        this.layer_left.style.width = (temp * this.content_width) + 'px';
        this.layer_right.style.width = ((1 - temp - width) * this.content_width) + 'px';
    }

    resize() {
        if (this.config.adjustable) {
            this.adjust_widths();
        } else {
            this.get_preview_coords();
        }

        // redraw
        this.update_point_dist();
        for (let i = 0; i < this.charts.length; i++) {
            this.set_chart_params(true);
            if (this.charts[i].config.draw) {
                this.charts[i].draw_chart('.chart-preview-canvas');
            }
        }

        this.get_data_range();
        this.update_main_chart();
    }

    animate_chart_labels() {
        this.labels = this.container.querySelectorAll('.charts-labels-list li');

        for (let i = 0; i < this.labels.length; i++) {
            this.labels[i].addEventListener('click', function () {
                this.labels[i].classList.add('active');

                setTimeout(function () {
                    this.labels[i].classList.remove('active');
                }.bind(this), 300);
            }.bind(this));
        }
    }

    update_all() {//todo
        this.preview_chart_init();
        this.update_main_chart();
    }

    preview_chart_init() {
        this.clear_preview_canvas();
        this.autosize(true); // get chart sizing

        for (let i = 0; i < this.charts.length; i++) {
            this.set_chart_params(true);
            if (this.charts[i].config.draw) {
                this.charts[i].draw_chart('.chart-preview-canvas');
            }
        }
    }

    update_main_chart() {
        this.autosize(); // get chart sizing
        this.display_vertical_axis();
        this.update_main_chart_canvas();

        // ---
        this.config.curr_timeflow_step = 1;
        this.get_curr_timeflow_step();
        this.move_timeflow_axis();
    }

    update_main_chart_canvas() {
        this.clear_canvas();
        this.draw_horizontal_grid();

        for (let i = 0; i < this.charts.length; i++) {
            this.set_chart_params();

            if (this.charts[i].config.draw) {
                this.charts[i].draw_chart();
            }
        }
    }

    add_chart(config) {
        let new_chart_index = this.charts.length;
        this.charts[new_chart_index] = config;
        this.init_chart(new_chart_index);
        this.update_all();
    }

// ---

    get_data_len() {
        return this.timeflow_data.length;
    }

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

// --- Set vertical chart step ---

    autosize(is_preview = false) {
        let prefix = is_preview ? 'preview_' : '';
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

        if (!this.config.no_data) {
            this.config.chart_max = max;
        } else {
            max = this.config.chart_max;
        }

        const canvas_content_height = config.content_height;
        config.chart_sizing = (canvas_content_height - this.config.max_line_width / 2) / max;
    }

    set_chart_params(is_preview = false) {
        let prefix = is_preview ? 'preview_' : '';
        let config = this[prefix + 'chart_config'];

        for (let i = 0; i < this.charts.length; i++) {
            this.charts[i].config = Object.assign(this.charts[i].config, config);// assign
        }
    }

// --- Display axises ---

    get_curr_timeflow_step() {
        let step = 1;

        while (this.chart_config.points_count / step > this.config.timeflow_steps_count) {
            step *= 2;
        }

        this.config.curr_timeflow_step = step;
    }

    resize_timeflow_axis() {
        this.destroy_old_labels('timeflow');

        let k = document.curr_area_border === 'right' ? 1 : -1;

        this.get_curr_timeflow_step();

        // -- getting start point --
        let start_point = document.curr_area_border === 'right' ? this.chart_config.start_index :
            this.chart_config.end_index;
        let iteration_step = (this.config.curr_timeflow_step > 1 ? this.config.curr_timeflow_step / 2 : 1);

        if (start_point !== 0 && start_point !== this.data_len - 1) {
            start_point -= k;
        }

        let opacity = (this.config.curr_timeflow_step * this.config.timeflow_steps_count) / this.chart_config.timeflow_points_count - 1;
        // -- making labels list --

        let labels_list = '';
        let labels_min_dist = 5;

        for (let i = 0; i < this.chart_config.timeflow_points_count; i++) {
            if ((start_point - this.timeflow_start_offset + k * i) % iteration_step === 0) {
                let left_pos = this.get_point_x_coord(start_point + k * i);
                let date = this.config.timeflow_labels_date_func(this.timeflow_data[start_point + k * i]);

                let class_list = 'axis-label timeflow-axis-label ';
                let style = 'left: ' + left_pos + 'px; ';

                if ((start_point - this.timeflow_start_offset + k * i) % this.config.curr_timeflow_step !== 0) {
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

        let step = this.config.curr_timeflow_step;

        let steps_count = this.chart_config.timeflow_points_count;
        let start_point = this.chart_config.start_index;

        if (this.chart_config.start_index !== 0) {
            start_point--;
        }

        while ((start_point - this.timeflow_start_offset) % step !== 0) {
            start_point++;
            steps_count--;
        }

        let labels_list = '';

        let i = 0;
        for (; i < steps_count; i += step) {
            let left_pos = this.get_point_x_coord(start_point + i);
            let date = this.config.timeflow_labels_date_func(this.timeflow_data[start_point + i]);

            let class_list = 'axis-label timeflow-axis-label ';
            let style = 'left: ' + left_pos + 'px';
            labels_list += "<span class='" + class_list + "' style='" + style + "' >" + date + "</span>";
        }

        this.timeflow_axis.insertAdjacentHTML('beforeend', labels_list);
    }

    display_vertical_axis() {
        this.destroy_old_labels('vertical');

        let vertical_axis_labels = '';
        this.set_vertical_axis_step();

        for (let i = 0; i < this.config.vertical_axis_steps_count; i++) {
            let val = i * this.chart_config.vertical_axis_val_step;
            let bottom_pos = this.chart_config.chart_sizing * val;

            vertical_axis_labels += "<span class='axis-label vertical-axis-label' style='bottom: " + bottom_pos + "px'>" +
                Math.round(val) + "</span>";
        }

        this.vertical_axis_labels_container.insertAdjacentHTML('afterbegin', vertical_axis_labels);
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

    get_vertical_axis_step(chart_sizing = this.chart_config.chart_sizing) { // TODO call 2 times ???
        let grid_padding_top = 15;
        return (this.chart_config.content_height - grid_padding_top) / (this.config.vertical_axis_steps_count - 1) / chart_sizing;
    }

// --- Drawing additional canvas elements ---

    draw_horizontal_grid() {
        let ctx = this.canvas.getContext('2d');
        this.set_vertical_axis_step();

        ctx.lineWidth = 1;
        ctx.strokeStyle = this.config.grid_colour;
        ctx.globalAlpha = 1;

        let y0 = this.config.canvas_height + this.chart_config.chart_sizing * this.chart_config.vertical_axis_val_step - 1;

        for (let i = 0; i < this.config.vertical_axis_steps_count; i++) {
            y0 -= this.chart_config.chart_sizing * this.chart_config.vertical_axis_val_step;
            y0 = ~~y0 + 0.5;

            ctx.beginPath();
            ctx.moveTo(this.config.side_padding, y0);
            ctx.lineTo(this.content_width + this.config.side_padding, y0);
            ctx.stroke();
            ctx.closePath();
        }
    }

// ----

    fill() {
        this.config = Object.assign({}, this.Default_container_config, this.config); // fill empty config fields with default vals
        this.timeflow_start_offset = (this.data_len - 1 % 2) === 0 ? 0 : 1;

        this.get_size();
        this.set_chart_config();
        this.set_preview_chart_config();
        this.bind_event_listeners();
    }

    update_point_dist() {
        this.preview_chart_config.point_dist = this.config.preview_canvas_width / (this.data_len - 1);
    }

    bind_event_listeners() {
        this.catch_box_move = this.catch_box_move.bind(this);
        this.move_show_area = this.move_show_area.bind(this);
        this.cancel_move_show_area = this.cancel_move_show_area.bind(this);

        this.chart_preview_resize = this.chart_preview_resize.bind(this);
        this.cancel_chart_preview_resize = this.cancel_chart_preview_resize.bind(this);

        this.resize = this.resize.bind(this);
    }

    set_preview_chart_config() {
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

// ----

    assign_max_line_width() {
        let max = 0;

        for (let i = 0; i < this.charts.length; i++) {
            if (this.charts[i].line_width > max) {
                max = this.charts[i].config.line_width;
            }
        }

        this.config.max_line_width = max;
    }

// ---

    insert_HTML() {
        document.body.classList.add(this.config.mode + '-mode');
        this.container.classList.add('chart-container-wrapper');

        this.insert_container_name();
        this.insert_chart_content();
        this.insert_preview_chart_content();
        this.insert_chart_labels();

        this.show_area_box = this.container.querySelector('.show-area-container');
        this.layer_left = this.container.querySelector('.area-border-left .layer');
        this.layer_right = this.container.querySelector('.area-border-right .layer');
        this.timeflow_axis = this.container.querySelector('.timeflow-axis-labels-container');
        this.vertical_axis_labels_container = this.container.querySelector(' .vertical-axis-labels-container');
        this.show_box_touch_indicator = this.container.querySelector('.show-area-touch'); // todo
        this.ctx = this.get_ctx();
    }

// --- Point details modal ---

    init_point_details_show() {
        let canvas_layer = this.container.querySelector('.canvas-layer');

        canvas_layer.addEventListener('mousemove', this.point_details_show.bind(this));
        canvas_layer.addEventListener('mouseout', this.cancel_point_details_show.bind(this));

        canvas_layer.addEventListener('touchstart', this.point_details_show.bind(this));
        canvas_layer.addEventListener('touchmove', this.point_details_show.bind(this));
        canvas_layer.addEventListener('touchend', this.cancel_point_details_show.bind(this));
    }

    highlight_line(x0) {
        let ctx = this.get_ctx();

        ctx.lineWidth = 1;
        ctx.strokeStyle = this.config.grid_accent_colour;

        ctx.beginPath();
        ctx.moveTo(x0, this.chart_config.padding_top);
        ctx.lineTo(x0, this.config.canvas_height);
        ctx.stroke();
        ctx.closePath();
    }

    get_point_x_coord(index) {
        return ~~((index - this.chart_config.start_index) * this.chart_config.point_dist + this.chart_config.offset_left) + 0.5;
    }

    show_point_modal(index) {
        let date = this.config.point_modal_date_func(this.timeflow_data[document.curr_point_index]);
        let point_values = this.point_modal.querySelectorAll('.point-value');

        for (let i = 0; i < this.charts.length; i++) {
            if (this.charts[i].config.draw) {
                point_values[i].textContent = this.charts[i].config.chart_data[index];
            }
        }

        this.point_modal.querySelector('.breakpoint-date').textContent = date;

        let modal_margin = -32;
        let modal_pos = this.get_point_x_coord(document.curr_point_index);

        if (modal_margin > this.content_width + this.config.side_padding - this.point_modal.offsetWidth - modal_pos) {
            modal_margin = this.content_width + this.config.side_padding - this.point_modal.offsetWidth - modal_pos;
        } else if (modal_margin < -this.config.side_padding - modal_pos) {
            modal_margin = -this.config.side_padding - modal_pos;
        }

        modal_pos += modal_margin;

        this.point_modal.style.left = modal_pos + 'px';
    }

// ---

    clear_canvas() {
        let ctx = this.canvas.getContext('2d');
        ctx.clearRect(0, 0, this.config.canvas_width, this.config.canvas_height);
    }

    clear_preview_canvas() {
        let ctx = this.preview_canvas.getContext('2d');
        ctx.clearRect(0, 0, this.config.preview_canvas_width, this.config.preview_canvas_height);
    }

    get_ctx() {
        return this.canvas.getContext('2d');
    }

// ---

    charts_toggle_draw_init() {
        this.animate_chart_labels();

        let inputs = this.container.querySelectorAll('.chart-draw-checkbox');

        for (let i = 0; i < inputs.length; i++) {
            inputs[i].addEventListener('change', this.toggle_chart_draw.bind(this, i));
        }
    }

    set_basic_chart_config() {
        this.basic_chart_config = {
            draw: true,

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
            this.init_chart(i);
        }

        this.preview_chart_config.content_height = this.config.preview_canvas_height - this.preview_chart_config.padding_top;
        this.chart_config.content_height = this.config.canvas_height - this.chart_config.padding_top; // todo
        this.assign_max_line_width();
    }

    init_chart(i) {
        let chart_config = Object.assign({}, this.basic_chart_config, this.charts[i]);
        this.charts[i] = new Chart(undefined, chart_config);
        this.charts[i].init();
    }

// ---- Insert HTML ----

    insert_container_name() {
        let name = '<h2 class="chart-container-name" style="width: ' + this.content_width + 'px;">'
            + this.config.name + '</h2>';
        this.container.insertAdjacentHTML('beforeend', name);
    }

    insert_chart_content() {
        let wrapper = this.insert_chart_wrapper();

        let canvas_layer = this.new_canvas_layer();
        wrapper.appendChild(canvas_layer);

        this.canvas = this.new_canvas();
        wrapper.appendChild(this.canvas);

        let vertical_axis = this.new_vertical_axis();
        wrapper.insertAdjacentHTML('beforeend', vertical_axis);

        let timeflow_axis = this.new_timeflow_axis();
        wrapper.insertAdjacentHTML('beforeend', timeflow_axis);

        this.point_modal = this.new_point_modal();
        canvas_layer.appendChild(this.point_modal);

        wrapper.insertAdjacentHTML('beforeend', '<p class="hidden no-data-message">No data to show</p>');

        this.point_modal.insertAdjacentHTML('afterbegin', '<p class="breakpoint-date"></p>');
        this.point_modal.insertAdjacentHTML('beforeend', '<ul class="points"></ul>');
    }

    insert_preview_chart_content() {
        let preview_wrapper = this.insert_chart_wrapper(true);

        this.preview_canvas = this.new_canvas(true);
        preview_wrapper.appendChild(this.preview_canvas);

        let show_area_box = this.new_show_area_box();
        preview_wrapper.insertAdjacentHTML('beforeend', show_area_box);
    }

    insert_chart_labels() {
        let list = this.new_labels_list();
        this.container.appendChild(list);
    }

// ---

    insert_chart_wrapper(is_preview = false) {
        let wrapper = document.createElement('div');
        let class_name = is_preview ? 'chart-preview-wrapper' : 'chart-wrapper';
        wrapper.classList.add(class_name);

        if (is_preview) {
            wrapper.style.width = this.content_width + 'px';
        }
        return this.container.appendChild(wrapper);
    }

    new_canvas_layer() {
        let layer = document.createElement('div');
        let class_name = 'canvas-layer';

        layer.style.width = this.content_width + 'px';
        layer.style.height = this.config.canvas_height + 'px';

        layer.classList.add(class_name);
        return layer;
    }

    new_canvas(is_preview = false) {
        let canvas = document.createElement('canvas');

        let class_name = is_preview ? 'chart-preview-canvas' : 'chart-canvas';
        let height = is_preview ? this.config.preview_canvas_height : this.config.canvas_height;
        let width = is_preview ? this.config.preview_canvas_width : this.config.canvas_width;

        canvas.classList.add(class_name);
        canvas.setAttribute('height', height);
        canvas.setAttribute('width', width);

        return canvas;
    }

    new_vertical_axis() {
        return "<div class='vertical-axis-labels-container axis-labels-container ' style='height: "
            + this.config.canvas_height + "px; left: " + this.config.side_padding + "px;'></div>";
    }

    new_timeflow_axis() {
        return '<div id="timeflow-axis-labels-container" class="timeflow-axis-labels-container horizontal-axis-labels-container axis-labels-container"></div>';
    }

    new_point_modal() {
        let point_modal = document.createElement('div');
        point_modal.classList.add('point-details-modal');

        return point_modal;
    }

    new_show_area_box() {
        let box_width = (this.config.data_end - this.config.data_start) * 100;
        let box_pos_right = (1 - this.config.data_end) * 100;

        let box_style = 'width: ' + box_width + '%; ' + 'right: ' + box_pos_right + '%;';
        let layer_l_style = 'width: ' + this.config.data_start * this.content_width + 'px';
        let layer_r_style = 'width: ' + box_pos_right + '%';

        return '<div class="show-area-container" style="' + box_style + '">' +
            '<span class="show-area-touch"></span>' +
            '<div class="area-border-left area-border" >' +
            '<div class="layer" style="' + layer_l_style + '"></div></div>' +
            '<div class="area-border-right area-border">' + '' +
            '<div class="layer" style="' + layer_r_style + '"></div></div>';
    }

    new_labels_list() {
        let list = document.createElement('ul');
        list.classList.add('charts-labels-list');
        list.style.width = this.content_width + 'px';

        return list;
    }

// --- Preview box ---

    static get_border_side(border_index) {
        return border_index === 0 ? 'left' : 'right';
    }

// --- preview box functions ---

    get_preview_coords() {
        let chart_preview_container = this.container.querySelector('.chart-preview-wrapper');

        this.x_pos_left = chart_preview_container.getBoundingClientRect().left;
        this.x_pos_right = chart_preview_container.getBoundingClientRect().right;
    }

    preview_box_init() {
        this.area_border_width = 5 + 2; // border width +  dist btw borders
        this.get_preview_coords();

        this.preview_box_resize_init();
        this.preview_box_move_init();

        this.get_data_range();
    }

    preview_box_resize_init() {
        document.show_area_move = true;

        let area_borders = this.container.querySelectorAll('.area-border');

        for (let i = 0; i < 2; i++) {
            area_borders[i].addEventListener("mousedown", this.resize_on_mousedown.bind(this, area_borders[i], i));

            area_borders[i].addEventListener("touchstart", this.resize_on_mousedown.bind(this, area_borders[i], i));
        }
    }

    resize_on_mousedown(obj, i, e) {
        if (e.target !== obj) {
            return;
        }

        obj.classList.add('active');

        document.curr_area_border = ChartContainer.get_border_side(i);
        document.show_area_move = false;

        let rect = this.show_area_box.getBoundingClientRect(),
            other_side = ChartContainer.other_side(document.curr_area_border);
        let mouse_x = e.touches ? e.touches[0].clientX : e.pageX;

        let k = (other_side === 'left' ? -1 : 1);
        let old_pos = k * (this['x_pos_' + other_side] - rect[other_side]);

        document.border_cursor_pos = k * (mouse_x - rect[document.curr_area_border]); // dist btw mouse and border edge ~ [1px, 5px]

        this.show_area_box.style[other_side] = old_pos + 'px';
        this.show_area_box.style[document.curr_area_border] = 'auto';

        document.addEventListener("mousemove", this.chart_preview_resize);
        obj.addEventListener("mouseup", this.cancel_chart_preview_resize);

        document.addEventListener("touchmove", this.chart_preview_resize);
        obj.addEventListener("touchend", this.cancel_chart_preview_resize);
    }

    preview_box_move_init() {
        this.show_area_box.addEventListener("mousedown", this.catch_box_move);
        this.show_area_box.addEventListener("touchstart", this.catch_box_move);
    }

    catch_box_move(e) {
        e = e || window.event;

        if (e.target !== this.show_area_box) {
            return;
        }

        let rect = this.show_area_box.getBoundingClientRect();
        let mouse_x = e.touches ? e.touches[0].clientX : e.pageX;

        document.curr_preview_box_pos = rect.right - mouse_x;
        document.curr_show_area_width = rect.width;

        this.show_area_box.classList.add('active');

        document.addEventListener("mousemove", this.move_show_area);
        document.addEventListener("mouseup", this.cancel_move_show_area);

        document.addEventListener("touchmove", this.move_show_area);
        document.addEventListener("touchend", this.cancel_move_show_area);
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
        this.chart_config.data_start = this.show_area_box.offsetLeft / this.config.preview_canvas_width; // TODO optimize
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

// ---

    animate_vertical_axis(new_chart_sizing) { // todo blinking non changing vertical size
        this.destroy_old_labels('vertical');
        this.prepare_grid_animation();

        let vertical_axis_labels = '';
        let step = this.get_vertical_axis_step(); // new labels step
        let stage = this.config.animation_step / this.config.cancel_animation_steps_num;

        // display new labels
        for (let i = 0; i < this.config.vertical_axis_steps_count; i++) {
            let bottom_pos = new_chart_sizing * i * step;
            if (bottom_pos > this.chart_config.content_height) {
                break;
            }

            this.ctx.globalAlpha = stage;
            this.draw_gridline(new_chart_sizing * i * step);

            vertical_axis_labels += "<span class='axis-label vertical-axis-label' style='bottom: " + bottom_pos + "px; opacity: " + stage + "'>" +
                Math.round(step * i) + "</span>";
        }

        // display old labels
        for (let i = 0; i < this.config.vertical_axis_steps_count; i++) {
            let bottom_pos = new_chart_sizing * i * this.chart_config.vertical_axis_val_step;
            if (bottom_pos > this.chart_config.content_height) {
                break;
            }

            let opacity = 1 - stage;

            this.ctx.globalAlpha = opacity;
            this.draw_gridline(new_chart_sizing * i * this.chart_config.vertical_axis_val_step);

            vertical_axis_labels += "<span class='axis-label vertical-axis-label' style='bottom: " + bottom_pos + "px; opacity: " + opacity + "'>" +
                Math.round(this.chart_config.vertical_axis_val_step * i) + "</span>";
        }

        this.vertical_axis_labels_container.insertAdjacentHTML('afterbegin', vertical_axis_labels);
    }

    prepare_grid_animation() {
        this.ctx.lineWidth = 1;
        this.ctx.strokeStyle = this.config.grid_colour;
    }

    draw_gridline(y) {
        this.ctx.beginPath();
        this.ctx.moveTo(this.config.side_padding, this.config.canvas_height - y);
        this.ctx.lineTo(this.content_width + this.config.side_padding, this.config.canvas_height - y);
        this.ctx.stroke();
        this.ctx.closePath();
    }


    animate_cancel_draw(a, k) { //todo optimize if chart sizing not changed
        this.clear_canvas();
        this.clear_preview_canvas();

        this.charts[a].config.opacity += k * (1 / (this.config.animation_steps_num + 1));

        let new_chart_sizing_stage = (this.config.animation_steps_num - this.config.animation_step) / this.config.animation_steps_num
        let new_chart_sizing = this.chart_config.chart_sizing - this.config.chart_sizing_diff * new_chart_sizing_stage;

        this.animate_vertical_axis(new_chart_sizing);

        for (let i = 0; i < this.charts.length; i++) {

            // -- redraw preview ---

            for (const key in this.preview_chart_config) {
                if (key !== 'chart_sizing') {
                    this.charts[i].config[key] = this.preview_chart_config[key];
                }
            }

            this.charts[i].config.chart_sizing = this.preview_chart_config.chart_sizing
                - this.config.preview_chart_sizing_diff * new_chart_sizing_stage

            if (this.charts[i].config.draw || i === a) {
                this.charts[i].draw_chart('.chart-preview-canvas');
            }

            // -- redraw main chart --

            this.charts[i].config.chart_sizing = new_chart_sizing;

            for (const key in this.chart_config) {
                if (key !== 'chart_sizing') {
                    this.charts[i].config[key] = this.chart_config[key];
                }
            }

            if (this.charts[i].config.draw || i === a) {
                this.charts[i].draw_chart();
            }
        }

        if (this.config.animation_step < this.config.animation_steps_num) {
            requestAnimationFrame(this.animate_cancel_draw.bind(this, a, k));
            this.config.animation_step++;
        } else {
            this.config.animation_step = 0;
            this.set_vertical_axis_step();

            if (this.config.no_data) {
                this.container.querySelector('.no-data-message').classList.remove('hidden');
            }
        }
    }

    point_details_show(e) {
        e = e || window.event;
        let mouse_x = e.touches ? e.touches[0].clientX : e.pageX;

        let rect = this.canvas.getBoundingClientRect();

        let canvas_pos = mouse_x - rect.left;
        let point_index = this.chart_config.start_index +
            Math.round((canvas_pos - this.chart_config.offset_left) / this.chart_config.point_dist);
        let point_coord = this.get_point_x_coord(point_index);

        if (point_coord < this.chart_config.side_padding || point_coord > this.chart_config.side_padding + this.content_width) {
            return;
        }

        this.point_modal.classList.add('show');

        if (document.curr_point_index !== point_index) {
            document.curr_point_index = point_index;

            this.clear_canvas();
            this.draw_horizontal_grid();
            this.highlight_line(point_coord);

            for (let i = 0; i < this.charts.length; i++) {
                if (this.charts[i].config.draw) {
                    this.charts[i].draw_chart();
                    this.charts[i].highlight_point(point_index);
                }
            }

            this.show_point_modal(point_index);
        }
    }

    cancel_point_details_show(e) {
        e = e || window.event;
        e.preventDefault();
        document.curr_point_index = -1;
        this.point_modal.classList.remove('show');

        this.clear_canvas();
        this.draw_horizontal_grid();
        for (let i = 0; i < this.charts.length; i++) {
            if (this.charts[i].config.draw) {
                this.charts[i].draw_chart();
            }
        }
    }

// ---

    move_show_area(e) {
        if (!document.show_area_move) {
            return;
        }

        e = e || window.event;
        let mouse_x = e.touches ? e.touches[0].clientX : e.pageX;
        let mouse_y = e.touches ? e.touches[0].clientY : e.pageY; // todo

        let dist_to_left = mouse_x - document.curr_show_area_width + document.curr_preview_box_pos - this.x_pos_left;
        let dist_to_right = this.x_pos_right - mouse_x - document.curr_preview_box_pos;

        // this.show_box_touch_indicator.style.left = (mouse_x - this.x_pos_left) + 'px';
        // this.show_box_touch_indicator.style.top = (mouse_y - 200) + 'px';

        if (dist_to_left >= 0 && dist_to_right >= 0) {
            let new_pos_right = this.x_pos_right - mouse_x - document.curr_preview_box_pos;

            this.show_area_box.style.right = this.layer_right.style.width = new_pos_right + 'px';
            this.show_area_box.style.left = 'auto';
            this.layer_left.style.width = dist_to_left + 'px';

            this.get_data_range();

            this.autosize();
            this.config.chart_sizing_diff = this.chart_config.chart_sizing - this.charts[0].config.chart_sizing;
            this.config.animation_steps_num = this.config.autosize_animation_steps_num;
            this.animate_autosize();
            this.move_timeflow_axis();
        }
    }

    cancel_move_show_area() {
        this.show_area_box.classList.remove('active');
        document.removeEventListener("mousemove", this.move_show_area);
        document.removeEventListener("touchmove", this.move_show_area);
    }

// ---

    chart_preview_resize(e) {
        let rect = this.show_area_box.getBoundingClientRect();
        e = e || window.event;
        let mouse_x = e.touches ? e.touches[0].clientX : e.pageX;

        let other = ChartContainer.other_side(document.curr_area_border);
        let k = other === 'left' ? -1 : 1;

        let dist_to_side = k * (mouse_x - this['x_pos_' + document.curr_area_border]) - document.border_cursor_pos;
        let dist_to_other_border = k * (rect[other] - mouse_x) - this.area_border_width;

        if (dist_to_side >= 0 && dist_to_other_border >= 0) {
            let new_width = k * (rect[other] - mouse_x) + document.border_cursor_pos;
            this.show_area_box.style.width = new_width + 'px';
            this['layer_' + document.curr_area_border].style.width = dist_to_side + 'px';

            this.get_data_range(); // TODO func optimiztaion + right border
            // this.config.data_start = (mouse_x - this.x_pos_left) / preview_box_width;
            // this.config.start_index = Math.floor(this.config.data_start * this.charts[0].config.chart_data.length); // percentage

            this.autosize();
            this.config.chart_sizing_diff = this.chart_config.chart_sizing - this.charts[0].config.chart_sizing;
            this.config.animation_steps_num = this.config.autosize_animation_steps_num;
            this.animate_autosize();

            this.resize_timeflow_axis();
        }
    }

    cancel_chart_preview_resize() {
        if (document.show_area_move) {
            return;
        }

        this.container.querySelector('.area-border.active').classList.remove('active');
        document.removeEventListener("mousemove", this.chart_preview_resize);
        document.removeEventListener("touchmove", this.chart_preview_resize);
        document.show_area_move = true;

        let labels = this.container.querySelectorAll('.timeflow-axis-label.to-fade');
        for (let i = 0; i < labels.length; i++) {
            labels[i].classList.add('faded');
        }
    }

// ---

    toggle_chart_draw(i) {
        let temp = this.preview_chart_config.chart_sizing;
        this.charts[i].config.draw = !this.charts[i].config.draw;
        if (!this.charts[i].config.draw) {
            this.config.no_data = true;
            for (let i = 0; i < this.charts.length; i++) {
                if (this.charts[i].config.draw) {
                    this.config.no_data = false;
                }
            }
        } else {
            this.config.no_data = false;
        }

        if (!this.config.no_data) {
            this.container.querySelector('.no-data-message').classList.add('hidden');
        }

        this.autosize(true);
        this.config.preview_chart_sizing_diff = this.preview_chart_config.chart_sizing - temp;

        this.point_modal.querySelectorAll('li')[i].classList.toggle('hidden');

        this.autosize();
        this.config.chart_sizing_diff = this.chart_config.chart_sizing - this.charts[0].config.chart_sizing;

        let k = this.charts[i].config.draw ? 1 : -1;
        this.config.animation_steps_num = this.config.cancel_animation_steps_num;
        this.animate_cancel_draw(i, k);

    }

    animate_autosize() {
        this.clear_canvas();

        let new_chart_sizing = this.chart_config.chart_sizing -
            this.config.chart_sizing_diff * (this.config.animation_steps_num - this.config.animation_step) / this.config.animation_steps_num;

        this.animate_vertical_axis(new_chart_sizing);

        for (let i = 0; i < this.charts.length; i++) {

            this.charts[i].config.chart_sizing = new_chart_sizing;

            for (const key in this.chart_config) {
                if (key !== 'chart_sizing') {
                    this.charts[i].config[key] = this.chart_config[key];
                }
            }

            if (this.charts[i].config.draw) {
                this.charts[i].draw_chart();
            }
        }

        if (this.config.animation_step < this.config.animation_steps_num) {
            requestAnimationFrame(this.animate_autosize.bind(this));
            this.config.animation_step++;
        } else {
            this.config.animation_step = 0;
            this.set_vertical_axis_step();
        }
    }
}

// ----

ChartContainer.prototype.Default_container_config = {
    adjustable: true,
    canvas_height: 400,
    // canvas_width: 400,

    name: '',

    preview_canvas_height: 55,
    preview_canvas_width: undefined,

    side_padding: 15,
    padding_top: 10,

    data_start: 0.7,
    data_end: 1,

    vertical_axis_steps_count: 6,
    timeflow_steps_count: 6,
    timeflow_labels_step: 1,

    timeflow_label_width: 42, // todo? move to prototype

    mode: 'day',

    highlight: false, // todo

    animation_steps_num: 9,
    animation_step: 0,
    cancel_animation_steps_num: 9,
    autosize_animation_steps_num: 5,

    no_data: false,

    timeflow_labels_date_func: (timestamp) => {
        let full_date = new Date(timestamp * 1000);
        return full_date.toLocaleDateString('en-US', {month: 'short', day: 'numeric'})
    },

    point_modal_date_func: (timestamp) => {
        return new Date(timestamp * 1000)
            .toLocaleDateString('en-US', {weekday: 'short', month: 'short', day: 'numeric'});
    }
};