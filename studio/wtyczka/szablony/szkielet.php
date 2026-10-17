<?php
/**
 * Szkielet strony głównej i stron dostawy (bez motywu, jak Elementor Canvas).
 * Zmienne: $html, $dostawa, $o.
 */
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}
$revion_ebook = isset( $szablon ) && 'ebook' === $szablon;
$revion_tytul = $dostawa ? 'Dostęp – Revion' : ( $revion_ebook ? 'Darmowy ebook „Nawyki Żelaznej Dyscypliny” – Revion' : 'Revion Life OS – szablon Notion po polsku: zadania, nawyki, cele, finanse' );
$revion_opis  = $revion_ebook ? 'Ebook PDF o nawykach opartych na badaniach i plan na 30 dni. Za darmo, bez zapisu na newsletter.' : 'Gotowy pulpit w Notion po polsku. Zadania, nawyki, cele, projekty i finanse w jednym miejscu. Płacisz raz, działa na darmowym Notion. Darmowy ebook o nawykach.';
$revion_url   = $revion_ebook ? get_permalink() : home_url( '/' );
$revion_obraz = REVION_URL . ( $revion_ebook ? 'obrazy/ebook-nawyki-okladka.webp' : 'obrazy/revion-og.jpg' );
$revion_wp    = ! empty( $o['wp_head'] ) && ! $dostawa;
?><!doctype html>
<html <?php language_attributes(); ?>>
<head>
<meta charset="<?php bloginfo( 'charset' ); ?>">
<meta name="viewport" content="width=device-width, initial-scale=1">
<?php if ( $dostawa ) : ?>
<meta name="robots" content="noindex, nofollow">
<?php endif; ?>
<?php if ( ! $revion_wp || ! current_theme_supports( 'title-tag' ) ) : ?>
<title><?php echo esc_html( $revion_tytul ); ?></title>
<?php endif; ?>
<?php if ( ! $dostawa && ( ! $revion_wp || ! revion_jest_wtyczka_seo() ) ) : ?>
<meta name="description" content="<?php echo esc_attr( $revion_opis ); ?>">
<link rel="canonical" href="<?php echo esc_url( $revion_url ); ?>">
<meta property="og:type" content="website">
<meta property="og:locale" content="pl_PL">
<meta property="og:title" content="<?php echo esc_attr( $revion_tytul ); ?>">
<meta property="og:description" content="<?php echo esc_attr( $revion_opis ); ?>">
<meta property="og:url" content="<?php echo esc_url( $revion_url ); ?>">
<meta property="og:image" content="<?php echo esc_url( $revion_obraz ); ?>">
<?php if ( ! $revion_ebook ) : ?>
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<?php endif; ?>
<meta name="twitter:card" content="summary_large_image">
<?php endif; ?>
<link rel="icon" href="<?php echo esc_url( REVION_URL . 'obrazy/favicon.svg' ); ?>" type="image/svg+xml">
<?php if ( $revion_wp ) { wp_head(); } ?>
<style>html,body{margin:0;padding:0;background:#05060A}</style>
</head>
<body>
<?php if ( $revion_wp ) { wp_body_open(); } ?>
<?php echo $html; // phpcs:ignore WordPress.Security.EscapeOutput -- gotowy HTML z wtyczki, linki przeszły esc_url ?>
<?php if ( $revion_wp ) { wp_footer(); } ?>
</body>
</html>
