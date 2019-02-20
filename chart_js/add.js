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

jQuery.document.ready(function($){
    $('#line-sickness-slider').slider({
        min: 0,
        max: 24,
    });

    console.log($('#line-sickness-slider'));
});




/*    var amountmonday = $('#amountmonday');
    var slidermonday = $('#slidermonday');
    slidermonday.slider({
        range: true,
        min: 0,
        max: 24,
        values: [12, 18],
        create: function() {
            var max = $(this).slider('values', 1);
            var min = $(this).slider('values', 0);
            amountmonday.val(max - min);
        },
        slide: function Total(event, ui) {
            amountmonday.val(ui.values[1] - ui.values[0]);
        }

    }); */
