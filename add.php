<?php

require_once 'connection.php';
require_once "Chart.php";
require_once 'add_functions.php';

$add_chart = new Chart;

$add_chart->default_data = [0, 5, 3, 9, 6, 2, 9, 4, 0];
$chart_points_num = count($add_chart->default_data);
$timeflow_start_point = date('Y-m-d', strtotime("-$chart_points_num days"));

//----

session_start();
if (!isset($_SESSION['logged_in']) || $_SESSION['logged_in'] !== true) {
    $is_disabled = 'disabled';
}

//----

//$body_class_list []= 'theme-classic';
$body_class_list [] = 'theme-bright';
//$body_class_list [] = 'theme-dark';

$stylesheets .= '<link rel="stylesheet" href="css/chart.css" type="text/css">' .
    '<link rel="stylesheet" href="css/chart_form.css" type="text/css">';

$content .= <<<EOD
    <div class="container">
    <div class='chart-form-container col-left'>
        <h1 class="page-title">Chart configuration</h1>
        <form class="chart-form" id="config-form" method="post" action="add_action.php">
        <section class="form-section main-info-fields">
            <p>
                <label for="chart_name">Name</label>
                <input type="text" name="chart_name" id="chart_name" class="form-field" value="My super chart">
            </p>
            <section class="chart-type-fieldset">
            <p class="fieldset-title">Data type</p>
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
            </section>
            <p>
                <label for="chart-type-id">Visual representation</label>
                <select class="form-field" name="chart_type_id" id="chart-type-id">
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
                    <div class="collapsible-header form-section-header">
                        <h2 class="form-section-title">Vertical axis</h2>
                    </div>
                    <div class="form-section-content">
                    <p>
                        <label for="chart_measure_id">Measure unit</label>
                        <select name="chart_measure_id" class="form-field" id="chart_measure_id">
EOD;
$content .= generate_options_list($pdo, 'measure', 'measure_name', 'cup');
$content .= <<<EOD
                        </select> or <input class="medium-input" type="text" name="chart_measure_name" placeholder="custom unit...">
                    </p>
                    <p>
                        <label for="vertical-axis-value-step">Value step</label>
                        <input type="number" name="vertical_axis_value_step" size="10" min="1" class="form-field smaller-input" id="vertical-axis-value-step" value="1">
                    </p>
                    <p>
                        <label for="vertical-axis-labels-step">Axis labels step</label>
                        <input type="number" name="vertical_axis_labels_step" size="10" min="1" class="form-field smaller-input" id="vertical-axis-labels-step" value="3">
                    </p>
                    </div>
                </section>
                <section class="collapsible collapsed form-section timeflow-axis-fields">
                    <div class="collapsible-header form-section-header">
                        <h2 class="form-section-title">Horizontal axis</h2>
                    </div>
                    <div class="form-section-content">
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
                            <label for="timeflow-step">Breakpoint step</label>    
                            <input class="form-field smaller-input" type="number" value="1" min="1" size='10' id="timeflow-step" name="timeflow_step">
                            <select name="timeflow_measure_id" id="timeflow-measure-id">
EOD;
$content .= generate_options_list($pdo, 'timeflow_measure', 'measure_name', 'day', 'measure_name');
$content .= <<<EOD
                        </select>
                    </fieldset>
                    
                    <fieldset class="measure-fields-wrapper">
                        <label for="timeflow-labels-step">Axis labels step</label>
                        <input type="number" name="timeflow_labels_step" min="1" size="10" class="form-field smaller-input" id="timeflow-labels-step" value="1">
                        <select name="timeflow_labels_measure_id" id="timeflow-labels-measure-id">
EOD;
$content .= generate_options_list($pdo, 'timeflow_measure', 'measure_name', 'day', 'measure_name');
$content .= <<<EOD
                        </select>
                    </fieldset>
                    <p>
                        <label for="timeflow-start-point">Show breakpoints since</label>
                        <input type="number" name="timeflow_start_point" class="form-field smaller-input" id="timeflow-start-point" value="9"> 
                        <span class="timeflow-measure"></span>s ago  
                        <!--<input type="date" id='timeflow-start-point' value="$timeflow_start_point" >-->
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
                    </div>
             </section>
             </section>
             <section class="form-section style-fields collapsed collapsible">
                <div class="collapsible-header form-section-header">
                    <h2 class="form-section-title">Style</h2>
                </div>
                <div class="form-section-content">
                <section class="inline">
                    <p class="fieldset-title">Line sickness</p>
                    <div class="form-field-slider medium-input" id="line-sickness-slider"></div>
                    <input type="number" class="form-field line-width-input smaller-input visually-hidden" id="line-width-input" value="2" min="1" max="20" />
                    
                </section>
                <section class="inline">
                    <p class="fieldset-title">Breakpoints distance</p>
                    <div class="form-field-slider medium-input" id="point-distance-slider"></div>
                    <input type="number" class="form-field point-dist-input smaller-input visually-hidden" id="point-dist-input" value="60" min="2" max="300" />    
                </section>
                <p class="colorpicker-input-container">
                   <label for="line-colour"> Line colour </label>
                   <input type="text" class="form-field minicolors-input medium-input" id="line-colour-input" />                   
                </p>
                <p class="colorpicker-input-container"> 
                   <label for="fill-colour"> Fill colour </label>
                   <input type="text" class="form-field minicolors-input medium-input" id="fill-colour-input" />   
                </p>
                <section class="points-fields">
                    <p class="show-points-input">
                        <label class="input-option-label" id="show-breakpoints-label">
                        <input class="visually-hidden" id="show-breakpoints" type="checkbox" checked>
                        <span class="checkbox-indicator"></span>
                        Show points 
                        </label>               
                    </p>
                    <section class="point-radius inline">
                        <p class="fieldset-title">Point radius</p>
                        <div class="form-field-slider medium-input" id="point-radius-slider"></div>
                        <input type="number" class="form-field point-radius-input smaller-input visually-hidden" id="point-radius-input" min="1" value="3" />
                    </section>
                    <!--<p class="point-border-">-->
                        <!--<input type="number" class="point-border-radius-input smaller-input" id="point-border-radius-input" min="0" value="5" />-->
                    <!--</p>-->
                </section>
                <section class="bar-chart-fields">
                    <section class="inline">
                        <h3 class="fieldset-title">Bar width</h3>
                        <div class="form-field-slider medium-input" id="bar-width-slider-slider"></div>
                        <input type="number" class="form-field bar-width-input smaller-input visually-hidden" id="bar-width-input" min="1" max="100" value="45" />
                    </section>
                    <section class="inline">
                        <h3 class="fieldset-title">Bar border radius</h3>
                        <div class="form-field-slider medium-input" id="bar-border-radius-slider"></div>
                        <input type="number" class="form-field bar-border-radius-input smaller-input visually-hidden" id="bar-border-radius-input" min="0" value="5" />
                    </section>                    
                </section> 
                <section class="curve-chart-fields">
                    <section class="inline">
                        <h3 class="fieldset-title">Smoothing</h3>
                        <div class="form-field-slider medium-input" id="smoothing-slider"></div>
                        <input type="number" class="form-field smoothing-input smaller-input visually-hidden" id="smoothing-input" min="1" max="30" value="2" />
                    </section>                    
                </section> 
                </div>
             </section>
            <button class="btn btn-save $is_disabled" type="submit" id="submit-btn">Save</button>
            <a class="btn" href="add.php">Reset</a>
        </form>
    </div>
    <div class="col-right">
        <div class="chart-wrapper">
            <div id="vertical-axis-labels-container" class="vertical-axis-labels-container axis-labels-container"></div>
            <div class="chart-canvas-wrapper">
                <canvas id="chart-canvas" height="400px" width="1400px"></canvas>
            </div>
            <div id="timeflow-axis-labels-container" class="timeflow-axis-labels-container horizontal-axis-labels-container axis-labels-container"></div>
            <div id="timeflow-gridlines-labels-container" class="timeflow-gridlines-labels-container"></div>
        </div>
        <section class="chart-data-input">
           <section class="manual-data-input">
             <form class="chart-data-input-form" id="data-form" method="post">        
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
$content .= generate_default_data_table_rows($add_chart->default_data);
$content .= <<<EOD
                    </tbody>
                    </table>
                    <a class="show-more-rows-link" onclick="show_more_rows()">Show <span class="rows-to-show-count"></span>more breakpoints</a>
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
