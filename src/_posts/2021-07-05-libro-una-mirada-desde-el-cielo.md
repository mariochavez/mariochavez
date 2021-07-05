---
layout: post
title: Libro “Una mirada desde el cielo”
date: 2021-07-05 11:00:00 -0600
published: Julio 05, 2021
categories: proyectos
description: Fotografía de dron de los 10 municipios del Estados de Colima.
keywords: colima, foto libro, fotografía, dron, dji, aérea, comala, manzanillo
image: /images/mirada/una-mirada.jpg
lang: es_MX
---
La fotografía de dron permite tener una perspectiva poco usual del lugar donde vivimos. Este libro trata precisamente de ofrecer esa perspectiva única de los 10 municipios de Estado de Colima.

Este libro representa el recorrido por cerca de tres años de visitar los municipios en diferentes épocas del año.

### Libro "Una mirada desde el cielo"
<div class="book" data-controller="book">
  <div class="book-wrapper" data-book-target="wrapper">
    {% for page in (0..76) %}
      {% assign paddedPage = page | prepend: '00' | slice: -2, 2 %}
      <div class="section" data-book-target="page">
        <img src="{{ "/images/mirada/" | append: paddedPage | append: ".jpg" }}" loading="lazy" class="page" style="height: 70%; margin: auto;" />
      </div>
    {% endfor %}
  </div>
  <div class="paginator" data-book-target="paginator"></div>
</div>
<p class="font-sans text-xs font-semibold text-center text-gray-600">Utilice las flechas del teclado para cambiar página<p>
