<?php

function get_only_value($pdo, $table_name, $value_name, $id)
{
    $chart_value = '';
    
    if ($query = $pdo->prepare("SELECT {$value_name} FROM {$table_name} WHERE id = ? LIMIT 1")) {
//        echo 'kkk';exit;
        $query->bindParam(1, $id, PDO::PARAM_INT);

        if ($query->execute()) {
//            echo 'kkk';exit;
            $chart_value = $query->fetch(PDO::FETCH_NUM)[0];
        }
    }
    
    return preg_replace('/\s+/', '_', $chart_value);
}

function chart_row_to_js($pdo, $row)
{

    $chart_id = $row['id'];

    // getting chart data
    $chart_data = [];
    if ($chart_data_res = $pdo->prepare("SELECT val FROM timeflow_chart_data WHERE chart_id = ?")) {
        if ($chart_data_res->bindParam(1, $chart_id) && $chart_data_res->execute()) {
            while ($data_row = $chart_data_res->fetch(PDO::FETCH_ASSOC)) {
                $chart_data [] = $data_row['val'];
            }
        }
    }



    // getting chart breakpoints
    $chart_breakpoints = [];
    $chart_breakpoints_res = $pdo->prepare("SELECT breakpoint FROM timeflow_chart_data WHERE chart_id = ?");
    if ($chart_breakpoints_res->bindParam(1, $chart_id) && $chart_breakpoints_res->execute()) {
        while ($data_row = $chart_breakpoints_res->fetch(PDO::FETCH_ASSOC)) {
            $chart_breakpoints [] = $data_row['breakpoint'];
        }
    }



    //    ----

    $chart_type = get_only_value($pdo, 'chart_type', 'type_name', $row['chart_type_id']);
//    echo 'kkk';exit;
    $timeflow_measure = get_only_value($pdo, 'timeflow_measure', 'measure_name', $row['timeflow_measure_id']);
    $timeflow_axis_labels_measure = get_only_value($pdo, 'timeflow_measure', 'measure_name', $row['timeflow_labels_measure_id']);

//    --- style ---

    $chart_config = array(
        "data_type" => $row['data_type'],
        "chart_data" => $chart_data,
        "chart_breakpoints" => $chart_breakpoints,
        'show_since_steps_ago' => $row['show_last'],

        "chart_type" => $chart_type,

        "vertical_axis_value_step" => $row['vertical_axis_value_step'],
        "vertical_axis_labels_step" => $row['vertical_axis_labels_step'],

        "timeflow_step" => $row['timeflow_step'],
        "timeflow_measure" => $timeflow_measure,
        "timeflow_axis_labels_step" => $row['timeflow_labels_step'],
        "timeflow_axis_labels_measure" => $timeflow_axis_labels_measure,

        //   styles
        /*"chart_sizing" => 30,
        "point_dist" => 60,
        "padding_left" => 30,

        "bar_width" => 45,
        "bar_border_radius" => 3, */

        "line_colour" => $row['line_colour'],
        "fill_colour" => $row['fill_colour'],
        'grid_colour' => $row['grid_colour'],
        "line_width" => $row['line_width'],

        "vertical_axis_show_ticks" => $row['vertical_axis_show_ticks'],
        "vertical_axis_show_line" => $row['vertical_axis_show_line'],
        "horizontal_axis_show_ticks" => $row['horizontal_axis_show_ticks'],
        "horizontal_axis_show_line" => $row['horizontal_axis_show_line'],
    );

    return $chart_config;
}