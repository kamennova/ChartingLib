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
    <link href="https://fonts.googleapis.com/css?family=Lato:300,400,500,700" rel="stylesheet">
    <link rel="stylesheet" href="css/normalize.css">
    <link rel="stylesheet" href="css/style.css">

    <?= isset($stylesheets) ? $stylesheets : null ?>
    <?= $theme_stylesheets ?>
    <link rel="stylesheet" href="css/chart.css" type="text/css">
</head>

<body class='<?= $body_classes ?> theme-light'>
<div class="site-wrapper">
    <section class="chart">
        <!-- <div class="chart-container-wrapper">
            <h2 class="chart-container-name">Followers</h2>
            <div class="chart-wrapper">
                <div id="vertical-axis-labels-container"
                     class="vertical-axis-labels-container axis-labels-container"></div>
                <div class="chart-canvas-wrapper">
                    <canvas id="chart-canvas" height="400px" width="400px"></canvas>
                </div>
                <div id="timeflow-axis-labels-container"
                     class="timeflow-axis-labels-container horizontal-axis-labels-container axis-labels-container"></div> --!>
<!--                <div id="timeflow-gridlines-labels-container" class="timeflow-gridlines-labels-container"></div>-->
                <!--<div class="point-details-modal">
                    <p class="breakpoint-date">Sat, Feb 24</p>
                    <ul class="points">
                        <li>
                            <span class="point-value">142</span><br>
                            <span class="point-chart-name">Joined</span>
                        </li>
                        <li>
                            <span class="point-value">67</span><br>
                            <span class="point-chart-name">Left</span>
                        </li>
                    </ul>
                </div>
            </div>
            <div class="chart-preview-wrapper">
                <div class="hidden-area-container chart-area-container"></div>
                <div class="show-area-container chart-area-container">
                    <div class="area-border-right area-border" id="area-border-left"></div>
                    <div class="area-border-left area-border" id="area-border-right"></div>
                </div>
                <div class="hidden-area-container chart-area-container"></div>
                <canvas id="chart-preview-canvas" height="60px" width="400px"></canvas>
            </div>
            <ul class="charts-labels-list">
                <li class="chart-label">
                    <span class="chart-show-input"></span>
                    Joined
                </li>
                <li class="chart-label">
                    <span class="chart-show-input"></span>
                    Left
                </li>
            </ul>
        </div> -->
        <div class="chart-container-wrapper-2">

        </div>
    </section>
</div>

<script src="chart_js/CHART_DATA.json"></script>
<script src="chart_js/default.js"></script>
<script src="chart_js/functions.js"></script>
<script src="chart_js/chart_object.js"></script>
<script src="chart_js/configurable.js"></script>
<script src="chart_js/draw_chart.js"></script>
<script src="chart_js/chart_preview.js"></script>
<script src="chart_js/chart_container.js"></script>
<script src="chart_js/add.js"></script>
</body>
</html>