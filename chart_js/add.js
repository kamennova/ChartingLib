document.getElementsByClassName('chart-canvas-wrapper')[0].style.height = Configurable.config.canvas_height + 'px';

// prepare axises
document.getElementsByClassName('vertical-axis-labels-container')[0].style.height = Configurable.config.canvas_height + 'px';
document.getElementsByClassName('horizontal-axis-labels-container')[0].style.width = Configurable.config.canvas_width + 'px';

// prepare form fields
hide(category_axis_fields);

prepare_default_chart_data();

Configurable.display_timeflow_axis();
Configurable.display_vertical_axis();
Configurable.draw_chart();

monitor_measure_value();

if(document.body.classList.contains('theme-bright')){
    let form_fields = document.querySelectorAll('.col-left input');
    let form_fields_number = form_fields.length;

    for (let i = 0; i < form_fields_number; i++) {
        if (form_fields[i].value != null && form_fields[i].value !== '') {
            form_fields[i].classList.add('visited');
        } else {
            form_fields[i].classList.remove('visited');
        }

        form_fields[i].addEventListener('change', function () {
            if (this.value != null) {
                this.classList.add('visited');
            } else {
                this.classList.remove('visited');
            }
        })
    }
}
//
// let form_field_sliders = document.getElementsByClassName('form-field-slider');
// for(let i =0, count = form_field_sliders.length; i < count; i++){
//
//     form_field_sliders[i].slider({
//         min: 0,
//         max: 24,
//
//
//         }
//     );
// }

$(document).ready(function($){
    let input = $('#line-width-input');
    let input_min = input.attr('min');
    let max = input.attr('max');
    console.log(max);

    $('#line-sickness-slider').slider({
        min: input_min,
        max: max,
        value: 12,
    });
});

/*
var amountmonday = $('#amountmonday');
var slidermonday = $('#slidermonday');
var max = $('slidermonday').slider('values', 1);
var min = $('slidermonday').slider('values', 0);



$(function() {
    slidermonday.slider({
        range:true,
        min: 0,
        max: 24,
        values: [12, 18],
        slide: function Total (event, ui) {
            amountmonday.val(ui.values[1] - ui.values[0]);

            $( "#amountmonday" ).val(  $( "#slidermonday" ).slider( "values", 1 ) - $( "#slidermonday" ).slider( "values", 0));
        },

    });
});
*/