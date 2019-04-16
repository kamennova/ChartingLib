
ChartContainer.prototype.get_preview_coords = function() {
    let chart_preview_container = this.container.querySelector('.chart-preview-wrapper');

    this.x_pos_left = chart_preview_container.getBoundingClientRect().left;
    this.x_pos_right = chart_preview_container.getBoundingClientRect().right;
};

ChartContainer.prototype.preview_box_init = function() {
    this.area_border_width = 7 + 2; // border width +  dist btw borders
    this.preview_box_resize_init();
    this.preview_box_move_init();
};


// ChartContainer.prototype.get_border_side = static fucntion(border_index) { // todo
//     return border_index === 0 ? 'left' : 'right';
// }


// ---

ChartContainer.prototype.chart_preview_resize = function (e) {
    let rect = this.show_area_box.getBoundingClientRect();
    e = e || window.event;
    let mouse_x = e.touches ? e.touches[0].clientX : e.pageX;

    let other = ChartContainer.other_side(this.curr_area_border);
    let k = other === 'left' ? -1 : 1;

    let dist_to_side = k * (mouse_x - this['x_pos_' + this.curr_area_border]) - this.border_cursor_pos;
    let dist_to_other_border = k * (rect[other] - mouse_x) - this.area_border_width;

    if (dist_to_side >= 0 && dist_to_other_border >= 0) {
        let new_width = k * (rect[other] - mouse_x) + this.border_cursor_pos;
        this.show_area_box.style.width = new_width + 'px';
        this['layer_' + this.curr_area_border].style.width = dist_to_side + 'px';

        this.get_data_range();
        this.prepare_autosize_animation();
        this.resize_timeflow_axis();
    }
};

ChartContainer.prototype.cancel_chart_preview_resize = function () {
    if (this.show_area_move) {
        return;
    }

    this.container.querySelector('.area-border.active').classList.remove('active');
    document.removeEventListener("mousemove", this.chart_preview_resize);
    document.removeEventListener("touchmove", this.chart_preview_resize);
    this.show_area_move = true;

    let labels = this.container.querySelectorAll('.timeflow-axis-label.to-fade');
    for (let i = 0; i < labels.length; i++) {
        labels[i].classList.add('faded');
    }
};

// ---

ChartContainer.prototype.move_show_area = function (e) {
    if (!this.show_area_move) {
        return;
    }

    e = e || window.event;
    let mouse_x = e.touches ? e.touches[0].clientX : e.pageX;

    let dist_to_left = mouse_x - this.curr_show_area_width + this.curr_preview_box_pos - this.x_pos_left;
    let dist_to_right = this.x_pos_right - mouse_x - this.curr_preview_box_pos;

    if (dist_to_left >= 0 && dist_to_right >= 0) {
        let new_pos_right = this.x_pos_right - mouse_x - this.curr_preview_box_pos;

        this.show_area_box.style.right = this.layer_right.style.width = new_pos_right + 'px';
        this.show_area_box.style.left = 'auto';
        this.layer_left.style.width = dist_to_left + 'px';

        this.get_data_range();
        this.prepare_autosize_animation();
        this.move_timeflow_axis();
    }
};

ChartContainer.prototype.cancel_move_show_area = function () {
    this.show_area_box.classList.remove('active');
    document.removeEventListener("mousemove", this.move_show_area);
    document.removeEventListener("touchmove", this.move_show_area);
};

// ---

ChartContainer.prototype.preview_box_resize_init = function () {
    this.show_area_move = true;

    let area_borders = this.container.querySelectorAll('.area-border');

    for (let i = 0; i < 2; i++) {
        area_borders[i].addEventListener("mousedown", this.resize_on_mousedown.bind(this, area_borders[i], i));

        area_borders[i].addEventListener("touchstart", this.resize_on_mousedown.bind(this, area_borders[i], i));
    }
};

ChartContainer.prototype.resize_on_mousedown = function (obj, i, e) {
    if (e.target !== obj) {
        return;
    }

    obj.classList.add('active');

    this.curr_area_border = ChartContainer.get_border_side(i);
    this.show_area_move = false;

    let rect = this.show_area_box.getBoundingClientRect(),
        other_side = ChartContainer.other_side(this.curr_area_border);
    let mouse_x = e.touches ? e.touches[0].clientX : e.pageX;

    let k = (other_side === 'left' ? -1 : 1);
    let old_pos = k * (this['x_pos_' + other_side] - rect[other_side]);

    this.border_cursor_pos = k * (mouse_x - rect[this.curr_area_border]); // dist btw mouse and border edge ~ [1px, 6px]

    this.show_area_box.style[other_side] = old_pos + 'px';
    this.show_area_box.style[this.curr_area_border] = 'auto';

    document.addEventListener("mousemove", this.chart_preview_resize);
    obj.addEventListener("mouseup", this.cancel_chart_preview_resize);

    document.addEventListener("touchmove", this.chart_preview_resize);
    obj.addEventListener("touchend", this.cancel_chart_preview_resize);
};

ChartContainer.prototype.preview_box_move_init = function () {
    this.show_area_box.addEventListener("mousedown", this.catch_box_move);
    this.show_area_box.addEventListener("touchstart", this.catch_box_move);
};

ChartContainer.prototype.catch_box_move = function (e) {
    e = e || window.event;

    if (e.target !== this.show_area_box) {
        return;
    }

    let rect = this.show_area_box.getBoundingClientRect();
    let mouse_x = e.touches ? e.touches[0].clientX : e.pageX;

    this.curr_preview_box_pos = rect.right - mouse_x;
    this.curr_show_area_width = rect.width;

    this.show_area_box.classList.add('active');

    document.addEventListener("mousemove", this.move_show_area);
    document.addEventListener("mouseup", this.cancel_move_show_area);

    document.addEventListener("touchmove", this.move_show_area);
    document.addEventListener("touchend", this.cancel_move_show_area);
};

// ---