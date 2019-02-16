<?php

require_once 'connection.php';

try {
    $pdo = new PDO("mysql:host=" . DB_SERVER . ";dbname=" . DB_NAME, DB_USERNAME, DB_PASSWORD);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    die("ERROR: Could not connect. " . $e->getMessage());
}


function generate_options_list($link, $table_name, $value_name, $default_value = false, $option_id = false)
{
    $options_list = '';
    $options_query = "SELECT * FROM {$table_name} ORDER BY id";

    if ($options_result = $link->query($options_query)) {
        $default_value = str_replace('_', ' ', $default_value);

        while ($row = $options_result->fetch(PDO::FETCH_ASSOC)) {
            $selected = (($row[$value_name] == $default_value) ? 'selected' : null);
            $id = ($option_id) ? "id = '" . str_replace(' ', '_', $row[$option_id]) . "'" : null;
            $options_list .= '<option value=' . $row['id'] . " $id $selected>" . $row[$value_name] . '</option>';
        }
    } else {
        echo "ERROR: Could not be able to execute $options_query. " . mysqli_error($link);
    }

    return $options_list;
}

function generate_options_from_arr($arr, $option_id = false)
{
    $options_list = '';
    foreach ($arr as $item) {
        $id = ($option_id) ? "id = '" . str_replace(' ', '_', $item) . "'" : null;
        $options_list .= '<option value=' . $item . " $id>" . $item . '</option>';
    }

    return $options_list;
}

function generate_default_data_table_rows()
{
    $default_data_table_rows = '';
    $default_data = [2, 5, 3, 9, 6, 2, 9];

    for ($i = 0; $i < 7; $i++) {
        $default_data_table_rows .= "<tr>" .
            "<td><input class='table-input' type='date' id='timeflow-chart-breakpoint[$i]' name='timeflow_chart_breakpoint[$i]'></td>" .
            "<td><input class='table-input' type='number' value='$default_data[$i]' id='timeflow-chart-value[$i]' name='timeflow_chart_value[$i]'></td>" .
            "<td><input type='button' onclick='delete_data_input_row(this)' value='Delete' /></td>" . "</tr>";
    }

    return $default_data_table_rows;
}

$timeflow_start_point = date('Y-m-d', strtotime('-1 week'));

?>

<?php

//$body_class_list .= 'theme-dark';

$content .= <<<EOD
    <link rel="stylesheet" href="css/chart_form.css" type="text/css">
    <div class="container">
    <div class='chart-form-container col-left'>
        <h1 class="page-title">Chart configuration</h1>
        <form class="chart-form" method="post">
        <section class="form-section main-info-fields">
            <p>
                <label for="chart_name">Name</label>
                <input type="text" name="chart_name" id="chart_name" value="My super chart">
            </p>
            <fieldset>
             <legend class="fieldset-title">Data type</legend>
            <ul class="axis-type-options options-list">
                        <li>
                        <label class="input-option-label"><input type="radio" class="visually-hidden" id="timeflow_axis" name="horizontal_axis_type" value="timeflow" checked>
                               <span class="radio-indicator"></span>Timeflow</label>
                        </li>
                        <li>
                        <label class="input-option-label"><input type="radio" class="visually-hidden" id="category_axis" name="horizontal_axis_type" value="category">
                                <span class="radio-indicator"></span>Category</label>
                        </li>
            </ul>
            </fieldset>
            <p>
                <label for="chart-type-id">Visual representation</label>
                <select name="chart-type-id" id="chart-type-id">
EOD;
$content .= generate_options_list($pdo, 'chart_type', 'type_name', 'curve_chart', 'type_name');
$content .= <<<EOD
                </select>
            </p>
            </section>
            <section class="pie-chart-fields" id="pie-chart-fields">
                <table class="pie-chart-data data-input-table">
                    <thead>
                        <tr>
                            <td>Category name</td>
                            <td>Percentage</td>
                        </tr>                    
                    </thead>
                    <tbody>
                        <tr>
                            <td><input class="table-input" type="text" name="pie_chart_category_name"></td>
                            <td><input class="table-input" type="number" name="pie_chart_category_percentage"></td>
                        </tr>
                    </tbody>
                </table>
            </section>
            <section class="plane-chart-fields" id="plane-chart-fields">
                <section class="collapsible collapsed form-section vertical-axis-fields">
                    <h2 class="collapsible-title form-section-title">Vertical axis</h2>
                    <p>
                        <label for="chart_measure_id">Measure unit</label>
                        <select name="chart_measure_id" id="chart_measure_id">
EOD;
$content .= generate_options_list($pdo, 'measure', 'measure_name', 'cup');
$content .= <<<EOD
                        </select> or <input class="medium-input" type="text" name="chart_measure_name" placeholder="custom unit...">
                    </p>
                    <p>
                        <label for="measure-value-step">Value step</label>
                        <input type="number" name="measure-value-step" size="10" min="1" class="smaller-input" id="measure-value-step" value="1">
                    </p>
                    <p>
                        <label for="vertical-axis-labels-step">Axis labels step</label>
                        <input type="number" name="vertical-axis-labels-step" size="10" min="1" class="smaller-input" id="vertical-axis-labels-step" value="2">
                    </p>
                </section>
                <section class="collapsible collapsed form-section timeflow-axis-fields">
                    <h2 class="collapsible-title form-section-title">Horizontal axis</h2>
                    <section class="horizontal_axis_options_fields" id="category_axis_options_fields">
                    category axis fields coming soon...
                        <!--<select name="chart_type_id" id="chart_type_id">-->
EOD;
//$content .= generate_options_list($linl, 'category', 'category_name');
$content .= <<<EOD
                        <!--</select>-->
                 </section>
                 <section class="horizontal_axis_options_fields" id="timeflow_axis_options_fields">
                    <fieldset class="measure-fields-wrapper">
                            <!--<label for="timeflow_measure_id">Timeflow measure</label>-->
                            <label for="timeflow-step">Value step</label>    
                            <input class="smaller-input" type="number" value="1" min="1" size='10' id="timeflow-step" name="timeflow_step">
                            <select name="timeflow_measure_id" id="timeflow-measure-id">
EOD;
$content .= generate_options_list($pdo, 'timeflow_measure', 'measure_name', 'day', 'measure_name');
$content .= <<<EOD
                        </select>
                    </fieldset>
                    
                        <fieldset class="measure-fields-wrapper">
                            <label for="timeflow-axis-labels-step">Axis labels step</label>
                            <input type="number" name="timeflow_axis_labels_step" min="1" size="10" class="smaller-input" id="timeflow-axis-labels-step" value="1">
                            <select name="timeflow_axis_labels_measure_id" id="timeflow-axis-labels-measure-id">
EOD;
$content .= generate_options_list($pdo, 'timeflow_measure', 'measure_name', 'day', 'measure_name');
$content .= <<<EOD
                        </select>
                        </fieldset>
                        <p>
                            <label for="timeflow-start-point">Axis labels start point</label>  
                            <input type="date" id='timeflow-start-point' value="$timeflow_start_point" >
                        </p>                       
                        <p class="checkbox-field-wrapper">
                            <label class="input-option-label" id="breakpoints-per-unit-label">
                            <input class="visually-hidden" id="breakpoints-per-unit" type="checkbox" value='1' checked>
                            <span class="checkbox-indicator"></span>
                            1 breakpoint per step 
                            <!--<span id="timeflow-measure-display"></span> -->
                            </label>                         
                        </p>
                        <!--</fieldset>-->
                </section>
             </section>
             </section>
             <section class="form-section collapsible">
                <h2 class="form-section-title collapsible-title">Style</h2>
                <p>
                    <label>Line sickness</label>
                    <input type="number" class="line-width-input smaller-input" id="line-width-input" value="2" min="1" />
                </p>
                <p>
                    <label>Points distance</label>
                    <input type="number" class="points-dist-input smaller-input" id="points-dist-input" value="60" min="0" />
                </p>
                <p class="colorpicker-input-container">
                   <label for="line-colour"> Line colour </label>
                   <input type="text" class="minicolors-input" id="line-colour-input" />                   
                </p>
                <p class="colorpicker-input-container"> 
                   <label for="fill-colour"> Fill colour </label>
                   <input type="text" class="minicolors-input" id="fill-colour-input" />   
                </p>
                <section class="bar-chart-fields">
                    <p>
                        <label>Bar width</label>
                        <input type="number" class="bar-width-input smaller-input" id="bar-width-input" min="1" value="45" />
                    </p>
                    <p>
                        <label>Bar border radius</label>
                        <input type="number" class="bar-border-radius-input smaller-input" id="bar-border-radius-input" min="0" value="5" />
                    </p>                    
                </section> 
                <section class="curve-chart-fields">
                    <p>
                        <label>Smoothing</label>
                        <input type="number" class="smoothing-input smaller-input" id="smoothing-input" min="1" value="2" />
                    </p>                    
                </section> 
                
             </section>
            <a class="btn" href="add.php">Reset to default</a>
        </form>
    </div>
    <div class="col-right">
        <div class="chart-wrapper">
            <div id="vertical-axis-labels-container" class="vertical-axis-labels-container"></div>
            <div class="chart-canvas-wrapper">
                <canvas id="chart-canvas" height="400px" width="1400px"></canvas>
            </div>
            <div id="timeflow-axis-labels-container" class="timeflow-axis-labels-container"></div>
            <div id="timeflow-gridlines-labels-container" class="timeflow-gridlines-labels-container"></div>
        </div>
        <section class="chart-data-input">
           <section class="manual-data-input">
             <form class="chart-data-input-form" method="post">        
                    <h2 class="form-section-title">Enter some data</h2>
                    <table class="plane-chart-data-input data-input-table" id="timeflow-chart-data-input">
                    <thead>
                        <tr>
                            <td>Breakpoint</td>
                            <td>Value</td>
                            <td>Actions</td>
                        </tr>                    
                    </thead>
                    <tbody id="timeflow-chart-data-input-tbody" class="timeflow-chart-data-input-tbody">
EOD;
$content .= generate_default_data_table_rows();
$content .= <<<EOD
                    </tbody>
                    </table>
                    <button type="button" onclick="add_data_input_row(this)" class="btn add-data-row-btn btn-add" id="add-data-row-btn">Add point</button>
            </form>
</section>
EOD;
include_once 'upload.php';
$content .= <<<EOD
    <section class="data-file-upload">
        <h2 class="form-section-title">Upload data table</h2>
        <p class="hint">File extension should be .csv; please make sure table delimiter is ',' (comma)</p>
        <form class="chart-data-upload-form" enctype="multipart/form-data" method="post">
            <input type="hidden" name="max_file_size" value="3000000" />
            <input name="data_file" type="file" class="file-upload-input" />
            <input type='submit' class="btn btn-upload" value="Upload file" />
        </form>
        <p class="upload-message">$upload_message</p>
        $field_headers
EOD;

$content .= <<<EOD
        <form class="data-file-config-form" method="post">
        <section class="data-file-config">
        Choose field to monitor: 
        <select class="data-field-select" name="data-field" id="data-field">
EOD;

$content .= generate_options_from_arr($field_options, true);
$content .= <<<EOD
</select>
EOD;

include_once 'extract.php';

$content .= <<<EOD
<input type="submit" value="Go" />
</form>
</section>
<section class="debug-info">
$debug_info
</section>
    </section>            
 </section>
    </div>
   </div>

<script src="chart_js/functions.js"></script>
<script src="chart_js/chart_object.js"></script>
<script src="chart_js/configurable.js"></script>
<script src="chart_js/chart_form.js"></script>
<script src="chart_js/chart_data.js"></script>
<script src="chart_js/draw_chart.js"></script>
<script src="chart_js/add.js"></script>

EOD;

?>
<?php mysqli_close($link); ?>
<?php require_once 'layout.php'; ?>
