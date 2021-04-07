---
layout: post
title: "Serie: Contruyendo un servidor Web con Ruby"
date: 2019-06-01 12:00:00 -0600
published: Junio 01, 2019
categories: proyectos
description: Serie enfocada a explicar cómo construir un servidor Web en Ruby que se apegue lo más cercano a la especificación de HTTP/1.1.
keywords: web, ruby, http, development, server
image: /images/serie/construyendo-servidor-web.png
lang: es_MX
---
La serie "Contruyendo un servidor Web con Ruby" está enfocada a explicar cómo construir un servidor Web en Ruby que se apegue lo más cercano a la especificación de HTTP/1.1 por lo que en video no únicamente se aprenderá Ruby y como construir el servidor pero también que es el HTTP y cómo ser un buen ciudadano Web.

Es importante notar que la serie no se trata de cómo utilizar <a href='https://rack.github.io' target='_blank'>Rack</a>, realmente se trata de cómo hacer uso de la clase <a href='https://ruby-doc.org/stdlib-2.4.0/libdoc/socket/rdoc/TCPServer.html' target='_blank'> e ir paso a paso creando el servidor mientras se implementa la interpretación del estándar HTTP/1.1 y de paso porque no, aprender algo de Ruby.

A través de las sesiones poco a poco se realizará la implementación en algunos casos agregando funcionalidad en otros refactorizando para preparar
el código para la siguiente iteración.

Los videos salen cada semana en viernes. La lista de las sesiones es la siguiente y la estaré actualizando conforme se liberen los videos.
- <a href='http://bit.ly/rubywebserver1' target='_blank'>Sesión 1</a>: Plática sobre el estándar de HTTP/1.1; verbos, estatuses y headers.
- <a href='http://bit.ly/rubywebserver2' target='_blank'>Sesión 2</a>: El servidor Web más sencillo en Ruby.
- <a href='http://bit.ly/rubywebserver3' target='_blank'>Sesión 3</a>: Refactorización de la clase Request.
- <a href='http://bit.ly/rubywebserver4' target='_blank'>Sesión 4</a>: Refactorización de la clase Response.
- <a href='http://bit.ly/rubywebserver5' target='_blank'>Sesión 5</a>: Agregando funcionalidad para servir assets estáticos.
