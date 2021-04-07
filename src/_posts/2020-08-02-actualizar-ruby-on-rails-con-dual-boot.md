---
layout: post
title: Actualizar Ruby on Rails con boot doble
date: 2020-08-04 01:00:00 -0600
published: Agosto 04, 2020
categories: desarrollo
description: Es necesario perder el miedo a actualizar y obtener los beneficios de seguridad y rendimiento de las versiones más recientes.
keywords: rails, ruby, performace, upgrade, dual, boot
image: /images/boot/upgrade-rails.jpg
lang: es_MX
---
Desde la versión 4.2 de Ruby on Rails las actualizaciones del framework son en buena medida estables. Atendiendo cuestiones de API's que ya están fuera de uso, verificando que las gemas o dependencias de la aplicación tengan ya soporte de la versión a la que vamos actualizar y que contenemos con un set de pruebas por lo menos es la funcionalidad crítica es suficiente para tener éxito.

Obviamente el tiempo y esfuerzo de actualización también dependerá de que tan grande es nuestra aplicación y la cantidad de ajustes que se requieran. Este esfuerzo se puede ver afectado en buena medida cuando tratamos de realizar la actualización en un "*branch*" de git con los nuevo cambios y que de alguna forma se empiece a quedar atrás esa rama de los cambios principales.

En este post voy a resumir la estrategia que desde mi punto de vista es la más efectiva.

## Dualboot

Normalmente soy de los desarrolladores que que prefieren omitir el uso de gemas o librería a menos  de que sea realmente necesario. [Bootboot](https://github.com/Shopify/bootboot){:target="_blank"} de Shopify en esta caso es bastante útil ya que permite tener dos `Gemfile` uno que es el base de la aplicación y otro dónde se tiene la versión de Rails a la que vamos actualizar así como versiones de dependencias necesarias.

Con una variable de ambiente es posible hacer que la aplicación haga el boot con la versión actual de Rails o con la versión nueva. Esto permite mandar a la rama principal los cambios de la actualización y los cambios normales de aplicación evitando conflictos a la larga o tener una rama de actualización separada por varias semanas y cuando estamos listos resolver conflictos.

Bootboot se instala como un plugin de Bundler en el archivo `Gemfile`.

```bash
plugin 'bootboot', '~> 0.1.1'
```

Después de agregar la librería ejecutamos lo siguiente.

```bash
$ bundle install && bundle bootboot
```

Al finalizer Bundler vamos a tener un archivo `Gemfile_next.lock` y en el archivo `Gemfile` vamos a encontrar un bloque que nos permite con la variable de ambiente *DEPENDENCIES_NEXT* hacer el boot de la aplicación con una versión de Rail u otra.

```bash
if ENV["DEPENDENCIES_NEXT"]
  enable_dual_booting if Plugin.installed?("bootboot")

  # Add any gem you want here, they will be loaded only when running
  # bundler command prefixed with `DEPENDENCIES_NEXT=1`.
else
end
```

El `if` yo lo modifiqué para quedara de la siguiente forma.

```bash
if ENV.fetch("DEPENDENCIES_NEXT", 0).to_i == 1
  enable_dual_booting if Plugin.installed?("bootboot")

  # Add any gem you want here, they will be loaded only when running
  # bundler command prefixed with `DEPENDENCIES_NEXT=1`.
else
end
```

Como primer paso es agregar en el bloque del `if` las dependencias de la versión a la cuál queremos migrar. Para el proyecto que utilicé para este ejemplo estoy migrando de Rails 6.0 a master de Rails que está marcado como Rails 6.1.alpha.

```bash
if ENV.fetch("DEPENDENCIES_NEXT", 0).to_i == 1
  enable_dual_booting if Plugin.installed?("bootboot")

  # Add any gem you want here, they will be loaded only when running
  # bundler command prefixed with `DEPENDENCIES_NEXT=1`.
  gem "rails", github: "rails/rails"
  gem "puma", "~> 5.0.0.beta1"
  gem "webpacker", github: "rails/webpacker"
else
  gem "puma", "~> 3.11"
  gem "rails", "~> 6.0.0"
  gem "webpacker", "~> 4.0"
end
```

Primeramente agregué la referencia de Rails a Github y corrí Bundler con la variable de ambiente.

```bash
$ DEPENDENCIES_NEXT=1 bundle install
```

Bundler me indicó que tenía conflictos para instalar Webpacker 4.0 con Rails 6.1.alpha entonces agregué Rails y Webpacker actual al bloque del `else` y agregué Webpacker de Github al bloque del `if`.

Este proceso lo repetí varias ocasiones hasta que en cada uno de los bloques del `if` tuviera las dependencias correctas. Este es el primer paso.

## Configuración de la aplicación

El siguiente paso es hacer que la aplicación pueda finalmente hacer el boot. Ejecuté el servidor de Rails de la siguiente forma.

```bash
$ DEPENDENCIES_NEXT=1  bin/rails s
```

Hubo código en los inicializadores que impedían que el servidor se iniciara correctamente pero es código que en la versión actual de Rails de la aplicación funciona sin problemas.

En este punto necesito tener información de qué versión de Rails se está ejecutando para decidir que código cambia, se queda o se modifica pero siempre manteniendo compatibilidad entre ambas versiones.

Modifiqué el archivo `config/application.rb` donde agregué el siguiente método.

```ruby
def rails_6_0?
  version = Gem::Version.new(Rails::VERSION::STRING)
  version.to_s.to_f < 6.1
end
```

Este método está disponible vía `Rails.application.rails_6_0?` y me permite conocer si estoy en la versión actual de la aplicación o en la versión nueva para de esta forma ejecutar cierto código para cada versión.

Es necesario hacer los ajustes que nuestra aplicación nos vaya solicitando para asegurar que al menos podemos hacer el boot de la misma.

Como siempre en cada actualización es necesario ejecutar el comando `bin/rails app:update`. Este proceso va a actualizar los archivos de configuración de la aplicación de forma interactiva, es decir, nos va a preguntar que acción realizar. Para cada archivo mostrado normalmente en mi caso o hago que sobre escriba el archivo con ***Y*** o que me muestre las diferencias de los cambios propuestos con ***d*** o negarle el que haga cambios con ***n***. La decisión va a depender de cada aplicación.

```bash
$ bin/rails app:update
    conflict  config/boot.rb
Overwrite /Users/marioch/Development/michelada/butaca/config/boot.rb? (enter "h" for help) [Ynaqdhm]
        Y - yes, overwrite
        n - no, do not overwrite
        a - all, overwrite this and all others
        q - quit, abort
        d - diff, show the differences between the old and the new
        h - help, show this help
        m - merge, run merge tool
```

Para el caso de actualización posiblemente en los archivos de configuración vamos a querer mantener la configuración actual y si hay cambios debido a la nueva versión de Rails entonces vamos a tener que hacer uso de nuestro método `Rails.application.rails_6_0?` para mantener ambas configuraciones separadas.

## Ajustes a la aplicación

En este punto podemos ejecutar la suite de pruebas y comenzar a corregir cualquier problema descubierto. Con la ayuda del equipo de QA también podemos descubrir ajustes necesarios. Recuerda que debido al ***dual boot*** podemos enviar de forma segura esos cambios a la rama principal de nuestro repositorio.

En el momento que nos sentimos satisfechos de los cambios realizados y que estamos listos para enviar nuestra aplicación con la nueva versión de Rails a producción y que confirmamos que funciona como lo esperamos, es momento de eliminar cualquier código condicional que agregamos durante el proceso de actualización.

## Conclusiones

Realmente no hay excusa para no tratar de actualizar nuestras aplicaciones a las nuevas versiones de Ruby on Rails y de Ruby. Las versiones recientes son bastante estables y la compatibilidad se ha mantenido para muchos de los casos.

Empresas como Github, Shopify y Basecamp al día de hoy corren con las versiones más nuevas sin problemas. Inclusive en el caso de Basecamp indican que tienen varios meses corriendo con la rama principal de Rails.

Es necesario perder el miedo a actualizar y obtener los beneficios de seguridad y rendimiento de las versiones más recientes.
