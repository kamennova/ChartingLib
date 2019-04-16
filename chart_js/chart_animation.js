
// --- Chart animations ---

ChartContainer.prototype.prepare_autosize_animation = function(draw_preview = false) {
    if (draw_preview) {
        let temp = 0;
        this.autosize(true);
        this.set_chart_params(true);
        this.config.preview_chart_sizing_diff = this.preview_chart_config.chart_sizing - temp;
    }

    this.autosize();
    this.set_vertical_axis_step();

    this.config.chart_sizing_diff = this.chart_config.chart_sizing - this.charts[0].config.chart_sizing;

    if (this.config.chart_sizing_diff === 0) {
        this.update_main_chart();
    } else if (!this.autosize_animation_requested) {
        this.autosize_animation_requested = true;
        window.requestAnimationFrame(this.animate_autosize.bind(this, draw_preview));
    }
};

ChartContainer.prototype.animate_chart_labels = function() {
    this.labels = this.container.querySelectorAll('.charts-labels-list li');

    for (let i = 0; i < this.labels.length; i++) {
        this.labels[i].addEventListener('click', () => {
            this.labels[i].classList.add('active');

            setTimeout(() => {
                this.labels[i].classList.remove('active');
            }, 300);
        });
    }
};

ChartContainer.prototype.animate_vertical_axis = function(new_chart_sizing) {
    this.destroy_old_labels('vertical');
    this.prepare_grid_animation();

    let vertical_axis_labels = '';
    let step = this.get_vertical_axis_step(); // new labels step

    // display new labels
    for (let i = 0; i < this.config.vertical_axis_steps_count; i++) {
        let bottom_pos = new_chart_sizing * i * step;
        if (bottom_pos > this.chart_config.content_height) {
            break;
        }

        this.ctx.globalAlpha = this.stage;
        this.draw_gridline(new_chart_sizing * i * step);

        vertical_axis_labels += "<span class='axis-label vertical-axis-label' style='bottom: " + bottom_pos +
            "px; opacity: " + this.stage + "'>" +
            Math.round(step * i) + "</span>";
    }

    // display old labels
    for (let i = 0; i < this.config.vertical_axis_steps_count; i++) {
        let bottom_pos = new_chart_sizing * i * this.chart_config.vertical_axis_val_step;
        if (bottom_pos > this.chart_config.content_height) {
            break;
        }

        let opacity = 1 - this.stage;

        this.ctx.globalAlpha = opacity;
        this.draw_gridline(new_chart_sizing * i * this.chart_config.vertical_axis_val_step);

        vertical_axis_labels += "<span class='axis-label vertical-axis-label' style='bottom: " + bottom_pos +
            "px; opacity: " + opacity + "'>" +
            Math.round(this.chart_config.vertical_axis_val_step * i) + "</span>";
    }

    this.vertical_axis_labels_container.insertAdjacentHTML('afterbegin', vertical_axis_labels);
};

ChartContainer.prototype.animate_cancel_draw = function(a, k, time) {
    this.config.animation_end = false;

    if (!this.config.start) this.config.start = time;
    this.stage = (time - this.config.start) / this.config.duration;
    if (this.stage > 1) this.stage = 1;

    this.clear_canvas();
    this.clear_preview_canvas();

    this.highlight_check();

    this.charts[a].config.opacity = k === 1 ? this.stage : 1 - this.stage;

    let new_chart_sizing = this.chart_config.chart_sizing - this.config.chart_sizing_diff * (1 - this.stage);

    if (this.config.chart_sizing_diff !== 0) {
        this.animate_vertical_axis(new_chart_sizing);
    } else {
        this.draw_horizontal_grid();
    }

    for (let i = 0; i < this.charts.length; i++) {

        // -- redraw preview ---

        for (const key in this.preview_chart_config) {
            if (key !== 'chart_sizing') {
                this.charts[i].config[key] = this.preview_chart_config[key];
            }
        }

        this.charts[i].config.chart_sizing = this.preview_chart_config.chart_sizing
            - this.config.preview_chart_sizing_diff * (1 - this.stage);
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
            if (this.highlight) this.charts[i].highlight_point(this.curr_point_index);
        }
    }

    if (this.stage < 1) {
        window.requestAnimationFrame(this.animate_cancel_draw.bind(this, a, k));
    } else {
        this.config.animation_end = true;
        this.config.start = null;
        this.set_vertical_axis_step();

        if (this.no_data) {
            this.container.querySelector('.no-data-message').classList.remove('hidden');
        }
    }
};

ChartContainer.prototype.animate_autosize = function(draw_preview, time) {
    if (!this.config.start) this.config.start = time;
    this.stage = (time - this.config.start) / this.config.duration;
    if (this.stage > 1) this.stage = 1;

    this.clear_canvas();
    if (draw_preview) {
        this.clear_preview_canvas();
    }

    let new_chart_sizing = (this.chart_config.chart_sizing -
        this.config.chart_sizing_diff * (1 - this.stage));

    this.animate_vertical_axis(new_chart_sizing);
    this.highlight_check();

    for (let i = 0; i < this.charts.length; i++) {

        // --- draw preview ---
        if (draw_preview) {
            for (const key in this.preview_chart_config) {
                if (key !== 'chart_sizing') {
                    this.charts[i].config[key] = this.preview_chart_config[key];
                }
            }

            this.charts[i].config.chart_sizing = (this.preview_chart_config.chart_sizing
                - this.config.preview_chart_sizing_diff * (1 - this.stage));

            if (this.charts[i].config.draw) {
                this.charts[i].draw_chart('.chart-preview-canvas');
            }
        }

        // --- draw main chart ---

        this.charts[i].config.chart_sizing = new_chart_sizing;

        for (const key in this.chart_config) {
            if (key !== 'chart_sizing') {
                this.charts[i].config[key] = this.chart_config[key];
            }
        }

        if (this.charts[i].config.draw) {
            this.charts[i].draw_chart();
            if (this.highlight) this.charts[i].highlight_point(this.curr_point_index);
        }
    }

    if (this.stage < 1) {
        window.requestAnimationFrame(this.animate_autosize.bind(this, draw_preview));
    } else {
        this.autosize_animation_requested = false;
        this.config.start = false;
        this.set_vertical_axis_step();
    }
};

ChartContainer.prototype.prepare_grid_animation = function() {
    this.ctx.lineWidth = 1;
    this.ctx.strokeStyle = this.config.grid_colour;
};