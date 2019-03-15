class Chart_container {
    constructor(container_selector, container_config, timeflow_data, charts) {
        this.container_selector = container_selector;
        this.config = container_config;
        this.charts = charts;
        this.timeflow_data = timeflow_data;

        this.container = document.querySelector(container_selector);
        this.data_len = this.charts[0].chart_data.length;

        this.init();
    }

    init() {
        this.fill();
        this.insert_HTML();
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
            this.charts[i].draw_chart('.chart-preview-canvas', true);
        }
    }

    update_main_chart() {
        this.autosize(); // get chart sizing

        this.display_vertical_axis();

        this.update_main_chart_canvas();

        this.display_timeflow_axis();
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

    // --- Set vertical chart step ---

    autosize(is_preview = false) {
        let prefix = is_preview ? 'preview_' : '';
        let config = this[prefix + 'chart_config'];

        let max = -10000;

        for (let a = 0; a < this.charts.length; a++) {
            if (this.charts[a].config.draw) {
                for (let i = 0; i < config.points_count; i++) {
                    if (this.charts[a].config.chart_data[config.start_index + i] > max) {
                        max = this.charts[a].config.chart_data[config.start_index + i];
                    }
                }
            }
        }

        if (max > 0) {
            this.config.chart_max = max;
        } else {
            max = this.config.chart_max;
        }

        let canvas_height = this.config[prefix + 'canvas_height'];
        config.chart_sizing = (canvas_height - this.config.max_line_width / 2) / max;
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

    display_timeflow_axis() {
        this.destroy_old_labels('timeflow');

        let timeflow_axis_labels_container = this.container.querySelector('.timeflow-axis-labels-container');

        let steps_count = this.get_timeflow_axis_labels_count();
        if (steps_count > 6) {
            // this.config.timeflow_axis_labels_step = this.config.canvas_width /
        }
        // console.log(steps_count);

        for (let i = 0, data_len = this.get_data_len(); i <= data_len; i += this.config.timeflow_axis_labels_step) {
            let left_pos = this.charts[0].config.point_dist * i + this.config.offset_left - 12;
            // console.log(left_pos);

            let full_date = new Date(this.timeflow_data[this.config.start_index + i] * 1000);
            let date = full_date.toLocaleDateString('en-US', {month: 'short', day: 'numeric'});

            let label = document.createElement('span');
            label.classList.add('axis-label', 'timeflow-axis-label');
            label.style.left = left_pos + 'px';
            label.innerText = date;

            timeflow_axis_labels_container.appendChild(label);
        }
    }

    get_timeflow_axis_labels_count() {
        let steps_count = this.config.canvas_width / (this.config.timeflow_axis_labels_step * this.charts[0].config.point_dist);

        return Math.floor(steps_count);
    }

    // ---

    display_vertical_axis() {
        this.destroy_old_labels('vertical');

        let steps_count = Math.ceil((this.config.canvas_height / this.config.chart_sizing) / this.config.vertical_axis_labels_step);
        let vertical_axis_labels_container = this.container.querySelector(' .vertical-axis-labels-container');
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

    destroy_old_labels(axis_type) {
        let old_labels = this.container.querySelector(' .' + axis_type + '-axis-labels-container');

        if (old_labels) {
            while (old_labels.firstChild) {
                old_labels.removeChild(old_labels.firstChild);
            }
        }
    }

    // --- Drawing additional canvas elements ---

    draw_horizontal_grid() {
        let ctx = this.canvas.getContext('2d');

        let gridlines_count = Math.ceil(this.config.canvas_height / (this.config.vertical_axis_labels_step * this.chart_config.chart_sizing));

        ctx.lineWidth = 1;
        ctx.strokeStyle = this.config.grid_colour;

        let y0 = this.config.canvas_height + this.chart_config.chart_sizing * this.config.vertical_axis_labels_step - 1;

        for (let i = 0; i < gridlines_count; i++) {
            y0 -= this.chart_config.chart_sizing * this.config.vertical_axis_labels_step;
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

        this.set_chart_config();
        this.set_preview_chart_config();
    }

    set_preview_chart_config() {
        this.preview_chart_config = {
            chart_sizing: this.config.chart_sizing, // changable

            point_dist: this.config.preview_canvas_width / (this.data_len - 1),
            start_index: 0,
            points_count: this.data_len,
            offset_left: 0,
            side_padding: 0
        };
    }

    set_chart_config() {  // TODO padding top
        this.chart_config = {
            chart_sizing: this.config.chart_sizing, // changable

            point_dist: this.config.preview_canvas_width / (this.data_len - 1),
            start_index: 0,
            points_count: this.data_len,
            offset_left: 0,
            side_padding: 0,
            end_index: 0,
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
        this.container.classList.add('chart-container-wrapper');

        this.insert_container_name();
        this.insert_chart_content();
        this.insert_preview_chart_content();
        this.insert_chart_labels();

        this.canvas = this.container.querySelector('.chart-canvas');
        this.preview_canvas = this.container.querySelector('.chart-preview-canvas');
        this.show_area_container = this.container.querySelector('.show-area-container');
    }

    // --- Point details modal ---

    init_point_details_show() {
        point_details_show = point_details_show.bind(this);
        cancel_point_details_show = cancel_point_details_show.bind(this);

        this.canvas.addEventListener('mousemove', point_details_show);
        this.canvas.addEventListener('mouseleave', cancel_point_details_show);
    }

    highlight_line() {
        let ctx = this.get_ctx();

        ctx.lineWidth = 1;
        ctx.strokeStyle = this.config.grid_accent_colour;

        let x0 = ~~((document.curr_point_index - this.config.start_index) * this.charts[0].config.point_dist) + 0.5;

        ctx.beginPath();
        ctx.moveTo(x0, 0);
        ctx.lineTo(x0, this.config.canvas_height);
        ctx.stroke();
        ctx.closePath();
    }

    show_point_modal(index) {
        let modal = this.container.querySelector('.point-details-modal');
        modal.style.left = ((index - this.config.start_index) * this.charts[0].config.point_dist - 32) + 'px'; // TODO

        let date = 'Sat 12, Feb';
        /*let date = str_to_date(this.config.chart_breakpoints[index], 'day');
        date = date.toLocaleDateString('en-US', {weekday: 'short', month: 'short', day: 'numeric'});*/

        let point_values = modal.querySelectorAll('.point-value');

        for (let i = 0; i < this.charts.length; i++) {
            // console.log(this.charts[i].config.draw); // TODO not displaying draw: false charts
            if (this.charts[i].config.draw) {
                point_values[i].textContent = this.charts[i].config.chart_data[index];
            }
        }

        modal.querySelector('.breakpoint-date').textContent = date;
    }

    // ---

    clear_canvas() {

        // if (canvas && canvas.getContext) {
        let ctx = this.canvas.getContext('2d');
        ctx.clearRect(0, 0, this.config.canvas_width, this.config.canvas_height);
        // }
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
            inputs[i].addEventListener('change', cancel_chart_draw.bind(this, i));
        }
    }

    // ---

    get_data_len() {
        return this.config.end_index - this.config.start_index;
    }

    charts_init() {
        let basic_chart_config = {
            draw: true,

            chart_wrapper_selector: this.container_selector,
            canvas_selector: '.chart-canvas',
            canvas_width: this.config.canvas_width,
            canvas_height: this.config.canvas_height,
        };

        for (let i = 0; i < this.charts.length; i++) {
            let chart_config = Object.assign({}, basic_chart_config, this.charts[i]);
            this.charts[i] = new Chart(undefined, chart_config);
            this.charts[i].init();
        }
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
        let list = this.new_labels_list();
        this.container.appendChild(list);
    }

    // ---

    insert_chart_wrapper(is_preview = false) {
        let wrapper = document.createElement('div');
        let class_name = is_preview ? 'chart-preview-wrapper' : 'chart-wrapper';

        if (is_preview) {
            wrapper.setAttribute('width', this.content_width + 'px');
            // wrapper.style.flexBasis = this.content_width+'px';
        }

        wrapper.classList.add(class_name);
        return this.container.appendChild(wrapper);
    }

    new_canvas(is_preview = false) {
        let canvas = document.createElement('canvas');

        let class_name = is_preview ? 'chart-preview-canvas' : 'chart-canvas'; // TODO 1 check ??
        let height = is_preview ? this.config.preview_canvas_height : this.config.canvas_height;
        let width = is_preview ? this.config.preview_canvas_width : this.config.canvas_width;

        canvas.classList.add(class_name);
        canvas.setAttribute('height', height);
        canvas.setAttribute('width', width);

        if (!is_preview) {
            // this.canvas = canvas;//
        }

        return canvas;
    }

    new_vertical_axis() {
        return "<div class='vertical-axis-labels-container axis-labels-container' style='height: "
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
        let style = 'width: ' + ((this.config.data_end - this.config.data_start) * 100) + '%; ' + 'right: ' + (1 - this.config.data_end) * 100 + '%;';

        return '<div class="show-area-container chart-area-container" style="' + style + '">' +
            '<div class="area-border-right area-border" id="area-border-left"><div class="layer"></div></div>' +
            '<div class="area-border-left area-border" id="area-border-right"><div class="layer"></div></div></div>';
    }

    new_labels_list() {
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

    preview_box_resize_init(){
        document.show_area_move = true;

        let area_borders = this.container.querySelectorAll('.area-border');

        chart_preview_resize = chart_preview_resize.bind(this);
        cancel_chart_preview_resize = cancel_chart_preview_resize.bind(this);

        for (let i = 0; i < 2; i++) {
            area_borders[i].addEventListener("mousedown", function (obj) {
                document.curr_area_border = this.get_border_side(obj);
                document.show_area_move = false;

                let rect = this.show_area_container.getBoundingClientRect();
                let old_pos,
                    other_side = 'right';

                if (document.curr_area_border === 'left') {
                    old_pos = this.x_pos_right - rect.right;
                } else {
                    other_side = 'left';
                    old_pos = rect.left - this.x_pos_left;
                }

                this.show_area_container.style[other_side] = old_pos + 'px';
                this.show_area_container.style[document.curr_area_border] = 'auto';

                document.addEventListener("mousemove", chart_preview_resize);
                document.addEventListener("mouseup", cancel_chart_preview_resize);
            }.bind(this, area_borders[i]));
        }
    }

    preview_box_move_init() {
        move_show_area = move_show_area.bind(this);
        cancel_move_show_area = cancel_move_show_area.bind(this);

        this.show_area_container.addEventListener("mousedown", function (e) {
            e = e || window.event;
            let rect = this.show_area_container.getBoundingClientRect();

            document.curr_preview_box_pos = rect.right - e.pageX;
            document.curr_show_area_width = rect.width;

            document.addEventListener("mousemove", move_show_area);
            document.addEventListener("mouseup", cancel_move_show_area);
        }.bind(this));
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
        let precise_point_count = this.config.data_show_percentage * (this.data_len - 1);
        this.chart_config.point_dist = this.content_width / precise_point_count; // horizontal distance btw points

        console.log(this.config.data_show_percentage);
        console.log(this.chart_config.point_dist);
    }

    set_data_show_percentage() {
        this.chart_config.data_start = this.show_area_container.offsetLeft / this.config.preview_canvas_width; // TODO ???
        this.chart_config.data_end = this.chart_config.data_start + this.config.data_show_percentage;
    }

    set_content_point_indexes() {
        this.config.unrounded_start_index = this.chart_config.data_start * (this.data_len - 1);
        let unrounded_end_index = this.chart_config.data_end * (this.data_len - 1);

        this.chart_config.start_index = Math.ceil(this.config.unrounded_start_index); // indexes of side content point
        this.chart_config.end_index = Math.floor(unrounded_end_index);
    }

    // ---

    set_offsets() {
        this.calculate_offset_left();
        this.calculate_offset_right();
    }

    calculate_offset_left() {
        // distance canvas left side - first content point
        let offset_left = (this.chart_config.start_index - this.config.unrounded_start_index) * this.chart_config.point_dist;

        // get dist canvas left edge -> first point
        let total_offset = this.chart_config.side_padding + offset_left;
        let steps_diff = 0;

        if (total_offset >= this.chart_config.point_dist) {
            steps_diff = Math.floor(total_offset / this.chart_config.point_dist);
            this.chart_config.start_index -= steps_diff; // index of closest outside point
        }

        this.chart_config.offset_left = total_offset - this.chart_config.point_dist * steps_diff;
    }

    calculate_offset_right() {
        let offset_right = this.config.canvas_width - this.content_width * this.chart_config.data_end;
        let total_offset_r = offset_right + this.chart_config.side_padding;
        let steps_diff_right = Math.floor(total_offset_r / this.chart_config.point_dist);

        if (steps_diff_right >= 1) {
            this.chart_config.end_index += steps_diff_right; // index of closest outside point
        }
    }

    // ---

    set_points_count() {
        this.chart_config.points_count = this.chart_config.end_index - this.chart_config.start_index; // indexes of 2 side visible points

        if (this.chart_config.end_index !== this.data_len - 1) {
            this.chart_config.points_count++;
        }

        if (this.chart_config.start_index !== 0) {
            this.chart_config.points_count++; // TODO fix point number
        }
    }

    // ---


}

// ----

let point_details_show = function (e) {
    this.container.querySelector('.point-details-modal').classList.add('show');
    let rect = this.canvas.getBoundingClientRect();

    let percentage = (e.pageX - rect.left) / this.canvas.width;
    let point_index = Math.round(this.config.start_index + (this.config.end_index - this.config.start_index) * percentage);

    if (document.curr_point_index !== point_index) {
        document.curr_point_index = point_index;
        this.clear_canvas();
        this.draw_horizontal_grid();
        this.highlight_line();
        for (let i = 0; i < this.charts.length; i++) {
            this.charts[i].draw_chart();
            this.charts[i].highlight_point(point_index);
        }

        this.show_point_modal(point_index);
    }
};

let cancel_point_details_show = function () {
    document.curr_point_index = -1;
    this.container.querySelector('.point-details-modal').classList.remove('show');

    this.clear_canvas();
    this.draw_horizontal_grid();
    for (let i = 0; i < this.charts.length; i++) {
        this.charts[i].draw_chart();
    }
};

// ---

let move_show_area = function (e) {
    if (document.show_area_move) {
        e = e || window.event;
        let mouse_x = e.pageX;

        if (mouse_x - document.curr_show_area_width + document.curr_preview_box_pos >= this.x_pos_left && mouse_x + document.curr_preview_box_pos <= this.x_pos_right) {
            let new_pos_right = this.x_pos_right - mouse_x - document.curr_preview_box_pos;
            this.show_area_container.style.right = new_pos_right + 'px';
            this.show_area_container.style.left = 'auto';
            this.get_data_range();
            this.update_main_chart();
        }
    }
};

let cancel_move_show_area = function () {
    document.removeEventListener("mousemove", move_show_area);
};

// ---

let chart_preview_resize = function (e) {
    let rect = this.show_area_container.getBoundingClientRect(); // TODO 2 rects
    e = e || window.event;
    let mouse_x = e.pageX;

    let preview_box_width = this.x_pos_right - this.x_pos_left;

    if (document.curr_area_border === 'left') {
        if (!(mouse_x <= this.x_pos_left || mouse_x >= rect.right - this.area_border_width)) { // inside the preview box

            let dist_to_left = mouse_x - this.x_pos_left; // TODO const dist pass ???
            let dist_to_right = this.x_pos_right - rect.right;

            let new_width = preview_box_width - dist_to_left - dist_to_right;
            this.show_area_container.style.width = new_width + 'px';

            this.config.data_start = (mouse_x - this.x_pos_left) / preview_box_width; // TODO -data-start
            this.config.start_index = Math.floor(this.config.data_start * this.charts[0].config.chart_data.length); // percentage

            this.update_main_chart();
        }
    } else {
        if (!(mouse_x <= rect.left + this.area_border_width || mouse_x >= this.x_pos_right)) { // inside the preview box
            let dist_to_left = rect.left - this.x_pos_left;
            let dist_to_right = this.x_pos_right - mouse_x;

            let new_width = preview_box_width - dist_to_left - dist_to_right;
            this.show_area_container.style.width = new_width + 'px';

            this.config.data_end = (mouse_x - this.x_pos_left) / preview_box_width;
            this.config.end_index = Math.floor(this.config.data_start * this.charts[0].config.chart_data.length); // percentage

            this.update_main_chart();
        }
    }
};

let cancel_chart_preview_resize = function () {
    document.removeEventListener("mousemove", chart_preview_resize); // TODO ???? reassign
    document.show_area_move = true;
};

// ---


function set_content_point_indexes() {
    let unrounded_start_index = this.chart_config.data_start * (this.data_len - 1);
    let unrounded_end_index = this.chart_config.data_end * (this.data_len - 1);

    this.chart_config.start_index = Math.ceil(unrounded_start_index); // indexes of side content point
    this.chart_config.end_index = Math.floor(unrounded_end_index);
}

// ---

let cancel_chart_draw = function (i) {
    this.charts[i].config.draw = !this.charts[i].config.draw;
    this.update_all();
};

Default_container_config = {
    canvas_height: 400,
    canvas_width: 400,

    preview_canvas_height: 60,
    preview_canvas_width: undefined,

    side_padding: 15,

    data_start: 0.7,
    data_end: 1,

    timeflow_axis_labels_step: 2,

    grid_colour: '#f2f4f5',
    grid_accent_colour: '#dfe6eb',
};

