<?php

session_start();

// redirecting logged in user to dashboard
if (isset($_SESSION['logged_in']) && $_SESSION['logged_in'] === true) {
    header("location: dashboard.php");
    exit;
}

require_once 'connection.php';

try {
    $pdo = new PDO("mysql:host=" . DB_SERVER . ";dbname=" . DB_NAME, DB_USERNAME, DB_PASSWORD);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    die("ERROR: Could not connect. " . $e->getMessage());
}

$user_email = $password = '';
$user_email_err = $password_err = '';

if ($_SERVER['REQUEST_METHOD'] == 'POST') {

    if (empty(trim($_POST['user_email']))) {
        $user_email_err = 'Please enter your email';
    } else {
        $user_email = trim($_POST['user_email']);
    }

    if (empty(trim($_POST['password']))) {
        $password_err = 'Please enter your password';
    } else {
        $password = trim($_POST['password']);
    }

    if (empty($user_email_err) && empty($password_err)) {
        $sql = "SELECT id, email, password_hash FROM users WHERE email = :email";

        if ($stmt = $pdo->prepare($sql)) {
            $stmt->bindParam(":email", $param_user_email, PDO::PARAM_STR);
            $param_user_email = trim($_POST['user_email']);

            if ($stmt->execute()) {
                if ($stmt->rowCount() === 1) {
                    if ($row = $stmt->fetch()) {
                        $id = $row['id'];
                        $user_email = $row['email'];
                        $password_hash = $row['password_hash'];

                        if (password_verify($password, $password_hash)) {
                            session_start();

                            $_SESSION['logged_in'] = true;
                            $_SESSION['id'] = $id;
                            $_SESSION['user_email'] = $user_email;

                            header("location: dashboard.php");
                        } else {
//                            echo 'hi';
                            $password_err = 'The password is not valid';
                        }
                    }
                } else {
                    $user_email_err = 'This account does not exist :(';
                }
            } else {
                echo "Oops. Something went wrong. Please try again later";
            }
        }

        unset($stmt);
    }
    unset($pdo);
}

$stylesheets .= '<link href="css/user-form.css" rel="stylesheet" />';

$content .= <<<EOD
<div class="container">
<div class="form-container login-form-container">
    <h1 class='page-title centered'>Log in</h1>
    <form class="login-form" method="post" action="
EOD;
$content .= htmlspecialchars($_SERVER['PHP_SELF']);
$content .= <<<EOD
        ">
        <p>
          <label for="user-email">Email</label><br>
          <input class="form-field" type="email" id="user-email" name="user_email" value="
EOD;
$content .= ($user_email) ? $user_email : null;
$content .= <<<EOD
" />
          <p class="error">$user_email_err</p>
        </p>
        <p>
          <label for="password">Password</label><br>
          <input class="form-field" type="password" id="password" name="password" />
          <p class="error">$password_err
EOD;
$content .= ($user_email_err = '') ? $password_err : null;
$content .= <<<EOD
        </p>
        </p>
        <input type="submit" value="Go" class="btn wider-btn" /> 
    </form>
    <p class="sign-up-link">Don't have an account? <a href="sign_up.php">Sign up</a></p>
</div>    
</div>
EOD;

include_once 'layout.php';