---
layout: orio-post
title: APIs con Ruby  
date: 2020-05-14 00:00:00 -0600
published: Mayo 14, 2020
categories: desarrollo
description: Recursos de la plática APIs con Ruby
keywords: rails, ruby, api, rest, desarrollo, integración
author: Mario Alberto Chávez
image: apis-con-ruby.jpg
---
# APIs con Ruby

El pasado 13 de mayo tuve una sesión de "streaming" para platicar sobre el desarrollo de APIs REST con Ruby. La plática
se dividió en varias secciones dónde se tocaron temas de qué herramientas hay para construir APIs con Ruby, los diferentes
estándares para construir APIs, herramientas para documentar, recursos para entender mejor qué es un API y cómo funciona,
entre otros temas.

El video ya está disponible para quienes no tuvieron la oportunidad de acompañarme.
<div style="text-align: center;">
  <iframe width="560" height="315" src="https://www.youtube.com/embed/ZRvcg3MSC0Y" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
</div>

Para la siguiente sesión hay que estar pendientes de mi cuenta de Twitter [@mario_chavez](https://twitter.com/mario_chavez){:target="_blank"}

## Recursos de plática

Para construir APIs con Ruby existen diversas opciones desde Ruby muy básico hasta frameworks completos como Rails. 

#### Rack API
[fnando/rack-api](https://github.com/fnando/rack-api){:target="_blank"}

#### Grape
[ruby-grape/grape](https://github.com/ruby-grape/grape){:target="_blank"}

#### Hanami
[Hanami](https://hanamirb.org){:target="_blank"}

#### Rails API
[Using Rails for API-only Applications - Ruby on Rails Guides](https://guides.rubyonrails.org/api_app.html){:target="_blank"}

### Referencias generales sobre APIs

Antes de aventurarnos a escribir un API realmente tenemos que entender de qué se trata un API y cuál es su relación con estándar HTTP.

#### Build APIs you won't hate
[Build APIs You Won't Hate](https://apisyouwonthate.com/books/build-apis-you-wont-hate){:target="_blank"}

#### El estándar de Open API
[Home - OpenAPI Initiative](https://www.openapis.org){:target="_blank"}

#### JSON API
[JSON:API](https://jsonapi.org){:target="_blank"}

#### The ION Hypermedia type
[The Ion Hypermedia Type](https://ionspec.org){:target="_blank"}

#### HAL - Hypertext application language
[The Hypertext Application Language](http://stateless.co/hal_specification.html){:target="_blank"}

### Editores

Escribir las especificaciones de un API puede ser una tarea complicada sin ayuda para asegurarnos que la estamos 
escribiendo de acuerdo al estándar que deseamos adoptar.

#### Stoplight Studio
[Stoplight Studio | OpenAPI Design, Planning & Modeling Tool](https://stoplight.io/studio/){:target="_blank"}

#### Swagger
[API Documentation & Design Tools for Teams | Swagger | Swagger](https://swagger.io/){:target="_blank"}

#### API Blueprint
[API Blueprint | API Blueprint](https://apiblueprint.org/){:target="_blank"}

[Keep your API in shape with API Blueprint](https://mariochavez.io/desarrollo/2018/08/02/keep-your-api-in-shape-with-api-blueprint.html){:target="_blank"}

### Lecciones a seguir

Todos los recursos disponibles ayudan a tener un mejor panorama al momento de crear un API pero no ayudan en lo 
específico a decidir cómo hacer el API. El siguiente post registra algunas experiencias basadas en el desarrollo de un
API que sea estándar y documentando.

#### Lecciones construyendo un API
[Lecciones construyendo un API REST](https://mariochavez.io/desarrollo/2019/12/30/lecciones-construyendo-un-api-rest.html){:target="_blank"}

### Implementación en Ruby

Ya conocimos algunas opciones sobre las cuales escribir nuestros APIs ahora toca el tema a herramientas específicas
que nos ayudan a seguir un camino estable y documentado al implementar un API.

#### Serializadores modernos
[Modern Ruby Serializers](https://vasilakisfil.social/blog/2020/01/20/modern-ruby-serializers/){:target="_blank"}

#### JSONAPI-RB
[jsonapi-rb/jsonapi-rb](https://github.com/jsonapi-rb/jsonapi-rb){:target="_blank"}

#### Committee
[interagent/committee](https://github.com/interagent/committee){:target="_blank"}

#### Writing a Hypermedia API client with Ruby
[Writing a Hypermedia API client in Ruby](https://thoughtbot.com/blog/writing-a-hypermedia-api-client-in-ruby){:target="_blank"}

#### Faster JSON generation with PostgreSQL
[Faster JSON Generation with PostgreSQL](https://hashrocket.com/blog/posts/faster-json-generation-with-postgresql){:target="_blank"}

#### Conditional GET with Rails
[ActionController::ConditionalGet](https://api.rubyonrails.org/classes/ActionController/ConditionalGet.html){:target="_blank"}

### Autentificación

Toda API requiere de algún mecanismo de autentificación. Dependiendo del uso de API vamos a tener dos opciones diferentes.

#### Token Authentication with Rails
[Token Authentication with Rails](https://thoughtbot.com/blog/token-authentication-with-rails){:target="_blank"}

### JSON Web Token
[jwt/ruby-jwt](https://github.com/jwt/ruby-jwt){:target="_blank"}

### El elefante blanco en el stream

Todo el material mostrado hasta este punto habla específicamente desde el punto de vistas de APIs REST y de la idea de
Phil Sturgeon de que realmente no conocemos REST aunque alguno de nostros juremos que hemos implementado APIs REST.
Es por eso que existe GraphQL, el cuál es una serie de "hacks" para crear APIs "más flexibles" a costa de ignorar el 
estándar HTTP.

### GraphQL
[GraphQL - Welcome](https://graphql-ruby.org/){:target="_blank"}

### Conclusiones
Para poder lograr un API exitosa y de la cuál no nos arrepintamos más adelante es necesario conocer qué es REST a fondo,
basarnos en elguno de los estándares disponibles y sobre todo que sea un API totalmente documentada. Todos los recursos
aquí mostrados ayudan a tener una idea más clara pero siempre es importante buscar inspiración en lo que otros hacen.

Busca en los servicios que consumes en tus aplicaciones cómo está documentada el API de los mismos, qué cosas son las que
te agradan de esa implementación y qué las que te desagradan, trata de seguir los pasos de esas APIs que te inspiran.

#### Stripe API
[Stripe API](https://stripe.com/docs/api){:target="_blank"}

#### Creditario API
[Creditario API](https://docs.creditar.io/){:target="_blank"}
