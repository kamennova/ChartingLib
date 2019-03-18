class Chart_container {
    constructor(container_selector, container_config, timeflow_data, charts) {
        this.container_selector = container_selector;
        this.config = container_config;
        this.charts = charts;
        this.timeflow_data = timeflow_data;

        this.container = document.querySelector(container_selector);
        this.data_len = this.timeflow_data.length;

        this.init();
    }

    init() {
        this.fill();
        this.insert_HTML();
        this.theme_switch_init();

        this.charts_init();
        this.preview_chart_init();
        this.preview_box_init();
        this.update_main_chart();

        // this.update_all();
        this.charts_toggle_draw_init();
        this.init_point_details_show();
    }

    update_all() {
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
        this.resize_timeflow_axis();
        // this.display_timeflow_axis();
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

    theme_switch_init() {
        this.config.theme_colors = theme_colors;
        this.set_colours();

        this.theme_btn.querySelector('.mode-name').textContent = Chart_container.get_other_mode(this.config.mode);

        this.theme_btn.addEventListener('click', function () {
            document.body.classList.remove(this.config.mode + '-mode');
            this.theme_btn.querySelector('.mode-name').textContent = this.config.mode;
            this.toggle_mode();
            document.body.classList.add(this.config.mode + '-mode');

            this.set_colours();
            this.update_main_chart_canvas(); // TODO optimize

        }.bind(this));
    }

    set_colours() {
        this.config.bg_color = this.config.theme_colors[this.config.mode].bg_color;
        this.config.grid_accent_colour = this.config.theme_colors[this.config.mode].grid_accent_colour;
        this.config.grid_colour = this.config.theme_colors[this.config.mode].grid_colour;

        this.chart_config.bg_color = this.config.bg_color;
    }

    toggle_mode() {
        this.config.mode = (this.config.mode === 'day' ? 'night' : 'day');
    }

    static get_other_mode(mode) {
        return (mode === 'day' ? 'night' : 'day');
    }

    // --- Set vertical chart step ---

    autosize(is_preview = false) {
        let prefix = is_preview ? 'preview_' : '';
        let config = this[prefix + 'chart_config'];

        let max = -10000,
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

        if (max > 0) {
            this.config.chart_max = max;
        } else {
            max = this.config.chart_max;
        }

        if (!is_preview) {
            // console.log(max);
        }

        let canvas_content_height = config.content_height;
        config.chart_sizing = (canvas_content_height - this.config.max_line_width / 2) / max;
    }

    set_chart_params(is_preview = false) {
        let prefix = is_preview ? 'preview_' : '';
        let config = this[prefix + 'chart_config'];

        for (let i = 0; i < this.charts.length; i++) {
            for (const key in config) {
                this.charts[i].config[key] = config[key];
            }
        }
    }

    // --- Display axises ---

    /*display_timeflow_axis() {
        this.destroy_old_labels('timeflow');

        let steps_count = Math.floor(this.config.canvas_width / this.chart_config.point_dist);
        // console.log(steps_count);
        let k = 1;

        if (steps_count > this.config.timeflow_steps_count) {
            k = Math.ceil(steps_count / this.config.timeflow_steps_count);
        }

        for (let i = 0; i < steps_count; i++) {
            let left_pos = this.get_point_x_coord(this.chart_config.start_index + i);

            let full_date = new Date(this.timeflow_data[this.chart_config.start_index + i] * 1000);
            // let date =this.get_timeflow_date(lab);

            let class_list = 'axis-label timeflow-axis-label ';
            class_list += (i % k === 0 ? '' : 'to-fade');
            let style = 'left: ' + left_pos + 'px';
            let label = "<span class='" + class_list + "' style='" + style + "' >" + date + "</span>";

            this.timeflow_axis.insertAdjacentHTML('beforeend', label);
        }
    }*/

    resize_timeflow_axis() {
        this.destroy_old_labels('timeflow');

        let k = document.curr_area_border === 'right' ? 1 : -1;

        this.config.curr_timeflow_step = 1;
        while (this.chart_config.points_count / this.config.curr_timeflow_step > this.config.timeflow_steps_count) {
            this.config.curr_timeflow_step *= 2;
        }

        // -- getting start point --
        let start_point = document.curr_area_border === 'right' ? this.chart_config.start_index : this.chart_config.end_index;
        if (start_point === 0 || start_point === this.data_len - 1) {
            start_point -= k;
        }

        while (start_point % this.config.curr_timeflow_step !== 0) {
            start_point += k;
        }

        // -- making labels list --

        let labels_list = '';
        let label_width = 42;
        let labels_min_dist = 5;
        let iteration_step = (this.config.curr_timeflow_step > 1 ? this.config.curr_timeflow_step/2 : 1);

        for (let i = 0; i < this.chart_config.points_count; i += iteration_step) {
            let left_pos = this.get_point_x_coord(start_point + k*i);
            let date = this.get_timeflow_date(start_point + k*i);

            let class_list = 'axis-label timeflow-axis-label ';
            let style = 'left: ' + left_pos + 'px; ';

            if (i % this.config.curr_timeflow_step !== 0) {
                class_list += ' faded';
                style += ' opacity: ' + ((this.chart_config.point_dist * this.config.curr_timeflow_step - label_width - labels_min_dist) / 100);
            }

            labels_list += "<span class='" + class_list + "' style='" + style + "' >" + date + "</span>";
        }

        this.timeflow_axis.insertAdjacentHTML('beforeend', labels_list);
    }

    add_timeflow_label(index, class_list = '') {
        // TODO ???
    }

    move_timeflow_axis() {
        this.destroy_old_labels('timeflow');

        let steps_count = this.chart_config.points_count; // TODO fix last Invalid date
        let k = 1;

        if (steps_count > this.config.timeflow_steps_count) {
            k = Math.ceil(steps_count / this.config.timeflow_steps_count);
        }

        let start_point = this.chart_config.start_index;
        if (this.chart_config.start_index === 0) {
            start_point--;
        }

        while (start_point % this.config.curr_timeflow_step !== 0) {
            start_point++;
        }

        let labels_list = '';
        for (let i = 0; i < steps_count; i += this.config.curr_timeflow_step) {
            let left_pos = this.get_point_x_coord(start_point + i);
            let date = this.get_timeflow_date(start_point + i);

            let class_list = 'axis-label timeflow-axis-label ';
            let style = 'left: ' + left_pos + 'px';
            labels_list += "<span class='" + class_list + "' style='" + style + "' >" + date + "</span>";
        }

        this.timeflow_axis.insertAdjacentHTML('beforeend', labels_list);
    }

    get_timeflow_date(index) {
        let full_date = new Date(this.timeflow_data[index] * 1000);
        return full_date.toLocaleDateString('en-US', {month: 'short', day: 'numeric'});
    }

    /*

        move_timeflow_axis() {
            this.destroy_old_labels('timeflow');

            let steps_count = Math.floor(this.config.canvas_width / this.chart_config.point_dist);
            let k = 1;

            if (steps_count > this.config.timeflow_steps_count) {
                k = Math.ceil(steps_count / this.config.timeflow_steps_count);
            }

            let labels_start_index = this.chart_config.start_index;

            while (labels_start_index % k !== 0) {
                labels_start_index++;
            }

            for (let i = 0; i < steps_count; i += k) {
                let left_pos = this.get_point_x_coord(labels_start_index + i);

                // let full_date = new Date(this.timeflow_data[labels_start_index + i] * 1000);
                // let date = full_date.toLocaleDateString('en-US', {month: 'short', day: 'numeric'});

                let class_list = 'axis-label timeflow-axis-label ';
                let style = 'left: ' + left_pos + 'px';
                let label = "<span class='" + class_list + "' style='" + style + "' >" + this.timeflow_data[labels_start_index + i] + "</span>";

                this.timeflow_axis.insertAdjacentHTML('beforeend', label);
            }
        }*/

    display_vertical_axis() {
        this.destroy_old_labels('vertical');

        let label_margin = 0;
        let vertical_axis_labels_container = this.container.querySelector(' .vertical-axis-labels-container');
        let vertical_axis_labels = '';
        let step = this.get_vertical_axis_step();

        for (let i = 0; i < this.config.vertical_axis_steps_count; i++) {
            let bottom_pos = this.chart_config.chart_sizing * i * step + label_margin;

            vertical_axis_labels += "<span class='axis-label vertical-axis-label' style='bottom: " + bottom_pos + "px'>" +
                step * i + "</span>";
        }

        vertical_axis_labels_container.insertAdjacentHTML('afterbegin', vertical_axis_labels);
    }

    destroy_old_labels(axis_type) {
        let old_labels = this.container.querySelector(' .' + axis_type + '-axis-labels-container');

        if (old_labels) {
            while (old_labels.firstChild) {
                old_labels.removeChild(old_labels.firstChild);
            }
        }
    }

    get_vertical_axis_step() {
        return Math.round(this.config.chart_max * 0.95 / (this.config.vertical_axis_steps_count - 1));
    }

    get_grid_steps_count() {
        let label_offset_height = 10;
        return Math.floor((this.chart_config.content_height - label_offset_height) / (this.chart_config.chart_sizing * this.config.vertical_axis_labels_step));
    }

    // --- Drawing additional canvas elements ---

    draw_horizontal_grid() {
        let ctx = this.canvas.getContext('2d');
        let gridlines_count = this.get_grid_steps_count();
        let step = this.get_vertical_axis_step();

        ctx.lineWidth = 1;
        ctx.strokeStyle = this.config.grid_colour;
        ctx.globalAlpha = 1;

        let y0 = this.config.canvas_height + this.chart_config.chart_sizing * step - 1;

        for (let i = 0; i < this.config.vertical_axis_steps_count; i++) {
            y0 -= this.chart_config.chart_sizing * step;
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
        for (const key in Default_container_config) {
            if (!this.config.hasOwnProperty(key) || this.config[key] == null) {
                this.config[key] = Default_container_config[key];
            }
        }

        this.assign_max_line_width();

        this.content_width = this.config.canvas_width - 2 * this.config.side_padding;
        this.config.preview_canvas_width = this.content_width;
        this.config.mode = 'day';

        this.set_chart_config();
        this.set_preview_chart_config();
        this.bind_event_listeners();
    }

    bind_event_listeners() {
        this.move_show_area = move_show_area.bind(this);
        this.cancel_move_show_area = cancel_move_show_area.bind(this);

        this.chart_preview_resize = chart_preview_resize.bind(this);
        this.cancel_chart_preview_resize = cancel_chart_preview_resize.bind(this);

        this.point_details_show = point_details_show.bind(this);
        this.cancel_point_details_show = cancel_point_details_show.bind(this);
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
        let max = 2; // default line width

        for (let i = 0; i < this.charts.length; i++) {
            if (typeof this.charts[i].line_width !== 'undefined' && this.charts[i].line_width > max) {
                max = this.charts[i].config.line_width;
            }
        }

        this.config.max_line_width = max;
    }

    // ---

    insert_HTML() {
        document.body.classList.add(this.config.mode + '-mode');
        this.container.classList.add('chart-container-wrapper');
        this.container.style.maxWidth = this.config.canvas_width + 'px';

        this.insert_container_name();
        this.insert_chart_content();
        this.insert_preview_chart_content();
        this.insert_chart_labels();
        this.insert_theme_button();

        this.canvas = this.container.querySelector('.chart-canvas');

        this.preview_canvas = this.container.querySelector('.chart-preview-canvas');
        this.show_area_container = this.container.querySelector('.show-area-container');
        this.layer_left = this.container.querySelector('.area-border-left .layer'); // TODO ???
        this.layer_right = this.container.querySelector('.area-border-right .layer');
        this.modal = this.container.querySelector('.point-details-modal');

        this.timeflow_axis = this.container.querySelector('.timeflow-axis-labels-container');

        this.theme_btn = this.container.querySelector('.theme-btn');
    }

    // --- Point details modal ---

    init_point_details_show() { // TODO modal bug fix large offset
        /* TODO fix modal hover
        let chart_wrapper = this.container.querySelector('.chart-wrapper');
        this.canvas.addEventListener('mouseover', function(){
            this.container.querySelector('.point-details-modal').classList.add('show');
        }.bind(this));
        this.canvas.addEventListener('mousemove', this.point_details_show);
        this.canvas.addEventListener('mouseleave', this.cancel_point_details_show);*/

        this.modal.addEventListener('mouseover', function () {
            this.modal.classList.add('show');
        }.bind(this));
        this.canvas.addEventListener('mouseover', function () {
            this.modal.classList.add('show');
        }.bind(this));
        this.canvas.addEventListener('mousemove', this.point_details_show);
        this.canvas.addEventListener('mouseleave', this.cancel_point_details_show);
    }

    highlight_line() {
        let ctx = this.get_ctx();

        ctx.lineWidth = 1;
        ctx.strokeStyle = this.config.grid_accent_colour;

        let x0 = this.get_point_x_coord(document.curr_point_index);

        ctx.beginPath();
        ctx.moveTo(x0, this.chart_config.padding_top);
        ctx.lineTo(x0, this.config.canvas_height);
        ctx.stroke();
        ctx.closePath();
    }

    get_point_x_coord(index) {
        return ~~((index - this.chart_config.start_index) * this.chart_config.point_dist + this.chart_config.offset_left) + 0.5
    }

    show_point_modal(index) {
        this.modal.style.left = (this.get_point_x_coord(document.curr_point_index) - 32) + 'px';

        let full_date = new Date(this.timeflow_data[document.curr_point_index] * 1000);
        let date = full_date.toLocaleDateString('en-US', {weekday: 'short', month: 'short', day: 'numeric'});

        let point_values = this.modal.querySelectorAll('.point-value');

        for (let i = 0; i < this.charts.length; i++) {
            if (this.charts[i].config.draw) {
                point_values[i].textContent = this.charts[i].config.chart_data[index];
            }
        }

        this.modal.querySelector('.breakpoint-date').textContent = date;
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
        let inputs = this.container.querySelectorAll('.chart-draw-checkbox');

        for (let i = 0; i < inputs.length; i++) {
            inputs[i].addEventListener('change', toggle_chart_draw.bind(this, i));
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
        this.chart_config.content_height = this.config.canvas_height - this.chart_config.padding_top;
        this.charts_koef = this.chart_config.content_height / this.preview_chart_config.content_height;
    }

    init_chart(i) {
        let chart_config = Object.assign({}, this.basic_chart_config, this.charts[i]);
        this.charts[i] = new Chart(undefined, chart_config);
        this.charts[i].init();
    }

    // ---- Insert HTML ----

    insert_container_name() {
        this.container.insertAdjacentHTML('beforeend', '<h2 class="chart-container-name">' + this.config.name + '</h2>');
    }

    insert_chart_content() {
        let wrapper = this.insert_chart_wrapper();

        let canvas = this.new_canvas();
        wrapper.appendChild(canvas);

        let vertical_axis = this.new_vertical_axis();
        wrapper.insertAdjacentHTML('beforeend', vertical_axis);

        let timeflow_axis = this.new_timeflow_axis();
        wrapper.insertAdjacentHTML('beforeend', timeflow_axis);

        let point_modal = this.new_point_modal();
        wrapper.appendChild(point_modal);

        point_modal.insertAdjacentHTML('afterbegin', '<p class="breakpoint-date"></p>');
        point_modal.insertAdjacentHTML('beforeend', '<ul class="points"></ul>');
    }

    insert_preview_chart_content() {
        let preview_wrapper = this.insert_chart_wrapper(true);

        let preview_canvas = this.new_canvas(true);
        preview_wrapper.appendChild(preview_canvas);

        let show_area_box = this.new_show_area_box();
        preview_wrapper.insertAdjacentHTML('beforeend', show_area_box);
        // this.show_area_container = this.container.querySelector('.show-area-container');
    }

    insert_chart_labels() {
        let list = Chart_container.new_labels_list();
        this.container.appendChild(list);
    }

    insert_theme_button() {
        let button = '<p class="theme-btn">Switch to <span class="mode-name"></span> Mode</p>';
        this.container.insertAdjacentHTML('beforeend', button);
    }

    // ---

    insert_chart_wrapper(is_preview = false) {
        let wrapper = document.createElement('div');
        let class_name = is_preview ? 'chart-preview-wrapper' : 'chart-wrapper';

        if (is_preview) {
            wrapper.setAttribute('width', this.content_width + 'px');
        }

        wrapper.classList.add(class_name);
        return this.container.appendChild(wrapper);
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
        let classes = 'vertical-axis-labels-container axis-labels-container ';
        classes += this.config.vertical_axis_show_line ? '' : ' no-line ';
        classes += this.config.vertical_axis_show_ticks ? '' : ' no-ticks ';

        return "<div class='" + classes + "' style='height: "
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

        return '<div class="show-area-container chart-area-container" style="' + box_style + '">' +
            '<div class="area-border-left area-border" >' +
            '<div class="layer" style="' + layer_l_style + '"></div></div>' +
            '<div class="area-border-right area-border">' + '' +
            '<div class="layer" style="' + layer_r_style + '"></div></div>';
    }

    static new_labels_list() {
        let list = document.createElement('ul');
        list.classList.add('charts-labels-list');

        return list;
    }

    // --- Preview box ---

    get_border_side(elem) {
        for (let i = 0, count = elem.classList.length; i < count; i++) {
            if (elem.classList[i].includes('left')) {
                return 'left';
            } else if (elem.classList[i].includes('right')) {
                return 'right';
            }
        }
    }

    // --- preview box functions ---

    preview_box_init() {
        this.area_border_width = 5 + 2; // border width +  dist btw borders

        let chart_preview_container = this.container.querySelector('.chart-preview-wrapper');

        this.x_pos_left = chart_preview_container.getBoundingClientRect().left;
        this.x_pos_right = chart_preview_container.getBoundingClientRect().right;

        this.preview_box_resize_init();
        this.preview_box_move_init();

        this.get_data_range();
    }

    preview_box_resize_init() {
        document.show_area_move = true;

        let area_borders = this.container.querySelectorAll('.area-border');

        for (let i = 0; i < 2; i++) {
            area_borders[i].addEventListener("mousedown", function (obj, e) {
                obj.classList.add('active');

                document.curr_area_border = this.get_border_side(obj);
                document.show_area_move = false;

                let rect = this.show_area_container.getBoundingClientRect(),
                    other_side = Chart_container.other_side(document.curr_area_border);
                let k = (other_side === 'left' ? -1 : 1);

                let old_pos = k * (this['x_pos_' + other_side] - rect[other_side]);

                document.border_cursor_pos = k * (e.pageX - rect[document.curr_area_border]); // dist btw mouse and border edge ~ [1px, 5px]

                this.show_area_container.style[other_side] = old_pos + 'px';
                this.show_area_container.style[document.curr_area_border] = 'auto';

                document.addEventListener("mousemove", this.chart_preview_resize);
                document.addEventListener("mouseup", this.cancel_chart_preview_resize);
            }.bind(this, area_borders[i]));
        }
    }

    preview_box_move_init() {
        this.show_area_container.addEventListener("mousedown", function (e) {
            e = e || window.event;
            let rect = this.show_area_container.getBoundingClientRect();

            document.curr_preview_box_pos = rect.right - e.pageX;
            document.curr_show_area_width = rect.width;

            document.addEventListener("mousemove", this.move_show_area);
            document.addEventListener("mouseup", this.cancel_move_show_area);
        }.bind(this));
    }

    move_show_area(e) {
        if (document.show_area_move) {
            e = e || window.event;
            let mouse_x = e.pageX;

            if (mouse_x - document.curr_show_area_width + document.curr_preview_box_pos >= this.x_pos_left &&
                mouse_x + document.curr_preview_box_pos <= this.x_pos_right) {
                let new_pos_right = this.x_pos_right - mouse_x - document.curr_preview_box_pos;
                this.show_area_container.style.right = new_pos_right + 'px';
                this.show_area_container.style.left = 'auto';
                // console.log(this.layer_right);
                this.layer_right.style.width = new_pos_right + 'px';

                // this.layer_left.style.width =
                this.get_data_range();
                this.update_main_chart();
            }
        }
    }

    get_data_range() {
        this.set_point_dist();
        this.set_data_show_percentage();
        this.set_content_point_indexes();
        this.set_offsets();
        this.set_points_count();
    }

    set_point_dist() {
        this.config.data_show_percentage = this.show_area_container.offsetWidth / this.config.preview_canvas_width;
        let precise_point_distances_count = this.config.data_show_percentage * (this.data_len - 1);
        this.chart_config.point_dist = this.content_width / precise_point_distances_count; // horizontal distance btw points
    }

    set_data_show_percentage() {
        this.chart_config.data_start = this.show_area_container.offsetLeft / this.config.preview_canvas_width; // TODO optimize
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

        this.chart_config.offset_left = total_offset - this.chart_config.point_dist * steps_diff;
    }

    calculate_offset_right() {
        let offset_right = this.chart_config.point_dist * (this.config.unrounded_end_index - this.chart_config.end_index);

        let total_offset_r = offset_right + this.chart_config.side_padding;
        let steps_diff_right = Math.floor(total_offset_r / this.chart_config.point_dist);

        if (steps_diff_right > 0) {
            if (steps_diff_right > this.data_len - this.chart_config.end_index - 1) {
                steps_diff_right = this.data_len - this.chart_config.end_index - 1;
            }
            this.chart_config.end_index += steps_diff_right; // index of side canvas point
        }
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
    }

    static other_side(side) {
        return (side === 'left' ? 'right' : 'left');
    }

    // ---

    animate_toggle_chart_draw(i) {
        this.autosize();
        this.config.chart_sizing_diff = this.chart_config.chart_sizing - this.charts[0].config.chart_sizing;

        let k = this.charts[i].config.draw ? 1 : -1;
        animate_cancel_draw(this, i, k);
    }
}

// ----

let point_details_show = function (e) {
    e = e || window.event;

    let rect = this.canvas.getBoundingClientRect();

    let canvas_pos = e.pageX - rect.left;
    let point_index = this.chart_config.start_index +
        Math.round((canvas_pos - this.chart_config.offset_left) / this.chart_config.point_dist);

    if (document.curr_point_index !== point_index) {
        document.curr_point_index = point_index;

        this.clear_canvas();
        this.draw_horizontal_grid();
        this.highlight_line();

        for (let i = 0; i < this.charts.length; i++) {
            if (this.charts[i].config.draw) {
                this.charts[i].draw_chart();
                this.charts[i].highlight_point(point_index);
            }
        }

        this.show_point_modal(point_index);
    }
};

let cancel_point_details_show = function () {
    document.curr_point_index = -1;
    this.modal.classList.remove('show');

    this.clear_canvas();
    this.draw_horizontal_grid();
    for (let i = 0; i < this.charts.length; i++) {
        if (this.charts[i].config.draw) {
            this.charts[i].draw_chart();
        }
    }
};

// ---

let move_show_area = function (e) { // TODO fix moving large box
    if (!document.show_area_move) {
        return;
    }

    e = e || window.event;
    let mouse_x = e.pageX;

    let dist_to_left = mouse_x - document.curr_show_area_width + document.curr_preview_box_pos - this.x_pos_left;
    let dist_to_right = this.x_pos_right - mouse_x - document.curr_preview_box_pos;

    if (dist_to_left >= 0 && dist_to_right >= 0) {
        let new_pos_right = this.x_pos_right - mouse_x - document.curr_preview_box_pos;

        this.show_area_container.style.right = this.layer_right.style.width = new_pos_right + 'px';
        this.show_area_container.style.left = 'auto';
        this.layer_left.style.width = dist_to_left + 'px';

        this.get_data_range();
        this.autosize();
        this.display_vertical_axis();
        this.update_main_chart_canvas();
        this.move_timeflow_axis();
        // this.update_main_chart();
    }
};

let cancel_move_show_area = function () {
    document.removeEventListener("mousemove", this.move_show_area);
};

// ---

let chart_preview_resize = function (e) {
    let rect = this.show_area_container.getBoundingClientRect(); // TODO 2 rects
    e = e || window.event;
    let mouse_x = e.pageX;

    let other = Chart_container.other_side(document.curr_area_border);
    let k = other === 'left' ? -1 : 1;

    let dist_to_side = k * (mouse_x - this['x_pos_' + document.curr_area_border]) - document.border_cursor_pos;
    let dist_to_other_border = k * (rect[other] - mouse_x) - this.area_border_width;

    if (dist_to_side >= 0 && dist_to_other_border >= 0) {
        let new_width = k * (rect[other] - mouse_x) + document.border_cursor_pos;
        this.show_area_container.style.width = new_width + 'px';
        this['layer_' + document.curr_area_border].style.width = dist_to_side + 'px';

        this.get_data_range(); // TODO func optimiztaion + right border
        // this.config.data_start = (mouse_x - this.x_pos_left) / preview_box_width;
        // this.config.start_index = Math.floor(this.config.data_start * this.charts[0].config.chart_data.length); // percentage


        this.autosize(); // get chart sizing
        this.display_vertical_axis();
        this.update_main_chart_canvas();
        this.resize_timeflow_axis();
        // this.move_timeflow_axis();

        // this.update_main_chart();
    }
};

let cancel_chart_preview_resize = function () {
    this.container.querySelector('.area-border.active').classList.remove('active'); // TODO not add active on
    document.removeEventListener("mousemove", this.chart_preview_resize);
    document.show_area_move = true;

    let labels = this.container.querySelectorAll('.timeflow-axis-label.to-fade');
    for (let i = 0; i < labels.length; i++) {
        labels[i].classList.add('faded');
    }
};

// ---

let toggle_chart_draw = function (i) {
    this.charts[i].config.draw = !this.charts[i].config.draw;
    this.modal.querySelectorAll('li')[i].classList.toggle('hidden');
    this.animate_toggle_chart_draw(i);
};

theme_colors = {
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

Default_container_config = {
    canvas_height: 400,
    canvas_width: 400,

    preview_canvas_height: 55,
    preview_canvas_width: undefined,

    side_padding: 15,
    padding_top: 10,

    data_start: 0.7,
    data_end: 1,

    vertical_axis_steps_count: 6,
    timeflow_steps_count: 6,
    timeflow_labels_step: 1,
};

const step = 9;
let counter = 0;

function animate_cancel_draw(obj, a, k) { //TODO preview max for all charts
    obj.clear_canvas();
    obj.draw_horizontal_grid();
    obj.clear_preview_canvas();

    obj.charts[a].config.opacity += k * (1 / (step + 1));

    for (let i = 0; i < obj.charts.length; i++) {

        // -- redraw preview ---

        for (const key in obj.preview_chart_config) {
            if (key !== 'chart_sizing') {
                obj.charts[i].config[key] = obj.preview_chart_config[key];
            }
        }

        obj.charts[i].config.chart_sizing += (obj.config.chart_sizing_diff / (step + 1));
        obj.charts[i].config.chart_sizing /= obj.charts_koef;

        if (obj.charts[i].config.draw || i === a) {
            obj.charts[i].draw_chart('.chart-preview-canvas');
        }
        obj.charts[i].config.chart_sizing *= obj.charts_koef;

        // -- redraw main chart --

        for (const key in obj.chart_config) {
            if (key !== 'chart_sizing') {
                obj.charts[i].config[key] = obj.chart_config[key];
            }
        }

        obj.display_vertical_axis();
        if (obj.charts[i].config.draw || i === a) {
            obj.charts[i].draw_chart();
        }
    }

    if (counter < step) {
        requestAnimationFrame(function () {
            animate_cancel_draw(obj, a, k)
        });
        counter++;
    } else {
        counter = 0;
    }
}