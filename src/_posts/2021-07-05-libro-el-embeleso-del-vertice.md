---
layout: post
title: Libro “Embeleso del vértice”
date: 2021-07-05 12:00:00 -0600
published: Julio 05, 2021
categories: proyectos
description: El embeleso de vértice es un experimento de conceptualización de la imágen a raíz del taller con el artista español Manuel Moranta.
keywords: colima, foto libro, fotografía, conceptualización, contemporánea
image: /images/embeleso/embeleso.jpg
lang: es_MX
---
Este libro es el resultado del taller de Conceptualización Visual con el artista visual español Manuel Moranta.

### Libro "El embeleso del vértice"
<div class="book" data-controller="book">
  <div class="book-wrapper" data-book-target="wrapper">
    {% for page in (0..10) %}
      {% assign paddedPage = page | prepend: '00' | slice: -2, 2 %}
      <div class="section" data-book-target="page">
        <img src="{{ "/images/embeleso/" | append: paddedPage | append: ".jpg" }}" loading="lazy" class="page" />
      </div>
    {% endfor %}
  </div>
  <div class="paginator" data-book-target="paginator"></div>
</div>
<p class="font-sans text-xs font-semibold text-center text-gray-600">Utilice las flechas del teclado para cambiar página<p>
