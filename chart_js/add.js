function charts_init() {
    document.getElementsByClassName('chart-canvas-wrapper')[0].style.height = Configurable.config.canvas_height + 'px';

    // prepare axises
    let vertical_axis = document.getElementsByClassName('vertical-axis-labels-container')[0];
    let horizontal_axis = document.getElementsByClassName('horizontal-axis-labels-container')[0];

    vertical_axis.style.height = Configurable.config.canvas_height + 'px';
    vertical_axis.style.borderColor = Configurable.config.grid_colour;
    horizontal_axis.style.width = Configurable.config.canvas_width + 'px';
    horizontal_axis.style.borderColor = Configurable.config.grid_colour;

    preview_box_init();

    // Configurable.autosize();
    Configurable.draw_chart();
    Configurable.display_timeflow_axis();
    Configurable.display_vertical_axis();
    Configurable.show_point_details();

    // Preview.autosize();
    Preview.draw_chart(false, true);
}

charts_init();

if (document.body.classList.contains('theme-bright')) {
    // theming
}

// -----

class Chart_container {
    constructor(elem, container_config, charts) {
        this.elem = elem;
        this.config = container_config;
        this.charts = charts;


        this.init();
    }

    init() {
        let container_wrapper = document.querySelector(this.elem);
        if (container_wrapper) {
            // insert name
            container_wrapper.insertAdjacentHTML('beforeend', '<h2 class="chart-container-name">' + this.config.name + '</h2>');

            let wrapper = document.createElement('div');
            wrapper.classList.add('chart-wrapper');
            container_wrapper.appendChild(wrapper);
            //container_wrapper.insertAdjacentHTML('afterbegin', '<div class="chart-wrapper"></div>');

            // insert main chart canvas
            let canvas = "<canvas id='chart-canvas' width='" + this.config.canvas_width + "' height='" + this.config.canvas_height + "' ></canvas>";
            wrapper.insertAdjacentHTML('beforeend', '<div class="chart-canvas-wrapper">' + canvas + '</div>');
            // this.elem.insertAdjacentHTML('beforeend', canvas);

            let vertical_axis = document.createElement('div');
            vertical_axis.classList.add('vertical-axis-labels-container', 'axis-labels-container');
            vertical_axis.style.height = this.config.canvas_height + 'px';
            wrapper.appendChild(vertical_axis);
            // wrapper.insertAdjacentHTML('beforeend', vertical_axis);

            let timeflow_axis = '<div id="timeflow-axis-labels-container" class="timeflow-axis-labels-container horizontal-axis-labels-container axis-labels-container"></div>';
            wrapper.insertAdjacentHTML('beforeend', timeflow_axis);

            let point_modal = document.createElement('div');
            point_modal.classList.add('point-details-modal');
            wrapper.appendChild(point_modal);

            point_modal.insertAdjacentHTML('afterbegin', '<p class="breakpoint-date"></p>');

            point_modal.insertAdjacentHTML('beforeend', '<ul class="points"></ul>');

            /*label.style.left = left_pos + 'px';
            label.innerText = date;
                <li>
                <span class="point-value">142</span><br>
                <span class="point-chart-name">Joined</span>
                </li>
                <li>
                <span class="point-value">67</span><br>
                <span class="point-chart-name">Left</span>
                </li>
                */


            // ----- charts drawing ---

            let user_chart_config = {
                chart_wrapper_selector: this.elem,
                canvas_selector: '#chart-canvas',
                canvas_width: this.config.canvas_width,
                canvas_height: this.config.canvas_height,
            };

            for (let i = 0; i < this.charts.length; i++) {
                let chart_config = Object.assign(user_chart_config, this.charts[i])
                new Chart(undefined, chart_config).init();
            }
        }
    }

}

let chart_container = new Chart_container('.chart-container-wrapper-2', {
        name: 'Followers',
        canvas_width: 400,
        canvas_height: 400,
    },
    [
        {
            chart_name: 'Joined',
            chart_data: [
                100, 90, 120, 130, 180, 170, 100, 120, 204, 125, 77, 182, 69, 97, 139, 160, 89, 60, 68, 222, 135, 52, 217, 147, 74, 202, 42, 232, 175, 224, 244, 220, 148, 133, 60, 109, 190],
            chart_breakpoints: [
                "2019-02-02", "2019-02-03", "2019-02-04", "2019-02-05", "2019-02-06", "2019-02-07", "2019-02-08", "2019-02-09", "2019-02-10", "2019-02-11", "2019-02-12", "2019-02-13", "2019-02-14", "2019-02-15", "2019-02-16", "2019-02-17", "2019-02-18", "2019-02-19", "2019-02-20", "2019-02-21", "2019-02-22", "2019-02-23", "2019-02-24", "2019-02-25", "2019-02-26", "2019-02-27", "2019-02-28", "2019-03-01", "2019-03-02", "2019-03-03", "2019-03-04", "2019-03-05", "2019-03-06", "2019-03-07", "2019-03-08", "2019-03-09", "2019-03-10"],
            line_colour: '#3cc23f',
        },
        {
            chart_name: 'Left',
            line_colour: '#f34c44',
        }
    ]);

