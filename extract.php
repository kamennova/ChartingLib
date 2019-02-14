<?php
ini_set("auto_detect_line_endings", true);

session_start();

if ($_SESSION['data_file_name'] && isset($_POST['data-field'])) {

    $selected_field = $_POST['data-field'];
    $field_options = $_SESSION['field_options'];
    $data_file_name = $_SESSION['data_file_name'];

//    $debug_info .= 'selected field: ' . var_dump($selected_field) . ';<br>' .
//    'field options: ' . var_dump($field_options) . ';<br>';

//    $debug_info .= 'Key: ' . var_dump($key) . '<br>' .
//     'Selected option: ' . $selected_field . '<br>';

    $key = array_search($selected_field, $field_options);
    $chart_data = [];

    if ($key !== Null) {
        $data_file = fopen("uploads/$data_file_name", "r") or die("Unable to open file!");

        $row_counter = 1;

        while (!feof($data_file)) {
                $row_data = explode(',', fgets($data_file));
            if (!$row_counter) {
                $chart_data [] = trim($row_data[$key]);
            } else $row_counter = 0;
        }

//        $debug_info .= 'Chart data array: ' . var_dump($chart_data) . '<br>';
        $chart_data = implode(',', $chart_data);
        echo '<script>let table_data = "' . $chart_data . '"; </script>';
    }
}