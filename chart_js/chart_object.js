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
            chart_type: 'line_chart',
            point_dist: 60,
            line_width: 2,
            shadow_colour: 'rgba(0, 0, 0, 0)',
            shadow_blur: 7,
            shadow_offset_x: 0,
            shadow_offset_y: 0,

            point_radius: 3,
            smoothing: 2,
            line_colour: '#3cc23f',
            fill_colour: 'rgba(0, 0, 0, 0)',

            offset_left: 0,
        };
    }

    insert_chart_label() {
        let charts_labels_list = document.querySelector(this.config.chart_wrapper_selector + ' .charts-labels-list');
        let input_name = this.config.chart_name.replace(/ /, '-');
        let label = '<li><label class="chart-label">' +
            '<input type="checkbox" class="visually-hidden chart-draw-checkbox" name="' + input_name + '" checked>' +
            '<span style="background-color: ' + this.config.line_colour + '; border-color: ' + this.config.line_colour + '" class="checkbox-indicator">' +
            '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 14 10"><path fill-rule="evenodd"  fill="white" ' +
            'd="M13.605,2.186 L5.993,9.618 C5.477,10.119 4.640,10.119 4.123,9.618 L0.382,5.996 C-0.135,5.496 -0.135, 4.685 0.382,4.186 C0.898,3.684' +
            ' 1.736,3.684 2.252,4.186 L5.058,6.902 L11.735,0.373 C12.252,-0.126 13.089,-0.126 13.605,0.373 C14.122,0.874 14.122,1.685 13.605,2.186 Z"/></svg>' +
            '</span>'
            + this.config.chart_name + '</label></li>';

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
                ctx.fillStyle = this.config.fill_colour;
                ctx.shadowColor = this.config.shadow_colour;
                ctx.shadowBlur = this.config.shadow_blur;
                ctx.shadowOffsetX = this.config.shadow_offset_x;
                ctx.shadowOffsetY = this.config.shadow_offset_y;
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
            let x0 = (index - this.config.start_index) * this.config.point_dist + this.config.offset_left,
                y0 = this.config.canvas_height - this.config.chart_data[index] * this.config.chart_sizing;


            ctx.fillStyle = this.config.bg_color;
            ctx.strokeStyle = this.config.line_colour;
            ctx.lineWidth = this.config.line_width;

            ctx.beginPath();
            ctx.arc(~~(x0 + 0.5), ~~(y0 + 0.5), ~~(this.config.point_radius + 0.5), 0, Math.PI * 2, false);
            ctx.fill();
            ctx.stroke();
            ctx.closePath();
        }
    }

    draw_line_chart(ctx) {
        let x = this.config.offset_left,
            y0 = ctx.canvas.clientHeight,
            index = this.config.start_index,
            count = this.config.points_count; // number of all points (visible + max 2 outside ones)

        if (this.config.start_index !== 0) {
            x -= this.config.point_dist;
            index--;
        }

        let y = y0 - this.config.chart_sizing * this.config.chart_data[index];

        ctx.moveTo(x, y);
        count--;
        index++;

        for (let i = 0; i < count; i++, index++) {
            x += this.config.point_dist;
            y = y0 - this.config.chart_sizing * this.config.chart_data[index];

            ctx.lineTo(x, y);
        }

        // ctx.fill();
        ctx.stroke();
        ctx.closePath();
    }
}