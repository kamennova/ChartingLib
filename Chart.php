<?php

class Chart
{
    private $id;

    public $default_data;

    public $owner_id = 'hi';
    public $name; // e.g. Tea cups daily
    public $data_type; // timeflow / category
    public $chart_type_id; // curve / bar / line / point / pie chart

    public $vertical_axis_measure_id; // cups/dollars/kilos/kms/hours
    public $vertical_axis_measure_step;
    public $vertical_axis_labels_step;

    public $timeflow_value_measure_id;// second/minute/hour/day/week/month/year/decade
    public $timeflow_value_step;
    public $timeflow_labels_measure_id;
    public $timeflow_labels_step;

    public $timeflow_start_point;

    // default data array
    public $chart_data = [0, 5, 3, 9, 6, 2, 9, 4, 0];

    /* ====================
        Style parameters
    ===================== */

    public $chart_sizing;
    public $point_dist;
    public $line_width;
    public $shadow_colour;
    public $shadow_blur;
    public $shadow_offset_x;
    public $shadow_offset_y;

    // axises & labels
    public $vertical_axis_show_ticks;
    public $vertical_axis_show_line;
    public $horizontal_axis_show_ticks;
    public $horizontal_axis_show_line;
    public $grid_colour;

    public $draw_points;
    public $point_radius;
    public $point_border_colour;
    public $point_fill_colour;

    // bar chart
    public $bar_width;
    public $bar_border_radius;

    // curve chart
    public $smoothing;

    // colours
    public $line_colour;
    public $fill_colour;
}