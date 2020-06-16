---
layout: orio-post
title: "Proteger tu aplicación de ataques en Internet"
date: 2020-06-15 00:01:00 -0600
published: Junio 15, 2020
categories: desarrollo
description: El Internet no es un lugar seguro por lo que antes de publicar nuestras aplicaciones en Internet tenemos que revisar políticas de acceso y medidas para protegerla de ciertos ataques.
image: rack-attack.jpg
keywords: development, rails, rack, attack, seguridad, ddos, protección
author: Mario Alberto Chávez
---
El Internet es una gran tecnología en su conjunto que ha cambiado la dinámica de la humanidad para consumir, publicar y realizar un sin fin de actividades que antes requerían de nuestra presencia física. Con todo lo bueno también existe una parte oscura. Hay personas que buscan encontrar problemas de seguridad, errores de programación que les de acceso a información privada o restringida.

En la mayoría existen quienes utilizan scripts para probar por problemas de seguridad conocidos, hay quienes utilizan diccionarios para tratar de acceder por fuerza bruta, hay quienes utilizar ingeniería social para obtener accesos entre otros tipos de ataques.

El Internet no es un lugar seguro.

## ¿Cómo proteger nuestra aplicación?

Hay diferentes opciones para proteger nuestras aplicaciones de problemas de seguridad y de cierto tipo de ataques.

Una de las más simples pero que implica un costo es poner nuestra aplicación detrás de un servicio [Cloudflare](https://www.cloudflare.com/) que se encarga de detener la mayoría de las amenazas posibles.

Si nuestra aplicación está escrita en Ruby (o Ruby on Rails){:target="_blank"} - y así lo asumiré de este momento en adelante -  siempre hay que asegurarnos que las librerías estén actualizadas a la versión más reciente para asegurar que si hay algún problema de seguridad en ellas estemos utilizando una versión con la corrección. La forma simple de estar al tanto de problemas de seguridad con librerías en Ruby es a través de [Bundle Audit](https://github.com/rubysec/bundler-audit){:target="_blank"}.

Otra herramienta básica es [Brakeman](https://brakemanscanner.org/){:target="_blank"} el cuál es un escáner de código busca por problemas relacionados código inseguro, falta de "sanitización" de parámetros, posibles problemas de explotación de SQL y otros más.

Ambas herramientas se pueden automatizar en el proceso de desarrollo con herramientas como [Lefthook](https://github.com/Arkweid/lefthook){:target="_blank"} que ayuda a configurar hooks de Git. También es posible automatizar las revisiones en los procesos de CI.

Dependiendo del tamaño de tu aplicación y de las regulaciones a la que esté sujeta puedes requerir de auditorías de terceros para verificar la seguridad de su aplicación.

Aún siguiendo al pie de la letra los pasos anteriores es necesario implementar algunas medidas adicionales que limiten que nuestra aplicación sea vulnerable.

# Rack Attack

[Rack::Atack](https://github.com/kickstarter/rack-attack){:target="_blank"} es una librería escrita por Kickstarter y que funciona como middleware de Rack para proteger nuestra aplicaciones de clientes maliciosos o abusivos. Al funcionar como middleware en nuestras aplicaciones nos aseguramos de detener *"requests"* antes de que lleguen al código de nuestra aplicación.

Comenzar con Rack::Attack es bastante simple para el valor que agrega. Obviamente hay que agregar la libreria a nuestro `Gemfile`.

```bash
$ bundle add rack-attack
```

Después hay que activar el middleware en el archivo `config/application.rb`

```bash
config.middleware.use Rack::Attack
```

Y creamos un inicializador donde vamos a configurar nuestra protección `config/initializers/rack_attack.rb`. Lo primero que debemos de hacer es activar Rack::Attack pero únicamente lo ocupamos para ambientes de Producción y Desarrollo.

```ruby
Rack::Attack.enabled = !Rails.env.test?
```

## throttle o regulación

La primer capa de protección de vamos a utilizar es *"throttle"* o regulación. Esta medida sirve para detener a aquellos clientes que estén haciendo demasiadas solicitudes en un periodo de tiempo definido por nosotros. Por ejemplo si alguien esta haciendo un "screen scraping" a nuestra aplicación lo podemos detener con el siguiente bloque de configuración.

```ruby
Rack::Attack.throttle("requests by ip", limit: 5, period: 2) do |request|
  request.ip
end
```

Esto limita a que por dirección IP sólo se puedan hacer 5 solicitudes en un lapso de dos segundos. Si el cliente sobrepasa los límites entonces recibirá una respuesta del servidor con el estatus 429 que significa *"Too Many Requests"*. Es importante notar que para que *"throttle"* funcione nuestra aplicación de Rails debe tener configurado el [cache](https://guides.rubyonrails.org/caching_with_rails.html#cache-stores) ya que Rack::Attack utiliza el cache para llevar el conteo y determinar si bloquea o no la solicitud.

Otra aplicación de *"throttle"* es la posibilidad de evitar el ataque de diccionario a la página de iniciar sesión.

```ruby
Rack::Attack.throttle('limit logins per email', limit: 5, period: 1.minute) do |req|
  if req.path == '/login' && req.post?
    req.params['email']
  end
end
```

Por ejemplo en este caso si la ruta solicitada es la de la página de iniciar sesión y se ha intentado más de 5 ocasiones con una contraseña incorrecta para el mismo correo electrónico en 1 minuto entonces se bloquea al cliente con el estatus 429.

Otro ejemplo es el controlar cuantas solicitudes un cliente puede realizar por segundo.

```ruby
Rack::Attack.throttle('limit API request', limit: 30, period: 1) do |req|
  if req.path == '/api'
    req.env["HTTP_AUTHORIZATION"]
  end
end
```

En este caso de los encabezados utilizamos el valor del API_KEY como llave para llevar el conteo de solicitudes. Para este caso del API además debemos configurar una respuesta al cliente donde le indiquemos los encabezados de Límite, Cuantas solicitudes le quedan y el tiempo antes de que se reinicie el contador. Para esto declaramos el siguiente bloque.

```ruby
Rack::Attack.throttled_response = lambda do |env|
  match_data = env["rack.attack.match_data"]
  now = match_data[:epoch_time]

  headers = {
    "RateLimit-Limit" => match_data[:limit].to_s,
    "RateLimit-Remaining" => "0",
    "RateLimit-Reset" => (now + (match_data[:period] - now % match_data[:period])).to_s
  }

  [429, headers, ["Throttled request"]]
end
```

El tiempo se muestra en [epoch](https://www.epochconverter.com/). El cliente siempre recibirá en los encabezados la respuesta la siguiente información.

```ruby
HTTP/1.1 429 Too Many Requests
RateLimit-Limit: 30
RateLimit-Remaining: 0
RateLimit-Reset: 1592260020
```

Podemos tener varios bloques que regulen a clientes que pueden estar abusando de nuestra aplicación. Rack::Attack aplicará los bloque de arriba hacia abajo y le impondrá la limitación que se cumpla primero.

## Bloqueo

Otra opción de Rack::Atack es el bloquear a clientes ofensivos aplicando diferentes reglas. el bloqueo puede ser permanente o temporal.

La forma más básica es el bloqueo de direcciones IP o de segmentos de red como se muestra continuación.

```ruby
Rack::Attack.blocklist_ip("1.2.3.4")
Rack::Attack.blocklist_ip("1.2.0.0/16")
```

Otra forma de bloquear es a través de reglas estáticas, por ejemplo si nuestra aplicación es Rails a la mejor alguien está ejecutando un script para encontrar vulnerabilidades de PHP o buscando acceder al archivo de contraseñas del servidor.

```ruby
Rack::Attack.blocklist("block script kidz") do |req|
  CGI.unescape(req.query_string) =~ %r{/etc/passwd} ||
  req.path.include?("/etc/passwd") ||
  req.path.include?("wp-admin") ||
  req.path.include?("wp-login")
end
```

El bloqueo no tiene que ser final con Rack::Attack, es posible realizar un bloqueo temporal mediante el uso de `Rack::Attack::Allow2Ban.filter`. Por ejemplo, a la mejor queremos bloquear temporalmente a el cliente que este tratando de iniciar sesión pero lo ha intentado al menos 3 ocasiones en 5 minutos; en este caso lo queremos bloquear por 30 minutos.

```ruby
Rack::Attack.blocklist("allow2ban login scrapers") do |req|
  Rack::Attack::Allow2Ban.filter(req.ip, maxretry: 3, findtime: 5.minutes, bantime: 30.minutes) do
    req.path == "/login" and req.post?
  end
end
```

Rack::Attack también tiene `Rack::Attack::Fail2Ban` que nos permite bloquear temporalmente si la solicitud falla, por ejemplo, alguien que este buscado `/images/` cambiando el identificador.

```ruby
Rack::Attack.blocklist("fail2ban scrapper") do |req|
  Rack::Attack::Fail2Ban.filter("scrappers-#{req.ip}", maxretry: 3, findtime: 10.minutes, bantime: 30.minutes) do
    req.path.include?("/images")
  end
end
```

## Permitir acceso

El permitir acceso o acceso seguro es una manera de definir quienes tienen acceso sin pasar por las otras reglas. Por ejemplo, es posible definir direcciones IP o segmentos de red.

```ruby
Rack::Attack.safelist_ip("5.6.7.8")
Rack::Attack.safelist_ip("5.6.7.0/24")
```

Aunque también es posible definir bloques, por ejemplo, para permitir el acceso desde el *localhost*.

```ruby
Rack::Attack.safelist("allow from localhost") do |req|
  "127.0.0.1" == req.ip || "::1" == req.ip
end
```

## Configurando nuestras políticas de acceso

Todas las reglas mencionadas pueden integrarse en conjunto para decidir como deseamos proteger nuestra aplicación. Inclusive pueden existir múltiples reglas para cada tipo. Sólo debemos tener en cuenta la precedencia de las reglas.

Las reglas del mismo tipo se leen de arriba hacia abajo y se van aplicando en ese orden. Rack::Attack ejecuta los tipos de reglas iniciando con **Permitir Acceso**, **Bloque** y **Regularización**. La primer regla que se cumpla para un cliente es la primera que se aplica.

## Notas finales ****

Como se puede apreciar con Rack::Attack se pueden crear políticas simples o muy complejas que nos ayuden a proteger nuestra aplicación de clientes maliciosos o simplemente proteger ciertas áreas de nuestra aplicación más allá de simplemente un usuario y contraseña.

La seguridad es un tema importante que no podemos obviar o ignorar cuando publicamos una aplicación en internet. Espero que esta guía rápida sea de ayuda proteger tu aplicación de Ruby.
