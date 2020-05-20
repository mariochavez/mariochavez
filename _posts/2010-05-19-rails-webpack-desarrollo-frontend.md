---
layout: orio-post
title: Rails, Webpack y desarrollo frontend con Javascript
date: 2020-05-19 01:00:00 -0600
published: Mayo 19, 2020
categories: desarrollo
description: Recursos de la plática Rails, Webpack y desarrollo frontend con Javascript
keywords: rails, ruby, webpack, javascript, desarrollo, stimulus, turbolink
author: Mario Alberto Chávez
image: frontend.jpg
---
# Rails, Webpack y desarrollo frontend con Javascript

El 19 de Mayo tuve una sesión de "streaming" para platicar sobre el desarrollo de frontend con Javascript en Rails. El video y los recurso están listados en este post.

El video ya está disponible para quienes no tuvieron la oportunidad de acompañarme.
<div style="text-align: center;">
  <iframe width="862" height="485" src="https://www.youtube.com/embed/maFimVOh3b4" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
</div>

Para la siguiente sesión hay que estar pendientes de mi cuenta de Twitter [@mario_chavez](https://twitter.com/mario_chavez){:target="_blank"}

## Recursos de plática
En el 2011 DHH anuncio que Javascript y compañía serian ciudadanos de primera clase en las aplicaciones de Rails. Oficialmente le daba la bienvenida a CoffeeScript, SCSS y JQuery. En su momento fue el paso correcto ya que el desarrollo de Frontend requería de un dinamismo que todos en el mundo de Rails estaban haciendo pero no había una guía exacta de cómo hacerle.

[From the Asset Pipeline to Webpack](https://mariochavez.io/desarrollo/2020/05/19/from-the-asset-pipeline-to-webpack.html){:target="_blank"}

El Asset Pipeline vino a ser esa guía hasta que ya no lo fue más. React, Angular, Vue y otros vinieron a cambiar el panorama del desarrollo de Frontend, el Frontend ya no era HTML o por lo menos no era como lo conocíamos.

Y aunque se hicieron ajustes al Asset Pipeline para adaptarse a los nuevos requisitos, simplemente no fue suficiente. Hacer que una aplicación de React se compilara mediante el Asset Pipeline ya no era algo trivial.

Seis años más tarde en mismo DHH anunciaba que Webpack tendría integración con Rails y un año más tarde que Webpack era el default para toda nueva aplicación de Rails. Este cambio hacía más sencillo la integración de nuevas tecnologías en el Frontend con Rails.

Sin embargo la geografía de las aplicaciones había cambiado desde antes de esos anuncios. El Frontend era una aplicación independiente, compilada y distribuida aparte del Backend. El Backend ya no era una sólo aplicación, posiblemente eran varias, eran microservicios.

Esto representó otro problema técnico, asegurar que los cambios de Frontend y Backend se realizaran de forma paralela. El hacer QA se complicaba ya que ahora era necesario levantar al menos dos aplicaciones, el Frontend y el Backend. Hacer pruebas automáticas de integración ni pensarlo. La complejidad del desarrollo de las aplicaciones también se lleva su parte.

Independientemente de cual sea nuestro sentir, al menos Rails no se interpone en el camino de querer remplazar el Frontend con alguna tecnología con Javascript. Y aunque algunos de los comentarios de separar el Frontend a su propio repositorio van en el sentido de dividir el desarrollo a final de cuentas depende de alguna manera del Backend. Otro de los comentarios es la distribución de los assets, la cuál se puede hacer sin ningún problema con un servicio como [Cloudflare](https://www.cloudflare.com/){:target="_blank"}

La gente de Evil Martians tiene tres posts de cómo trabajar de forma moderna con Javascript y Rails.

[Evil Front Part 1: Modern Front-end in Rails - Martian Chronicles](https://evilmartians.com/chronicles/evil-front-part-1){:target="_blank"}

Si la intención es hacer una SPA o Single Page Application con el Backend de Rails, gracias a Webpacker, Rails no va a ser un obstáculo al respecto, inclusive cuenta con algunos generadores que nos van ayudar en la tarea de hacer el "boilerplate" de la aplicación. 

En el modelo de Omakase de Rails el empuje sigue en una dirección contraria a las SPA. Es por eso que  que StimulsJS fue liberado hace un par de años.

[A modest JavaScript framework for the HTML you already have.](https://stimulusjs.org/){:target="_blank"}

StimulusJS es una librería de Javascript que puede hacer data-binding a elementos en el DOM así como reaccionar a eventos. Lo importante de StimulusJS es que no se apropia del HTML y DOM si no que trabaja con él. Esto quiere decir que Rails aún tiene que servir sus vistas en HTML. Es mi librería de defacto para proyectos dónde no sea realmente necesario React o Angular. - A final de cuentas no soy ni Facebook ni Google -.

Funciona sin problemas con Turbolinks, el cuál ha mejorado increíblemente desde las primeras versiones y en realidad entre ambos hacen que las páginas respondan casi de forma instantánea con muy poco código.

[turbolinks/turbolinks](https://github.com/turbolinks/turbolinks){:target="_blank"}

Tal es el caso que la gente de The Changelog lo utiliza aún cuando su aplicación no es Rails.

[Why we chose Turbolinks](https://changelog.com/posts/why-we-chose-turbolinks){:target="_blank"}

HoneyBadger tiene unos muy buenos concejos para usar Turbolink sin dispararse en el pie.

[How We Migrated To Turbolinks Without Breaking Javascript](https://www.honeybadger.io/blog/turbolinks/){:target="_blank"}

Entre Turbolinks y StimulusJS realmente vale a la pena detener un momento y preguntarnos si realmente necesitamos una SPA.

[Escaping the SPA rabbit hole with modern Rails](https://medium.com/@jmanrubia/escaping-the-spa-rabbit-hole-with-turbolinks-903f942bf52c){:target="_blank"}

Para quienes quieran explorar StimulusJS les comparto una lista de ejemplo de cosas básicas para ser utilizado.

[Stimulus.js Tutorials * Blogging On Rails](https://onrails.blog/stimulus-js-tutorials/){:target="_blank"}

La adopción de StimulusJS ya comienza a cuestionarnos sobre patrones y mejores formas de adopción, definitivamente el crear componentes compuestos hasta este momento es lo que mejor me ha funcionado.

[Introducing Stimulus-use composable behaviors for your controllers](https://dev.to/adrienpoly/introducing-stimulus-use-composable-behaviors-for-your-controllers-mlc){:target="_blank"}

La gente de Basecamp está trabajando en su propio cliente de correo electrónico llamado Hey. Es posible que el 5 de Junio lo abran en nivel beta. Esta hecho con Rails, Turbolinks y StimulusJS.

[HEY](https://hey.com/){:target="_blank"}

DHH anunció que va a revisar de forma pública los cambios, mejoras y patrones que emplearon para el desarrollo del cliente, el cuál aparentemente no tiene muchas dependencias de Javascript.

[https://twitter.com/_swanson/status/1253037966710181892](https://twitter.com/_swanson/status/1253037966710181892){:target="_blank"}

Stimulus está en evolución. Hace unas semanas vi un video de demostración de Stimulus-Reflex y CableReady. Dos herramientas que aprovechan ActionCable para hacer aplicaciones reactivas mediante sockets sin escribir una sola línea de Javascript.

[https://twitter.com/mario_chavez/status/1256263180722081792](https://twitter.com/mario_chavez/status/1256263180722081792){:target="_blank"}

Fue simplemente un deleite ver como funcionaba.

[Stimulux Reflex](https://docs.stimulusreflex.com/){:target="_blank"}

[Cable Ready](https://cableready.stimulusreflex.com/){:target="_blank"}

Creo que hay mucho camino aún por recorrer en mundo de Rails para hacer aplicaciones que sean rápidas y fáciles de desarrollar, que de gusto trabajar en ellas en pocas palabras. Pero tenemos que ser consientes que Rails es aburrido, ya no es ese espejito brillante.

Facebook hace unos días cambió su interfase gráfica, es "diferente". El equipo técnico de Facebook escribió un post explicando como movieron todo a React y Relay y dividieron los assets en pequeños bundles con la finalidad de que fuera más rápida. Veredicto ... es más lenta.

[Rebuilding our tech stack for a new Facebook.com - Facebook Engineering](https://engineering.fb.com/web/facebook-redesign/){:target="_blank"}

Finalmente sobre los comentarios que hice sobre microservicios anteriormente les dejo el siguiente tweet de un ingeniero de Uber para que ustedes mismos se creen su propio criterio.

[https://twitter.com/GergelyOrosz/status/1247132806041546754](https://twitter.com/GergelyOrosz/status/1247132806041546754){:target="_blank"}