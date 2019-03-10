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

function draw_bar_chart(obj, ctx, start_index, days_diff) {
    let bar_padding_left = obj.config.padding_left - obj.config.bar_width / 2;

    let x0 = obj.config.point_dist * (days_diff) + bar_padding_left,
        y0 = obj.config.canvas_height;

    // console.log(days_diff);

    let x = x0 - obj.config.point_dist,
        index = start_index,
        y,
        R = obj.config.bar_border_radius;

    for (let i = 0, points_count = obj.points_to_show_num(start_index); i < points_count; i++, index++) {
        x += obj.config.point_dist;
        y = y0 - obj.config.chart_sizing * obj.config.chart_data[index];

        ctx.beginPath();

        ctx.moveTo(x, y0);
        ctx.lineTo(x, y + R);
        ctx.arc(x + R, y + R, R, Math.PI, -1 / 2 * Math.PI, false);
        ctx.lineTo(x + obj.config.bar_width - R, y);
        ctx.arc(x + obj.config.bar_width - R, y + R, R, 3 / 2 * Math.PI, 0, false);
        ctx.lineTo(x + obj.config.bar_width, y0);

        ctx.stroke();
        ctx.fill();
    }
}

function draw_curve_chart(obj, ctx, start_index, days_diff, k = 2 /* smoothness coefficient */) {
    let x0 = obj.config.padding_left + days_diff * obj.config.point_dist,
        y0 = ctx.canvas.clientHeight;

    let x1 = x0,
        y1 = y0 - obj.config.chart_data[start_index] * obj.config.chart_sizing;
    ctx.moveTo(x1, y0);
    ctx.lineTo(x1, y1);

    // console.log(obj.config.chart_data);

    let x = x0,
        y,
        index = start_index + 1;

    ctx.strokeStyle = obj.config.line_colour;

    for (let i = 1, points_count = obj.points_to_show_num(start_index); i < points_count; i++, index++) {
        x += obj.config.point_dist;
        y = y0 - obj.config.chart_data[index] * obj.config.chart_sizing;
        let cpt_x = x - obj.config.point_dist / 2;
        let cpt_y1 = y0 - obj.config.chart_data[index - 1] * obj.config.chart_sizing;
        let cpt_y2 = y0 - obj.config.chart_data[index] * obj.config.chart_sizing;

        ctx.bezierCurveTo(cpt_x - k, cpt_y1, cpt_x + k, cpt_y2, x, y);
    }

    ctx.lineTo(x, y0);

    ctx.fill();
    ctx.stroke();

    // --- redrawing the last line ---
    ctx.strokeStyle = 'white'; // setting non-transparent bg
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x, y0);
    ctx.stroke();
    ctx.closePath();

    ctx.strokeStyle = ctx.fillStyle;
    ctx.shadowColor = 'rgba(0, 0, 0, 0)';
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x, y0);
    ctx.stroke();
    ctx.closePath();

    // --- redrawing the first line ---
    ctx.strokeStyle = 'white'; // setting non-transparent bg
    ctx.beginPath();
    ctx.moveTo(x0, y0);
    ctx.lineTo(x0, y0 - obj.config.chart_data[start_index] * obj.config.chart_sizing);
    ctx.stroke();
    ctx.closePath();

    ctx.strokeStyle = obj.config.fill_colour; // redrawing the line with fill colour
    ctx.beginPath();
    ctx.moveTo(x0, y0);
    ctx.lineTo(x0, y0 - obj.config.chart_data[start_index] * obj.config.chart_sizing);
    ctx.stroke();
    ctx.closePath();

    // console.log('---');
}

function draw_point_chart(obj, ctx, start_index, days_diff) {
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

/*function draw_line_chart(obj, ctx, days_diff) {
    ctx.moveTo(obj.config.padding_left + obj.config.point_dist * days_diff, obj.config.canvas_height - obj.config.chart_sizing * obj.config.chart_data[0]);

    let x0 = obj.config.point_dist * (days_diff - 1) + obj.config.padding_left;
    let y0 = obj.config.canvas_height;

    obj.config.chart_data.forEach(function (item, i, arr) {
        x0 += obj.config.point_dist;
        ctx.lineTo(x0, y0 - obj.config.chart_sizing * item);
    });
    ctx.fill();
    ctx.stroke();
}*/