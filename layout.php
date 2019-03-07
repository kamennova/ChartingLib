<?php if (isset($body_class_list)) {
    $body_classes = '';
    foreach ($body_class_list as $body_class) {

        if(strpos($body_class, 'theme') !== false){
            // theme name is 'theme-xyz'
            $theme_name = substr($body_class, 6);

            $theme_stylesheets = "<link rel='stylesheet' href='css/themes/$theme_name.css' />";
        }

        $body_classes .= $body_class . ' ';
    }
}

?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset
    "UTF-8">
    <title><?= isset($title) ? $title : 'My stats' ?></title>
    <link href="https://fonts.googleapis.com/css?family=Lato:300,400,500,700|Varela+Round" rel="stylesheet">
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css"
          integrity="sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm" crossorigin="anonymous">
    <link rel="stylesheet" href="css/normalize.css">

    <link rel="stylesheet" href="plugins/jquery-minicolors/jquery.minicolors.css">
    <link rel="stylesheet" href="css/style.css">

    <?= isset($stylesheets) ? $stylesheets : null ?>
    <?= $theme_stylesheets ?>

    <link rel="stylesheet" href="https://ajax.googleapis.com/ajax/libs/jqueryui/1.11.4/themes/smoothness/jquery-ui.css" type="text/css">

    <script src="https://ajax.googleapis.com/ajax/libs/jquery/2.1.4/jquery.min.js" type="text/javascript"></script>
    <script src="https://ajax.googleapis.com/ajax/libs/jqueryui/1.11.4/jquery-ui.min.js"></script>

    <script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/js/bootstrap.min.js"
            integrity="sha384-JZR6Spejh4U02d8jOt6vLEHfe/JQGiRRSQQxSfFWpi1MquVdAyjUar5+76PVCmYl"
            crossorigin="anonymous"></script>
    <script src="plugins/jquery-minicolors/jquery.minicolors.min.js"></script>
</head>

<body class='<?= $body_classes ?>'>
<div class="site-wrapper">
    <header class="main-header">
        <div class="container">
            <nav class="user-nav visually-hidden">
                <div class="user-thumbnail">
                    <img src="img/thumbnail.png"/>
                </div>
                <p class="greeting">Welcome, Masha</p>
            </nav>

            <a class="logo header-logo" href="index.php">
                <span class="logo-pic">
                    <span class="bar bar-1"></span>
                    <span class="bar bar-2"></span>
                    <span class="bar bar-3"></span>
                    <span class="bar bar-4"></span>
                </span>
                My stats
            </a>
            <ul class="site-links">
                <li><a class="theme-settings-link" href="#">Theme</a></li>

                <?php session_start();
                if (!isset($_SESSION['logged_in']) || $_SESSION['logged_in'] !== true) {
//<!--             unlogged user menu-->
                    echo '<li><a class="login-link" href="login.php">Log in</a></li>';
                } else {
//<!--                logged in user menu-->
                    echo '<li><a class="dashboard-link" href="dashboard.php">Dashboard</a></li>';
                    echo '<li><a class="logout-link" href="logout.php">Log out</a></li>';
                } ?>
            </ul>
        </div>
    </header>

    <main>
        <?= $content ?>
    </main>

    <script src="js/script.js"></script>
</div>
</body>

</html>