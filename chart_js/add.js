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

if (document.body.classList.contains('theme-bright')) {
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

$(document).ready(function ($) {

    // initialize sliders
 /*   let slider_inputs = $(".form-field-slider");
    $.each(slider_inputs, function (i, val) {

        let input = $(val).next();
        let input_min = input.attr('min') - 0;
        let input_max = input.attr('max') - 0;
        let input_value = input.val();

        $(val).slider({
            min: input_min,
            max: input_max,
            value: input_value,

            slide: function Total(event, ui) {
                input.val(ui.value);
                update_val(input);
            }
        });
    });*/

    // prepare 2 forms submitting
    let config_form = $("#config-form");
    let data_form = $("#data-form");

    $(config_form).submit(function(evt){
        evt.preventDefault();

        let forms_data = $(config_form).serialize() + "&" + $(data_form).serialize();

        $.ajax({
            url  : $(config_form).attr('action'),
            type : "POST",
            data : forms_data,
            success : function(d){
                window.location = 'dashboard.php';
                alert(d);
            }
        });
    });
});

function get_property_name (input){
    let input_id = input.attr('id');
    let prop_name = input_id.replace(/-/gi, '_');

    if (prop_name.indexOf('_input') >= 0) {
        prop_name = prop_name.substr(0, prop_name.length - 6);
    }

    return prop_name;
}

function update_val(input) {
    let prop_name = get_property_name(input);
    Configurable.config[prop_name] = Number(input.val());

    Configurable.draw_chart();
    Configurable.destroy_old_labels('timeflow');
    Configurable.display_timeflow_axis();

    // get_points_num();
}