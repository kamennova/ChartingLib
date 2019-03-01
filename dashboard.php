<?php

session_start();

if (!isset($_SESSION['logged_in']) || $_SESSION['logged_in'] !== true) {
    header('location: login.php');
    exit;
}

require_once 'connection.php';

//----
$stylesheets .= '<link rel="stylesheet" href="css/chart.css" type="text/css">';
//-----

function get_num_value($pdo, $table_name, $value_name, $id)
{
    $query = $pdo->query("SELECT {$value_name} FROM {$table_name} WHERE id = {$id}");

    $chart_value = '';
    while ($chart_value_row = $query->fetch(PDO::FETCH_NUM)) {
        $chart_value = $chart_value_row[0];
    }

    return preg_replace('/\s+/', '_', $chart_value);
}

$owner_id = $_SESSION['id'];

$result = $pdo->query("SELECT * FROM chart WHERE owner_id = {$owner_id}");

$charts_list = '';
$charts_names_list = '';
$i = 0;

// displaying list of charts
while ($row = $result->fetch(PDO::FETCH_ASSOC)) {

    $data_type = $row['data_type'];

    $chart_names_list .= '<li><span class="list-style"></span><a href="#">' . $row['chart_name'] . '</a></li>';

//    ----

    $index_num = $i + 1;

    $chart_item = <<<EOD
    <li class='chart' id='chart-$index_num'>
        <h2 class='chart-name'><a href='#'> {$row['chart_name']} </a></h2>
        <div class="chart-wrapper" id="chart-wrapper-$index_num">
            <div class="vertical-axis-labels-container axis-labels-container"></div>
            <div class="chart-canvas-wrapper">
                <canvas class='chart-canvas' id='chart-canvas-$index_num' height='300px' width='400px'></canvas>
            </div>
EOD;

    $chart_item .= ($data_type == 'timeflow') ?
        '<div class="horizontal-axis-labels-container timeflow-axis-labels-container axis-labels-container"></div>' .
        '<div class="timeflow-gridlines-labels-container"></div>' :
        '<div class="category-axis-labels-container"></div>';
    $chart_item .= '</div></li>';

    // getting chart data
    $chart_data = [];
    $chart_data_result = $pdo->query("SELECT * FROM timeflow_chart_data WHERE chart_id = {$row['id']}");
    while ($data_row = $chart_data_result->fetch(PDO::FETCH_ASSOC)) {
        $chart_data [] = $data_row['val'];
    }

    $chart_type = get_num_value($pdo, 'chart_type', 'type_name', $row['chart_type_id']);

    $vertical_axis_labels_step = get_num_value($pdo, 'chart', 'vertical_axis_labels_step', $row['id']);

    $timeflow_step = get_num_value($pdo, 'chart', 'timeflow_step', $row['id']);
    $timeflow_measure = get_num_value($pdo, 'timeflow_measure', 'measure_name', $row['timeflow_measure_id']);

    $timeflow_axis_labels_step = get_num_value($pdo, 'chart', 'timeflow_labels_step', $row['id']);
    $timeflow_axis_labels_measure = get_num_value($pdo, 'timeflow_measure', 'measure_name', $row['timeflow_labels_measure_id']);

    $chart_config = json_encode(array(
        "chart_wrapper_selector" => '#chart-wrapper-' . $index_num,

        "chart_data" => $chart_data,

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
        "canvas_selector" => '#chart-canvas-' . $index_num,
        "canvas_width" => 400,
        "canvas_height" => 300,
        "bar_width" => 45,
        "point_dist" => 60,
        "padding_left" => 30,

        "line_colour" => '#4158D0',
        "fill_colour" => '#e2e6f9',
        'grid_colour' => '#e0e0e0',
        "line_width" => '1',

        "vertical_axis_show_ticks" => false,
        "vertical_axis_show_line" => false,
        "horizontal_axis_show_ticks" => false,
        "horizontal_axis_show_line" => true,
    ));

    $js .= "new Chart(undefined, $chart_config).draw_all();";

    $i++;

    $charts_list .= $chart_item;
}

if ($chart_names_list) {
    $chart_names_list = '<ul class="user-charts-nav">' . $chart_names_list . '</ul>';
}

//-----

$body_class_list [] = 'dashboard-page';
$body_class_list [] = 'theme-bright';
$stylesheets .= '<link href="css/dashboard.css" rel="stylesheet" />';

ob_start(); ?>

    <aside class="sidebar">
        <ul class="side-nav">
            <li><a href="dashboard.php">Dashboard</a></li>
            <li><h4><span class="plus-icon"></span>My charts</h4>
                $chart_names_list
            </li>
        </ul>
        <!--<a href="add.php" class="btn btn-add">Add chart</a>-->
    </aside>

    <div class='container dashboard-container'>
        <section class="dashboard">

            <?php if ($charts_list) { ?>
                <ul class='charts-list'> <?= $charts_list ?> </ul>
            <?php } else { ?>
                <p class="nothing-found-message">No charts to show yet :/ </p>
            <?php } ?>
        </section>
    </div>
    <script src="chart_js/functions.js"></script>
    <script src="chart_js/chart_object.js"></script>
    <script src="chart_js/draw_chart.js"></script>
    <script><?= $js ?></script>
    <script src='js/dashboard.js'></script>

<?php
$content = ob_get_contents();
ob_end_clean();
include_once 'layout.php';

$pdo = null;