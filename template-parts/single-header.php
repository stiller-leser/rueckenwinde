<?php
/**
 * The header for our theme
 *
 * This is the template that displays all of the <head> section and everything up until <div id="content">
 *
 * @link https://developer.wordpress.org/themes/basics/template-files/#template-partials
 *
 * @package writers_blogily
 */

?>
<!doctype html>
<html <?php language_attributes(); ?>>
<head>
	<meta charset="<?php bloginfo( 'charset' ); ?>">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<link rel="profile" href="http://gmpg.org/xfn/11">
	<meta name="google-site-verification" content="qWSxcQ35GaiRPHJSJtZ_6U4U31A-YsyUwG8xV44QYZQ" />

	<?php wp_head(); ?>
	<?php if(is_page( array( 'contact-us', 'privacy-policy' ) )): ?>
	<meta name="robots" content="noindex,nofollow">
	<?php endif; ?>
</head>
 
<body <?php body_class(); ?>>
	