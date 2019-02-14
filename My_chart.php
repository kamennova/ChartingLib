<?php

class My_chart
{

    private $id;

    public $owner_id;
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

}