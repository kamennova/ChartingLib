class ChartLine {
    constructor(config) {
        this.config = config;

        this.init();
    }

    init() {
        this.fill();
        this.config.line_width *= this.config.dpi;

        // filling point detail modal list
        let point_modal_list = document.querySelector(this.config.chart_wrapper_selector + ' .point-details-modal ul');
        let list_option = '<li style="color:' + this.config.line_colour + '"><span class="point-value"></span><br><span class="point-chart-name">' + this.config.chart_name + '</span></li>';
        point_modal_list.insertAdjacentHTML('beforeend', list_option);

        if (this.config.show_label)
            this.insert_chart_label();
    }

    insert_chart_label() {
        let charts_labels_list = document.querySelector(this.config.chart_wrapper_selector + ' .charts-labels-list');
        // console.log(this.config);

        let input_name = this.config.chart_name.replace(/ /, '-');
        let label = '<li><label class="chart-label">' +
            '<input type="checkbox" class="visually-hidden active chart-draw-checkbox" name="' + input_name + '" checked>' +
            '<span style="background-color: ' + this.config.line_colour + '; border-color: ' + this.config.line_colour + '" class="checkbox-indicator">' +
            '</span>' + this.config.chart_name + '</label></li>';

        charts_labels_list.insertAdjacentHTML('beforeend', label);
    }

    fill() {
        let Default_config = {
            chart_type: 'line_chart',
            point_dist: 60,
            line_width: 2,
            bar_width: 40,
            smoothing: 0.5,

            point_radius: 3,
            line_colour: '#3cc23f',
            fill_colour:
            // linear_gradient: {
            //     x1: 0,
            //     y1: 0,
            //     x2: 0,
            //     y2: 1
            // },
            //
            // stops: [
            //     [0, '#3cc23f'],
            //     [1, 'rgba(0,0,0,0'],
            // ],

                ['rgba(0, 0, 0, 0)'],

            bar_border_radius: 10,

            offset_left: 0,
            show_label: true,
        };

        this.config = Object.assign({}, Default_config, this.config);
    }

    set_fill_style(ctx) {
        if (typeof this.config.fill_colour === 'string' || this.config.fill_colour.length <  2) {
            ctx.fillStyle = this.config.fill_colour;
        } else {
            let colours_num = this.config.fill_colour.length;

            if (colours_num > 1) {
                let colour_stop_step = 1 / (colours_num - 1);

                let grad = ctx.createLinearGradient(0, 0, 0, this.config.canvas_height * this.config.dpi);
                for (let i = 0; i < colours_num; i++) {
                    grad.addColorStop(colour_stop_step * i, this.config.fill_colour[i]);
                }

                ctx.fillStyle = grad;
            }
        }
    }

    draw_chart(canvas_selector = this.config.canvas_selector) {
        let canvas = document.querySelector(this.config.chart_wrapper_selector + ' ' + canvas_selector);

        if (canvas && canvas.getContext) {
            let ctx = canvas.getContext('2d');
            if (this.config.chart_data.length > 0) {

                this.set_fill_style(ctx);
                ctx.lineWidth = this.config.line_width;
                ctx.strokeStyle = this.config.line_colour;
                ctx.lineJoin = 'round';
                ctx.lineCap = 'round';
                ctx.globalAlpha = this.config.opacity;

                ctx.beginPath();

                switch (this.config.chart_type) {
                    case 'line_chart':
                        this.draw_line_chart(ctx);
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
            count = this.config.points_count; // number of all points (visible + max 2 outside ones)

        if (this.config.start_index !== 0) {
            x0 -= this.config.point_dist * this.config.dpi;
            index--;
        }

        let y = y0 - this.config.chart_sizing * this.config.chart_data[index] * this.config.dpi,
            y1 = y,
            x = x0;

        ctx.moveTo(~~x0 + 0.5, y0);
        ctx.lineTo(~~x0 + 0.5, y);
        count--;
        index++;

        for (let i = 0; i < count; i++, index++) {
            x += this.config.point_dist * this.config.dpi;
            y = y0 - this.config.chart_sizing * this.config.chart_data[index] * this.config.dpi;

            ctx.lineTo(~~x + 0.5, y);
        }

        ctx.lineTo(x, y0);

        ctx.fill();
        ctx.stroke();
        ctx.closePath();

        this.redraw_line(ctx, x0, y0, y1);
        this.redraw_line(ctx, x, y0, y);
    }

    redraw_line(ctx, x, y0, y) {
        ctx.strokeStyle = this.config.bg_color; // setting non-transparent bg
        ctx.beginPath();
        ctx.moveTo(~~x + 0.5, y0);
        ctx.lineTo(~~x + 0.5, y);
        ctx.stroke();
        ctx.closePath();

        ctx.strokeStyle = ctx.fillStyle;
        ctx.shadowColor = 'rgba(0, 0, 0, 0)';
        ctx.beginPath();
        ctx.moveTo(~~x + 0.5, y0);
        ctx.lineTo(~~x + 0.5, y);
        ctx.stroke();
        ctx.closePath();
    }

    draw_bar_chart(ctx) {
        let x = this.config.offset_left * this.config.dpi - this.config.bar_width / 2,
            y0 = ctx.canvas.clientHeight * this.config.dpi,
            index = this.config.start_index,
            count = this.config.points_count, // number of all points (visible + max 2 outside ones)
            R = this.config.bar_border_radius;

        if (this.config.start_index !== 0) {
            x -= this.config.point_dist * this.config.dpi;
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
            ctx.lineTo(x + this.config.bar_width - R, y);
            ctx.arc(x + this.config.bar_width - R, y + R, R, 3 / 2 * Math.PI, 0, false);
            ctx.lineTo(x + this.config.bar_width, y0 + this.config.line_width);

            ctx.fill();
            ctx.stroke();
        }

        ctx.stroke();
        ctx.closePath();
    }

    draw_curve_chart(ctx) {
        let x0 = this.config.offset_left * this.config.dpi,
            y0 = ctx.canvas.clientHeight * this.config.dpi,
            index = this.config.start_index,
            count = this.config.points_count; // number of all points (visible + max 2 outside ones)

        if (this.config.start_index !== 0) {
            x0 -= this.config.point_dist * this.config.dpi;
            index--;
        }

        let y = y0 - this.config.chart_sizing * this.config.chart_data[index] * this.config.dpi,
            y1 = y,
            x = x0,
            k = this.config.point_dist / 2 * (1 - this.config.smoothing);

        ctx.moveTo(x, y0);
        ctx.lineTo(x, y);
        count--;
        index++;

        for (let i = 0; i < count; i++, index++) {
            x += this.config.point_dist * this.config.dpi;
            y = y0 - this.config.chart_sizing * this.config.chart_data[index] * this.config.dpi;

            let cpt_x = x - this.config.point_dist / 2;
            let cpt_y1 = y0 - this.config.chart_data[index - 1] * this.config.chart_sizing * this.config.dpi;
            let cpt_y2 = y0 - this.config.chart_data[index] * this.config.chart_sizing * this.config.dpi;

            ctx.bezierCurveTo(cpt_x - k, cpt_y1, cpt_x + k, cpt_y2, x, y);
        }

        ctx.lineTo(x, y0);

        ctx.fill();
        ctx.stroke();
        ctx.closePath();

        this.redraw_line(ctx, x0, y0, y1);
        this.redraw_line(ctx, x, y0, y);
    }

    draw_point_chart(obj, ctx, start_index, days_diff) {
        // todo
        let x0 = obj.config.padding_left + obj.config.point_dist * days_diff,
            y0 = obj.config.canvas_height;

        let x = x0 - obj.config.point_dist,
            y,
            index = start_index;

        for (let i = 0, points_count = obj.points_to_show_num(start_index); i < points_count; i++, index++) {
            x += obj.config.point_dist;
            y = y0 - obj.config.chart_sizing * obj.config.chart_data[index];

            ctx.beginPath();
            ctx.arc(x, y, obj.config.point_radius, 0, Math.PI * 2, true);
            ctx.fill();
            ctx.stroke();
            ctx.closePath();

            // --- additional circle ---
            /* ctx.shadowColor = 'rgba(0, 0, 0, 0)';
            ctx.arc(obj.config.point_dist * i + obj.config.padding_left - 10, obj.config.canvas_height - obj.config.chart_sizing * item, 5, 0, Math.PI * 2, true);
            ctx.fill(); */
        }
    }
}