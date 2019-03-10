<?php

require_once 'add_functions.php';

$stylesheets .= '<link rel="stylesheet" href="css/chart.css" type="text/css">' .
    '<link rel="stylesheet" href="css/chart_form.css" type="text/css">';

ob_start(); ?>

    <div class="container">
        <div class="sidebar-nav-panel">
            <ul class="sidebar-tabs">
                <li class="configurations-tab"><span></span></li>
                <li class="data-tab"><span></span></li>
            </ul>
        </div>
        <aside class='chart-form-container sidebar hidden'>
            <header class="sidebar-header">
                <span class="configuration-icon"></span>
                <h2 class="page-title chart-name">My super chart</h2>
            </header>
            <!--            <h1 class="page-title">My super chart</h1>-->
            <form class="chart-form" id="config-form" method="post" action="add_action.php">
                <section class="form-section main-info-fields">
                    <p style="display: none">
                        <label for="chart_name">Name</label>
                        <input type="text" name="chart_name" id="chart_name" class="form-field" value="My super chart">
                    </p>
                    <section class="chart-type-fieldset">
                        <p class="fieldset-title">Data type</p>
                        <ul class="axis-type-options options-list">
                            <li>
                                <label class="input-option-label">
                                    <input type="radio" class="visually-hidden" id="timeflow_axis"
                                           name="horizontal_axis_type" value="timeflow" checked>
                                    <span class="radio-indicator"></span>Timeflow</label>
                            </li>
                            <li>
                                <label class="input-option-label"><input type="radio" class="visually-hidden"
                                                                         id="category_axis" name="horizontal_axis_type"
                                                                         value="category">
                                    <span class="radio-indicator"></span>Category</label>
                            </li>
                        </ul>
                    </section>
                    <p>
                        <label for="chart-type-id">Visual representation</label>
                        <select class="form-field" name="chart_type_id" id="chart-type-id">
                            <?= generate_options_list($pdo, 'chart_type', 'type_name', 'curve_chart', 'type_name'); ?>

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

                                    <?= generate_options_list($pdo, 'measure', 'measure_name', 'cup'); ?>

                                </select> or <input class="medium-input" type="text" name="chart_measure_name"
                                                    placeholder="custom unit...">
                            </p>
                            <p>
                                <label for="vertical-axis-value-step">Value step</label>
                                <input type="number" name="vertical_axis_value_step" size="10" min="1"
                                       class="form-field smaller-input" id="vertical-axis-value-step">
                            </p>
                            <p>
                                <label for="vertical-axis-labels-step">Axis labels step</label>
                                <input type="number" name="vertical_axis_labels_step" size="10" min="1"
                                       class="form-field smaller-input" id="vertical-axis-labels-step">
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

                                //$content .= generate_options_list($linl, 'category', 'category_name');
                                <!--</select>-->
                            </section>
                            <section class="horizontal_axis_options_fields" id="timeflow_axis_options_fields">
                                <fieldset class="measure-fields-wrapper">
                                    <!--<label for="timeflow_measure_id">Timeflow measure</label>-->
                                    <label for="timeflow-step">Breakpoint step</label>
                                    <input class="form-field smaller-input" type="number" min="1" size='10'
                                           id="timeflow-step" name="timeflow_step">
                                    <select name="timeflow_measure_id" id="timeflow-measure-id">

                                        <?= generate_options_list($pdo, 'timeflow_measure', 'measure_name', 'day', 'measure_name'); ?>

                                    </select>
                                </fieldset>

                                <fieldset class="measure-fields-wrapper">
                                    <label for="timeflow-labels-step">Axis labels step</label>
                                    <input type="number" name="timeflow_labels_step" min="1" size="10"
                                           class="form-field smaller-input" id="timeflow-labels-step">
                                    <select name="timeflow_labels_measure_id" id="timeflow-labels-measure-id">

                                        <?= generate_options_list($pdo, 'timeflow_measure', 'measure_name', 'day', 'measure_name'); ?>

                                    </select>
                                </fieldset>
                                <p>
                                    <label for="show-since-steps-ago">Show breakpoints since</label>
                                    <input type="number" name="show_since_steps_ago" class="form-field smaller-input"
                                           id="show-since-steps-ago">
                                    <span class="timeflow-measure"></span>s ago
                                </p>
                                <p class="checkbox-field-wrapper">
                                    <label class="input-option-label" id="breakpoints-per-unit-label">
                                        <input class="visually-hidden" id="breakpoints-per-unit" type="checkbox"
                                               value='1'
                                               checked>
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
                <section class="form-section style-fields collapsible">
                    <div class="collapsible-header form-section-header">
                        <h2 class="form-section-title">Style</h2>
                    </div>
                    <div class="form-section-content">
                        <h3 class="fields-title">Distances</h3>
                        <div class="inline two-col-section">

                            <div class="col-left">
                                <p class="fieldset-title">Value</p>
                                <div class="form-field-slider medium-input" id="value-distance-slider"></div>
                                <input type="hidden" class="form-field value-dist-input smaller-input visually-hidden"
                                       id="value-dist-input"/>
                            </div>
                            <div class="col-right">
                                <p class="fieldset-title">Breakpoints</p>
                                <div class="form-field-slider medium-input" id="point-distance-slider"></div>
                                <input type="hidden" class="form-field point-dist-input smaller-input visually-hidden"
                                       id="point-dist-input"/>
                            </div>
                        </div>

                        <section class="chart-colours inline two-col-section">
                            <div class="col-left">
                                <p class="fieldset-title">Line sickness</p>
                                <div class="form-field-slider medium-input" id="line-sickness-slider"></div>
                                <input type="hidden" class="form-field line-width-input smaller-input visually-hidden"
                                       id="line-width-input"/>
                            </div>
                            <div class="col-right">
                                <p class="colorpicker-input-container">
                                    <label class="fieldset-title" for="line-colour-input"> Line colour </label>
                                    <input type="text" class="form-field minicolors-input medium-input"
                                           id="line-colour-input"/>
                                </p>
                            </div>
                        </section>

                        <section class="chart-colours inline two-col-section">
                            <!--                            <div class="col-left">-->
                            <!--                                <p class="colorpicker-input-container">-->
                            <!--                                    <label class="fieldset-title" for="line-colour-input"> Line colour </label>-->
                            <!--                                    <input type="text" class="form-field minicolors-input medium-input"-->
                            <!--                                           id="line-colour-input"/>-->
                            <!--                                </p>-->
                            <!--                            </div>-->
                            <div class="col-right">
                                <p class="colorpicker-input-container">
                                    <label class="fieldset-title" for="fill-colour-input"> Fill colour </label>
                                    <input type="text" class="form-field minicolors-input medium-input"
                                           id="fill-colour-input"/>
                                </p>
                            </div>

                        </section>


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
                                <input type="hidden" class="form-field point-radius-input smaller-input visually-hidden"
                                       id="point-radius-input"/>
                            </section>
                            <!--<p class="point-border-">-->
                            <!--<input type="number" class="point-border-radius-input smaller-input" id="point-border-radius-input" min="0" value="5" />-->
                            <!--</p>-->
                        </section>
                        <section class="bar-chart-fields">
                            <section class="inline">
                                <h3 class="fieldset-title">Bar width</h3>
                                <div class="form-field-slider medium-input" id="bar-width-slider-slider"></div>
                                <input type="hidden" class="form-field bar-width-input smaller-input visually-hidden"
                                       id="bar-width-input"/>
                            </section>
                            <section class="inline">
                                <h3 class="fieldset-title">Bar border radius</h3>
                                <div class="form-field-slider medium-input" id="bar-border-radius-slider"></div>
                                <input type="hidden"
                                       class="form-field bar-border-radius-input smaller-input visually-hidden"
                                       id="bar-border-radius-input"/>
                            </section>
                        </section>
                        <section class="curve-chart-fields">
                            <section class="inline">
                                <h3 class="fieldset-title">Smoothing</h3>
                                <div class="form-field-slider medium-input" id="smoothing-slider"></div>
                                <input type="hidden" class="form-field smoothing-input smaller-input visually-hidden"
                                       id="smoothing-input"/>
                            </section>
                        </section>
                    </div>
                </section>
                <button class="btn btn-save <?= $is_disabled ?>" type="submit" id="submit-btn">Save</button>
                <a class="btn" href="add.php">Reset</a>
            </form>
        </aside>
        <div class="col-right">
            <h2 class="chart-name"></h2>
            <div class="chart-wrapper">
                <div id="vertical-axis-labels-container"
                     class="vertical-axis-labels-container axis-labels-container"></div>
                <div class="chart-canvas-wrapper">
                    <canvas id="chart-canvas" height="400px" width="400px"></canvas>
                </div>
                <div id="timeflow-axis-labels-container"
                     class="timeflow-axis-labels-container horizontal-axis-labels-container axis-labels-container"></div>
                <div id="timeflow-gridlines-labels-container" class="timeflow-gridlines-labels-container"></div>
            </div>
            <div class="chart-preview-wrapper">
                <div class="hidden-area-container chart-area-container"></div>
                <div class="show-area-container chart-area-container">
                    <div class="area-border area-left-border" id="area-border-left"></div>
                    <div class="area-border area-right-border" id="area-border-right"></div>
                </div>
                <div class="hidden-area-container chart-area-container"></div>
                <canvas id="chart-preview-canvas" height="60px" width="400px"></canvas>
            </div>
            <section class="chart-data-input visually-hidden">
                <section class="manual-data-input">
                    <form class="chart-data-input-form" id="data-form" method="post">
                        <h2 class="form-section-title">Data table</h2>
                        <p class="inline">
                            <label>Default data</label>
                            <input type="number" name="default_data_num" id="default-data-num-input"/>
                        </p>
                        <table class="plane-chart-data-input data-input-table" id="timeflow-chart-data-input">
                            <thead>
                            <tr>
                                <td>Breakpoint</td>
                                <td>Value</td>
                                <td>Actions</td>
                            </tr>
                            </thead>
                            <tbody id="timeflow-chart-data-input-tbody" class="timeflow-chart-data-input-tbody">

                            <?= generate_default_data_table_rows($add_chart->default_data); ?>

                            </tbody>
                        </table>
                        <a class="show-more-rows-link" onclick="show_more_rows()">Show <span
                                    class="rows-to-show-count"></span>more breakpoints</a>
                        <button type="button" onclick="add_data_input_row(this)" class="btn add-data-row-btn btn-add"
                                id="add-data-row-btn">Add point
                        </button>
                    </form>
                </section>


                <?php include_once 'upload.php'; ?>

                <section class="data-file-upload">
                    <h2 class="form-section-title">Upload data table</h2>
                    <p class="hint">File extension should be .csv; please make sure table delimiter is ',' (comma)</p>
                    <form class="chart-data-upload-form" enctype="multipart/form-data" method="post">
                        <input type="hidden" name="max_file_size" value="3000000"/>
                        <input name="data_file" type="file" class="file-upload-input"/>
                        <input type='submit' class="btn btn-upload" value="Upload file"/>
                    </form>
                    <p class="upload-message"><?= $upload_message ?></p>
                    <?= $field_headers ?>
                    <form class="data-file-config-form" method="post">
                        <section class="data-file-config">
                            <label for="data-field">Choose field to monitor:</label>
                            <select class="data-field-select" name="data-field" id="data-field">

                                <?= generate_options_from_arr($field_options, true); ?>

                            </select>


                            <?php include_once 'extract.php'; ?>

                            <input type="submit" value="Go"/>
                    </form>
                </section>
                <section class="debug-info">
                    <?= $debug_info ?>
                </section>
            </section>
            <!--            </section>-->
        </div>
    </div>

<?php if ($chart_state === 'update') { ?>
    <script>let User_config = <?= $user_config ?></script>
    <?php ;
} ?>
    <script src="chart_js/default.js"></script>
    <script src="chart_js/functions.js"></script>
    <script src="chart_js/chart_object.js"></script>
    <script src="chart_js/configurable.js"></script>
    <script src="chart_js/chart_form.js"></script>
<!--    <script src="chart_js/chart_data.js"></script>-->
    <script src="chart_js/draw_chart.js"></script>
    <script src="chart_js/chart_preview.js"></script>
    <script src="chart_js/add.js"></script>


<?php
$content = ob_get_contents();
ob_end_clean();