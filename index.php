<?php

if (isset($body_class_list)) {
    $body_classes = '';
    foreach ($body_class_list as $body_class) {

        if (strpos($body_class, 'theme') !== false) {
            // theme name is 'theme-xyz'
            $theme_name = substr($body_class, 6);

            $theme_stylesheets = "<link rel='stylesheet' href='css/themes/$theme_name.css' />";
        }

        $body_classes .= $body_class . ' ';
    }
} ?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset
    "UTF-8">
    <title><?= isset($title) ? $title : 'My stats' ?></title>
    <link href="https://fonts.googleapis.com/css?family=Open+Sans:300,400,600,700" rel="stylesheet">
    <link rel="stylesheet" href="css/normalize.css">
    <link rel="stylesheet" href="css/style.css">

    <?= isset($stylesheets) ? $stylesheets : null ?>
    <?= $theme_stylesheets ?>
    <link rel="stylesheet" href="css/chart.css" type="text/css">
</head>

<body class='<?= $body_classes ?> theme-light'>
<div class="site-wrapper">
    <section class="chart">
        <div class="chart-container-wrapper-2"> </div>
        <div class="chart-container-wrapper-1"> </div>
    </section>
</div>

<script src="chart_js/CHART_DATA.json"></script>

<script src="chart_js/default.js"></script>
<script src="chart_js/functions.js"></script>
<script src="chart_js/chart_object.js"></script>
<!--<script src="chart_js/draw_chart.js"></script>-->
<!--<script src="chart_js/chart_preview.js"></script>-->
<script src="chart_js/chart_container.js"></script>
<script src="chart_js/add.js"></script>
</body>
</html>