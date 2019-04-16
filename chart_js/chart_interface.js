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

ChartContainer.prototype.get_chart_attr = function (chart_id, attr, attr_index = null) {
    if (attr_index !== null)
        return (this.charts[chart_id].config[attr])[attr_index];

    return this.charts[chart_id].config[attr];
};

ChartContainer.prototype.add_gradient_colour = function (chart_id, col) {
    if (typeof this.charts[chart_id].config.fill_colour === 'string') {
        this.charts[chart_id].config.fill_colour = [this.charts[chart_id].config.fill_colour];
    }

    this.charts[chart_id].config.fill_colour.push(col);
};

ChartContainer.prototype.update_chart_attr = function (chart_id, attr, val, attr_index = null) {
    if (attr_index !== null) {
        (this.charts[chart_id].config[attr])[attr_index] = val;
    } else {
        this.charts[chart_id].config[attr] = val;
    }


    okk();
};

ChartContainer.prototype.redraw_charts = function () {
    this.update_main_chart_canvas();
    this.update_preview_chart();
};

ChartContainer.prototype.push_val = function (val, chart_id) {
    this.charts[chart_id].config.chart_data.push(val);
};

ChartContainer.prototype.delete_point_by_index = function (index, chart_id) {
    this.charts[chart_id].config.chart_data.splice(index, 1);
    this.timeflow_data.splice(index, 1); // todo
};

ChartContainer.prototype.delete_point_by_val = function (val, chart_id) {
    let chart_data = this.charts[chart_id].config.chart_data;
    let index = chart_data.indexOf(val);
    chart_data.splice(index, 1);

    this.timeflow_data.splice(index, 1); // todo
};