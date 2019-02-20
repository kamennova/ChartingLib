<?php


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

function generate_default_data_table_rows($default_data)
{
    $default_data_table_rows = '';

    $points_num = count($default_data);

    for ($i = 0; $i < $points_num; $i++) {
        $default_data_table_rows .= "<tr>" .
            "<td><input class='table-input' type='date' id='timeflow-chart-breakpoint[$i]' name='timeflow_chart_breakpoint[$i]'></td>" .
            "<td><input class='table-input' type='number' value='$default_data[$i]' id='timeflow-chart-value[$i]' name='timeflow_chart_value[$i]'></td>" .
            "<td><input type='button' onclick='delete_data_input_row(this)' value='Delete' /></td>" . "</tr>";
    }

    return $default_data_table_rows;
}