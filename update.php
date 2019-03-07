<?php

// --- Is logged in check ---

session_start();

if (!isset($_SESSION['logged_in']) || $_SESSION['logged_in'] !== true) {
    header('location: login.php');
    exit;
}

$user_id = $_SESSION['id'];

require_once 'connection.php';

// --- Chart owner check ---

if (isset($_GET['id'])) {
    $chart_id = $_GET['id'];
    if ($stmt = $pdo->prepare("SELECT owner_id FROM chart WHERE id = ? LIMIT 1")) {
        if ($stmt->bindParam(1, $chart_id, PDO::PARAM_INT) && $stmt->execute()) {
            $owner_id = $stmt->fetch()[0];
            if($owner_id != ''){
                if($owner_id == $user_id){



                    if($stmt = $pdo->prepare("SELECT * FROM chart WHERE id = ?")){
                        if ($stmt->bindParam(1, $chart_id, PDO::PARAM_INT) && $stmt->execute()) {
                            $row = $stmt->fetch();



                            $chart_config = json_encode(array(
                                'chart_name' => $row['chart_name'],

                                "chart_data" => $chart_data,
                                "chart_breakpoints" => $chart_breakpoints,
                                'show_since_steps_ago' => $row[''],

                                "chart_type" => $chart_type,

                                //"measure_value_step" => $measure_value_step,
                                "vertical_axis_labels_step" => $vertical_axis_labels_step,

                                "timeflow_step" => $timeflow_step,
                                "timeflow_measure" => $timeflow_measure,
                                "timeflow_axis_labels_step" => $timeflow_axis_labels_step,
                                "timeflow_axis_labels_measure" => $timeflow_axis_labels_measure,
                                "timeflow_start_point" => '2019-02-15',

                                //        styles
                                "chart_sizing" => 30,
                                "point_dist" => 60,

                                "bar_width" => 45,
                                "bar_border_radius" => 3,

                                "line_colour" => $row['line_colour'],
                                "fill_colour" => $row['fill_colour'],
                                'grid_colour' => $row['grid_colour'],
                                "line_width" => $row['line_width'],

                                "vertical_axis_show_ticks" => $row['vertical_axis_show_ticks'],
                                "vertical_axis_show_line" => $row['vertical_axis_show_line'],
                                "horizontal_axis_show_ticks" => $row['horizontal_axis_show_ticks'],
                                "horizontal_axis_show_line" => $row['horizontal_axis_show_line'],
                            ));
                        }
                    }

                    include_once "chart_form.php";

                    $chart_id = $row['id'];
                    $data_type = $row['data_type'];
//            $line_colour = $row['line_colour'];
//            $fill_colour = $row['fill_colour'];
//            $line_width = $row['line_width'];
//            $vertical_axis_show_ticks = $row['vertical_axis_show_ticks'];

                    $chart_names_list .= '<li><span class="list-style"></span><a href="update.php/">' . $row['chart_name'] . '</a></li>';

//    ----

                    $index_num = $i + 1;

                    // getting chart data
                    $chart_data = [];
                    $chart_data_result = $pdo->query("SELECT val FROM timeflow_chart_data WHERE chart_id = {$chart_id}");
                    while ($data_row = $chart_data_result->fetch(PDO::FETCH_ASSOC)) {
                        $chart_data [] = $data_row['val'];
                    }

                    // getting chart breakpoints
                    $chart_breakpoints = [];
                    $chart_breakpoints_res = $pdo->query("SELECT breakpoint FROM timeflow_chart_data WHERE chart_id = {$chart_id}");
                    while ($data_row = $chart_breakpoints_res->fetch(PDO::FETCH_ASSOC)) {
                        $chart_breakpoints [] = $data_row['breakpoint'];
                    }

                    ob_start();

                    ?>
                    <li class='chart' id='chart-<?= $index_num ?>'>
                        <h2 class='chart-name'><a href='update.php?id=<?= $chart_id ?>'><?= $row['chart_name'] ?></a></h2>
                        <div class="chart-wrapper" id="chart-wrapper-<?= $index_num ?>">
                            <div class="vertical-axis-labels-container axis-labels-container"></div>
                            <div class="chart-canvas-wrapper">
                                <canvas class='chart-canvas' id='chart-canvas-<?= $index_num ?>' height='250px'
                                        width='400px'></canvas>
                            </div>

                            <?php if ($data_type == 'timeflow') { ?>
                                <div class="horizontal-axis-labels-container timeflow-axis-labels-container axis-labels-container"></div>
                                <div class="timeflow-gridlines-labels-container"></div> <?php } else { ?>
                                <div class="category-axis-labels-container"></div> <?php } ?>

                            <?php if (!$chart_data) { ?>
                                <p class="no-data-message">No data here yet</p>
                            <?php } ?>

                        </div>
                    </li>

                    <?php $chart_item = ob_get_contents();
                    ob_end_clean();

                    //    ----

                    $show_since_steps_ago = get_num_value($pdo, 'chart', 'show_last', $row['id']);
                    $chart_type = get_num_value($pdo, 'chart_type', 'type_name', $row['chart_type_id']);

                    $vertical_axis_labels_step = get_num_value($pdo, 'chart', 'vertical_axis_labels_step', $row['id']);

                    $timeflow_step = get_num_value($pdo, 'chart', 'timeflow_step', $row['id']);
                    $timeflow_measure = get_num_value($pdo, 'timeflow_measure', 'measure_name', $row['timeflow_measure_id']);

                    $timeflow_axis_labels_step = get_num_value($pdo, 'chart', 'timeflow_labels_step', $row['id']);
                    $timeflow_axis_labels_measure = get_num_value($pdo, 'timeflow_measure', 'measure_name', $row['timeflow_labels_measure_id']);

//    --- style ---




                    $js .= "new Chart(undefined, $chart_config).draw_all();";

                } else {
                    echo 'No access';
                }
            } else {
                include_once "error404.php";
            }

        } else {echo "Error / no connection. Please try later";}
    } else {
        echo "Error / no connection. Please try later";
    }

} else {

}

//----

include_once 'layout.php';

$pdo = null;