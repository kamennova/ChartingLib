// --- Interface ---

ChartContainer.prototype.update_all = function () { // todo add animation
    this.get_data_len();

    if (this.data_len !== 0 && this.charts[0].config.draw) { // todo
        this.no_data = false;
    }

    this.preview_chart_config.points_count = this.data_len;
    this.update_preview_chart();

    this.update_main_chart();
};

ChartContainer.prototype.set_chart_attr = function (chart_id, attr, val, attr_index = null) {
    if (attr_index !== null) {
        (this.charts[chart_id].config[attr])[attr_index] = val;
    } else {
        this.charts[chart_id].config[attr] = val;
    }
};

ChartContainer.prototype.edit_val = function (chart_id, val, pos, update = true) {
    this.charts[chart_id].config.chart_data[pos] = val;

    if (update) this.update_all();
};

ChartContainer.prototype.edit_breakpoint = function (chart_id, breakpoint, pos) {
    this.timeflow[pos] = breakpoint;
};

ChartContainer.prototype.get_chart_attr = function (chart_id, attr, attr_index = null) {
    if (attr_index !== null)
        return (this.charts[chart_id].config[attr])[attr_index];

    return this.charts[chart_id].config[attr];
};

// ---

ChartContainer.prototype.add_gradient_colour = function (chart_id, col) {
    if (typeof this.charts[chart_id].config.fill_colour === 'string') {
        this.charts[chart_id].config.fill_colour = [this.charts[chart_id].config.fill_colour];
    }

    this.charts[chart_id].config.fill_colour.push(col);
};

ChartContainer.prototype.add_fill_color = function (line_id, color, pos) {
    if (this.charts[line_id].config.fill.length === 1) {
        let fill_conf = this.charts[line_id].config.fill_colour;
        fill_conf.direction = this.charts[line_id].Default_config.fill_colour.direction;
        fill_conf.stops = this.charts[line_id].Default_config.fill_colour.stops;
    }

    this.charts[line_id].config.fill[pos] = color;
};

ChartContainer.prototype.set_gradient = function (line_id) {
    this.charts[line_id].config.fill_style = 'gradient';
    this.charts[line_id].config.fill = this.charts[line_id].config.gradient.colors;
};

ChartContainer.prototype.set_plain = function (line_id) {
    this.charts[line_id].config.fill_style = 'color';
    this.charts[line_id].config.fill = this.charts[line_id].config.fill_style;
};

// ---

ChartContainer.prototype.update_container_attr = function (attr, val, attr_index = null, update_chart = true) {
    if (attr_index !== null) {
        (this.config[attr])[attr_index] = val;
    } else {
        this.config[attr] = val;
    }

    if (update_chart) this.update_all();
};

ChartContainer.prototype.update_line_attr = function (line_id, attr, val, attr_index = null, update_chart = true) {
    if (attr_index !== null) {

        if (typeof this.charts[line_id].config[attr] === 'string') {
            this.charts[line_id].config[attr] = [this.charts[line_id].config[attr]];
        }

        if (attr === 'fill') {
            if (this.charts[line_id].config.fill_style === 'colour') { // ignore index
                this.charts[line_id].config[attr] = val;
                this.charts[line_id].config.fill_colour = val;
            } else {
                this.add_fill_color(line_id, val, attr_index);
            }
        } else {
            this.charts[line_id].config[attr][attr_index] = val;
        }

    } else {
        this.charts[line_id].config[attr] = val;

        if (attr === 'line_colour') {
            this.container.querySelectorAll('.point-details-modal li')[line_id].style.color = val;
            let indicator = this.container.querySelectorAll('.charts-labels-list li')[line_id].querySelector('.checkbox-indicator');
            indicator.style.backgroundColor = val;
            indicator.style.borderColor = val;
        } else if (attr === 'line_name') {
            this.container.querySelectorAll('.point-details-modal li')[line_id]
                .querySelector('.point-chart-name').innerText = val;
            this.container.querySelectorAll('.charts-labels-list li')[line_id]
                .querySelector('.line-name').innerText = val;
        }
    }

    if (update_chart) this.update_all();
};

ChartContainer.prototype.redraw_charts = function () {
    this.update_preview_chart();
    this.update_main_chart_canvas();
};

// ---

ChartContainer.prototype.push_val = function (val, chart_id) {
    this.charts[chart_id].config.chart_data.push(val);
};

ChartContainer.prototype.add_point = function (values, breakpoint, pos, update_chart = true) {
    for (let i = 0; i < this.charts.length; i++) {
        this.charts[i].config.chart_data.splice(pos, 0, values[i]);
    }

    this.timeflow_data.splice(pos, 0, breakpoint);

    if (update_chart) this.update_all();
};

ChartContainer.prototype.push_point = function (values, breakpoint, update_chart = true) {
    for (let i = 0; i < values.length; i++) {
        this.push_val(values[i], i);
    }

    this.timeflow_data.push(breakpoint);
    this.get_data_len();

    if (update_chart) this.update_all();
};

ChartContainer.prototype.delete_point_by_index = function (index, update_chart = true) {
    for (let chart of this.charts) {
        chart.config.chart_data.splice(index, 1);
    }

    this.timeflow_data.splice(index, 1); // todo

    if (update_chart) this.update_all(); // todo
};

// ---

ChartContainer.prototype.add_line = function (config) {
    this.init_line(config);
    this.get_max_line_width();

    let input = this.container.querySelector('.charts-labels-list li:last-of-type .chart-draw-checkbox');
    input.addEventListener('change', this.toggle_chart_draw.bind(this, this.charts.length - 1));

    this.update_all();
};

ChartContainer.prototype.delete_line = function (line_id, update) {
    this.charts.splice(line_id, 1);
    this.charts.filter(val => val);

    this.point_modal.querySelector('.points')
        .removeChild(this.point_modal.querySelector('li:nth-child(' + (line_id + 1) + ')'));
    this.container.querySelector('.charts-labels-list').removeChild(this.container.querySelector('.charts-labels-list').querySelector('li:nth-child(' + (line_id + 1) + ')'));

    if (update) {
        this.update_all();
    }
};