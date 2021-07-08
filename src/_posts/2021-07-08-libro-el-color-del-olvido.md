---
layout: post
title: Libro “El color del olvido”
date: 2021-07-08 12:00:00 -0600
published: Julio 08, 2021
categories: proyectos
description: El color del olvido es un experimento del taller Nuevo reportaje del fotógrafo Ricardo Cases.
keywords: colima, foto libro, fotografía, conceptualización, contemporánea
image: /images/color/color.jpg
lang: es_MX
---
Este libro es el resultado del taller Nuevo reportaje del fotógrafo Ricardo Cases.

### Libro "El color del olvido"
<div class="book" data-controller="book">
  <div class="book-wrapper" data-book-target="wrapper">
    {% for page in (0..19) %}
      {% assign paddedPage = page | prepend: '00' | slice: -2, 2 %}
      <div class="section" data-book-target="page">
        <img src="{{ "/images/color/" | append: paddedPage | append: ".jpg" }}" loading="lazy" class="page" />
      </div>
    {% endfor %}
  </div>
  <div class="paginator" data-book-target="paginator"></div>
</div>
<p class="font-sans text-xs font-semibold text-center text-gray-600">Utilice las flechas del teclado para cambiar página<p>
