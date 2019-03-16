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

        let charts_labels_list = document.querySelector(this.config.chart_wrapper_selector + ' .charts-labels-list');
        let input_name = this.config.chart_name.replace(/ /, '-');
        let label = '<li><label class="chart-label">' +
            '<input type="checkbox" class="visually-hidden chart-draw-checkbox" name="' + input_name + '" checked>' +
            '<span style="background-color: ' + this.config.line_colour + '; border-color: ' + this.config.line_colour + '" class="checkbox-indicator"></span>'
            + this.config.chart_name + '</label></li>';

        charts_labels_list.insertAdjacentHTML('beforeend', label);
    }

    fill() {
        for (const key in Default_config) {
            let value = Default_config[key];
            if (!this.config.hasOwnProperty(key) || this.config[key] == null) {
                this.config[key] = Default_config[key];
            }
        }
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

                switch (this.config.chart_type) {
                    case 'line_chart':
                        this.draw_line_chart(ctx);
                        break;
                    case 'curve_chart':
                        draw_curve_chart.bind(this)(ctx);
                        break;
                    case 'point_chart':
                        draw_point_chart.bind(this)(ctx);
                        break;
                }
            }
        }
    }

    highlight_point(index) {
        if (this.config.draw) {
            let canvas = document.querySelector(this.config.chart_wrapper_selector + ' ' + this.config.canvas_selector);
            let ctx = canvas.getContext('2d');
            let x0 = (index - this.config.start_index) * this.config.point_dist + this.config.offset_left,
                y0 = this.config.canvas_height - this.config.chart_data[index] * this.config.chart_sizing;


            ctx.fillStyle = this.config.background_color;
            ctx.strokeStyle = this.config.line_colour;
            ctx.lineWidth = this.config.line_width;

            ctx.beginPath();
            ctx.arc(~~(x0 + 0.5), ~~(y0 + 0.5), ~~(this.config.point_radius + 0.5), 0, Math.PI * 2, false);
            ctx.fill();
            ctx.stroke();
            ctx.closePath();
        }
    }

    // ---

    draw_line_chart(ctx) {
        let x,
            y0 = ctx.canvas.clientHeight,
            index = this.config.start_index,
            count = this.config.points_count; // number of all points (visible + max 2 outside ones)

        if (this.config.start_index === 0) {
            x = this.config.offset_left;
            count--;
        } else {
            x = this.config.offset_left - this.config.point_dist;
            index--;
        }

        let y = y0 - this.config.chart_sizing * this.config.chart_data[index];

        ctx.moveTo(x, y);
        index++;

        for (let i = 0; i < count; i++, index++) {
            /*if(!this.config.chart_data[index]){
               console.log(index);
            }*/

            x += this.config.point_dist;
            y = y0 - this.config.chart_sizing * this.config.chart_data[index];

            ctx.lineTo(x, y);
        }

        // ctx.fill();
        ctx.stroke();
        ctx.closePath();
    }
}