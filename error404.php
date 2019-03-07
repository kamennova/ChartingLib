<?php ob_start(); ?>

<div class="container">
    <h1 class="error-page-title">404</h1>
</div>

<?php $content .= ob_get_contents();
ob_end_clean();
