<?php

session_start();

if (!isset($_SESSION['logged_in']) || $_SESSION['logged_in'] !== true) {
    header('location: login.php');
    exit;
}

$owner_id = $_SESSION['id'];

require_once 'connection.php';
require 'chart_functions.php';

// ---

$charts_list = '';
$charts_names_list = '';
$i = 0;

$new_num = 0;
$index_num = &$new_num;

if ($stmt = $pdo->prepare("SELECT * FROM chart WHERE owner_id = ?")) {
    if ($stmt->bindParam(1, $owner_id, PDO::PARAM_INT) && $stmt->execute()) {

//      displaying list of charts
        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            $index_num = $i + 1;
//            $new_num = $i+1;
            $chart_id = $row['id'];

            $chart_names_list .= '<li><span class="list-style"></span><a href="update.php/">' . $row['chart_name'] . '</a></li>';
            $user_config = chart_row_to_js($pdo, $row);

            ob_start(); ?>

            <li class='chart' id='chart-<?= $index_num ?>'>
                <h2 class='chart-name'><a href='update.php?id=<?= $chart_id ?>'><?= $row['chart_name'] ?></a></h2>
                <div class="chart-wrapper" id="chart-wrapper-<?= $index_num ?>">
                    <div class="vertical-axis-labels-container axis-labels-container"></div>
                    <div class="chart-canvas-wrapper">
                        <canvas class='chart-canvas' id='chart-canvas-<?= $index_num ?>' height='250px'
                                width='400px'></canvas>
                    </div>

                    <?php if ($user_config['data_type'] == 'timeflow') { ?>
                        <div class="horizontal-axis-labels-container timeflow-axis-labels-container axis-labels-container"></div>
                        <div class="timeflow-gridlines-labels-container"></div> <?php } else { ?>
                        <div class="category-axis-labels-container"></div> <?php } ?>

                    <?php if (count($user_config['chart_data']) == 0) { ?>
                        <p class="no-data-message">No data here yet</p>
                    <?php } ?>

                </div>
            </li>

            <?php $chart_item = ob_get_contents();
            ob_end_clean();

            $default_config = array(
                "chart_wrapper_selector" => '#chart-wrapper-' . ($index_num),
                "canvas_selector" => '#chart-canvas-' . $index_num,
                "canvas_width" => 400,
                "canvas_height" => 250,
                "padding_left" => 30,
            );

            $chart_config = json_encode(array_merge($user_config, $default_config));
            $js .= "new Chart(undefined, $chart_config).draw_all();";

            $i++;

            $charts_list .= $chart_item;
        }
    }
}

if ($chart_names_list) {
    $chart_names_list = '<ul class="user-charts-nav">' . $chart_names_list . '</ul>';
}

//-----

$body_class_list [] = 'dashboard-page';
$body_class_list [] = 'theme-bright';
$stylesheets .= '<link rel="stylesheet" href="css/chart.css" type="text/css">' .
    '<link href="css/dashboard.css" rel="stylesheet"/>';

ob_start(); ?>

    <aside class="sidebar">
        <ul class="side-nav">
            <li><a href="dashboard.php">Dashboard</a></li>
            <li><h4><span class="plus-icon"></span>My charts</h4>
                $chart_names_list
            </li>
        </ul>

    </aside>

    <div class='container dashboard-container'>
        <header class="dashboard-header">
            <h1 class="page-title">My charts</h1>
            <a href="add.php" class="btn btn-add">Add chart</a>
        </header>
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