<?php
/**
 * Plugin Name: Revion – strona
 * Description: Strona główna Revion, dwie strony dostawy, regulamin, polityki i formularze w jednym pakiecie. Po włączeniu wejdź w Ustawienia → Revion i wklej linki.
 * Version: 1.0.0
 * Author: Revion
 * Requires at least: 6.0
 * Requires PHP: 7.4
 * License: Proprietary
 * Text Domain: revion-strona
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

define( 'REVION_DIR', plugin_dir_path( __FILE__ ) );
define( 'REVION_URL', plugin_dir_url( __FILE__ ) );
define( 'REVION_OPCJE', 'revion_strona' );
define( 'REVION_STAN', 'revion_strona_stan' );
require_once REVION_DIR . 'wersja.php'; // REVION_REGULAMIN_PDF, REVION_DOMYSLNE, REVION_SLUGI – generowane przy budowie
require_once REVION_DIR . 'znak-wodny.php';

/** Strony, które wtyczka tworzy przy pierwszym włączeniu. */
function revion_definicje() {
	return array(
		'glowna'               => array( 'tytul' => 'Revion', 'slug' => 'revion', 'szablon' => 'glowna' ),
		'dostawa-life-os'      => array( 'tytul' => 'Dostęp – Revion Life OS', 'slug' => '', 'szablon' => 'dostawa-life-os' ),
		'dostawa-pakiet-pro'   => array( 'tytul' => 'Dostęp – Revion Pakiet Pro', 'slug' => '', 'szablon' => 'dostawa-pakiet-pro' ),
		'darmowy-ebook'        => array( 'tytul' => 'Darmowy ebook „Nawyki Żelaznej Dyscypliny”', 'slug' => 'darmowy-ebook', 'szablon' => 'ebook' ),
		'regulamin'            => array( 'tytul' => 'Regulamin', 'slug' => 'regulamin', 'dokument' => 'regulamin' ),
		'polityka-prywatnosci' => array( 'tytul' => 'Polityka prywatności', 'slug' => 'polityka-prywatnosci', 'dokument' => 'polityka-prywatnosci' ),
		'polityka-cookies'     => array( 'tytul' => 'Polityka cookies', 'slug' => 'polityka-cookies', 'dokument' => 'polityka-cookies' ),
		'formularz-reklamacji' => array( 'tytul' => 'Formularz reklamacji', 'slug' => 'formularz-reklamacji', 'dokument' => 'formularz-reklamacji' ),
		'formularz-zwrotu'     => array( 'tytul' => 'Formularz zwrotu i odstąpienia od umowy', 'slug' => 'formularz-zwrotu', 'dokument' => 'formularz-zwrotu' ),
	);
}

/** Pola w Ustawienia → Revion. */
function revion_pola() {
	return array(
		'stripe_life_os' => array( 'Link Stripe: Life OS (29 zł) – nowy link, stary za 47 zł wyłącz', '', true ),
		'stripe_pro'     => array( 'Link Stripe: Pakiet Pro (69 zł)', '', true ),
		'notion'         => array( 'Link do szablonu Life OS w Notion (opublikowany, „Allow duplicate as template”)', '', true ),
		'zrzut_kokpit'   => array( 'Zrzut ekranu: Główny Kokpit', '', false ),
		'zrzut_projekty' => array( 'Zrzut ekranu: Projekty', '', false ),
		'zrzut_nawyki'   => array( 'Zrzut ekranu: Cele i nawyki', '', false ),
		'zrzut_finanse'  => array( 'Zrzut ekranu: Finanse', '', false ),
		'pdf_skupienie'  => array( 'Inny adres PDF „Skupienie Absolutne” (zostaw puste: plik z wtyczki)', '', false ),
		'zip_ikony'      => array( 'Inny adres ZIP z ikonami (zostaw puste: plik z wtyczki)', '', false ),
	);
}

function revion_opcje() {
	$domyslne = array( 'wp_head' => 0, 'znak_wodny' => 1, 'stripe_klucz' => '' );
	foreach ( revion_pola() as $klucz => $pole ) {
		$domyslne[ $klucz ] = $pole[1];
	}
	$opcje = wp_parse_args( (array) get_option( REVION_OPCJE, array() ), $domyslne );
	// linki wpisane przy budowie wtyczki (wersja.php) uzupełniają puste pola
	$wbudowane = defined( 'REVION_DOMYSLNE' ) ? (array) json_decode( REVION_DOMYSLNE, true ) : array();
	foreach ( $wbudowane as $klucz => $wartosc ) {
		if ( '' === (string) ( $opcje[ $klucz ] ?? '' ) && $wartosc ) {
			$opcje[ $klucz ] = $wartosc;
		}
	}
	// „wtyczka:obrazy/…” to plik dołączony do wtyczki
	foreach ( $opcje as $klucz => $wartosc ) {
		if ( is_string( $wartosc ) && 0 === strpos( $wartosc, 'wtyczka:' ) ) {
			$opcje[ $klucz ] = REVION_URL . substr( $wartosc, 8 );
		}
	}
	return $opcje;
}

function revion_stan() {
	return wp_parse_args( (array) get_option( REVION_STAN, array() ), array( 'strony' => array(), 'pliki' => array() ) );
}

/* -------------------------------------------------------------------------
 * Włączenie: pliki do uploads, strony, strona główna
 * ---------------------------------------------------------------------- */

register_activation_hook( __FILE__, 'revion_aktywacja' );

function revion_kopiuj( $zrodlo, $katalog, $nazwa ) {
	$up = wp_upload_dir();
	if ( ! empty( $up['error'] ) || ! file_exists( $zrodlo ) ) {
		return '';
	}
	$cel = trailingslashit( $up['basedir'] ) . $katalog;
	wp_mkdir_p( $cel );
	if ( ! file_exists( $cel . '/index.php' ) ) {
		file_put_contents( $cel . '/index.php', "<?php\n// Silence is golden.\n" );
	}
	if ( ! file_exists( $cel . '/' . $nazwa ) ) {
		copy( $zrodlo, $cel . '/' . $nazwa );
	}
	return trailingslashit( $up['baseurl'] ) . $katalog . '/' . $nazwa;
}

function revion_aktywacja() {
	$stan = revion_stan();

	// Pliki trafiają do uploads, żeby linki u klientów działały także po aktualizacji lub usunięciu wtyczki.
	if ( empty( $stan['katalog_platny'] ) ) {
		$stan['katalog_platny'] = 'revion-' . strtolower( wp_generate_password( 16, false, false ) );
	}
	$p = REVION_DIR . 'pliki/';
	$stan['pliki']['nawyki']        = revion_kopiuj( $p . 'Nawyki-Zelaznej-Dyscypliny-Revion.pdf', '2026/10', 'Nawyki-Zelaznej-Dyscypliny-Revion.pdf' );
	$stan['pliki']['skupienie']     = revion_kopiuj( $p . 'Skupienie-Absolutne-Revion.pdf', $stan['katalog_platny'], 'Skupienie-Absolutne-Revion.pdf' );
	$stan['pliki']['ikony']         = revion_kopiuj( $p . 'Pakiet-Ikon-Revion.zip', $stan['katalog_platny'], 'Pakiet-Ikon-Revion.zip' );
	$stan['pliki']['regulamin_pdf'] = revion_kopiuj( $p . REVION_REGULAMIN_PDF, 'revion', REVION_REGULAMIN_PDF );
	update_option( REVION_STAN, $stan, false ); // dokumenty podstawiają adresy plików

	foreach ( revion_definicje() as $klucz => $d ) {
		if ( ! empty( $stan['strony'][ $klucz ] ) && get_post( $stan['strony'][ $klucz ] ) ) {
			continue; // już istnieje: nie nadpisujemy zmian właściciela
		}
		$stan['strony'][ $klucz ] = revion_utworz_strone( $d );
		update_option( REVION_STAN, $stan, false );
	}

	if ( ! isset( $stan['poprzednia_glowna'] ) ) {
		$stan['poprzednia_glowna'] = array(
			'show_on_front' => get_option( 'show_on_front' ),
			'page_on_front' => (int) get_option( 'page_on_front' ),
		);
	}
	update_option( 'show_on_front', 'page' );
	update_option( 'page_on_front', (int) $stan['strony']['glowna'] );

	update_option( REVION_STAN, $stan, false );
	flush_rewrite_rules();
}

function revion_utworz_strone( $d ) {
	if ( ! empty( $d['dokument'] ) ) {
		$tresc = (string) file_get_contents( REVION_DIR . 'dokumenty/' . $d['dokument'] . '.html' );
		$tresc = revion_podstaw( $tresc, false );
		$istniejaca = get_page_by_path( $d['slug'], OBJECT, 'page' );
		if ( $istniejaca ) {
			// stara wersja zostaje w rewizjach strony
			wp_update_post( array( 'ID' => $istniejaca->ID, 'post_content' => $tresc, 'post_status' => 'publish' ) );
			update_post_meta( $istniejaca->ID, '_revion_szablon', 'dokument' );
			return $istniejaca->ID;
		}
		$id = wp_insert_post( array( 'post_type' => 'page', 'post_status' => 'publish', 'post_title' => $d['tytul'], 'post_name' => $d['slug'], 'post_content' => $tresc ) );
		update_post_meta( $id, '_revion_szablon', 'dokument' );
		return $id;
	}
	$slugi = defined( 'REVION_SLUGI' ) ? (array) json_decode( REVION_SLUGI, true ) : array();
	$slug  = $d['slug'] ? $d['slug'] : ( $slugi[ $d['szablon'] ] ?? 'dostep-' . strtolower( wp_generate_password( 12, false, false ) ) );
	$id   = wp_insert_post(
		array(
			'post_type'    => 'page',
			'post_status'  => 'publish',
			'post_title'   => $d['tytul'],
			'post_name'    => $slug,
			'post_content' => '<!-- wp:paragraph --><p>Treść tej strony wyświetla wtyczka „Revion – strona”. Linki zmienisz w Ustawienia → Revion.</p><!-- /wp:paragraph -->',
		)
	);
	update_post_meta( $id, '_revion_szablon', $d['szablon'] );
	return $id;
}

register_deactivation_hook( __FILE__, 'revion_wylaczenie' );

function revion_wylaczenie() {
	$stan = revion_stan();
	if ( isset( $stan['poprzednia_glowna'] ) && (int) get_option( 'page_on_front' ) === (int) ( $stan['strony']['glowna'] ?? 0 ) ) {
		update_option( 'show_on_front', $stan['poprzednia_glowna']['show_on_front'] );
		update_option( 'page_on_front', $stan['poprzednia_glowna']['page_on_front'] );
		unset( $stan['poprzednia_glowna'] );
		update_option( REVION_STAN, $stan, false );
	}
}

/* -------------------------------------------------------------------------
 * Podstawianie linków
 * ---------------------------------------------------------------------- */

function revion_url_strony( $klucz ) {
	$stan = revion_stan();
	$id   = $stan['strony'][ $klucz ] ?? 0;
	return $id ? get_permalink( $id ) : home_url( '/' . $klucz . '/' );
}

function revion_podstaw( $html, $strona = true, $nadpisz = array() ) {
	$o    = revion_opcje();
	$stan = revion_stan();

	$zrzuty = $o['zrzut_kokpit'] && $o['zrzut_projekty'] && $o['zrzut_nawyki'] && $o['zrzut_finanse'];
	if ( ! $zrzuty ) {
		// bez prawdziwych zrzutów nie pokazujemy galerii „Prawdziwe zrzuty ekranu”
		$html = preg_replace( '/<!--REVION_ZRZUTY-->.*?<!--\/REVION_ZRZUTY-->/s', '', $html );
	}
	$kontakt = get_page_by_path( 'kontakt', OBJECT, 'page' );
	$zastepczy = REVION_URL . 'obrazy/pakiet-ebookow-3d.webp';

	$mapa = array(
		'{{REVION_OBRAZY}}'         => REVION_URL . 'obrazy/',
		'{{REVION_STRIPE_LIFE_OS}}' => $o['stripe_life_os'] ? $o['stripe_life_os'] : '#oferta',
		'{{REVION_STRIPE_PRO}}'     => $o['stripe_pro'] ? $o['stripe_pro'] : '#oferta',
		'{{REVION_MAILERLITE}}'     => revion_url_strony( 'darmowy-ebook' ),
		'{{REVION_NOTION}}'         => $o['notion'] ? $o['notion'] : '#',
		'{{REVION_PDF_NAWYKI}}'     => $stan['pliki']['nawyki'] ?? '#',
		'{{REVION_PDF_SKUPIENIE}}'  => $o['pdf_skupienie'] ? $o['pdf_skupienie'] : ( $stan['pliki']['skupienie'] ?? '#' ),
		'{{REVION_ZIP_IKONY}}'      => $o['zip_ikony'] ? $o['zip_ikony'] : ( $stan['pliki']['ikony'] ?? '#' ),
		'{{REVION_ZRZUT_KOKPIT}}'   => $o['zrzut_kokpit'] ? $o['zrzut_kokpit'] : $zastepczy,
		'{{REVION_ZRZUT_PROJEKTY}}' => $o['zrzut_projekty'] ? $o['zrzut_projekty'] : $zastepczy,
		'{{REVION_ZRZUT_NAWYKI}}'   => $o['zrzut_nawyki'] ? $o['zrzut_nawyki'] : $zastepczy,
		'{{REVION_ZRZUT_FINANSE}}'  => $o['zrzut_finanse'] ? $o['zrzut_finanse'] : $zastepczy,
		'{{REVION_URL_REGULAMIN}}'  => revion_url_strony( 'regulamin' ),
		'{{REVION_URL_POLITYKA}}'   => revion_url_strony( 'polityka-prywatnosci' ),
		'{{REVION_URL_COOKIES}}'    => revion_url_strony( 'polityka-cookies' ),
		'{{REVION_URL_REKLAMACJA}}' => revion_url_strony( 'formularz-reklamacji' ),
		'{{REVION_URL_ZWROT}}'      => revion_url_strony( 'formularz-zwrotu' ),
		'{{REVION_URL_KONTAKT}}'    => $kontakt ? get_permalink( $kontakt ) : 'mailto:kontakt@revion.pl',
		'{{REVION_URL_EBOOK}}'      => revion_url_strony( 'darmowy-ebook' ),
		'{{REVION_URL_HOME}}'       => home_url( '/' ),
		'{{REVION_URL_REGULAMIN_PDF}}' => $stan['pliki']['regulamin_pdf'] ?? revion_url_strony( 'regulamin' ),
	);
	$mapa = array_merge( $mapa, $nadpisz );
	if ( $strona ) {
		$mapa = array_map( 'esc_url', $mapa );
	}
	return strtr( $html, $mapa );
}

/* -------------------------------------------------------------------------
 * Wyświetlanie: strona główna i strony dostawy bez motywu (jak Elementor Canvas)
 * ---------------------------------------------------------------------- */

add_action( 'template_redirect', 'revion_wyswietl', 1 );

function revion_wyswietl() {
	if ( ! is_page() ) {
		return;
	}
	$id      = get_queried_object_id();
	$szablon = get_post_meta( $id, '_revion_szablon', true );
	if ( ! in_array( $szablon, array( 'glowna', 'dostawa-life-os', 'dostawa-pakiet-pro', 'ebook' ), true ) ) {
		return;
	}
	$plik = REVION_DIR . 'szablony/' . $szablon . '.html';
	if ( ! file_exists( $plik ) ) {
		return;
	}
	$nadpisz   = array();
	$komunikat = '';
	if ( 'dostawa-pakiet-pro' === $szablon && revion_znak_wodny_wlaczony() ) {
		$sesja = isset( $_GET['sesja'] ) ? sanitize_text_field( wp_unslash( $_GET['sesja'] ) ) : ''; // phpcs:ignore WordPress.Security.NonceVerification
		$dane  = revion_sesja( $sesja );
		if ( $dane && $dane['kwota'] >= REVION_PRO_GROSZE ) {
			$nadpisz['{{REVION_PDF_SKUPIENIE}}'] = add_query_arg( array( 'revion_plik' => 'skupienie', 'sesja' => $sesja ), home_url( '/' ) );
			$nadpisz['{{REVION_ZIP_IKONY}}']     = add_query_arg( array( 'revion_plik' => 'ikony', 'sesja' => $sesja ), home_url( '/' ) );
			$komunikat = '<p style="font-size:.92rem;margin-bottom:8px">Pliki z Pakietu Pro są oznaczone Twoim adresem e-mail (' . esc_html( $dane['email'] ) . '). Zapisz tę stronę w zakładkach razem z całym adresem: to Twój stały dostęp do pobierania.</p>';
		} else {
			$nadpisz['{{REVION_PDF_SKUPIENIE}}'] = '#brak-dostepu';
			$nadpisz['{{REVION_ZIP_IKONY}}']     = '#brak-dostepu';
			$komunikat = '<div id="brak-dostepu" class="karta" style="margin:0 0 18px;border-color:#FFB020"><p style="margin:0"><b>Nie widzimy potwierdzenia płatności w adresie tej strony.</b> Ebook „Skupienie Absolutne” i ikony pobierzesz przez stronę, na którą przekierowała Cię płatność (jej adres kończy się na <code>?sesja=…</code>). Nie masz go? Napisz na <a href="mailto:kontakt@revion.pl" class="cyj">kontakt@revion.pl</a>, odeślemy link.</p></div>';
		}
	}
	$html    = str_replace( '<!--REVION_KOMUNIKAT-->', $komunikat, revion_podstaw( (string) file_get_contents( $plik ), true, $nadpisz ) );
	$dostawa = 0 === strpos( $szablon, 'dostawa' );
	$o       = revion_opcje();
	if ( $dostawa ) {
		nocache_headers();
		header( 'X-Robots-Tag: noindex, nofollow', true );
	}
	status_header( 200 );
	include REVION_DIR . 'szablony/szkielet.php';
	exit;
}

function revion_jest_wtyczka_seo() {
	return defined( 'WPSEO_VERSION' ) || class_exists( 'RankMath' ) || defined( 'AIOSEO_VERSION' ) || defined( 'SEOPRESS_VERSION' );
}

// strony dostawy poza mapą strony i wyszukiwarką
add_filter(
	'wp_sitemaps_posts_query_args',
	function ( $args, $typ ) {
		if ( 'page' === $typ ) {
			$stan                   = revion_stan();
			$args['post__not_in']   = array_merge( $args['post__not_in'] ?? array(), array_filter( array( $stan['strony']['dostawa-life-os'] ?? 0, $stan['strony']['dostawa-pakiet-pro'] ?? 0 ) ) );
		}
		return $args;
	},
	10,
	2
);
add_filter(
	'wpseo_exclude_from_sitemap_by_post_ids',
	function ( $ids ) {
		$stan = revion_stan();
		return array_merge( (array) $ids, array_filter( array( $stan['strony']['dostawa-life-os'] ?? 0, $stan['strony']['dostawa-pakiet-pro'] ?? 0 ) ) );
	}
);
add_action(
	'pre_get_posts',
	function ( $q ) {
		if ( ! is_admin() && $q->is_main_query() && $q->is_search() ) {
			$stan = revion_stan();
			$q->set( 'post__not_in', array_filter( array( $stan['strony']['dostawa-life-os'] ?? 0, $stan['strony']['dostawa-pakiet-pro'] ?? 0 ) ) );
		}
	}
);
add_filter(
	'wp_robots',
	function ( $robots ) {
		if ( is_page() ) {
			$szablon = get_post_meta( get_queried_object_id(), '_revion_szablon', true );
			if ( 0 === strpos( (string) $szablon, 'dostawa' ) ) {
				$robots['noindex']  = true;
				$robots['nofollow'] = true;
			}
		}
		return $robots;
	}
);

/* -------------------------------------------------------------------------
 * Ustawienia → Revion
 * ---------------------------------------------------------------------- */

add_action( 'admin_menu', function () {
	add_options_page( 'Revion', 'Revion', 'manage_options', 'revion-strona', 'revion_ekran_ustawien' );
} );

add_action( 'admin_init', function () {
	register_setting(
		'revion_strona',
		REVION_OPCJE,
		array(
			'type'              => 'array',
			'sanitize_callback' => function ( $wej ) {
				$wyj   = array( 'wp_head' => empty( $wej['wp_head'] ) ? 0 : 1, 'znak_wodny' => empty( $wej['znak_wodny'] ) ? 0 : 1 );
				$klucz = isset( $wej['stripe_klucz'] ) ? trim( sanitize_text_field( (string) $wej['stripe_klucz'] ) ) : '';
				$zapisane = (array) get_option( REVION_OPCJE, array() );
				$wyj['stripe_klucz'] = '' === $klucz ? (string) ( $zapisane['stripe_klucz'] ?? '' ) : $klucz;
				foreach ( array_keys( revion_pola() ) as $klucz ) {
					$wyj[ $klucz ] = isset( $wej[ $klucz ] ) ? esc_url_raw( trim( (string) $wej[ $klucz ] ) ) : '';
				}
				return $wyj;
			},
		)
	);
} );

add_action( 'admin_enqueue_scripts', function ( $hook ) {
	if ( 'settings_page_revion-strona' === $hook ) {
		wp_enqueue_media();
	}
} );

add_filter( 'plugin_action_links_' . plugin_basename( __FILE__ ), function ( $linki ) {
	array_unshift( $linki, '<a href="' . esc_url( admin_url( 'options-general.php?page=revion-strona' ) ) . '">Ustawienia</a>' );
	return $linki;
} );

function revion_braki() {
	$o     = revion_opcje();
	$braki = array();
	foreach ( revion_pola() as $klucz => $pole ) {
		if ( $pole[2] && empty( $o[ $klucz ] ) ) {
			$braki[] = $pole[0];
		}
	}
	return $braki;
}

add_action( 'admin_notices', function () {
	if ( ! current_user_can( 'manage_options' ) ) {
		return;
	}
	$braki = revion_braki();
	if ( $braki ) {
		echo '<div class="notice notice-warning"><p><strong>Revion:</strong> uzupełnij w <a href="' . esc_url( admin_url( 'options-general.php?page=revion-strona' ) ) . '">Ustawienia → Revion</a>: ' . esc_html( implode( ', ', $braki ) ) . '.</p></div>';
	}
} );

function revion_ekran_ustawien() {
	if ( ! current_user_can( 'manage_options' ) ) {
		return;
	}
	$o    = revion_opcje();
	$stan = revion_stan();
	?>
	<div class="wrap">
		<h1>Revion – strona</h1>
		<p>Wtyczka utworzyła stronę główną, dwie strony dostawy, regulamin, polityki i formularze. Wklej poniżej linki i kliknij „Zapisz zmiany”. Strona zmieni się od razu.</p>

		<h2>1. Adresy stron dostawy (wklej w Stripe → link płatności → Po płatności → Przekieruj na stronę)</h2>
		<table class="widefat striped" style="max-width:900px">
			<tr><td><strong>Life OS (29 zł)</strong></td><td><code><?php echo esc_html( revion_url_strony( 'dostawa-life-os' ) ); ?></code></td></tr>
			<tr><td><strong>Pakiet Pro (69 zł)</strong></td><td><code><?php echo esc_html( revion_url_strony( 'dostawa-pakiet-pro' ) . ( revion_znak_wodny_wlaczony() ? '?sesja={CHECKOUT_SESSION_ID}' : '' ) ); ?></code></td></tr>
		</table>
		<p>Tych adresów nie udostępniaj publicznie. Strony mają „noindex” i nie ma ich w mapie strony.</p>

		<h2>2. Linki</h2>
		<form method="post" action="options.php">
			<?php settings_fields( 'revion_strona' ); ?>
			<table class="form-table" role="presentation">
				<?php foreach ( revion_pola() as $klucz => $pole ) : ?>
					<tr>
						<th scope="row"><label for="revion-<?php echo esc_attr( $klucz ); ?>"><?php echo esc_html( $pole[0] ); ?><?php echo $pole[2] ? ' *' : ''; ?></label></th>
						<td>
							<input type="url" class="regular-text" style="width:100%;max-width:640px" id="revion-<?php echo esc_attr( $klucz ); ?>" name="<?php echo esc_attr( REVION_OPCJE . '[' . $klucz . ']' ); ?>" value="<?php echo esc_attr( $o[ $klucz ] ); ?>">
							<?php if ( 0 === strpos( $klucz, 'zrzut_' ) ) : ?>
								<button type="button" class="button revion-media" data-cel="revion-<?php echo esc_attr( $klucz ); ?>">Wybierz z biblioteki</button>
							<?php endif; ?>
						</td>
					</tr>
				<?php endforeach; ?>
				<tr>
					<th scope="row">Znak wodny w plikach Pakietu Pro</th>
					<td><label><input type="checkbox" name="<?php echo esc_attr( REVION_OPCJE . '[znak_wodny]' ); ?>" value="1" <?php checked( ! empty( $o['znak_wodny'] ) ); ?>> Oznaczaj PDF i ZIP adresem e-mail kupującego, datą i numerem zakupu</label></td>
				</tr>
				<tr>
					<th scope="row"><label for="revion-stripe-klucz">Klucz Stripe do znaku wodnego</label></th>
					<td><input type="password" autocomplete="off" class="regular-text" id="revion-stripe-klucz" name="<?php echo esc_attr( REVION_OPCJE . '[stripe_klucz]' ); ?>" value="" placeholder="<?php echo $o['stripe_klucz'] ? 'zapisany (wpisz nowy, żeby zmienić)' : 'rk_live_…'; ?>">
					<p class="description">Stripe → Developers → API keys → <b>Create restricted key</b>: nazwa „Revion strona”, uprawnienie <b>Checkout Sessions: Read</b>, reszta None. Skopiuj klucz <code>rk_live_…</code> i wklej tutaj. Nie wysyłaj go nikomu.</p></td>
				</tr>
				<tr>
					<th scope="row">Skrypty WordPressa na stronie głównej</th>
					<td><label><input type="checkbox" name="<?php echo esc_attr( REVION_OPCJE . '[wp_head]' ); ?>" value="1" <?php checked( ! empty( $o['wp_head'] ) ); ?>> Włącz dopiero, gdy zainstalujesz wtyczkę zgód cookies albo Meta Pixel (inaczej zostaw wyłączone).</label></td>
				</tr>
			</table>
			<p>Galeria „Prawdziwe zrzuty ekranu” pojawi się, gdy dodasz wszystkie 4 zrzuty. Do tego czasu jest ukryta.</p>
			<?php submit_button(); ?>
		</form>

		<h2>3. Pliki do pobrania (skopiowane do Twojego WordPressa)</h2>
		<table class="widefat striped" style="max-width:900px">
			<tr><td>Ebook „Nawyki Żelaznej Dyscypliny” (darmowy, link w mailach)</td><td><code><?php echo esc_html( $stan['pliki']['nawyki'] ?? '' ); ?></code></td></tr>
			<tr><td>Ebook „Skupienie Absolutne” (Pakiet Pro)</td><td><code><?php echo esc_html( $o['pdf_skupienie'] ? $o['pdf_skupienie'] : ( $stan['pliki']['skupienie'] ?? '' ) ); ?></code></td></tr>
			<tr><td>50 ikon do Notion (Pakiet Pro)</td><td><code><?php echo esc_html( $o['zip_ikony'] ? $o['zip_ikony'] : ( $stan['pliki']['ikony'] ?? '' ) ); ?></code></td></tr>
			<tr><td>Regulamin w PDF (link do maili A1–A3)</td><td><code><?php echo esc_html( $stan['pliki']['regulamin_pdf'] ?? '' ); ?></code></td></tr>
		</table>
		<p>Adresów płatnych plików nie publikuj. Są tylko na stronie dostawy Pakietu Pro i w mailu po zakupie.</p>

		<h2>4. Dokumenty do sprawdzenia</h2>
		<table class="widefat striped" style="max-width:900px">
			<?php foreach ( array( 'regulamin', 'polityka-prywatnosci', 'polityka-cookies', 'formularz-reklamacji', 'formularz-zwrotu' ) as $klucz ) :
				$id    = $stan['strony'][ $klucz ] ?? 0;
				$post  = $id ? get_post( $id ) : null;
				$ile   = $post ? substr_count( $post->post_content, 'DO UZUPEŁNIENIA' ) : 0;
				?>
				<tr>
					<td><a href="<?php echo esc_url( revion_url_strony( $klucz ) ); ?>" target="_blank" rel="noopener"><?php echo esc_html( $post ? $post->post_title : $klucz ); ?></a></td>
					<td><?php echo $ile ? '<strong style="color:#b32d2e">Do uzupełnienia: ' . (int) $ile . ' (zaznaczone na żółto)</strong>' : '✓ gotowe'; ?></td>
					<td><?php if ( $id ) : ?><a class="button" href="<?php echo esc_url( get_edit_post_link( $id ) ); ?>">Edytuj</a><?php endif; ?></td>
				</tr>
			<?php endforeach; ?>
		</table>
		<p>Strona główna: <a href="<?php echo esc_url( home_url( '/' ) ); ?>" target="_blank" rel="noopener"><?php echo esc_html( home_url( '/' ) ); ?></a>. Po wyłączeniu wtyczki wraca poprzednia strona główna.</p>
	</div>
	<script>
	document.querySelectorAll('.revion-media').forEach(function (b) {
		b.addEventListener('click', function () {
			var ramka = wp.media({ title: 'Wybierz zrzut ekranu', library: { type: 'image' }, multiple: false });
			ramka.on('select', function () {
				document.getElementById(b.dataset.cel).value = ramka.state().get('selection').first().toJSON().url;
			});
			ramka.open();
		});
	});
	</script>
	<?php
}

/* -------------------------------------------------------------------------
 * Znak wodny: weryfikacja płatności w Stripe i pobieranie oznaczonych plików
 * ---------------------------------------------------------------------- */

function revion_znak_wodny_wlaczony() {
	$o = revion_opcje();
	return ! empty( $o['znak_wodny'] ) && ! empty( $o['stripe_klucz'] );
}

/** Dane opłaconej sesji Stripe Checkout (e-mail, kwota w groszach, data) albo null. */
function revion_sesja( $sesja ) {
	if ( ! preg_match( '/^cs_(test|live)_[A-Za-z0-9]{10,}$/', (string) $sesja ) ) {
		return null;
	}
	$klucz_cache = 'revion_s_' . md5( $sesja );
	$cache       = get_transient( $klucz_cache );
	if ( is_array( $cache ) ) {
		return $cache;
	}
	$o = revion_opcje();
	if ( empty( $o['stripe_klucz'] ) ) {
		return null;
	}
	$r = wp_remote_get(
		'https://api.stripe.com/v1/checkout/sessions/' . rawurlencode( $sesja ),
		array( 'timeout' => 15, 'headers' => array( 'Authorization' => 'Bearer ' . $o['stripe_klucz'] ) )
	);
	if ( is_wp_error( $r ) || 200 !== (int) wp_remote_retrieve_response_code( $r ) ) {
		return null;
	}
	$d = json_decode( wp_remote_retrieve_body( $r ), true );
	if ( ! is_array( $d ) || 'paid' !== ( $d['payment_status'] ?? '' ) ) {
		return null;
	}
	$dane = array(
		'email' => sanitize_email( $d['customer_details']['email'] ?? '' ),
		'kwota' => (int) ( $d['amount_total'] ?? 0 ),
		'data'  => (int) ( $d['created'] ?? time() ),
	);
	set_transient( $klucz_cache, $dane, 30 * DAY_IN_SECONDS );
	return $dane;
}

add_action( 'init', 'revion_pobierz', 1 );

function revion_pobierz() {
	if ( empty( $_GET['revion_plik'] ) ) { // phpcs:ignore WordPress.Security.NonceVerification
		return;
	}
	$plik  = sanitize_key( wp_unslash( $_GET['revion_plik'] ) ); // phpcs:ignore WordPress.Security.NonceVerification
	$sesja = isset( $_GET['sesja'] ) ? sanitize_text_field( wp_unslash( $_GET['sesja'] ) ) : ''; // phpcs:ignore WordPress.Security.NonceVerification
	$pliki = array(
		'skupienie' => array( 'Skupienie-Absolutne-Revion.pdf', 'application/pdf' ),
		'ikony'     => array( 'Pakiet-Ikon-Revion.zip', 'application/zip' ),
	);
	$dane = revion_znak_wodny_wlaczony() ? revion_sesja( $sesja ) : null;
	if ( ! isset( $pliki[ $plik ] ) || ! $dane || $dane['kwota'] < REVION_PRO_GROSZE ) {
		wp_die( 'Ten link do pobrania jest nieważny. Otwórz stronę dostępu z przekierowania po płatności albo napisz na kontakt@revion.pl.', 'Revion', array( 'response' => 403 ) );
	}
	$stan    = revion_stan();
	$up      = wp_upload_dir();
	$sciezka = trailingslashit( $up['basedir'] ) . ( $stan['katalog_platny'] ?? '' ) . '/' . $pliki[ $plik ][0];
	if ( empty( $stan['katalog_platny'] ) || ! is_readable( $sciezka ) ) {
		wp_die( 'Plik jest chwilowo niedostępny. Napisz na kontakt@revion.pl.', 'Revion', array( 'response' => 500 ) );
	}
	$nr    = substr( $sesja, -8 );
	$tekst = sprintf( 'Licencja: %s | zakup %s | nr %s | revion.pl', $dane['email'], wp_date( 'd.m.Y', $dane['data'] ), $nr );
	$tresc = (string) file_get_contents( $sciezka );
	if ( 'skupienie' === $plik ) {
		$oznaczony = revion_znak_wodny_pdf( $tresc, $tekst );
		if ( false !== $oznaczony ) {
			$tresc = $oznaczony;
		}
	} elseif ( class_exists( 'ZipArchive' ) ) {
		$tmp = wp_tempnam( 'revion-ikony' );
		if ( $tmp && copy( $sciezka, $tmp ) ) {
			$zip = new ZipArchive();
			if ( true === $zip->open( $tmp ) ) {
				$zip->addFromString( 'LICENCJA.txt', "Pakiet 50 ikon do Notion – Revion\r\n\r\nLicencja dla: " . $dane['email'] . "\r\nData zakupu: " . wp_date( 'd.m.Y', $dane['data'] ) . "\r\nNumer zakupu: " . $nr . "\r\n\r\nLicencja na użytek własny jednej osoby (§ 12 Regulaminu revion.pl). Prosimy nie udostępniać plików.\r\n" );
				$zip->close();
				$tresc = (string) file_get_contents( $tmp );
			}
			unlink( $tmp );
		}
	}
	nocache_headers();
	header( 'X-Robots-Tag: noindex, nofollow' );
	header( 'Content-Type: ' . $pliki[ $plik ][1] );
	header( 'Content-Disposition: attachment; filename="' . $pliki[ $plik ][0] . '"' );
	header( 'Content-Length: ' . strlen( $tresc ) );
	echo $tresc; // phpcs:ignore WordPress.Security.EscapeOutput
	exit;
}
