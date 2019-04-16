ChartContainer.prototype.init_point_details_show = function() {
    let canvas_layer = this.container.querySelector('.canvas-layer');

    canvas_layer.addEventListener('mousedown', this.point_details_show.bind(this));
    canvas_layer.addEventListener('mousemove', this.point_details_show.bind(this));
    canvas_layer.addEventListener('mouseout', this.cancel_point_details_show.bind(this));

    canvas_layer.addEventListener('touchstart', this.point_details_show.bind(this));
    canvas_layer.addEventListener('touchmove', this.point_details_show.bind(this));
    canvas_layer.addEventListener('touchend', this.cancel_point_details_show.bind(this));
};

ChartContainer.prototype.show_point_modal = function(index) {
    let date = this.point_modal_date_wrapper(this.timeflow_data[index]);
    let point_values = this.point_modal.querySelectorAll('.point-value');

    for (let i = 0; i < this.charts.length; i++) {
        if (this.charts[i].config.draw) {
            point_values[i].textContent = this.charts[i].config.chart_data[index];
        }
    }

    this.point_modal.querySelector('.breakpoint-date').textContent = date;

    let modal_margin = -32;
    let modal_pos = this.get_point_x_coord(index);
    let max_modal_margin = this.content_width + this.config.side_padding - this.point_modal.offsetWidth - modal_pos;

    if (modal_margin > max_modal_margin) {
        modal_margin = max_modal_margin;
    } else if (modal_margin < -this.config.side_padding - modal_pos) {
        modal_margin = -this.config.side_padding - modal_pos;
    }

    modal_pos += modal_margin;

    this.point_modal.style.left = modal_pos + 'px';
};

ChartContainer.prototype.point_details_show = function(e) {
    if (e.type === 'mousedown' || e.type === 'touchstart') {
        this.highlight = !this.highlight;
    } else if (this.highlight && e.type !== 'touchmove') {
        return;
    }

    e = e || window.event;
    this.curr_mouse_pos = e.touches ? e.touches[0].clientX : e.pageX;

    let point_index = this.get_point_index();
    let point_coord = this.get_point_x_coord(point_index);

    if (point_coord < this.chart_config.side_padding || point_coord > this.chart_config.side_padding + this.content_width) {
        return;
    }

    this.point_modal.classList.add('show');

    if (this.curr_point_index !== point_index) {
        this.curr_point_index = point_index;

        this.clear_canvas();
        this.draw_horizontal_grid();
        this.highlight_line(point_coord);

        if (e.type === 'mousedown' || e.type === 'touchstart') {
            this.highlight = true;
        }

        for (let chart of this.charts) {
            if (chart.config.draw) {
                chart.draw_chart();
                chart.highlight_point(point_index);
            }
        }

        this.show_point_modal(point_index);
    }
};

ChartContainer.prototype.cancel_point_details_show = function(e) {
    e = e || window.event;
    e.preventDefault();

    if (this.highlight) {
        return;
    }

    this.curr_point_index = -1;
    this.point_modal.classList.remove('show');

    this.clear_canvas();
    this.draw_horizontal_grid();
    for (let chart of this.charts) {
        if (chart.config.draw) {
            chart.draw_chart();
        }
    }
};

ChartContainer.prototype.point_modal_date_wrapper = function(timestamp) {
    if (this.point_modal_date_cahce[timestamp] == undefined) {
        this.point_modal_date_cahce[timestamp] = this.config.point_modal_date_func(timestamp);
    }

    return this.point_modal_date_cahce[timestamp];
};