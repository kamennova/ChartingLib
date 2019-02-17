<?php

require_once "connection.php";

try {
    $pdo = new PDO("mysql:host=" . DB_SERVER . ";dbname=" . DB_NAME, DB_USERNAME, DB_PASSWORD);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    die ("Error. Could not connect. " . $e->getMessage());
}

$owner_id = '';
$name = '';
$chart_type_id = '';
$data_type = '';

$vertical_axis_value_step = '';
$vertical_axis_labels_step = '';

$timeflow_value_step = '';
$timeflow_labels_step = '';

if($_SERVER['REQUEST_METHOD'] == 'POST'){
    $name = trim($_POST['chart_name']);
    $chart_type_id = trim($_POST['chart_type_id']);
    $data_type = trim($_POST['horizontal_axis_type']);

    $vertical_axis_value_step = trim($_POST['measure_value_step']);
    $vertical_axis_labels_step = trim($_POST['vertical_axis_labels_step']);

    $timeflow_value_step = trim($_POST['timeflow_value_step']);
    $timeflow_labels_step = trim($_POST['timeflow_axis_labels_step']);

    echo "Measure value step: " . $vertical_axis_value_step . '<br>';
    echo "Vertical axis labels step: " . $vertical_axis_labels_step . '<br>';
    echo "Data type: " . $data_type . '<br>';
    echo $timeflow_labels_step . ' ' . $timeflow_value_step;
}