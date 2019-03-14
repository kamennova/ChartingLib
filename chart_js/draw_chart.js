/* =========================
        Drawing
========================= */

function draw_curve_chart(ctx, start_index, days_diff, k = 2 /* smoothness coefficient */) {
    let x0 = this.config.offset_left + -1 * this.config.point_dist,
        y0 = ctx.canvas.clientHeight;

    let x1 = x0,
        y1 = y0 - this.config.chart_data[start_index] * this.config.chart_sizing;
    ctx.moveTo(x1, y0);
    ctx.lineTo(x1, y1);

    let x = x0,
        y,
        index = start_index + 1;

    ctx.strokeStyle = this.config.line_colour;

    for (let i = 1, points_count = this.points_to_show_num(start_index); i < points_count; i++, index++) {
        x += this.config.point_dist;
        y = y0 - this.config.chart_data[index] * this.config.chart_sizing;
        let cpt_x = x - this.config.point_dist / 2;
        let cpt_y1 = y0 - this.config.chart_data[index - 1] * this.config.chart_sizing;
        let cpt_y2 = y0 - this.config.chart_data[index] * this.config.chart_sizing;

        ctx.bezierCurveTo(~~(cpt_x - k) + 0.5, ~~(cpt_y1) + 0.5, ~~(cpt_x + k) + 0.5, ~~(cpt_y2) + 0.5, (~~x) + 0.5, ~~y + 0.5);
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
    ctx.lineTo(x0, y0 - this.config.chart_data[start_index] * this.config.chart_sizing);
    ctx.stroke();
    ctx.closePath();

    ctx.strokeStyle = this.config.fill_colour; // redrawing the line with fill colour
    ctx.beginPath();
    ctx.moveTo(x0, y0);
    ctx.lineTo(x0, y0 - this.config.chart_data[start_index] * this.config.chart_sizing);
    ctx.stroke();
    ctx.closePath();

    // console.log('---');
}

function draw_point_chart(ctx, start_index, days_diff) {
    let x0 = this.config.offset_left + this.config.point_dist * days_diff,
        y0 = this.config.canvas_height;

    let x = x0 - this.config.point_dist,
        y,
        index = start_index;

    for (let i = 0, points_count = this.points_to_show_num(start_index); i < points_count; i++, index++) {
        x += this.config.point_dist;
        y = y0 - this.config.chart_sizing * this.config.chart_data[index];

        ctx.beginPath();
        ctx.arc(x, y, this.config.point_radius, 0, Math.PI * 2, true);
        ctx.fill();
        ctx.stroke();
        ctx.closePath();

        // --- additional circle ---
        /* ctx.shadowColor = 'rgba(0, 0, 0, 0)';
        ctx.arc(this.config.point_dist * i + this.config.offset_left - 10, this.config.canvas_height - this.config.chart_sizing * item, 5, 0, Math.PI * 2, true);
        ctx.fill(); */
    }
}

function draw_line_chart(ctx) {
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