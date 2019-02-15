
/* =========================
   Displaying the axises
========================= */

function translate_measure(val) {
    let price = 0;
    switch (val) {
        // case 'hour':
        //     price = 1;
        //     break;
        case 'day':
            price = 1;
            break;
        case 'week':
            price = 7;
            break;
    }

    return price;
}

function draw_bar_chart(obj, ctx, days_diff) {
    // ok();
    ctx.shadowColor = 'rgba(0, 0, 0, 0)';
    let bar_chart_left_padding = obj.config.chart_left_padding - obj.config.chart_col_width / 2;

    ctx.moveTo(bar_chart_left_padding + obj.config.chart_point_dist * days_diff, obj.config.canvas_height);
    obj.config.chart_data.forEach(function (item, i, arr) {
        ctx.moveTo(obj.config.chart_point_dist * (i + days_diff) + bar_chart_left_padding, obj.config.canvas_height);
        ctx.lineTo(obj.config.chart_point_dist * (i + days_diff) + bar_chart_left_padding, obj.config.canvas_height - obj.config.chart_sizing * item);
        ctx.lineTo(obj.config.chart_point_dist * (i + days_diff) + bar_chart_left_padding + obj.config.chart_col_width, obj.config.canvas_height - obj.config.chart_sizing * item);
        ctx.lineTo(obj.config.chart_point_dist * (i + days_diff) + bar_chart_left_padding + obj.config.chart_col_width, obj.config.canvas_height);
    });

    ctx.stroke();
    ctx.fill();
}

function draw_line_chart(obj, ctx, days_diff) {
    ctx.moveTo(obj.config.chart_left_padding + obj.config.chart_point_dist * days_diff, obj.config.canvas_height - obj.config.chart_sizing * obj.config.chart_data[0]);

    obj.config.chart_data.forEach(function (item, i, arr) {
        ctx.lineTo(obj.config.chart_point_dist * (i + days_diff) + obj.config.chart_left_padding, obj.config.canvas_height - obj.config.chart_sizing * item);
    });
    // ctx.fill();
    ctx.stroke();
}

function draw_curve_chart(obj, ctx, days_diff, k = 2 /* curve coefficient */) {
    let points_count = obj.config.chart_data.length;

    ctx.shadowColor = 'rgba(0, 0, 0, 0)';
    ctx.moveTo(obj.config.chart_left_padding + obj.config.chart_point_dist * days_diff, obj.config.canvas_height);
    ctx.lineTo(obj.config.chart_left_padding + obj.config.chart_point_dist * days_diff, obj.config.canvas_height - obj.config.chart_data[0] * obj.config.chart_sizing);

    ctx.strokeStyle = obj.config.line_colour;

    // obj.config.chart_data.forEach()
    for (let i = 1; i < points_count; i++) {
        let pt_x = obj.config.chart_left_padding + obj.config.chart_point_dist * (i + days_diff);
        let pt_y = obj.config.canvas_height - obj.config.chart_data[i] * obj.config.chart_sizing;
        let control_pt_x = pt_x - obj.config.chart_point_dist / 2;
        let control_pt_y1 = obj.config.canvas_height - obj.config.chart_data[i - 1] * obj.config.chart_sizing;
        let control_pt_y2 = obj.config.canvas_height - obj.config.chart_data[i] * obj.config.chart_sizing;

        ctx.bezierCurveTo(control_pt_x - k, control_pt_y1, control_pt_x + k, control_pt_y2, pt_x, pt_y);
        if (i === (points_count - 1)) {
            ctx.stroke();
            ctx.strokeStyle = ctx.fillStyle;
            ctx.shadowColor = 'rgba(0, 0, 0, 0)';
            ctx.lineTo(pt_x, obj.config.canvas_height);
        }
    }

    ctx.fill();

    // redrawing the first line
    ctx.beginPath();
    ctx.moveTo(obj.config.chart_left_padding + obj.config.chart_point_dist * days_diff, obj.config.canvas_height);
    ctx.lineTo(obj.config.chart_left_padding + obj.config.chart_point_dist * days_diff, obj.config.canvas_height - obj.config.chart_data[0] * obj.config.chart_sizing);
    ctx.stroke();
    ctx.closePath();
}

function draw_point_chart(obj, ctx, days_diff) {

    ctx.moveTo(obj.config.chart_left_padding + obj.config.chart_point_dist * days_diff, obj.config.canvas_height - obj.config.chart_sizing * obj.config.chart_data[0]);
    obj.config.chart_data.forEach(function (item, i, arr) {
        ctx.shadowColor = 'rgba(65, 88, 208, 0)';
        // ctx.shadowBlur = 7;
        // ctx.shadowOffsetX = 0;
        // ctx.shadowOffsetY = 0;

        ctx.fillStyle = '#4158D0';
        ctx.moveTo(obj.config.chart_point_dist * (i + days_diff) + obj.config.chart_left_padding, obj.config.canvas_height - obj.config.chart_sizing * item);
        ctx.arc(obj.config.chart_point_dist * (i + days_diff) + obj.config.chart_left_padding, obj.config.canvas_height - obj.config.chart_sizing * item, 4, 0, Math.PI * 2, true);
        ctx.fill();

        // ctx.shadowColor = 'rgba(0, 0, 0, 0)';
        // ctx.arc(obj.config.chart_point_dist * i + obj.config.chart_left_padding - 10, obj.config.canvas_height - obj.config.chart_sizing * item, 5, 0, Math.PI * 2, true);
        // ctx.fill();
    });
    // ctx.stroke();
}