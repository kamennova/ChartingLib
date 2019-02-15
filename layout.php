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
    <link rel="stylesheet" href="css/style.css">

    <link rel="stylesheet" href="plugins/jquery-minicolors/jquery.minicolors.css">
    <?= isset($stylesheets) ? $stylesheets : null ?>

    <script src="https://code.jquery.com/jquery-3.2.1.slim.min.js"
            integrity="sha384-KJ3o2DKtIkvYIK3UENzmM7KCkRr/rE9/Qpg6aAZGJwFDMVNA/GpGFF93hXpG5KkN"
            crossorigin="anonymous"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.12.9/umd/popper.min.js"
            integrity="sha384-ApNbgh9B+Y1QKtv3Rn7W3mgPxhU9K/ScQsAP7hUibX39j7fakFPskvXusvfa0b4Q"
            crossorigin="anonymous"></script>
    <script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/js/bootstrap.min.js"
            integrity="sha384-JZR6Spejh4U02d8jOt6vLEHfe/JQGiRRSQQxSfFWpi1MquVdAyjUar5+76PVCmYl"
            crossorigin="anonymous"></script>
    <script src="plugins/jquery-minicolors/jquery.minicolors.min.js"></script>
</head>
<body <?= isset($body_class_list) ? "class='$body_class_list'" : null ?>>
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
                    echo '<li><a class="logout-link" href="logout.php">Log out</a></li>';
                } ?>
            </ul>
        </div>
    </header>

    <main>
        <?= $content ?>
    </main>

    <footer class="main-footer">
        <!--        <ul class="footer-nav">-->
        <!--            <li><a href="wishlist.php">Wishlist</a></li>-->
        <!--            <li><a href="#">TODO</a></li>-->
        <!--            <li><a href="#">Customize</a></li>-->
        <!--            <li><a href="#">Invite</a></li>-->
        <!--        </ul>-->
    </footer>

    <script src="js/script.js"></script>

</div>
</body>

</html>