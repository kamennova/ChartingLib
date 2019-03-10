<?php

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

session_start();

// redirecting unlogged user to log in form
if (!isset($_SESSION['logged_in']) || !$_SESSION['logged_in'] === true) {
    header("location: login.php");
    exit;
}

//----

require_once "connection.php";

$owner_id = '';
$name = '';
$chart_type_id = '';
$data_type = '';

$err = '';

$vertical_axis_value_step = '';
$vertical_axis_labels_step = '';

$timeflow_step = '';
$timeflow_labels_step = '';

$chart_fields = ['owner_id', 'chart_name', 'chart_type_id', 'data_type', 'vertical_axis_value_step',
    'vertical_axis_labels_step', 'vertical_axis_measure_id', 'timeflow_step', 'timeflow_labels_step',
    'timeflow_measure_id', 'timeflow_labels_measure_id', 'created_at',
    'show_last'
    ];

$chart_fields_params = array_map(function ($value) {
    return ':' . $value;
}, $chart_fields);

$chart_fields_str = '';
$chart_fields_params_str = '';
$chart_fields_count = count($chart_fields);

for ($i = 0; $i < $chart_fields_count; $i++) {
    $chart_fields_str .= $chart_fields[$i] . ', ';
    $chart_fields_params_str .= $chart_fields_params[$i] . ', ';
}

$chart_fields_str = substr($chart_fields_str, 0, -2);
$chart_fields_params_str = substr($chart_fields_params_str, 0, -2);

$start_date = '09-02-2019';



    /*
    $date = "04-15-2013";
$date1 = str_replace('-', '/', $date);
$tomorrow = date('m-d-Y',strtotime($date1 . "+1 days"));

echo $tomorrow;*/

/*$new_stmt = $pdo->prepare("INSERT INTO timeflow_chart_data (chart_id, breakpoint, val) VALUES (5, ?, ?)");

for($i = 1; $i < 30; $i++){
    $date = date('Y-m-d', strtotime($start_date . "+$i days"));
    $val = rand(40, 250);

    echo $date . ' ' . $val . "<br>";

    $new_stmt->bindParam(1, $date, PDO::PARAM_STR);
    $new_stmt->bindParam(2, $val, PDO::PARAM_INT);

    $new_stmt->execute();
}

exit;*/

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $owner_id = $_SESSION['id'];
    $chart_name = trim($_POST['chart_name']);
    $chart_type_id = trim($_POST['chart_type_id']);
    $data_type = trim($_POST['horizontal_axis_type']);

    $vertical_axis_value_step = trim($_POST['vertical_axis_value_step']);
    $vertical_axis_labels_step = trim($_POST['vertical_axis_labels_step']);
    $vertical_axis_measure_id = trim($_POST['chart_measure_id']);

    $timeflow_step = trim($_POST['timeflow_step']);
    $timeflow_labels_step = trim($_POST['timeflow_labels_step']);
    $timeflow_measure_id = trim($_POST['timeflow_measure_id']);
    $timeflow_labels_measure_id = trim($_POST['timeflow_labels_measure_id']);

    $show_last = trim($_POST['timeflow_start_point']);

    $created_at = date("Y-m-d H:i:s");

    $data_length = count($_POST['timeflow_chart_value']);

    if (empty($err)) {
        $sql = "INSERT INTO chart ({$chart_fields_str}) VALUES ({$chart_fields_params_str})";

        if ($stmt = $pdo->prepare($sql)) {
            $stmt->bindParam(':owner_id', $owner_id, PDO::PARAM_INT);

            $stmt->bindParam(':chart_name', $chart_name, PDO::PARAM_STR);
            $stmt->bindParam(':chart_type_id', $chart_type_id, PDO::PARAM_INT);
            $stmt->bindParam(':data_type', $data_type, PDO::PARAM_STR);

            $stmt->bindParam(':vertical_axis_value_step', $vertical_axis_value_step, PDO::PARAM_INT);
            $stmt->bindParam(':vertical_axis_labels_step', $vertical_axis_labels_step, PDO::PARAM_INT);
            $stmt->bindParam(':vertical_axis_measure_id', $vertical_axis_measure_id, PDO::PARAM_INT);

            $stmt->bindParam(':timeflow_step', $timeflow_step, PDO::PARAM_INT);
            $stmt->bindParam(':timeflow_labels_step', $timeflow_labels_step, PDO::PARAM_INT);
            $stmt->bindParam(':timeflow_measure_id', $timeflow_measure_id, PDO::PARAM_INT);
            $stmt->bindParam(':timeflow_labels_measure_id', $timeflow_labels_measure_id, PDO::PARAM_INT);

            $stmt->bindParam(':show_last', $show_last, PDO::PARAM_INT);

            $stmt->bindValue(':created_at', $created_at, PDO::PARAM_STR);

            for($i=0; $i < $chart_fields_count; $i++){
                // echo $i+1 . ') ' . $chart_fields[$i] . ": " .  ${$chart_fields[$i]} . "<br>";
            }

            if ($stmt->execute()) {
                $chart_id = intval($pdo->lastInsertId());

                $sql = "INSERT INTO timeflow_chart_data (chart_id, breakpoint, val) VALUES (:chart_id, :breakpoint, :val)";

                if($stmt = $pdo->prepare($sql)) {
                    $stmt->bindParam(':chart_id', $chart_id, PDO::PARAM_INT);
                    $stmt->bindParam(':breakpoint', $breakpoint, PDO::PARAM_STR);
                    $stmt->bindParam(':val', $value, PDO::PARAM_INT);

                    echo 'a';

                    for ($breakpoint_num = 0; $breakpoint_num < $data_length; $breakpoint_num++) {

                        $breakpoint = trim($_POST['timeflow_chart_breakpoint'][$breakpoint_num]);
                        $value = intval(trim($_POST['timeflow_chart_value'][$breakpoint_num]));

                        $stmt->execute();

//                        echo $breakpoint_num . ' ' . $breakpoint . ', ' . $value . "<br>";
                    }
                }

//                header("location: dashboard.php");
                exit;
            } else {
                echo $stmt->errorCode();
                echo 'Error';
//                exit;
            }
        }

        unset($stmt);
    }

    unset($pdo);
}