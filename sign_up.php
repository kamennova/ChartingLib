<?php

require_once 'connection.php';

try {
    $pdo = new PDO("mysql:host=" . DB_SERVER . ";dbname=" . DB_NAME, DB_USERNAME, DB_PASSWORD);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    die("ERROR: Could not connect. " . $e->getMessage());
}

//---

$user_email = '';
$password = '';
$confirm_password = '';

$user_email_err = $user_password_err = $confirm_password_err = '';

//----

if ($_SERVER['REQUEST_METHOD'] == 'POST') {

    // user email validation
    if (empty(trim($_POST['user_email']))) {
        $user_email_err = 'Please enter your email.';
    } else {
        $sql = "SELECT id FROM users WHERE email = :email";

        if ($stmt = $pdo->prepare($sql)) {
            $stmt->bindParam(":email", $param_email, PDO::PARAM_STR);
            $param_email = trim($_POST['user_email']);

            if ($stmt->execute()) {
                if ($stmt->rowCount() == 1) {
                    $user_email_err = 'This email is taken :/<br>Already registered? <a class="login-link" href="login.php">Log in</a>';
                } else {
                    $user_email = trim($_POST['user_email']); // ??? $param_email
                }
            } else {
                echo 'Error';
            }
        }

        unset($stmt);
    }

    // password validation
    if (empty(trim($_POST['user_password']))) {
        $user_password_err = 'Please enter a password';
    } elseif (strlen(trim($_POST['user_password'])) < 3) {
        $user_password_err = 'Password should container at least 3 characters';
    } else {
        $user_password = trim($_POST['user_password']);
    }

    if (empty(trim($_POST['confirm_password']))) {
        $confirm_password_err = 'Please confirm your password';
    } else {
        $confirm_password = trim($_POST['confirm_password']);
        if (empty($user_password_err) && $user_password != $confirm_password) {
            $confirm_password_err = 'Oops. Passwords did not match :(';
        }
    }

    if (empty($user_email_err) && empty($user_password_err) && empty($confirm_password_err)) {
        $sql = "INSERT INTO users (email, password_hash) VALUES (:email, :password_hash)";

        if ($stmt = $pdo->prepare($sql)) {
            $stmt->bindParam(':email', $param_email, PDO::PARAM_STR);
            $stmt->bindParam(':password_hash', $param_password, PDO::PARAM_STR);

            $param_email = $user_email;
            $param_password = password_hash($user_password, PASSWORD_DEFAULT);


            if ($stmt->execute()) {
                header("location: login.php");
                exit;
            } else {
                echo 'Error';
            }
        }

        unset($stmt);
    }
    unset($pdo);
}

//---

$body_class_list .= 'sign-up';
$stylesheets .= "<link rel='stylesheet' href='css/user-form.css' />";

$content .= <<<EOD
<div class="container">
<div class="form-container sign-up-form-container">
    <h1 class='page-title centered'>Sign up</h1>
    <form class="sign-up-form" method="post" action="
EOD;
$content .= htmlspecialchars($_SERVER["PHP_SELF"]);
$content .= <<<EOD
">
        <p>
          <label class="field-label" for="user-email">Email</label><br>
          <input class="form-field" type="email" id="user-email" name="user_email" value="$user_email" />
          <p class="error">$user_email_err</p>
        </p>
        <p>
          <label class="field-label" for="user-password">Password</label><br>
          <input class="form-field" type="password" id="user-password" name="user_password" value="$user_password"/>
          <p class="error">$user_password_err</p>
        </p>
        <p>
          <label class="field-label" for="confirm-password">Confirm password</label><br>
          <input class='form-field' type="password" id="confirm-password" name="confirm_password" />
          <p class="error">
EOD;
$content .= ($user_email_err == '') ? $confirm_password_err : null;
$content .= <<<EOD
            </p>
        </p>
        <input type="submit" value="Go" class="btn wider-btn submit-btn"/>
    </form>
</div>
</div>
<script src="js/sign-up-form.js" ></script>
EOD;

include_once 'layout.php';

$pdo = null;

//??? connection try config.php