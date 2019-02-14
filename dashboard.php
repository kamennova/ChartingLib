<?php

session_start();

if (!isset($_SESSION['logged_in']) || $_SESSION['logged_in'] !== true) {
    header('location: login.php');
    exit;
}

//----

require_once 'connection.php';

try {
    $pdo = new PDO("mysql:host=" . DB_SERVER . ";dbname=" . DB_NAME, DB_USERNAME, DB_PASSWORD);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    die("ERROR: Could not connect. " . $e->getMessage());
}

$owner_id = $_SESSION['id'];

$result = $pdo->query("SELECT * FROM chart WHERE owner_id = {$owner_id}");

$charts_list = '';
$charts_names_list = '';
$i = 0;

// displaying list of charts
while ($row = $result->fetch(PDO::FETCH_ASSOC)) {

    $data_type = $row['data_type'];

    $chart_names_list .= '<li><span class="list-style"></span><a href="#">' . $row['name'] . '</a></li>';

    $charts_list .= "<li class='chart' id='chart-$i'>";
    $charts_list .= "<h2 class='section-title chart-name'><a href='#'>" . $row['name'] . "</a></h2>";
    $charts_list .= '<div id="vertical-axis-labels-container" class="vertical-axis-labels-container"></div>' .
        '<div class="chart-canvas-wrapper">' .
        '<canvas class="chart-canvas" height="300px" width="400px"></canvas>' .
        '</div>';
    $charts_list .= ($data_type == 'timeflow') ?
        '<div id="timeflow-axis-labels-container" class="timeflow-axis-labels-container"></div>' .
        '<div id="timeflow-gridlines-labels-container" class="timeflow-gridlines-labels-container"></div>' :
        '\'<div id="timeflow-axis-labels-container" class="timeflow-axis-labels-container"></div>';
    $charts_list .= '</li>';

    // getting chart data
    $chart_data = [];
    $chart_data_result = $pdo->query("SELECT * FROM timeflow_chart_data WHERE chart_id = {$row['id']}");
    while ($data_row = $chart_data_result->fetch(PDO::FETCH_ASSOC)) {
        $chart_data [] = $data_row['value'];
    }

    $chart_config = json_encode(array(
        "chart_data" => $chart_data,
        "field" => 42,
    ));
    $js .= "new Chart(undefined, $chart_config).draw();";

    $i++;
}

$body_class_list = 'dashboard-page';
$stylesheets .= '<link href="css/dashboard.css" rel="stylesheet" />';

$content .= <<<EOD
<div class='container dashboard-container'>
  <aside class="sidebar">
    <ul class="side-nav">
        <li><a href="dashboard.php">Dashboard</a></li>
        <li><h4><span class="plus-icon"></span>My charts</h4>
            
EOD;

if ($chart_names_list) {
    $content .= '<ul class="user-charts-nav">' . $chart_names_list . '</ul>';
}
$content .= <<<EOD
        </li>
    </ul>
    <a href="add.php" class="btn">Add chart</a>
  </aside>
  <section class="dashboard">
EOD;
if ($charts_list) {
    $content .= "<ul class=\"charts-list\">" . $charts_list . '</ul>';
} else {
    $content .= '<p class="nothing-found-message">No charts to show yet :/ </p>';
}
$content .= <<<EOD
  </section>
</div>
<script src="chart_js/functions.js"></script>
<script src="chart_js/chart_object.js"></script>
<script src="chart_js/draw_chart.js"></script>
EOD;

$content .= "<script>$js</script>";
$content .= "<script src='js/dashboard.js'></script>";

include_once 'layout.php';

$pdo = null;