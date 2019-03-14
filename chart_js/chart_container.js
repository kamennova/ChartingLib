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
        this.fill(); // filling empty fields with default values
        this.insert_HTML();
        this.charts_init();
        this.charts_toggle_draw_init();

        // this.display_timeflow_axis()

        this.preview_chart_init();
        this.preview_box_init();

        this.update_main_chart();// setting start_index. end_index
        return;

        // this.update_all();

        this.init_point_details_show();
    }

    update_all() {
        this.preview_chart_init();
        this.update_main_chart();
    }

    preview_chart_init() {
        this.clear_preview_canvas();
        this.autosize_preview(); // get chart sizing

        for (let i = 0; i < this.charts.length; i++) {
            this.charts[i].config.chart_sizing = this.config.chart_sizing; // changable

            this.charts[i].config.point_dist = this.config.preview_canvas_width / (this.data_len - 1);
            this.charts[i].config.start_index = 0;
            this.charts[i].config.points_count = this.data_len; // or end index
            this.charts[i].config.offset_left = 0;
            this.charts[i].config.side_padding = 0;

            this.charts[i].draw_chart('.chart-preview-canvas', true);
        }
    }

    update_main_chart() {
        this.autosize(); // get chart sizing
        this.display_vertical_axis();

        this.clear_canvas();
        this.draw_horizontal_grid();

        for (let i = 0; i < this.charts.length; i++) {
            this.charts[i].config.chart_sizing = this.config.chart_sizing;
            this.charts[i].config.point_dist = this.config.point_dist;

            this.charts[i].config.start_index = this.config.start_index;
            this.charts[i].config.end_index = this.config.end_index;
            this.charts[i].config.points_count = this.config.points_count; // or end index
            this.charts[i].config.offset_left = this.config.offset_left;
            this.charts[i].config.side_padding = this.config.side_padding;

            this.charts[i].draw_chart();
        }

        this.display_timeflow_axis();
    }

    /*autosize(preview = false) {
        let points_count = preview ? this.data_len : this.config.end_index - this.config.start_index + 2;

        let max = -10000;

        for (let a = 0; a < this.charts.length; a++) {
            if (!this.charts[a].config.draw) {
                continue;
            }
            for (let i = 0; i < points_count; i++) {
                if (this.charts[a].config.chart_data[this.config.start_index + i] > max) {
                    max = this.charts[a].config.chart_data[this.config.start_index + i];
                }
            }
        }

        let max_line_width = 2;// TODO let max_line_width = get_max()
        let max_point_radius = 4;

        let canvas_height = (preview ? this.config.preview_canvas_height : this.config.canvas_height);
        this.config.chart_sizing = (canvas_height - max_line_width / 2 - max_point_radius) / max;
    }*/

    autosize(preview = false) {
        let points_count = preview ? this.data_len : this.config.end_index - this.config.start_index + 2;

        let max = -10000;

        for (let a = 0; a < this.charts.length; a++) {
            if (!this.charts[a].config.draw) {
                continue;
            }
            for (let i = 0; i < points_count; i++) {
                if (this.charts[a].config.chart_data[this.config.start_index + i] > max) {
                    max = this.charts[a].config.chart_data[this.config.start_index + i];
                }
            }
        }

        let max_line_width = 2;// TODO let max_line_width = get_max()
        let max_point_radius = 4;

        let canvas_height = (preview ? this.config.preview_canvas_height : this.config.canvas_height);
        this.config.chart_sizing = (canvas_height - max_line_width / 2 - max_point_radius) / max;
    }


    autosize_preview() {
        let points_count = this.data_len; // TODO padding top

        let max = -10000;

        for (let a = 0; a < this.charts.length; a++) {
            if (!this.charts[a].config.draw) {
                continue;
            }
            for (let i = 0; i < points_count; i++) {
                if (this.charts[a].config.chart_data[this.config.start_index + i] > max) {
                    max = this.charts[a].config.chart_data[this.config.start_index + i];
                }
            }
        }

        let max_line_width = 2;// TODO let max_line_width = get_max()

        let canvas_height = this.config.preview_canvas_height;
        this.config.chart_sizing = (canvas_height - max_line_width / 2) / max;
    }

    set_chart_params() {
        for (let i = 0; i < this.charts.length; i++) {
            this.charts[i].config.chart_sizing = this.config.chart_sizing;
            this.charts[i].point_dist = this.config.point_dist;

            this.charts[i].start_index = this.config.start_index;
            this.charts[i].end_index = this.config.end_index;
            this.charts[i].points_count = this.config.points_count; // or end index
            this.charts[i].offset_left = this.config.offset_left;
            this.charts[i].side_padding = this.config.side_padding;
        }
    }

    set_preview_chart_params() {
        for (let i = 0; i < this.charts.length; i++) {
            this.charts[i].config.chart_sizing = this.config.chart_sizing; // changable

            this.charts[i].point_dist = this.config.preview_canvas_width / this.data_len;
            this.charts[i].start_index = 0;
            this.charts[i].end_index = this.data_len - 1;
            this.charts[i].points_count = this.data_len; // or end index
            this.charts[i].offset_left = 0;
            this.charts[i].side_padding = 0;
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

    display_timeflow_axis() {
        this.destroy_old_labels('timeflow');

        let timeflow_axis_labels_container = this.container.querySelector('.timeflow-axis-labels-container');

        let steps_count = get_timeflow_axis_labels_count.bind(this)();
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

    draw_horizontal_grid() {
        let ctx = this.canvas.getContext('2d');

        let gridlines_count = Math.ceil(this.config.canvas_height / (this.config.vertical_axis_labels_step * this.config.chart_sizing));

        ctx.lineWidth = 1;
        ctx.strokeStyle = this.config.grid_colour;

        let y0 = this.config.canvas_height + this.config.chart_sizing * this.config.vertical_axis_labels_step - 1;

        for (let i = 0; i < gridlines_count; i++) {
            y0 -= this.config.chart_sizing * this.config.vertical_axis_labels_step;
            y0 = ~~y0 + 0.5;

            ctx.beginPath();
            ctx.moveTo(this.config.side_padding, y0);
            ctx.lineTo(this.content_width + this.config.side_padding, y0);
            ctx.stroke();
            ctx.closePath();
        }
    }

    fill() {
        for (const key in Default_container_config) {
            if (!this.config.hasOwnProperty(key) || this.config[key] == null) {
                this.config[key] = Default_container_config[key];
            }
        }

        this.content_width = this.config.canvas_width - 2 * this.config.side_padding;
        this.config.preview_canvas_width = this.content_width;
    }

    insert_HTML() {
        this.container.classList.add('chart-container-wrapper');

        insert_container_name.bind(this)();
        insert_chart_content.bind(this)();
        insert_preview_chart_content.bind(this)();
        insert_chart_labels.bind(this)();

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

    // --- preview box functions ---

    preview_box_init() {
        document.show_area_move = true;

        let area_border_width = 5 // border width
            + 2; // dist btw borders

        let chart_preview_container = this.container.querySelector('.chart-preview-wrapper');

        let x_pos_left = chart_preview_container.getBoundingClientRect().left;
        let x_pos_right = chart_preview_container.getBoundingClientRect().right;

        let area_borders = this.container.querySelectorAll('.area-border');

        // changing box width

        chart_preview_listener = chart_preview_listener.bind(this, area_border_width, x_pos_left);
        cancel_chart_preview_listener = cancel_chart_preview_listener.bind(this);

        for (let i = 0; i < 2; i++) {
            area_borders[i].addEventListener("mousedown", function (obj) {
                document.curr_area_border = get_border_side(obj);
                document.show_area_move = false;

                let rect = this.show_area_container.getBoundingClientRect();
                let old_pos,
                    other_side = 'right';

                if (document.curr_area_border === 'left') {
                    old_pos = x_pos_right - rect.right;
                } else {
                    other_side = 'left';
                    old_pos = rect.left - x_pos_left;
                }

                this.show_area_container.style[other_side] = old_pos + 'px';
                this.show_area_container.style[document.curr_area_border] = 'auto';

                document.addEventListener("mousemove", chart_preview_listener);
                document.addEventListener("mouseup", cancel_chart_preview_listener);
            }.bind(this, area_borders[i]));
        }

        // --- moving the preview box ---

        this.show_area_container.addEventListener("mousedown", function (e) {
            let rect = this.show_area_container.getBoundingClientRect();

            document.curr_preview_box_pos = rect.right - e.pageX;
            document.curr_show_area_width = rect.width;

            document.addEventListener("mousemove", move_show_area);
            document.addEventListener("mouseup", cancel_move_show_area);
        }.bind(this));

        let cancel_move_show_area = function () {
            document.removeEventListener("mousemove", move_show_area);
        };

        let move_show_area = function (e) {
            if (document.show_area_move) {
                e = e || window.event;
                let mouse_x = e.pageX;

                if (mouse_x - document.curr_show_area_width + document.curr_preview_box_pos >= x_pos_left && mouse_x + document.curr_preview_box_pos <= x_pos_right) {
                    let new_pos_right = x_pos_right - mouse_x - document.curr_preview_box_pos;
                    this.show_area_container.style.right = new_pos_right + 'px';
                    this.show_area_container.style.left = 'auto';
                    get_data_range.bind(this)();
                    this.update_main_chart();
                }
            }
        }.bind(this);

        get_data_range.bind(this)();
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
    }
}

let Default_container_config = {
    canvas_height: 400,
    canvas_width: 400,

    preview_canvas_height: 60,
    preview_canvas_width: undefined,

    chart_sizing: 20,
    padding_left: 0,
    side_padding: 15,

    data_start: 0.7,
    data_end: 1,
    start_index: 0,
    end_index: 0,

    timeflow_axis_labels_step: 2,

    grid_colour: '#f2f4f5',
    grid_accent_colour: '#dfe6eb',
};

// ---- Insert HTML ----

function insert_container_name() {
    this.container.insertAdjacentHTML('beforeend', '<h2 class="chart-container-name">' + this.config.name + '</h2>');
}

function insert_chart_content() {
    let wrapper = insert_chart_wrapper.bind(this)();

    let canvas = new_canvas.bind(this)();
    wrapper.appendChild(canvas);

    let vertical_axis = new_vertical_axis.bind(this)();
    wrapper.insertAdjacentHTML('beforeend', vertical_axis);

    let timeflow_axis = new_timeflow_axis.bind(this)();
    wrapper.insertAdjacentHTML('beforeend', timeflow_axis);

    let point_modal = new_point_modal.bind(this)();
    wrapper.appendChild(point_modal);

    point_modal.insertAdjacentHTML('afterbegin', '<p class="breakpoint-date"></p>');
    point_modal.insertAdjacentHTML('beforeend', '<ul class="points"></ul>');
}

function insert_preview_chart_content() {
    let preview_wrapper = insert_chart_wrapper.bind(this)(true);

    let preview_canvas = new_canvas.bind(this)(true);
    preview_wrapper.appendChild(preview_canvas);

    let show_area_box = new_show_area_box.bind(this)();
    preview_wrapper.insertAdjacentHTML('beforeend', show_area_box);
    // this.show_area_container = this.container.querySelector('.show-area-container');
}

function insert_chart_labels() {
    let labels_form = new_labels_form.bind(this)();

    let list = new_labels_list.bind(this)();
    labels_form.appendChild(list);
}

// ---

function insert_chart_wrapper(is_preview = false) {
    let wrapper = document.createElement('div');
    let class_name = is_preview ? 'chart-preview-wrapper' : 'chart-wrapper';

    if (is_preview) {
        wrapper.setAttribute('width', this.content_width + 'px');
        // wrapper.style.flexBasis = this.content_width+'px';
    }

    wrapper.classList.add(class_name);
    return this.container.appendChild(wrapper);
}

function new_canvas(is_preview = false) {
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

function new_vertical_axis() {
    return "<div class='vertical-axis-labels-container axis-labels-container' style='height: "
        + this.config.canvas_height + "px; left: " + this.config.side_padding + "px;'></div>";
}

function new_timeflow_axis() {
    return '<div id="timeflow-axis-labels-container" class="timeflow-axis-labels-container horizontal-axis-labels-container axis-labels-container"></div>';
}

function new_point_modal() {
    let point_modal = document.createElement('div');
    point_modal.classList.add('point-details-modal');

    return point_modal;
}

function new_show_area_box() {
    return '<div class="show-area-container chart-area-container">' +
        '<div class="area-border-right area-border" id="area-border-left"><div class="layer"></div></div>' +
        '<div class="area-border-left area-border" id="area-border-right"><div class="layer"></div></div></div>';
}

function new_labels_form() {
    let labels_form = document.createElement('form');
    labels_form.classList.add('charts-draw-form');
    labels_form.setAttribute('name', this.config.name + '_charts_draw_form');

    return this.container.appendChild(labels_form);
}

function new_labels_list() {
    let list = document.createElement('ul');
    list.classList.add('charts-labels-list');

    return list;
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

let chart_preview_listener = function (area_border_width, x_pos_left) {
    let rect = this.show_area_container.getBoundingClientRect(); // TODO 2 rects
    let e = window.event;
    let mouse_x = e.pageX;
    let x_pos_right = this.config.preview_canvas_width + x_pos_left;

    let preview_box_width = x_pos_right - x_pos_left;

    if (document.curr_area_border === 'left') {
        if (!(mouse_x <= x_pos_left || mouse_x >= rect.right - area_border_width)) { // inside the preview box

            let dist_to_left = mouse_x - x_pos_left; // TODO const dist pass ???
            let dist_to_right = x_pos_right - rect.right;

            let new_width = preview_box_width - dist_to_left - dist_to_right;
            this.show_area_container.style.width = new_width + 'px';

            this.config.data_start = (mouse_x - x_pos_left) / preview_box_width; // TODO -data-start
            this.config.start_index = Math.floor(this.config.data_start * this.charts[0].config.chart_data.length); // percentage

            this.update_main_chart();
        }
    } else {
        if (!(mouse_x <= rect.left + area_border_width || mouse_x >= x_pos_right)) { // inside the preview box
            let dist_to_left = rect.left - x_pos_left;
            let dist_to_right = x_pos_right - mouse_x;

            let new_width = preview_box_width - dist_to_left - dist_to_right;
            this.show_area_container.style.width = new_width + 'px';

            this.config.data_end = (mouse_x - x_pos_left) / preview_box_width;
            this.config.end_index = Math.floor(this.config.data_start * this.charts[0].config.chart_data.length); // percentage

            this.update_main_chart();
        }
    }
};

let cancel_chart_preview_listener = function () {
    document.removeEventListener("mousemove", chart_preview_listener); // TODO ???? reassign
    document.show_area_move = true;
};

function get_border_side(elem) {
    for (let i = 0, count = elem.classList.length; i < count; i++) {
        if (elem.classList[i].includes('left')) {
            return 'left';
        } else if (elem.classList[i].includes('right')) {
            return 'right';
        }
    }
}

// ---

function get_timeflow_axis_labels_count() {
    let steps_count = this.config.canvas_width / (this.config.timeflow_axis_labels_step * this.charts[0].config.point_dist);

    return Math.floor(steps_count);
}

// ---

function get_data_range() {
    // 1) get precise horizontal point dist
    let data_show_percentage = this.show_area_container.offsetWidth / this.config.preview_canvas_width;
    let precise_point_count = data_show_percentage * (this.data_len - 1);
    this.config.point_dist = this.content_width / precise_point_count; // horizontal distance btw points

    // 2) get indexes of left and right edge points inside canvas !content area!
    this.config.data_start = this.show_area_container.offsetLeft / this.config.preview_canvas_width; //TODO ???
    this.config.data_end = this.config.data_start + data_show_percentage;

    let unrounded_start_index = this.config.data_start * (this.data_len - 1);
    let unrounded_end_index = this.config.data_end * (this.data_len - 1);

    this.config.start_index = Math.ceil(unrounded_start_index); // index of first content point
    this.config.end_index = Math.floor(unrounded_end_index);
    // console.log(this.config.end_index);

    // 3) get dist canvas content area left edge -> first point
    let offset_left = (this.config.start_index - unrounded_start_index) * this.config.point_dist; // distance canvas left side - first content point

    // 4) get dist canvas left edge -> first point
    let total_offset = this.config.side_padding + offset_left;
    let steps_diff = 0;

    if (total_offset >= this.config.point_dist) {
        steps_diff = Math.floor(total_offset / this.config.point_dist);
        this.config.start_index -= steps_diff;
    }

    this.config.offset_left = total_offset - this.config.point_dist * steps_diff;

    // ---

    let offset_right = this.config.canvas_width - this.content_width * this.config.data_end;
    let total_offset_r = offset_right + this.config.side_padding;
    let steps_diff_right = Math.floor(total_offset_r / this.config.point_dist);

    if (steps_diff_right >= 1) {
        this.config.end_index += steps_diff_right;
    }

    this.config.points_count = this.config.end_index - this.config.start_index;

    if (this.config.end_index !== this.data_len - 1) {
        this.config.points_count++;
    }

    if (this.config.start_index !== 0) {
        this.config.points_count++; // TODO fix point number
    }
}

function set_point_dist() {
    let data_show_percentage = this.show_area_container.offsetWidth / this.config.preview_canvas_width;
    let precise_point_count = data_show_percentage * this.data_len;
    this.config.point_dist = this.content_width / precise_point_count; // horizontal distance btw points
}

function set_content_point_indexes() {
    this.config.data_start = this.show_area_container.offsetLeft / this.config.preview_canvas_width; //TODO ???
    this.config.data_end = this.config.data_start + data_show_percentage;

    let unrounded_start_index = this.config.data_start * this.data_len;
    let unrounded_end_index = this.config.data_end * this.data_len;

    this.config.start_index = Math.ceil(unrounded_start_index); // index of first content point
    this.config.end_index = Math.floor(unrounded_end_index);

}

// ---

let cancel_chart_draw = function (i) {
    this.charts[i].config.draw = !this.charts[i].config.draw;
    this.update_all();
};