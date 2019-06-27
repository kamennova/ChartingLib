class ChartLine {
    constructor(config) {
        this.config = config;

        this.init();
    }

    init() {
        this.fill();
        this.config.fill = this.config.fill_style === 'colour' ? this.config.fill_colour :
            this.config[this.config.fill_style].colors;
        this.config.line_width *= this.config.dpi;

        // filling point detail modal list
        let point_modal_list = document.querySelector(this.config.chart_wrapper_selector + ' .point-details-modal ul');
        let list_option = '<li style="color:' + this.config.line_colour + '">' +
            '<span class="point-value"></span><br><span class="point-chart-name">' + this.config.chart_name + '</span></li>';
        point_modal_list.insertAdjacentHTML('beforeend', list_option);

        if (this.config.show_label)
            this.insert_chart_label();
    }

    static isset_data(val) {
        return val === 0 || (val !== null && val !== undefined);
    }

    insert_chart_label() {
        let charts_labels_list = document.querySelector(this.config.chart_wrapper_selector + ' .charts-labels-list');

        let input_name = this.config.chart_name.replace(/ /, '-');
        let label = '<li><label class="chart-label">' +
            '<input type="checkbox" class="visually-hidden active chart-draw-checkbox" name="' + input_name + '" checked>' +
            '<span style="background-color: ' +
            this.config.line_colour + '; border-color: ' + this.config.line_colour + '" class="checkbox-indicator">' +
            '</span>' + '<span class="line-name">' + this.config.line_name + '</span></label></li>';

        charts_labels_list.insertAdjacentHTML('beforeend', label);
    }

    fill() {
        let Default_config = {
            chart_type: 'line_chart',
            point_dist: 60,
            line_width: 2,
            bar_width: 0.7,
            smoothing: 0.5,

            point_radius: 3,
            line_colour: '#3cc23f',
            gradient: {
                direction: [0, 0, 0, 1],
                stops: [0, 1],
                colors: ['#3cc23f', 'rgba(0,0,0,0)'],
            },

            fill_colour: 'rgba(0, 0, 0, 0)',
            fill_style: 'colour',

            bar_border_radius: 0.5,

            offset_left: 0,
            show_label: true,
        };

        this.config = Object.assign({}, Default_config, this.config);
    }

    set_fill_style(ctx) {
        if (this.config.fill_style === 'colour') {
            ctx.fillStyle = this.config.fill_colour;
        } else {
            let grad_conf = this.config.gradient;
            if (this.config.gradient.colors.length > 1) {

                let grad = ctx.createLinearGradient(
                    this.grad_coord(grad_conf.direction[0], 'x'),
                    this.grad_coord(grad_conf.direction[1], 'y'),
                    this.grad_coord(grad_conf.direction[2], 'x'),
                    this.grad_coord(grad_conf.direction[3], 'y'));

                for (let i = 0; i < grad_conf.colors.length; i++) {
                    grad.addColorStop(grad_conf.stops[i], grad_conf.colors[i]);
                }

                ctx.fillStyle = grad;
            } else {
                ctx.fillStyle = this.config.gradient.colors[0];
            }
        }
    }

    grad_coord(coord, dir) {
        if (dir === 'x') {
            return coord * this.config.canvas_width * this.config.dpi;
        } else if (dir === 'y') {
            return coord * this.config.canvas_height * this.config.dpi;
        }
    }

    draw_chart(canvas_selector = this.config.canvas_selector) {
        let canvas = document.querySelector(this.config.chart_wrapper_selector + ' ' + canvas_selector);

        if (canvas && canvas.getContext) {
            let ctx = canvas.getContext('2d');
            this.config.canvas_height = ctx.canvas.clientHeight;

            if (this.config.chart_data.length > 0) {

                // if drawing preview chart, draw thinner line or point radius
                let changed_line = false,
                    changed_rad = false;

                if (canvas_selector !== this.config.canvas_selector) {
                    if (this.config.line_width >= 4) {
                        this.config.line_width /= 2;
                        changed_line = true;
                    }

                    if (this.config.point_radius >= 3) {
                        this.config.point_radius /= 2;
                        changed_rad = true;
                    }
                }

                this.set_fill_style(ctx);
                ctx.lineWidth = this.config.line_width;
                ctx.strokeStyle = this.config.line_colour;
                ctx.lineJoin = 'round';
                ctx.lineCap = 'round';
                ctx.globalAlpha = this.config.opacity;

                ctx.beginPath();

                let temp = this.config.smoothing;

                if(this.config.chart_type === 'line_chart'){
                    this.config.smoothing = 0;
                }

                switch (this.config.chart_type) {
                    case 'line_chart':
                        this.draw_curve_chart(ctx);
                        break;

                    case 'curve_chart':
                        this.draw_curve_chart(ctx);
                        break;

                    case 'bar_chart' :
                        this.draw_bar_chart(ctx);
                        break;

                    case 'point_chart':
                        this.draw_point_chart(ctx);
                        break;
                }

                // setting line and radius width back
                if (changed_line) {
                    this.config.line_width *= 2;
                }

                if (changed_rad) {
                    this.config.point_radius *= 2;
                }

                this.config.smoothing = temp;
            }
        }
    }

    highlight_point(index) {
        if (!this.config.draw) return;

        let canvas = document.querySelector(this.config.chart_wrapper_selector + ' ' + this.config.canvas_selector);
        let ctx = canvas.getContext('2d');
        let x0 = ((index - this.config.start_index) * this.config.point_dist + this.config.offset_left) * this.config.dpi,
            y0 = (this.config.canvas_height - this.config.chart_data[index] * this.config.chart_sizing) * this.config.dpi;

        ctx.fillStyle = this.config.bg_color;
        ctx.strokeStyle = this.config.line_colour;
        ctx.lineWidth = this.config.line_width;

        ctx.beginPath();
        ctx.arc(~~(x0 + 0.5), ~~(y0 + 0.5), ~~(this.config.point_radius * this.config.dpi + 0.5), 0, Math.PI * 2, false);
        ctx.fill();
        ctx.stroke();
        ctx.closePath();
    }

    draw_line_chart(ctx) {
        let x0 = this.config.offset_left * this.config.dpi,
            y0 = ctx.canvas.clientHeight * this.config.dpi,
            index = this.config.start_index,
            count = this.config.points_count, // number of all points (visible + max 2 outside ones)
            x_step = this.config.point_dist * this.config.dpi,
            y_step = this.config.chart_sizing * this.config.dpi;

        if (this.config.start_index !== 0) {
            x0 -= x_step;
            index--;
        }

        for (let i = 0; i < count; i++) {
            if (ChartLine.isset_data(this.config.chart_data[index])) { // if point value is not 'no data'
                /* if point is beyond canvas edge & next point is 'no data', go to next one
                    else it is the start point */
                if (!(x0 < 0 && index + 1 < this.config.chart_data.length &&
                    !ChartLine.isset_data(this.config.chart_data[index + 1]))
                ) {
                    break;
                }
            }

            x0 += x_step;
            index++;
            count--;
        }

        // ---

        let y = y0 - y_step * this.config.chart_data[index],
            y1 = y,
            x = x0,
            is_prev_null = false;

        ctx.moveTo(~~x0 + 0.5, y0);
        ctx.lineTo(~~x0 + 0.5, y);
        count--;
        index++;

        for (let i = 0; i < count; i++, index++) {
            x += x_step;

            let val = this.config.chart_data[index];
            if (!ChartLine.isset_data(val)) {
                if (!is_prev_null) { // this is the first point of no data
                    this.end_line(ctx, x0, (x - x_step), y0);
                    is_prev_null = true;
                }

                continue;
            }

            y = y0 - this.config.chart_sizing * this.config.chart_data[index] * this.config.dpi;

            if (is_prev_null) {
                ctx.moveTo(x, y);
                is_prev_null = false;
                x0 = x;
                y1 = y;
                continue;
            }

            ctx.lineTo(~~x + 0.5, y);
        }

        if (!is_prev_null) {
            if (index < this.config.chart_data.length && x - this.config.canvas_width < this.config.line_width / 2
                && ChartLine.isset_data(this.config.chart_data[index])) {

                let diff = this.config.line_width - (x - this.config.canvas_width);
                x = x + diff;
                ctx.lineTo(x, y);
            }

            ctx.fill();
            ctx.stroke();
            ctx.closePath();

            this.redraw_line(ctx, x0, y0, y1);
            this.redraw_line(ctx, x, y0, y);
        }
    }

    redraw_line(ctx, x, y0, y) {
        x = ~~x - 1;

        ctx.lineWidth += 4;
        ctx.strokeStyle = this.config.bg_color; // setting non-transparent bg
        ctx.beginPath();
        ctx.moveTo(x, y0);
        ctx.lineTo(x, y);
        ctx.stroke();
        ctx.closePath();

        ctx.strokeStyle = ctx.fillStyle;
        ctx.shadowColor = 'rgba(0, 0, 0, 0)';
        ctx.beginPath();
        ctx.moveTo(x, y0);
        ctx.lineTo(x, y);
        ctx.stroke();
        ctx.closePath();

        ctx.lineWidth -= 4;
    }

    draw_bar_chart(ctx) {
        let x_step = this.config.point_dist * this.config.dpi;
        let bar_width = this.config.bar_width * x_step * 1.1;
        let x = this.config.offset_left * this.config.dpi - bar_width / 2,
            y0 = ctx.canvas.clientHeight * this.config.dpi,
            index = this.config.start_index,
            count = this.config.points_count, // number of all points (visible + max 2 outside ones)
            R = this.config.bar_border_radius * 0.5 * bar_width;

        if (this.config.start_index !== 0) {
            x -= x_step;
            index--;
        }

        let y = y0 - this.config.chart_sizing * this.config.chart_data[index] * this.config.dpi;

        ctx.moveTo(x, y);
        count--;
        index++;

        for (let i = 0; i < count; i++, index++) {
            x += this.config.point_dist * this.config.dpi;
            y = y0 - this.config.chart_sizing * this.config.chart_data[index] * this.config.dpi;

            ctx.beginPath();

            ctx.moveTo(x, y0 + this.config.line_width);
            ctx.lineTo(x, y + R);
            ctx.arc(x + R, y + R, R, Math.PI, -1 / 2 * Math.PI, false);
            ctx.lineTo(x + bar_width - R, y);
            ctx.arc(x + bar_width - R, y + R, R, 3 / 2 * Math.PI, 0, false);
            ctx.lineTo(x + bar_width, y0 + this.config.line_width);

            ctx.fill();
            ctx.stroke();
        }

        ctx.stroke();
        ctx.closePath();
    }

    prepare_stroke_style(ctx, x0, x) {
        let width = x - x0;
        let half_w = this.config.line_width / 2;

        let stroke_grad = ctx.createLinearGradient(x0, 0, x, 0);
        stroke_grad.addColorStop(half_w / width + 0.006, 'rgba(0, 0, 0, 0)');
        stroke_grad.addColorStop(half_w / width + 0.006, this.config.line_colour);
        stroke_grad.addColorStop(1 - half_w / width - 0.003, this.config.line_colour);
        stroke_grad.addColorStop(1 - half_w / width - 0.003, 'rgba(0, 0, 0, 0)');

        ctx.strokeStyle = stroke_grad;
    }

    draw_curve_chart(ctx) {
        let x0 = this.config.offset_left * this.config.dpi,
            y0 = ctx.canvas.clientHeight * this.config.dpi,
            index = this.config.start_index,
            count = this.config.points_count, // number of all points (visible + max 2 outside ones)
            x_step = this.config.point_dist * this.config.dpi,
            y_step = this.config.chart_sizing * this.config.dpi;

        if (this.config.start_index !== 0) {
            x0 -= x_step;
            index--;
        }

        // first non-empty value to start drawing
        for (let i = 0; i < count; i++) {
            if (ChartLine.isset_data(this.config.chart_data[index])) { // if point value is not 'no data'
                /* if point is beyond canvas edge & next point is 'no data', go to next one
                    else it is the start point */
                if (!(x0 < 0 && index + 1 < this.config.chart_data.length &&
                    !ChartLine.isset_data(this.config.chart_data[index + 1]))
                ) {
                    break;
                }
            }

            x0 += x_step;
            index++;
            count--;
        }

        let y = y0 - this.config.chart_data[index] * y_step,
            y1 = y,
            x = x0,
            k = x_step / 2 * (1 - this.config.smoothing),
            is_prev_null = false;

        // ---

        this.begin_curve(ctx, x, y0, y);
        count--;
        index++;

        for (let i = 0; i < count; i++, index++) {
            x += x_step;

            let val = this.config.chart_data[index];
            if (!ChartLine.isset_data(val)) {
                if (!is_prev_null) { // this is the first point of no data
                    this.end_curve(ctx, x0, (x - x_step), y0);
                    is_prev_null = true;
                }

                continue;
            }

            y = y0 - y_step * val;

            if (is_prev_null) {
                this.begin_curve(ctx, x, y0, y);
                is_prev_null = false;
                x0 = x;
                y1 = y;
                continue;
            }

            let cpt_x = x - x_step / 2;
            let cpt_y1 = y0 - this.config.chart_data[index - 1] * y_step;
            let cpt_y2 = y0 - this.config.chart_data[index] * y_step;

            ctx.bezierCurveTo(cpt_x - k, cpt_y1, cpt_x + k, cpt_y2, ~~x + 0.5, ~~y + 0.5);
        }

        if (!is_prev_null) {
            if (index < this.config.chart_data.length && x - this.config.canvas_width < this.config.line_width / 2
                && ChartLine.isset_data(this.config.chart_data[index])) {

                let diff = this.config.line_width - (x - this.config.canvas_width);
                x = x + diff;
                ctx.lineTo(x, y);
            }

            this.end_curve(ctx, x0, x, y0);
        }
    }

    begin_curve(ctx, x, y0, y) {
        ctx.strokeStyle = this.config.line_colour;

        ctx.beginPath();
        ctx.moveTo(~~x + 0.5, y0);
        ctx.lineTo(~~x + 0.5, y);
    }

    end_line(ctx, start_x, end_x, y0, test = false){
        ctx.lineTo(~~end_x + 0.5, y0);

        if (end_x - start_x !== 0) {
            this.prepare_stroke_style(ctx, ~~start_x + 0.5, ~~end_x + 0.5, test);
        }

        ctx.fill();
        ctx.stroke();
        ctx.closePath();
    }

    end_curve(ctx, start_x, end_x, y0, test = false) { // todo y0->this.canvas_height
        ctx.lineTo(~~end_x + 0.5, y0);

        if (end_x - start_x !== 0) {
            this.prepare_stroke_style(ctx, ~~start_x + 0.5, ~~end_x + 0.5, test);
        }

        ctx.fill();
        ctx.stroke();
        ctx.closePath();
    }

    // ---

    draw_point_chart(ctx) {
        let x0 = this.config.offset_left * this.config.dpi,
            y0 = ctx.canvas.clientHeight * this.config.dpi,
            index = this.config.start_index,
            count = this.config.points_count,
            x_step = this.config.point_dist * this.config.dpi;

        if (this.config.start_index !== 0) {
            x0 -= this.config.point_dist * this.config.dpi;
            index--;
        }

        for (let i = 0; i < count; i++) {
            if (ChartLine.isset_data(this.config.chart_data[index])) {
                break;
            }

            x0 += x_step;
            index++;
            count--;
        }

        let y = y0 - this.config.chart_sizing * this.config.chart_data[index] * this.config.dpi,
            x = x0;

        ctx.beginPath(); // todo experimental type - no path included
        ctx.arc(x, y, this.config.point_radius, 0, Math.PI * 2, true);
        ctx.fill();
        ctx.stroke();
        ctx.closePath();

        count--;
        index++;

        for (let i = 0; i < count; i++, index++) {
            x += x_step;
            y = y0 - this.config.chart_sizing * this.config.chart_data[index] * this.config.dpi;

            ctx.beginPath();
            ctx.arc(x, y, this.config.point_radius, 0, Math.PI * 2, true);
            ctx.fill();
            ctx.stroke();
            ctx.closePath();
        }
    }
}