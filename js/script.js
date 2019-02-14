// $('.carousel[data-type="multi"] .item').each(function () {
//     var next = $(this).next();
//     if (!next.length) {
//         next = $(this).siblings(':first');
//     }
//     next.children(':first-child').clone().appendTo($(this));
//
//     for (var i = 0; i < 2; i++) {
//         next = next.next();
//         if (!next.length) {
//             next = $(this).siblings(':first');
//         }
//
//         next.children(':first-child').clone().appendTo($(this));
//     }
// });

// var canvas = document.getElementById('example-canvas');
// if (canvas.getContext) {
//
//     var ctx = canvas.getContext('2d');
//
//
// ctx.beginPath();ctx.moveTo(30, 100);
// ctx.moveTo(30,90);
// ctx.moveTo(30, 10);
// ctx.moveTo(30, 200 - 150);
// ctx.moveTo(30, 200 - 30);ctx.moveTo(30, 200 - 30);ctx.moveTo(30, 200 - 90);ctx.stroke();}


// var canvas = document.getElementById('line-chart-canvas-style-2');
//
//
// var canvas_height = 200;
// var canvas_width = 500;
//
// var chart_left_padding = 30;
// var chart_col_width = 45;
// var chart_col_dist = 15;
// var chart_sizing = 30;
// var chart_point_dist = chart_col_dist + chart_col_width;
//
// if (canvas && canvas.getContext) {
//     var ctx = canvas.getContext('2d');
//
//     var tea_cups =  [4, 5, 1, 1, 4, 2, 2];
//
//     ctx.beginPath();
//
//     ctx.lineWidth = 2;
//     ctx.strokeStyle = '#4158D0';
//     ctx.shadowColor = 'rgba(65, 88, 208, 0.7)';
//     ctx.shadowBlur = 7;
//     ctx.shadowOffsetX = 0;
//     ctx.shadowOffsetY = 0;
//
//     ctx.moveTo(chart_left_padding, canvas_height - 90);
//     tea_cups.forEach(function(item, i, arr){
//         ctx.lineTo(chart_point_dist * ++i, canvas_height - chart_sizing * item);
//     });
//     ctx.stroke();
// } else {
//     // canvas-unsupported code here
// }
