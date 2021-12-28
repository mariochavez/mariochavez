---
layout: post
title: Libro “Los Chayacates de Ixtlahuacán, Una historia de tradición y devoción”
date: 2021-07-04 12:00:00 -0600
published: Julio 04, 2021
categories: proyectos
description: Trabajo de documentación y foto libro de la festividad de los Chayacates de Ixtlahuacán
keywords: colima, foto libro, fotografía, fiesta popular, chayacates, ixtlahucán
image: /images/foto_libro/IMG_6268.jpg
lang: es_MX
---
La fiesta popular de "Los Chayacates de Ixtlahuacán" sucede cada 5 y 6 de Enero en la cabecera municipal de Ixtlahuacán de los Reyes Colima.

El fervor de los habiatntes del pueblo, las manifestaciones de color, participación, unión y amistad celebran el evento de Epifanía con devoción y respecto, combinando las creencias religiosas con pinceladas de ritos prehispánicos.

Los Chayacates, son cuatro personajes indígenas ataviados con máscaras blancas de madera de colorín, trenzas de fibra de acapán y vestuario de ixtle. Estos personajes, al igual que los Reyes Magos, se enteran del nacimiento de Jesus en Belén y son guiados por el olfato de sus perros  hasta él.

La fiesta alcanza a todo el pueblo con la típica pastorela y el recorrido y danzas de los cuatro Chayacates quienes van preguntando en náhuatl "Campa mutla catiles, endios sipilzin" por el niño Dios.

### Libro "Los Chayacates de Ixtlahuacán, Una historia de tradición y devoción"
<div class="book" data-controller="book">
  <div class="book-wrapper" data-book-target="wrapper">
    {% for page in (0..22) %}
      {% assign paddedPage = page | prepend: '00' | slice: -2, 2 %}
      <div class="section" data-book-target="page">
        <img src="{{ "/images/chayacates_libro/" | append: paddedPage | append: ".jpg" }}" loading="lazy" class="page" />
      </div>
    {% endfor %}
  </div>
  <div class="paginator" data-book-target="paginator"></div>
</div>
<p class="font-sans text-xs font-semibold text-center text-gray-600">Utilice las flechas del teclado para cambiar página<p>
