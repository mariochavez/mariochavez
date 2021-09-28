---
layout: post
title: La Cofradía de los volcanes
date: 2021-08-31 12:00:00 -0600
published: Agosto 31, 2021
categories: proyectos
description: La Cofradía de los Volcanes es un trabajo sobre la exploración del territorio que circunda los Volcanes de Fuego y Nevado de Colima.
keywords: colima, foto, fotografía, photography, volcano
image: /images/cofradia_libro/04.jpg
lang: en_MX
---
La Cofradía de los Volcanes es un trabajo sobre la exploración del territorio que circunda los Volcanes de Fuego y Nevado de Colima.

<div class="book" data-controller="book">
  <div class="book-wrapper" data-book-target="wrapper">
    {% for page in (0..28) %}
      {% assign paddedPage = page | prepend: '00' | slice: -2, 2 %}
      <div class="section" data-book-target="page">
        <img src="{{ "/images/cofradia_libro/" | append: paddedPage | append: ".jpg" }}" loading="lazy" class="page" />
      </div>
    {% endfor %}
  </div>
  <div class="paginator" data-book-target="paginator"></div>
</div>
<p class="font-sans text-xs font-semibold text-center text-gray-600">Utilice las flechas del teclado para cambiar página<p>