<?php

if ($_SERVER['REQUEST_METHOD'] === 'POST') {

    $cups_quantity = mysqli_real_escape_string($link, $_REQUEST['cups_quantity']);

    $sql = "UPDATE tea_cups SET quantity = '$cups_quantity' where tea_cups.date = '$today'";
    echo "<meta http-equiv='refresh' content='0'>";

    if (!mysqli_query($link, $sql)) {
        echo "ERROR: Could not be able to execute $sql. " . mysqli_error($link);
    }
}