// ---- Insert HTML ----

ChartContainer.prototype.insert_HTML = function () {
    document.body.classList.add(this.config.mode + '-mode');
    this.container.classList.add('chart-container-wrapper');

    this.insert_container_name();
    this.insert_chart_content();

    if (this.config.show_preview) {
        this.insert_preview_chart_content();
        this.show_area_box = this.container.querySelector('.show-area-container');
        this.layer_left = this.container.querySelector('.area-border-left .layer');
        this.layer_right = this.container.querySelector('.area-border-right .layer');
    }

    if (this.config.show_labels)
        this.insert_chart_labels();

    this.timeflow_axis = this.container.querySelector('.timeflow-axis-labels-container');
    this.vertical_axis_labels_container = this.container.querySelector(' .vertical-axis-labels-container');
    this.ctx = this.get_ctx();
};

ChartContainer.prototype.insert_container_name = function () {
    if (!this.config.show_name) return;

    let name;
    if (this.config.name_link) {
        name = '<a href ="' + this.config.name_link + '">' + this.config.name + '</a>';
    } else {
        name = this.config.name;
    }

    let name_wrapper = '<h2 class="chart-container-name" style="width: ' + this.content_width + 'px;">'
        + name + '</h2>';
    this.container.insertAdjacentHTML('beforeend', name_wrapper);
};

ChartContainer.prototype.insert_chart_content = function () {
    let wrapper = this.insert_chart_wrapper();

    let canvas_layer = this.new_canvas_layer();
    wrapper.appendChild(canvas_layer);

    this.canvas = this.new_canvas();
    wrapper.appendChild(this.canvas);

    let vertical_axis = this.new_vertical_axis();
    wrapper.insertAdjacentHTML('beforeend', vertical_axis);

    wrapper.insertAdjacentHTML('beforeend', '<div id="timeflow-axis-labels-container"' +
        ' class="timeflow-axis-labels-container axis-labels-container"></div>');

    this.point_modal = this.new_point_modal();
    canvas_layer.appendChild(this.point_modal);

    wrapper.insertAdjacentHTML('beforeend', '<p class="hidden no-data-message"><span>' + this.config.no_data_message + '</span></p>');

    this.point_modal.insertAdjacentHTML('afterbegin', '<p class="breakpoint-date"></p>');
    this.point_modal.insertAdjacentHTML('beforeend', '<ul class="points"></ul>');
};

ChartContainer.prototype.insert_preview_chart_content = function () {
    let preview_wrapper = this.insert_chart_wrapper(true);

    this.preview_canvas = this.new_canvas(true);
    preview_wrapper.appendChild(this.preview_canvas);

    let show_area_box = this.new_show_area_box();
    preview_wrapper.insertAdjacentHTML('beforeend', show_area_box);
};

ChartContainer.prototype.insert_chart_labels = function () {
    let list = this.new_labels_list();
    this.container.appendChild(list);
};

// ---

ChartContainer.prototype.insert_chart_wrapper = function (is_preview = false) {
    let wrapper = document.createElement('div');
    let class_name = is_preview ? 'chart-preview-wrapper' : 'chart-wrapper';
    wrapper.classList.add(class_name);

    if (is_preview) {
        wrapper.style.width = this.content_width + 'px';
    }
    return this.container.appendChild(wrapper);
};

ChartContainer.prototype.new_canvas_layer = function () {
    let layer = document.createElement('div');
    let class_name = 'canvas-layer';

    layer.style.width = this.content_width + 'px';
    layer.style.height = this.config.canvas_height + 'px';

    layer.classList.add(class_name);
    return layer;
};

ChartContainer.prototype.new_canvas = function (is_preview = false) {
    let canvas = document.createElement('canvas');

    let class_name = is_preview ? 'chart-preview-canvas' : 'chart-canvas';
    let height = is_preview ? this.config.preview_canvas_height : this.config.canvas_height;
    let width = is_preview ? this.config.preview_canvas_width : this.config.canvas_width;

    canvas.classList.add(class_name);
    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';
    canvas.setAttribute('height', height * this.dpi);
    canvas.setAttribute('width', width * this.dpi);

    return canvas;
};

ChartContainer.prototype.new_vertical_axis = function () {
    return "<div class='vertical-axis-labels-container axis-labels-container ' style='height: "
        + this.config.canvas_height + "px; left: " + this.config.side_padding + "px;'></div>";
};

ChartContainer.prototype.new_point_modal = function () {
    let point_modal = document.createElement('div');
    point_modal.classList.add('point-details-modal');

    return point_modal;
};

ChartContainer.prototype.new_show_area_box = function () {
    let box_width = (this.config.data_end - this.config.data_start) * 100;
    let box_pos_right = (1 - this.config.data_end) * 100;

    let box_style = 'width: ' + box_width + '%; ' + 'right: ' + box_pos_right + '%;';
    let layer_l_style = 'width: ' + this.config.data_start * this.content_width + 'px';
    let layer_r_style = 'width: ' + box_pos_right + '%';

    return '<div class="show-area-container" style="' + box_style + '">' +
        '<span class="show-area-touch"></span>' +
        '<div class="area-border-left area-border" >' +
        '<div class="layer" style="' + layer_l_style + '"></div></div>' +
        '<div class="area-border-right area-border">' + '' +
        '<div class="layer" style="' + layer_r_style + '"></div></div>';
};

ChartContainer.prototype.new_labels_list = function () {
    let list = document.createElement('ul');
    list.classList.add('charts-labels-list');
    list.style.width = this.content_width + 'px';

    return list;
};