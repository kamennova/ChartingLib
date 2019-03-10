function preview_box_init() {
    document._show_area_move = true;

    let chart_preview_container = document.querySelector('.chart-preview-wrapper');
    let show_area_container = document.querySelector('.show-area-container');
    let x_pos_left = chart_preview_container.getBoundingClientRect().left;
    let x_pos_right = chart_preview_container.getBoundingClientRect().right;
    let preview_box_width = x_pos_right - x_pos_left;

    let area_borders = document.querySelectorAll('.area-border');
    for (let i = 0; i < 2; i++) {
        area_borders[i].addEventListener("mousedown", function () {
            document.curr_area_border = get_border_side(this);
            document.addEventListener("mousemove", chart_preview_listener);
            document.addEventListener("mouseup", cancel_listener);
        });
    }

    // let area_left_border = document.querySelector('.area-border.area-border-left');

    // area_left_border.addEventListener("mousedown", function () {
    //     document.currAreaBorder = get_border_side(this);
    //     document.addEventListener("mousemove", chart_preview_listener);
    //     document.addEventListener("mouseup", cancel_listener);
    // });

    let chart_preview_listener = function (e) {
        e = e || window.event;
        let mouse_x = e.pageX;
        document._show_area_move = false;

        if (document.curr_area_border === 'left') {
            if (!(mouse_x <= x_pos_left || mouse_x >= x_pos_right)) { // inside the preview box
                let rect = show_area_container.getBoundingClientRect();

                let dist_to_left = mouse_x - x_pos_left;
                let dist_to_right = x_pos_right - rect.right;

                let new_width = preview_box_width - dist_to_left - dist_to_right;
                let old_pos = rect.left - x_pos_left;

                console.log(old_pos);

                show_area_container.style.right = old_pos + 'px';
                show_area_container.style.left = 'auto';

                show_area_container.style.width = new_width + 'px';

                document.data_start = (rect.left - x_pos_left) / preview_box_width;
                Configurable.draw_chart();
                Configurable.display_vertical_axis();
                Configurable.display_timeflow_axis();
            }
        } else {
            if (!(mouse_x <= x_pos_left || mouse_x >= x_pos_right)) { // inside the preview box
                let rect = show_area_container.getBoundingClientRect();
                let old_pos = rect.left - x_pos_left;

                console.log(old_pos);

                show_area_container.style.right = 'auto';
                show_area_container.style.left = old_pos + 'px';

                let dist_to_left = mouse_x - x_pos_left;
                let dist_to_right = x_pos_right - rect.right;

                let new_width = preview_box_width - dist_to_left - dist_to_right;
                show_area_container.style.width = new_width + 'px';

                document.data_start = (rect.left - x_pos_left) / preview_box_width;
                Configurable.draw_chart();
                Configurable.display_vertical_axis();
                Configurable.display_timeflow_axis();
            }
        }


    };

    let cancel_listener = function () {
        document.removeEventListener("mousemove", chart_preview_listener);
        document._show_area_move = true;
    };

// -----

    show_area_container.addEventListener("mousedown", function (e) {
        // console.log('2');

        // console.log(document._show_area_move);
        let rect = show_area_container.getBoundingClientRect();

        document.curr_preview_box_pos = rect.right - e.pageX;
        document.curr_show_area_width = rect.right - rect.left;

        document.addEventListener("mousemove", move_show_area);
        document.addEventListener("mouseup", cancel_move_show_area);

    });

    let cancel_move_show_area = function () {
        document.removeEventListener("mousemove", move_show_area);
    };


    let move_show_area = function (e) {
        if (document._show_area_move) {
            e = e || window.event;
            let mouse_x = e.pageX;

            if (!(mouse_x - document.curr_show_area_width + document.curr_preview_box_pos <= x_pos_left || mouse_x + document.curr_preview_box_pos >= x_pos_right)) {
                let new_pos_right = x_pos_right - mouse_x - document.curr_preview_box_pos;
                show_area_container.style.right = new_pos_right + 'px';
            } else {
                // out of the box
            }

            get_data_range();
            Configurable.draw_chart();
            Configurable.display_vertical_axis();
        }
    };

    get_data_range();


    function get_data_range() {
        // TODO: wrong left pos
        let rect = show_area_container.getBoundingClientRect();
        document.data_start = (rect.left + 9.5 - x_pos_left) / preview_box_width;
        document.data_end = (rect.right - x_pos_left) / preview_box_width;
    }

    function get_border_side(elem) {
        for (let i = 0, count = elem.classList.length; i < count; i++) {
            if (elem.classList[i].includes('left')) {
                return 'left';
            } else if (elem.classList[i].includes('right')) {
                return 'right';
            }
        }
    }
}

