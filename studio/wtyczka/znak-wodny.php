<?php
/**
 * Znak wodny w PDF: dopisuje na dole każdej strony linijkę z danymi kupującego.
 * Działa przez przyrostową aktualizację pliku (incremental update): oryginalne obiekty zostają,
 * więc linki, spis treści i jakość PDF się nie zmieniają. Obsługuje PDF z klasyczną tabelą xref
 * (takie generuje Chromium przy składzie ebooków Revion).
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/** Tekst bezpieczny dla czcionki Helvetica i łańcucha PDF. */
function revion_pdf_tekst( $tekst ) {
	$z  = array( 'ą' => 'a', 'ć' => 'c', 'ę' => 'e', 'ł' => 'l', 'ń' => 'n', 'ó' => 'o', 'ś' => 's', 'ź' => 'z', 'ż' => 'z', 'Ą' => 'A', 'Ć' => 'C', 'Ę' => 'E', 'Ł' => 'L', 'Ń' => 'N', 'Ó' => 'O', 'Ś' => 'S', 'Ź' => 'Z', 'Ż' => 'Z', '·' => '|', '–' => '-' );
	$t  = strtr( (string) $tekst, $z );
	$t  = preg_replace( '/[^\x20-\x7E]/', '?', $t );
	return str_replace( array( '\\', '(', ')' ), array( '\\\\', '\\(', '\\)' ), $t );
}

/** Indeks końca słownika << … >> zaczynającego się na pozycji $start (wskazuje na „<<”). */
function revion_pdf_koniec_slownika( $s, $start ) {
	$glebokosc = 0;
	$n         = strlen( $s );
	for ( $i = $start; $i < $n - 1; $i++ ) {
		$dwa = $s[ $i ] . $s[ $i + 1 ];
		if ( '<<' === $dwa ) {
			$glebokosc++;
			$i++;
		} elseif ( '>>' === $dwa ) {
			$glebokosc--;
			$i++;
			if ( 0 === $glebokosc ) {
				return $i + 1;
			}
		}
	}
	return false;
}

/** Tabela xref: numer obiektu => przesunięcie (z uwzględnieniem /Prev). */
function revion_pdf_xref( $pdf, $poz ) {
	$offsety = array();
	$odwiedzone = array();
	while ( null !== $poz && ! isset( $odwiedzone[ $poz ] ) ) {
		$odwiedzone[ $poz ] = true;
		if ( 'xref' !== substr( $pdf, $poz, 4 ) ) {
			return false; // strumień xref (PDF 1.5+) nie jest obsługiwany
		}
		$koniec = strpos( $pdf, 'trailer', $poz );
		if ( false === $koniec ) {
			return false;
		}
		$linie = preg_split( '/\r\n|\r|\n/', trim( substr( $pdf, $poz + 4, $koniec - $poz - 4 ) ) );
		$nr    = 0;
		foreach ( $linie as $l ) {
			$l = trim( $l );
			if ( preg_match( '/^(\d+)\s+(\d+)$/', $l, $m ) ) {
				$nr = (int) $m[1];
			} elseif ( preg_match( '/^(\d{10})\s+(\d{5})\s+([nf])$/', $l, $m ) ) {
				if ( 'n' === $m[3] && ! isset( $offsety[ $nr ] ) ) {
					$offsety[ $nr ] = (int) $m[1];
				}
				$nr++;
			}
		}
		$trailer = substr( $pdf, $koniec, 600 );
		$poz     = preg_match( '/\/Prev\s+(\d+)/', $trailer, $m ) ? (int) $m[1] : null;
	}
	return $offsety;
}

/** Dodaje czcionkę /RevF do tekstu słownika zasobów (<< … >>). */
function revion_pdf_dodaj_czcionke( $zasoby, $czcionka, $pdf, $offsety ) {
	if ( preg_match( '/\/Font\s*<</', $zasoby, $m, PREG_OFFSET_CAPTURE ) ) {
		$p = $m[0][1] + strlen( $m[0][0] );
		return substr( $zasoby, 0, $p ) . '/RevF ' . $czcionka . ' 0 R ' . substr( $zasoby, $p );
	}
	if ( preg_match( '/\/Font\s+(\d+)\s+(\d+)\s+R/', $zasoby, $m, PREG_OFFSET_CAPTURE ) ) {
		$slownik = revion_pdf_slownik_obiektu( $pdf, $offsety, (int) $m[1][0] );
		if ( false === $slownik ) {
			return false;
		}
		$slownik = '<</RevF ' . $czcionka . ' 0 R ' . substr( $slownik, 2 );
		return substr( $zasoby, 0, $m[0][1] ) . '/Font ' . $slownik . substr( $zasoby, $m[0][1] + strlen( $m[0][0] ) );
	}
	return '<</Font <</RevF ' . $czcionka . ' 0 R>> ' . substr( $zasoby, 2 );
}

/** Słownik (bez strumienia) obiektu o podanym numerze. */
function revion_pdf_slownik_obiektu( $pdf, $offsety, $nr ) {
	if ( ! isset( $offsety[ $nr ] ) ) {
		return false;
	}
	$p = strpos( $pdf, '<<', $offsety[ $nr ] );
	$k = false === $p ? false : revion_pdf_koniec_slownika( $pdf, $p );
	return false === $k ? false : substr( $pdf, $p, $k - $p );
}

/**
 * Zwraca PDF ze znakiem wodnym albo false, jeśli plik ma nieobsługiwaną budowę.
 */
function revion_znak_wodny_pdf( $pdf, $tekst ) {
	if ( ! preg_match( '/startxref\s+(\d+)\s+%%EOF\s*$/', $pdf, $m ) ) {
		return false;
	}
	$startxref = (int) $m[1];
	$offsety   = revion_pdf_xref( $pdf, $startxref );
	if ( ! $offsety ) {
		return false;
	}
	$trailer = substr( $pdf, strrpos( $pdf, 'trailer' ), 600 );
	if ( ! preg_match( '/\/Size\s+(\d+)/', $trailer, $ms ) || ! preg_match( '/\/Root\s+(\d+\s+\d+\s+R)/', $trailer, $mr ) ) {
		return false;
	}
	$info = preg_match( '/\/Info\s+(\d+\s+\d+\s+R)/', $trailer, $mi ) ? $mi[1] : '';
	$id   = preg_match( '/\/ID\s*(\[[^\]]*\])/', $trailer, $md ) ? $md[1] : '';

	$nastepny = (int) $ms[1];
	$nowe     = array(); // numer => treść obiektu (bez nagłówka)
	$czcionka = $nastepny++;
	$q        = $nastepny++;
	$qq       = $nastepny++;
	$nowe[ $czcionka ] = '<</Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding>>';
	$nowe[ $q ]        = "<</Length 2>>\nstream\nq\n\nendstream";
	$nowe[ $qq ]       = "<</Length 2>>\nstream\nQ\n\nendstream";
	$napis             = revion_pdf_tekst( $tekst );
	$teksty            = array(); // szerokość strony => numer obiektu z napisem
	$strony            = 0;

	foreach ( $offsety as $nr => $off ) {
		$naglowek = substr( $pdf, $off, 40 );
		if ( ! preg_match( '/^\s*' . $nr . '\s+\d+\s+obj/', $naglowek ) ) {
			continue;
		}
		$p = strpos( $pdf, '<<', $off );
		if ( false === $p || $p - $off > 40 ) {
			continue;
		}
		$k = revion_pdf_koniec_slownika( $pdf, $p );
		if ( false === $k ) {
			continue;
		}
		$slownik = substr( $pdf, $p, $k - $p );
		if ( ! preg_match( '/\/Type\s*\/Page(?![A-Za-z])/', $slownik ) || ! preg_match( '/^\s*endobj/', substr( $pdf, $k, 20 ) ) ) {
			continue; // tylko obiekty stron (bez strumieni)
		}
		if ( ! preg_match( '/\/Contents\s*(\d+\s+\d+\s+R|\[[^\]]*\])/', $slownik, $mc, PREG_OFFSET_CAPTURE ) ) {
			continue;
		}
		// zasoby: w słowniku albo jako odwołanie (wtedy wstawiamy kopię ze zmianą)
		if ( preg_match( '/\/Resources\s*<</', $slownik, $mz, PREG_OFFSET_CAPTURE ) ) {
			$pz     = $mz[0][1] + strlen( $mz[0][0] ) - 2;
			$kz     = revion_pdf_koniec_slownika( $slownik, $pz );
			$zasoby = substr( $slownik, $pz, $kz - $pz );
			$zakres = array( $pz, $kz );
		} elseif ( preg_match( '/\/Resources\s+(\d+)\s+\d+\s+R/', $slownik, $mz, PREG_OFFSET_CAPTURE ) ) {
			$zasoby = revion_pdf_slownik_obiektu( $pdf, $offsety, (int) $mz[1][0] );
			$zakres = array( $mz[0][1] + strlen( '/Resources' ), $mz[0][1] + strlen( $mz[0][0] ) );
			if ( false === $zasoby ) {
				continue;
			}
			$zasoby = ' ' . $zasoby;
		} else {
			continue; // zasoby dziedziczone: pomijamy stronę, żeby niczego nie zepsuć
		}
		$noweZasoby = revion_pdf_dodaj_czcionke( ltrim( $zasoby ), $czcionka, $pdf, $offsety );
		if ( false === $noweZasoby ) {
			continue;
		}
		$szer = 420.0;
		$wys0 = 0.0;
		$x0   = 0.0;
		if ( preg_match( '/\/MediaBox\s*\[\s*([\d.\-]+)\s+([\d.\-]+)\s+([\d.\-]+)\s+([\d.\-]+)\s*\]/', $slownik, $mb ) ) {
			$szer = (float) $mb[3] - (float) $mb[1];
			$wys0 = (float) $mb[2];
			$x0   = (float) $mb[1];
		}
		$klucz = sprintf( '%.2f|%.2f', $szer, $wys0 );
		if ( ! isset( $teksty[ $klucz ] ) ) {
			$rozmiar = 6.5;
			$dl      = strlen( $napis ) * $rozmiar * 0.5;
			$x       = max( 12, ( $szer - $dl ) / 2 + $x0 );
			$tresc   = sprintf( "BT /RevF %.1f Tf 0.58 0.6 0.64 rg 1 0 0 1 %.2f %.2f Tm (%s) Tj ET\n", $rozmiar, $x, $wys0 + 9, $napis );
			$nr_t    = $nastepny++;
			$nowe[ $nr_t ]    = '<</Length ' . strlen( $tresc ) . ">>\nstream\n" . $tresc . "\nendstream";
			$teksty[ $klucz ] = $nr_t;
		}
		$zawartosc = trim( $mc[1][0], '[] ' );
		$noweZawartosci = '[' . $q . ' 0 R ' . $zawartosc . ' ' . $qq . ' 0 R ' . $teksty[ $klucz ] . ' 0 R]';
		// podmiana od końca, żeby przesunięcia się nie rozjechały
		$zmiany = array(
			array( $mc[1][1], strlen( $mc[1][0] ), $noweZawartosci ),
			array( $zakres[0], $zakres[1] - $zakres[0], ' ' . $noweZasoby ),
		);
		usort( $zmiany, function ( $a, $b ) {
			return $b[0] - $a[0];
		} );
		foreach ( $zmiany as $z ) {
			$slownik = substr( $slownik, 0, $z[0] ) . $z[2] . substr( $slownik, $z[0] + $z[1] );
		}
		$nowe[ $nr ] = $slownik;
		$strony++;
	}
	if ( ! $strony ) {
		return false;
	}

	$wynik = rtrim( $pdf ) . "\n";
	$pozycje = array();
	ksort( $nowe );
	foreach ( $nowe as $nr => $tresc ) {
		$pozycje[ $nr ] = strlen( $wynik );
		$wynik         .= $nr . " 0 obj\n" . $tresc . "\nendobj\n";
	}
	$xref   = strlen( $wynik );
	$wynik .= "xref\n";
	foreach ( $pozycje as $nr => $poz ) {
		$wynik .= $nr . " 1\n" . sprintf( '%010d 00000 n ', $poz ) . "\n";
	}
	$wynik .= "trailer\n<</Size " . $nastepny . ' /Root ' . $mr[1] . ( $info ? ' /Info ' . $info : '' ) . ( $id ? ' /ID ' . $id : '' ) . ' /Prev ' . $startxref . ">>\nstartxref\n" . $xref . "\n%%EOF\n";
	return $wynik;
}
