<?php

header('location: /add.php');
exit;

require_once 'connection.php';
$link = mysqli_connect($host, $user, $password, $database) or die("Error: " . mysqli_error($link));

//-------Stats output------

$chart_max_value = 6;
$chart_columns_number = 7;
$chart_sizing = 30; // px per grades between divider hr
$chart_grading = 2; // value step

date_default_timezone_set('Europe/Kiev');
//date_default_timezone_set('Asia/Barnaul');
//echo date('d h:i:s A');

$today = date('Y-m-d');

$today_record = "SELECT * FROM tea_cups WHERE tea_cups.date = '$today'";

$result = mysqli_query($link, $today_record);

if ($result->num_rows == 0) {
    $add_today_record = mysqli_query($link, "INSERT INTO tea_cups(date, quantity) VALUES ('$today', '0')");

    if (!mysqli_query($link, $add_today_record)) {
        echo "ERROR: Could not be able to execute $add_today_record. " . mysqli_error($link);
    }
}

$tea_cups_query = "SELECT * FROM (SELECT * FROM tea_cups ORDER BY date DESC LIMIT {$chart_columns_number}) tmp ORDER by tmp.date ASC";
$tea_cups_result = mysqli_query($link, $tea_cups_query) or die("Error: " . mysqli_error($link));

$tea_cups_chart = '';
$tea_cups_chart_labels = '';

for ($i = 0; $i <= $chart_max_value; $i += $chart_grading) {
    $divider_grading = $i * $chart_sizing;
    $tea_cups_chart .= "<hr class='chart-grading' style='bottom: {$divider_grading}px' />" .
        ($i === 0 ? '' : "<span class='chart-grading-label' style='bottom: {$divider_grading}px'>$i</span>");
}

while ($row = mysqli_fetch_assoc($tea_cups_result)) {
    $column_height = $chart_sizing * $row['quantity'];
    $tea_cups_chart .= "<div class='chart-column' style='height: {$column_height}px' ></div>";

    if ($row['date'] == date('Y-m-d')) {
        $label_content = 'Today';
    } else {
        $label_content = date('D jS', strtotime($row['date']));
    }
    $tea_cups_chart_labels .= "<label class='chart-label'>" . $label_content . '</label>';
}

//---line chart---

mysqli_data_seek($tea_cups_result, 0);

$chart_col_width = 45;
$chart_cols_dist = 15;

$chart_points_dist = $chart_col_width + $chart_cols_dist;
$chart_left_padding = 30 + $chart_col_width / 2;
$canvas_height = 200;

$line_chart_js = "var canvas = document.getElementById('example-canvas'); if (canvas.getContext) {var ctx = canvas.getContext('2d'); ctx.lineWidth = 2; ctx.beginPath();";
$line_chart_labels = '';

$i = 0;

while ($row = mysqli_fetch_assoc($tea_cups_result)) {

    $column_height = $canvas_height - $chart_sizing * $row['quantity'];

    if ($i == 0) {
        $line_chart_js .= "ctx.moveTo($chart_left_padding, $column_height);";
        $line_chart_js .= "ctx.arc($chart_left_padding, $column_height, 5, 0, Math.PI * 2, true);";
        $line_chart_js .= "ctx.lineTo($chart_left_padding + 5, $column_height);";
    } else {
        $line_chart_js .= "ctx.lineTo($chart_points_dist * $i + $chart_left_padding - 5, $column_height);";
        $line_chart_js .= "ctx.arc($chart_points_dist * $i + $chart_left_padding, $column_height, 5, 0, Math.PI * 2, true);";
        $line_chart_js .= "ctx.lineTo($chart_points_dist * $i + $chart_left_padding + 5, $column_height);";
    }

    if ($row['date'] == date('Y-m-d')) {
        $label_content = 'Today';
    } else {
        $label_content = date('D jS', strtotime($row['date']));
    }
    $line_chart_labels .= "<label class='chart-label'>" . $label_content . '</label>';

    $i++;
}

$line_chart_js .= "ctx.stroke();}";


//--------

$content = <<< EOD

<div class="container row">
  <div class="col-sm-4">
    <section class="stats">
       <section class="tea-cups-daily-stats bar-chart basic-style">
           <h2 class="section-title">Tea cups daily</h2>
           <div class='chart-container column-chart'>$tea_cups_chart</div>
           <div class="labels-container">$tea_cups_chart_labels</div>
           </section>
          </section>
          </div>
          <div class="col-sm-4">
           <section class="bar-chart style-2">
                <h2 class="section-title">Style 2</h2>
           <div class='chart-container column-chart'>$tea_cups_chart</div>
           <div class="labels-container">$tea_cups_chart_labels</div>
</section>
</div>
<div class="col-sm-4">
           <section class="bar-chart style-3">
                <h2 class="section-title">Style 3</h2>
           <div class='chart-container column-chart'>$tea_cups_chart</div>
           <div class="labels-container">$tea_cups_chart_labels</div>
</section>
</div>


EOD;

include 'insert.php';

$content .= <<< EOD
<div class="col-sm-4">
 <section class="line-chart basic-style">
 <h2 class="section-title">Line chart. Basic style</h2>
 <canvas id="example-canvas" width="500" height="200">message</canvas>
 <div class="labels-container">$line_chart_labels</div>
</section>
</div>
<div class="col-sm-4">
<section class="line-chart style-2">
<h2 class="section-title">Line chart. Style 2</h2>
 <canvas id="line-chart-canvas-style-2" width="500" height="200">message</canvas>
 <div class="labels-container">$line_chart_labels</div>
</div>
<form method="post">
    <p>
        <label class="label-add" for="cups_quantity"><span class="visually-hidden">+1 cup</span></label>
        <!--<input type="hidden" name="cups_quantity" id="cups_quantity">-->
        <input type="number" name="cups_quantity" id="cups_quantity" onchange="this.form.submit()">
    </p>
    <!--<input type="submit" value="Submit">-->
</form>
    </section>
    <a class="btn" href="add.php">Add chart</a>
  </div>
</div><script>$line_chart_js</script>              
EOD;


?>


<?php mysqli_close($link); ?>
<?php require_once 'layout.php'; ?>