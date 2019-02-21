<?php

session_start();

// redirecting unlogged user to log in form
if (!isset($_SESSION['logged_in']) || !$_SESSION['logged_in'] === true) {
    header("location: login.php");
    exit;
}

//----

$owner_id = '';
$name = '';
$chart_type_id = '';
$data_type = '';

$err = '';

$vertical_axis_value_step = '';
$vertical_axis_labels_step = '';

$timeflow_value_step = '';
$timeflow_labels_step = '';

$chart_fields = ['owner_id', 'chart_name', 'chart_type_id', 'data_type', 'vertical_axis_value_step',
    'vertical_axis_labels_step', 'vertical_axis_measure_id', 'timeflow_step', 'timeflow_labels_step',
    'timeflow_measure_id', 'timeflow_labels_measure_id', 'created_at'];

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

//echo $chart_fields_str . "<br>";

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $owner_id = $_SESSION['id'];
    $chart_name = trim($_POST['chart_name']);
    $chart_type_id = trim($_POST['chart_type_id']);
    $data_type = trim($_POST['horizontal_axis_type']);

    $vertical_axis_value_step = trim($_POST['vertical_axis_value_step']);
    $vertical_axis_labels_step = trim($_POST['vertical_axis_labels_step']);
    $vertical_axis_measure_id = trim($_POST['chart_measure_id']);

    $timeflow_step = trim($_POST['timeflow_value_step']);
    $timeflow_labels_step = trim($_POST['timeflow_labels_step']);
    $timeflow_measure_id = trim($_POST['timeflow_measure_id']);
    $timeflow_labels_measure_id = trim($_POST['timeflow_labels_measure_id']);

    $created_at = time();

    if (empty($err)) {
        $sql = "INSERT INTO chart ({$chart_fields_str}) VALUES ({$chart_fields_params_str})";

        if ($stmt = $pdo->prepare($sql)) {
            $stmt->bindParam(':owner_id', $param_owner_id, PDO::PARAM_INT);
            $stmt->bindParam(':chart_name', $param_chart_name, PDO::PARAM_STR);
            $stmt->bindParam(':chart_type_id', $param_chart_type_id, PDO::PARAM_INT);
            $stmt->bindParam(':data_type', $param_data_type, PDO::PARAM_STR);

            $stmt->bindParam(':vertical_axis_value_step', $param_vertical_axis_value_step, PDO::PARAM_INT);
            $stmt->bindParam(':vertical_axis_labels_step', $param_vertical_axis_labels_step, PDO::PARAM_INT);
            $stmt->bindParam(':vertical_axis_measure_id', $param_vertical_axis_measure_id, PDO::PARAM_INT);

            $stmt->bindParam(':timeflow_value_step', $param_timeflow_value_step, PDO::PARAM_INT);
            $stmt->bindParam(':timeflow_labels_step', $param_timeflow_labels_step, PDO::PARAM_INT);
            $stmt->bindParam(':timeflow_value_measure_id', $param_timeflow_value_measure_id, PDO::PARAM_INT);
            $stmt->bindParam(':timeflow_labels_measure_id', $param_timeflow_labels_measure_id, PDO::PARAM_INT);

            $stmt->bindParam(':created_ad', $param_created_at, PDO::PARAM_INT);

            for ($i = 0; $i < count($chart_fields); $i++) {
                $param_name = 'param_' . $chart_fields[$i];
                ${$param_name} = ${$chart_fields[$i]};
                echo $i + 1 . ') ' . $param_name . ":  " . $$param_name . "<br>";
            }

            if ($stmt->execute()) {
                $chart_id_query = "SELECT id FROM chart WHERE owner_id = {$param_owner_id} AND created_at = {$param_created_at} LIMIT 1";
                $chart_id_result = $pdo->query($chart_id_query, MYSQLI_STORE_RESULT);

                $sql = "INSERT INTO timeflow_chart_data (chart_id, breakpoint, value) VALUES (:chart_id, :breakpoint, :value)";

                if($stmt = $pdo->prepare($sql)){
                    $stmt->bindParam(':chart_id', $param_chart_id, PDO::PARAM_INT);
                    $stmt->bindParam(':breakpoint', $param_breakpoint, PDO::PARAM_STR);
                    $stmt->bindParam(':value', $param_value, PDO::PARAM_INT);

                    $breakpoint_num = 0;

                    $param_chart_id = $chart_id_result;

                    while(trim($_POST["timeflow-chart-value[$breakpoint_num]"]) !== ''){
                        $param_breakpoint = trim($_POST["timeflow-chart-value[$breakpoint_num]"]);
                        $param_value = trim($_POST["timeflow-chart-breakpoint[$breakpoint_num]"]);
                        $stmt->execute();

                        $breakpoint_num++;
                    }
                }

                header("location: dashboard.php");
                exit;
            } else {
                echo 'Error';
            }
        }

        unset($stmt);
    }

    unset($pdo);
}