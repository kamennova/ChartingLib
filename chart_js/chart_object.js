/**==========================
 Chart model
 ==========================*/

class Chart {
    constructor(element, config) {
        this.config = config;
    }

    init() {
        this.fill();

        // filling point detail modal list
        let point_modal_list = document.querySelector(this.config.chart_wrapper_selector + ' .point-details-modal ul');
        let list_option = '<li style="color:' + this.config.line_colour + '"><span class="point-value"></span><br><span class="point-chart-name">' + this.config.chart_name + '</span></li>';
        point_modal_list.insertAdjacentHTML('beforeend', list_option);

        this.insert_chart_label();
    }

    set_default_config() {
        this.Default_config = {
            point_dist: 60,
            line_width: 2,

            point_radius: 3,
            line_colour: '#3cc23f',

            offset_left: 0,
        };
    }

    insert_chart_label() {
        let charts_labels_list = document.querySelector(this.config.chart_wrapper_selector + ' .charts-labels-list');
        let input_name = this.config.chart_name.replace(/ /, '-');
        let label = '<li><label class="chart-label">' +
            '<input type="checkbox" class="visually-hidden active chart-draw-checkbox" name="' + input_name + '" checked>' +
            '<span style="background-color: ' + this.config.line_colour + '; border-color: ' + this.config.line_colour + '" class="checkbox-indicator">' +
            '</span>' + this.config.chart_name + '</label></li>';

        charts_labels_list.insertAdjacentHTML('beforeend', label);
    }

    fill() {
        this.set_default_config();
        this.config = Object.assign({}, this.Default_config, this.config);
    }

    draw_chart(canvas_selector = this.config.canvas_selector) {
        let canvas = document.querySelector(this.config.chart_wrapper_selector + ' ' + canvas_selector);

        if (canvas && canvas.getContext) {
            let ctx = canvas.getContext('2d');
            if (this.config.chart_data.length > 0) {

                ctx.lineWidth = this.config.line_width;
                ctx.strokeStyle = this.config.line_colour;
                ctx.lineJoin = 'round';
                ctx.lineCap = 'round';
                ctx.globalAlpha = this.config.opacity;

                ctx.beginPath();

                this.draw_line_chart(ctx);
            }
        }
    }

    highlight_point(index) {
        if (this.config.draw) {
            let canvas = document.querySelector(this.config.chart_wrapper_selector + ' ' + this.config.canvas_selector);
            let ctx = canvas.getContext('2d');
            let x0 = ((index - this.config.start_index) * this.config.point_dist + this.config.offset_left) *this.config.dpi,
                y0 = (this.config.canvas_height - this.config.chart_data[index] * this.config.chart_sizing)*this.config.dpi;

            ctx.fillStyle = this.config.bg_color;
            ctx.strokeStyle = this.config.line_colour;
            ctx.lineWidth = this.config.line_width;

            ctx.beginPath();
            ctx.arc(~~(x0 + 0.5), ~~(y0 + 0.5), ~~(this.config.point_radius *this.config.dpi + 0.5), 0, Math.PI * 2, false);
            ctx.fill();
            ctx.stroke();
            ctx.closePath();
        }
    }

    draw_line_chart(ctx) {
        let x = this.config.offset_left * this.config.dpi,
            y0 = ctx.canvas.clientHeight* this.config.dpi,
            index = this.config.start_index,
            count = this.config.points_count; // number of all points (visible + max 2 outside ones)

        if (this.config.start_index !== 0) {
            x -= this.config.point_dist *this.config.dpi;
            index--;
        }

        let y = y0 - this.config.chart_sizing * this.config.chart_data[index] *this.config.dpi;

        ctx.moveTo(x, y);
        count--;
        index++;

        for (let i = 0; i < count; i++, index++) {
            x += this.config.point_dist *this.config.dpi;
            y = y0 - this.config.chart_sizing * this.config.chart_data[index] *this.config.dpi;

            ctx.lineTo(x, y);
        }

        ctx.stroke();
        ctx.closePath();
    }
}