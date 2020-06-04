---
layout: orio-post
title: Escribiendo un cliente Rest que haga cache de la solicitudes
date: 2020-06-04 00:00:00 -0600
published: Junio 04, 2020
categories: desarrollo
description: El desarrollar y mantener un API REST requiere de conocer el estándar de HTTP para tratar de obtener el mejor provecho y ofrecer mejores APIs para los clientes. Como parte del trabajo de mantener un API REST también incluye el asegurarse que los clientes hagan uso efectivo de las facilidades del API.
keywords: rails, ruby, api, rest, cache, desarrollo, integración
author: Mario Alberto Chávez
image: cliente-rest.jpg
---
Hace algunos meses escribí el post "[Lecciones construyendo un API REST](https://mariochavez.io/desarrollo/2019/12/30/lecciones-construyendo-un-api-rest.html){:target="_blank"} " donde hablo sobre lo aprendido e implementado en la construcción de un API REST para [Creditar.io](https://creditar.io){:target="_blank"} , el producto plataforma Fintech que mi equipo construyó.

Todas las lecciones ahí descritas aplican para cuando estamos desarrollando la parte del servidor o Backend pero deja fuera al cliente que se encarga de consumir ese API.

En este post voy precisamente a tocar el tema del cliente pero antes vamos a enfocarnos en un par de encabezados de HTTP que van a ayudar a que el cliente sea más efectivo.

## GET Condicional

En el estándar de HTTP existen dos encabezados que pueden ayudar a los servidores a decidir si envían respuesta a una petición con el estatus 200 o si no envían respuesta con el status 304. Esos dos encabezados son `ETag` y `Last-Modified`.

En una aplicación de API de Rail cuando hacemos una petición como la siguiente

```bash
$ curl -I [http://localhost:3000/books](http://localhost:3000/books) -H 'Accept: application/json'
```

El servidor responde con el contenido *JSON* de la petición pero además en los encabezados envía el valor de `ETag`. 

```bash
HTTP/1.1 200 OK
X-Frame-Options: SAMEORIGIN
X-XSS-Protection: 1; mode=block
X-Content-Type-Options: nosniff
X-Download-Options: noopen
X-Permitted-Cross-Domain-Policies: none
Referrer-Policy: strict-origin-when-cross-origin
Content-Type: application/json; charset=utf-8
ETag: W/"c648786499da3bb30fa94437fd64399e"
Cache-Control: max-age=0, private, must-revalidate
X-Request-Id: bd9aca1f-42ea-43da-a113-cbbf80fbf727
X-Runtime: 0.185222
```

`ETag` es una valor que Rails calcula para nuestra petición y que en teoría si la respuesta a la misma petición no cambia el valor de `Etag` se mantendría constante ya que se calcula sobre la respuesta.

Usando el valor de `ETag` en nuestra peticiones podemos lograr algo llamado **Get Condicional** para agilizar la respuesta desde el servidor. Rails nos ofrece el método `#stale?` precisamente para tomar ventaja de este encabezado.

Veamos un ejemplo de cómo utilizar `#stale?` en un controlador.

```
def index
    @books = Book.all

    if stale?(@books)
      respond_to do |format|
        format.html { render :index }
        format.json { render json: @books }
      end
    end
  end
```

Aquí vemos que nuestro controlador ejecuta el *query* para obtener los datos que requerimos pero en lugar de pasarlos directamente para que sean serializados y enviados al cliente que hizo la petición los pasamos como parámetro a `#stale?` y el código que serializa y envía la respuesta lo ponemos dentro de un `if`.

En este punto si hacemos la misma llamada que hicimos anteriormente vemos que los encabezados cambian un poco.

```bash
$ curl -I [http://localhost:3000/books](http://localhost:3000/books) -H 'Accept: application/json'

HTTP/1.1 200 OK
X-Frame-Options: SAMEORIGIN
X-XSS-Protection: 1; mode=block
X-Content-Type-Options: nosniff
X-Download-Options: noopen
X-Permitted-Cross-Domain-Policies: none
Referrer-Policy: strict-origin-when-cross-origin
ETag: W/"180329663bde620b442e03d9010ce297"
Last-Modified: Wed, 29 Apr 2020 18:03:17 GMT
Content-Type: application/json; charset=utf-8
Cache-Control: max-age=0, private, must-revalidate
X-Request-Id: 482a861c-c30c-49e8-bd27-ebb07023a702
X-Runtime: 0.092157
```

Primeramente vemos que el valor de `ETag` cambió. Este valor está calculado en base al resultado del *query* `@books = Book.all` y siempre que el *query* regrese los mismos registros ese valor va a ser exactamente igual. Además, vemos que ahora el servidor nos envía el encabezado `Last-Modified` el cual tiene una fecha que corresponde al atributo `#modified_at` de los registros del query, en este caso toma el valor del registro modificado más recientemente.

De la llamada anterior Rails nos ofrece la siguientes estadísticas.

```bash
Completed 200 OK in 26ms (Views: 10.1ms | ActiveRecord: 1.4ms | Allocations: 10915)
```

Si volvemos a realizar la llamada al API pero ahora incluimos los valores de los encabezados `ETag` y `Last-Modified` de la siguiente forma. `If-None-Match` con el valor de `ETag` y `If-Modified-Since` para `Last-Modified`.

```bash
$ curl -I [http://localhost:3000/books](http://localhost:3000/books) -H 'Accept: application/json' -H 'If-None-Match: W/"180329663bde620b442e03d9010ce297"' -H 'If-Modified-Since: Wed, 29 Apr 2020 18:03:17 GMT'
```

Rails va ejecutar el *query*  pero el método `#stale?` va a calcular el `ETag` y `Last-Modified` para los registros del *query* para luego compararlos con los valores que recibimos en los encabezados de la petición. En el caso de ser los mismos Rails ya no ejecuta el resto del código - el código dentro del `if` - y regresa una respuesta vacía con el estatus *304 Not modified*. Esto le indica al cliente que el resultado de la petición no ha cambiado con respecto a la petición previa. 

Ahora Rails nos ofrece las siguientes estadísticas.

```bash
Completed 304 Not Modified in 4ms (ActiveRecord: 0.4ms | Allocations: 1667)
```

Automáticamente la respuesta del servidor fue más eficiente. Ejecutó menos código, utilizó menos memoria y envió menos datos a través de la red. A esto se le conoce como **GET condicional**.

En [Creditar.io](https://creditar.io){:target="_blank"}  recientemente hicimos este ajuste en el API para utilizar `#stale?` y dar la oportunidad de realizar **GET Condicional**. El cambio en el código fue bastante trivial.

Ahora los clientes que consumen ese API tienen la oportunidad de recibir menos datos a través de la red y hacer que las peticiones sean más rápidas. Para quienes utilizan la gema de [Creditar.io](https://creditar.io){:target="_blank"}  en su versión más reciente pueden tener ese beneficio simplemente habilitando el cache de Rails.

## Escribiendo mi propio cliente

Ahora que conocemos que un **GET Condicional** y que vimos como implementarlo en Rails vamos a escribir un cliente de REST sencillo que nos permita tomar ventaja de los encabezados `ETag` y `Last-Modified`.

Como librería de HTTP en Ruby vamos a hacer uso de [HTTPX](https://gitlab.com/honeyryderchuck/httpx){:target="_blank"}  aunque no vamos a explotar toda la funcionalidad de la misma este post puede ser un inicio para que si están interesados experimenten con la funcionalidad de HTTP2 o el mulit-request con una sola conexión en HTTP1 entre otras cosas.

El cliente que vamos a escribir es bastante simple y sólo cubre un par de recursos en el API de [Creditar.io](https://creditar.io){:target="_blank"} ; el *endpoint* para obtener un cliente y el *endpoint* para leer una solicitud.

El código del cliente es el siguiente.

```ruby
class ApiClient
  def self.fetch_customer(id, use_cache: true)
    new("https://#{Rails.application.credentials.creditario[:host]}/customers/#{id}", method: :get, use_cache: use_cache).execute
  end

  def self.fetch_application(id, use_cache: true)
    new("https://#{Rails.application.credentials.creditario[:host]}/applications/#{id}?include=attachments", method: :get, use_cache: use_cache).execute
  end

  def initialize(url, method: :get, use_cache: true)
    @url = url
    @method = method
    @use_cache = use_cache
  end

  def execute
    payload = @use_cache ? cache_read_url(@url).dig(:payload) : ""
    httpx = build_request(@url)

    case @method
    when :get then execute_get(httpx, @url, payload)
    end
  end

  private

  def cache_read_url(url)
    @cached_response ||= Rails.cache.read(url) || {}
  end

  def cache_write_response(response, url)
    Rails.cache.write(url, {
      payload: response.body.read,
      etag: response.headers["ETag"],
      modified_since: response.headers["Last-Modified"]
    })
  end

  def execute_get(httpx, url, response)
    new_response = httpx.get(url)

    if new_response.status == 200
      cache_write_response(new_response, url) if @use_cache
      JSON.parse(new_response.body.read)
    elsif new_response.status == 304
      JSON.parse(response)
    end
  end

  def build_request(url)
    headers = {
      "Accept" => "application/vnd.creditar.v1+json",
      "Content-Type" => "application/json",
      "Application-Context" => "sandbox",
      "Authorization" => "Token token=#{Rails.application.credentials.creditario[:api_key]}"
    }

    if @use_cache
      etag = cache_read_url(url).dig(:etag)
      modified_since = cache_read_url(url).dig(:modified_since)

      headers["If-None-Match"] = etag if etag.present?
      headers["If-Modified-Since"] = modified_since if modified_since.present?
    end

    HTTPX.with_headers(headers)
  end
end
```

Los métodos `#fetch_customer` y `#fetch_application` están a nivel de clase. Estos reciben dos parámetros: id del recursos y opcionalmente si queremos utilizar el cache o no. Ambos al ejecutarse crean una instancia de la clase `ApiClient` para posteriormente ejecutar la llamada con la URL al recurso que construyó cada método.

Antes de realizar la llamada configura los encabezados HTTP que van a ser enviados al servidor. Hay algunos que son base y estan `ETag` y `Last-Modified` que van a ser enviados únicamente si se cumplen dos condiciones:

- La opción de utilizar cache es verdadera
- Tenemos en cache para esa URL una copia de esos encabezados de alguna llamada previa

Para el cache, en este caso, estamos utilizando el cache configurado con Rails. En el cache utilizamos la URL completa con parámetros como llave y como valor guardamos una estructura similar a la siguiente:

```json
{
  etag: "W\484848484",
  modified-since: "Wed, 25 March 2020",
  payload: "{...}"
}
```

Al realizar la llamada verificamos el estatus de respuesta. Si es 200 quiere decir que el servidor nos envió una nueva copia de la información, ya sea porque no enviamos los encabezados `ETag` y `Last-Modified` o bien, los enviamos pero hubo nueva información en el servidor.

Si estamos utilizando cache guardamos los encabezados y una copia de los datos para llamadas posteriores y retornamos el resultado de la llamada.

En caso de que el estatus de la respuesta haya sido 304, quiere decir que enviamos los encabezados `ETag` y `Last-Modified` y que el servidor no encontró información nueva, por lo tanto solo nos regresa el estatus 304 sin datos. En este punto extraemos la copia de los datos que tenemos en el cache y eso es lo que retornamos como resultado de la llamada.

Técnicamente para quien utilice nuestro cliente REST va a ser totalmente transparente si los datos vienen desde el servidor o desde el cache local. Sin embargo el hacer uso del cache trae resultados positivos para el servidor del API ya que como vimos en el ejemplo con Rails se consume menos memoria y el servidor responde a las solicitudes más rápidamente.

Del lado del cliente también es posible percibir mejoras en los tiempos de respuesta, aunque estás siempre van a estar ligadas con el tiempo de internet y la latencia de la red.

Para poder comprobar los beneficios del lado del cliente se programó un par de pruebas con la librería [Benchmark-ips](https://github.com/evanphx/benchmark-ips){:target="_blank"}  para que nos ayude a evaluar si hay beneficios o no de utilizar el **GET Condicional** y el cache en el cliente.

```ruby
require "benchmark/ips"

Benchmark.ips do |api|
  Rails.cache.clear
  api.report("no-cache-customer") { ApiClient.fetch_customer("9e2b06d3-f2d5-44b7-b48d-36ea0dfa0187", use_cache: false) }

  Rails.cache.clear
  api.report("cache-customer") { ApiClient.fetch_customer("9e2b06d3-f2d5-44b7-b48d-36ea0dfa0187") }

  api.compare!
end

Benchmark.ips do |api|
  Rails.cache.clear
  api.report("no-cache-application") { ApiClient.fetch_application("6d3b26bf-3ab0-4716-aa91-2bb5139ef78a", use_cache: false) }

  Rails.cache.clear
  api.report("cache-application") { ApiClient.fetch_application("6d3b26bf-3ab0-4716-aa91-2bb5139ef78a") }

  api.compare!
end
```

Con Benchmark-ips probamos la llamada para obtener un cliente sin cache y con cache y hacemos lo mismo para obtener una solicitud. En ambos casos Benchmark-ips hace un calentamiento con 2 llamadas y posteriormente ejecuta 5 veces cada llamada.

Los resultados son los siguientes.

```bash
Warming up ------------------------------------—
no-cache-customer     1.000  i/100ms
   cache-customer     1.000  i/100ms
Calculating -------------------------------------
   no-cache-customer      3.165  (± 0.0%) i/s -     16.000  in   5.063248s
      cache-customer      3.265  (± 0.0%) i/s -     17.000  in   5.228465s

Comparison:
      cache-customer:        3.3 i/s
   no-cache-customer:        3.2 i/s - 1.03x  (± 0.00) slower

=> #<Benchmark::IPS::Report:0x00007f9cbf9f6c90 @entries=[#<Benchmark::IPS::Report::Entry:0x00007f9cc02f0378 @label="no-cache-customer", @microseconds=5063248.0, @iterations=16, @stats=#<Benchmark::IPS::Stats::SD:0x00007f9cc02f0490 @samples=[3.233452001021771, 3.306823630561664, 3.254699786491694, 3.1271401365309384, 3.2323650245174886, 2.835029626059592, 3.053323237011163, 3.2682622322884702, 3.0658294908270385, 3.0752860784874514, 3.157123733993383, 3.201413744309487, 3.342190137196905, 3.062702712635793, 3.1983419795178176, 3.224454261116306], @mean=3.1649023632854356, @error=0>, @measurement_cycle=1, @show_total_time=true>, #<Benchmark::IPS::Report::Entry:0x00007f9cc508d2e8 @label="cache-customer", @microseconds=5228465.0, @iterations=17, @stats=#<Benchmark::IPS::Stats::SD:0x00007f9cc508d360 @samples=[3.1828178759783188, 3.427897601842838, 2.948452210012354, 3.2978811113859345, 3.2421742020198745, 3.4091412714051454, 3.0942700307570443, 3.3882225384563256, 3.5391339739165826, 3.3277648734451017, 3.4406352788978958, 3.2761320674359022, 3.249696965757943, 2.672910585795084, 3.3074251695055397, 3.253471454041462, 3.4531817616752076], @mean=3.265365233666386, @error=0>, @measurement_cycle=1, @show_total_time=true>], @data=nil>
```

Para el caso de obtener la información de un cliente desde el API con el cache y sin el cache el resultado es muy similar aunque sin cache sí es más lento.

```bash
Warming up ------------------------------------—
no-cache-application     1.000  i/100ms
   cache-application     1.000  i/100ms
Calculating -------------------------------------
no-cache-application      1.315  (± 0.0%) i/s -      7.000  in   6.031559s
   cache-application      3.071  (±32.6%) i/s -     15.000  in   5.270988s

Comparison:
   cache-application:        3.1 i/s
no-cache-application:        1.3 i/s - 2.34x  (± 0.00) slower

=> #<Benchmark::IPS::Report:0x00007f9cc491aba0 @entries=[#<Benchmark::IPS::Report::Entry:0x00007f9cc2b47498 @label="no-cache-application", @microseconds=6031559.0, @iterations=7, @stats=#<Benchmark::IPS::Stats::SD:0x00007f9cc2b47560 @samples=[1.1724057884018586, 0.7877849221117047, 1.9610073302454003, 1.9321692657563574, 1.2268869828518008, 1.3782932594568147, 0.7456404268344059], @mean=1.3148839965226204, @error=0>, @measurement_cycle=1, @show_total_time=true>, #<Benchmark::IPS::Report::Entry:0x00007f9cc50453a8 @label="cache-application", @microseconds=5270988.0, @iterations=15, @stats=#<Benchmark::IPS::Stats::SD:0x00007f9cc5045448 @samples=[1.2400747517060329, 1.9133043531500642, 3.295946315626411, 3.2205081961933595, 3.466168462719625, 3.265476726947367, 3.2231135921923295, 3.3409841871218426, 3.440031648291164, 3.4534202674328656, 3.2150102398076137, 3.446742655853086, 3.1980964929673856, 3.175651643717291, 3.1777102690885055], @mean=3.071482653520996, @error=1>, @measurement_cycle=1, @show_total_time=true>], @data=nil>
```

Para el caso de obtener una solicitud la diferencia con cache y sin cache es más grande. Sin cache es 2.34 veces más lento que utilizar el cache.

Hay una gran diferencia entre los resultados de los dos recursos y de alguna forma era de esperarse. Los beneficios de realizar el **GET Condicional** y el cache del lado del cliente siempre van a depender de la complejidad de las acciones que realice el servidor del API para responder a las solicitudes. El utilizar esta técnica logra ejecutar menos código del lado del servidor y siempre el ejecutar no código va a ser más rápido que ejecutar código.

## Final

El desarrollar y mantener un API REST requiere de conocer el estándar de HTTP para tratar de obtener el mejor provecho y ofrecer mejores APIs para los clientes. Como parte del trabajo de mantener un API REST también incluye el asegurarse que los clientes hagan uso efectivo de las facilidades del API.

Aunque los ejemplos aquí mostrados están relacionados con Rails y con un cliente con Ruby, el **GET Condicional** y el cache son técnicas agnósticas que pueden ser implementadas en otros lenguajes y frameworks de desarrollo.
