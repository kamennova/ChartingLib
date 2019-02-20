<?php
ini_set("auto_detect_line_endings", true);

session_start();

$upload_dir = '/var/www/new/uploads/';
$upload_file = $upload_dir . basename($_FILES['data_file']['name']);
$upload_message = '';
//$field_options = '';


if ($_FILES['data_file']['name']) {
    if (move_uploaded_file($_FILES['data_file']['tmp_name'], $upload_file)) {
        chmod($upload_file, 0755);
        $upload_message = 'File uploaded successfully<br>';

        $file_name = basename($upload_file);

        $data_file = fopen("uploads/$file_name", "r") or die("Unable to open file!");

        if (!feof($data_file)) {
            $fields_headers = fgets($data_file);
            $upload_message .= 'Table fields: ' . $fields_headers . "<br>";

//            echo ini_get("auto_detect_line_endings");

            $field_options = explode(',', $fields_headers);


            $field_options = array_map(function ($value) {
                return trim($value);
            }, $field_options);

            $_SESSION['data_file_name'] = $file_name;
            $_SESSION['field_options'] = $field_options;
        }

//        var_dump($field_options);
        if (isset($_POST['data-field'])) var_dump($_POST['data-field']);
    } else {
        $upload_message = 'File is incorrect, upload failed.<br>';
    }
}