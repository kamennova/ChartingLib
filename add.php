<?php

require_once 'connection.php';
require_once "Chart.php";

$add_chart = new Chart;

$add_chart->default_data = [0, 5, 3, 9, 6, 2, 9, 4, 0];
$chart_points_num = count($add_chart->default_data);
$timeflow_start_point = date('Y-m-d', strtotime("-$chart_points_num days"));

// --- Log in check ---

session_start();
if (!isset($_SESSION['logged_in']) || $_SESSION['logged_in'] !== true) {
    $is_disabled = 'disabled';
}

//---

include_once "chart_form.php";

//---

mysqli_close($link);

require_once 'layout.php';