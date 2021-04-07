---
layout: post
title: Identificar, evaluar y solucionar problemas de performance con Ruby
date: 2020-05-27 01:00:00 -0600
published: Mayo 27, 2020
categories: desarrollo
description: Recursos de la plática Identificar, evaluar y solucionar problemas de performance con Ruby
keywords: rails, ruby, performace, postgresql, desarrollo, debug, profiler, stackprof
image: /images/performance/performance.jpg
lang: es_MX
---
# Identificar, evaluar y solucionar problemas de performance con Ruby

El 27 de Mayo tuve una sesión de "streaming" para platicar sobre como identificar, evaluar y solucionar problemas de performance en Ruby. El video y los recurso están listados en este post.

El video ya está disponible para quienes no tuvieron la oportunidad de acompañarme.

<div class="aspect-w-16 aspect-h-9">
  <iframe src="https://www.youtube.com/embed/Kh4k4RcUsyA" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
</div>

Para la siguiente sesión hay que estar pendientes de mi cuenta de Twitter [@mario_chavez](https://twitter.com/mario_chavez ){:target="_blank"}

## Recursos de plática
Ruby no es el lenguaje más rápido del mundo en términos de ejecución por lo que siempre hay que considerar si la forma en como escribimos nuestros programas es la mejor en aspectos como legibilidad y rendimiento.

Escribiendo Ruby rápido (Erik Michaels-Ober )

<div class="aspect-w-16 aspect-h-9">
  <iframe src="https://www.youtube.com/embed/fGFM_UrSp70" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
</div>

Juanito Fatas (Core Ruby ) documentó en un repositorio de Github las diferentes formas de escribir el mismo código en Ruby para determinar cuál es más rápida, todo basado en la plática de Erik Michaels-Ober.

[JuanitoFatas/fast-ruby](https://github.com/JuanitoFatas/fast-ruby ){:target="_blank"}

El pragma `frozen_string_literal` puede ayudar a reducir el consumo de memoria en un programa de Ruby 2.3 o mejor.

[Ruby Optimization with One Magic Comment](https://www.mikeperham.com/2018/02/28/ruby-optimization-with-one-magic-comment/ ){:target="_blank"}

Cómo funciona la máquina virtual de Ruby (Mario Chávez)

<div class="aspect-w-16 aspect-h-9">
  <iframe src="https://www.youtube.com/embed/PT5UO23zOHc" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
</div>

La herramienta Benchmark IPS es básica para poder medir y comparar como una propuesta de código es más rápida o más lenta que otra. La clave para medir el rendimiento son las métricas.

[evanphx/benchmark-ips](https://github.com/evanphx/benchmark-ips ){:target="_blank"}

Rails agregó un generador para poder generar pruebas de performance.

[Rails has added a benchmark generator](https://blog.saeloun.com/2020/02/11/rails-benchmark-generator.html ){:target="_blank"}

En el Keynote de Aaron Patterson de Railsconf habla de cómo identifica problemas de performace con Benchmark IPS y Stackprof

[Railsconf2020](https://railsconf.org/2020/video/aaron-patterson-aaron-patterson-s-variety-show ){:target="_blank"}

Stackprof ayuda para conocer en que parte de nuestro código es que Ruby está tomando más tiempo.

[StackProf: The Holy Grail of Rails Profiling](https://scoutapm.com/blog/profiling-rails-with-stackprof ){:target="_blank"}

Menos código es código más rápido. Es necesario revisar las dependencias de nuestros programas y eliminar todo lo que no es necesario.

[Kill Your Dependencies](https://www.mikeperham.com/2016/02/09/kill-your-dependencies/ ){:target="_blank"}

Rack Miniprofiler una una herramienta útil para entender el performace en aplicaciones Rack, como Sinatra o Rails.

[rack-mini-profiler - the Secret Weapon of Ruby and Rails Speed](https://www.speedshop.co/2015/08/05/rack-mini-profiler-the-secret-weapon.html ){:target="_blank"}

Derailed es otra herramienta que ayuda a entender estáticamente problemas de consumo de memoria y performance para aplicaciones de Rails.

[Patching Rails Performance](https://blog.heroku.com/patching-rails-performance ){:target="_blank"}

Derailed en Github

[schneems/derailed_benchmarks](https://github.com/schneems/derailed_benchmarks ){:target="_blank"}

Si en este punto tu código en Ruby está tan optimizado como es posible quizás el problema de performance tiene que ver con el acceso a la Base de Datos. Existen patrones que aunque parecen insignificantes pueden causar problemas de performance en ActiveRecord y posiblemente existan situaciones similares con otros ORM en Ruby.

[3 ActiveRecord Mistakes That Slow Down Rails Apps: Count, Where and Present](https://www.speedshop.co/2019/01/10/three-activerecord-mistakes.html ){:target="_blank"}

El infame problema de N+1 en los queries.

[Fighting the Hydra of N+1 queries - Martian Chronicles](https://evilmartians.com/chronicles/fighting-the-hydra-of-n-plus-one-queries ){:target="_blank"}

La falta de indices o actualización de los mismos con el paso del tiempo también pueden representar un problema de performance en una aplicación.

[Faster Rails: Is Your Database Properly Indexed? - Semaphore](https://semaphoreci.com/blog/2017/05/09/faster-rails-is-your-database-properly-indexed.html ){:target="_blank"}

Si usas una base de datos como Postgresql hay tareas de mantenimiento regulares que debe de recibir para asegurar el mejor de los performance.

[Simple Tips for PostgreSQL Query Optimization](https://statsbot.co/blog/postgresql-query-optimization/ ){:target="_blank"}

PgHero es una herramienta que puede ayudar con el monitoreo del performance de la base de datos.

[ankane/pghero](https://github.com/ankane/pghero ){:target="_blank"}

Rails hace que el caching sea muy sencillo pero también es fácil cometer errores. Russian Doll Caching pueden ayudar para evitar renderizar las vistas cada vez que son requeridas.

[Russian doll caching in Rails](https://blog.appsignal.com/2018/04/03/russian-doll-caching-in-rails.html ){:target="_blank"}

En modo de producción también hay bastante que hacer para asegurar que las aplicaciones funcionan lo mejor posible. Por ejemplo compilar Ruby con JMalloc y obtener un beneficio en el consumo de memoria.

[How we halved our memory consumption in Rails with jemalloc](https://medium.com/rubyinside/how-we-halved-our-memory-consumption-in-rails-with-jemalloc-86afa4e54aa3 ){:target="_blank"}

Configurar Puma (o Unicorn) para un mejor rendimiento es importante.

[Configuring Puma, Unicorn and Passenger for Maximum Efficiency](https://www.speedshop.co/2017/10/12/appserver.html ){:target="_blank"}

Otra guía para entender como llegar a la configuración perfecta con Puma.

[A Simpler Rails Benchmark, Puma and Concurrency - Appfolio Engineering](http://engineering.appfolio.com/appfolio-engineering/2019/4/11/a-simpler-rails-benchmark-puma-and-concurrency ){:target="_blank"}

Si ponemos todos los links mencionados en acción llegaremos a un par de guías de cómo optimizar todo lo posible para mejorar el rendimiento de nuestras aplicaciones.

[How to Fix Slow Code in Ruby](https://engineering.shopify.com/blogs/engineering/how-fix-slow-code-ruby ){:target="_blank"}

[Rails is Fast: Optimize Your View Performance](https://blog.appsignal.com/2020/01/22/rails-is-fast-optimize-your-view-performance.html ){:target="_blank"}

La siguiente guía nos lleva de la mano a sacar la mejor ventaja de Heroku.

[Big on Heroku: Scaling Fountain without losing a drop - Martian Chronicles](https://evilmartians.com/chronicles/big-on-heroku-scaling-fountain-without-losing-a-drop ){:target="_blank"}

Finalmente algunas herramientas de las que podemos echar mano para ayudarnos a solucionar problemas de performance.

Una de ellas es TracePoint de Ruby que nos ayuda a encontrar los lugares en los que se ejecuta código como creación de objetos, ejecución de queries y otras cosas que pueden ser inesperadas.

[Changing the Approach to Debugging in Ruby with TracePoint](https://blog.appsignal.com/2020/04/01/changing-the-approach-to-debugging-in-ruby-with-tracepoint.html ){:target="_blank"}

SI queremos monitorear nuestra aplicación Skiylight es la herramienta más sencilla del mercado.

[Skylight](https://www.skylight.io ){:target="_blank"}

La guía completa de performance en aplicaciones Rails basada en problemas reales de consultoría.

[The Complete Guide to Rails Performance](https://www.railsspeed.com ){:target="_blank"}

Finalmente les dejo este post con la pregunta si Ruby es demasiado lento para escalar.

[Is Ruby Too Slow For Web-Scale?](https://www.speedshop.co/2017/07/11/is-ruby-too-slow-for-web-scale.html ){:target="_blank"}
