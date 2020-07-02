---
layout: orio-post
title: Más allá del Rails Way
date: 2020-07-02 01:00:00 -0600
published: Julio 02, 2020
categories: desarrollo
description: Mantener bajo control el código fuente de una aplicación de Rails que lleva varios años en desarrollo puede ser un reto pero hay formas de recobrar el control.
keywords: rails, ruby, performace, postgresql, desarrollo, debug, refactor, patterns, patrones, diseño
author: Mario Alberto Chávez
image: refactor.jpg
---
# Más allá del "Rails way"

Hace un par de años estuve presentando una plática llamada "Más allá del 'Rails Way'" con grupos locales de desarrollo.

En la plática toco algunos temas que tienen relación a qué pasa cuando una aplicación de Rails ya ha crecido a cierto tamaño y qué podemos hacer para tratar de mantenerla en control.

No soy el único que habla sobre estos temas, por ejemplo Ryan Bigg trata el mismo tema en su libro "[Exploding Rails](https://leanpub.com/explodingrails/){:target="_blank"}" solamente que el acercamiento de él es bastante radical y a mi punto de vista funcionaría en aplicaciones nuevas o "Greenfield" pero desafortunadamente desecha todo el conocimiento que hay sobre Rails.

David Bryant Copeland tiene su libro "[Sustainable Web Development with Rails](https://sustainable-rails.com){:target="_blank"}" donde habla de su experiencia de como mantener en forma una aplicación de Rails que ha estado creciendo desde diferentes aspectos de la misma.

Mi plática está más alineada con las ideas de David Bryant Copeland y el alcance es más específico a ciertas áreas que en lo personal encuentro problemáticas y que describo a continuación.

## Fat Controllers, obese Models

Esta ha sido una discusión desde hace mucho tiempo en el desarrollo de Rails. Es el primer problema que de identifica en el código de una aplicación de Rails con algunos años en desarrollo y aunque nos damos cuenta casi al inicio sobre esta problemática generalmente por cuestiones prácticas se asume como deuda técnica y se continua adelante.

El problema es que conforme pase el tiempo, sin importar si decidimos por "Fat Controllers" o "Obese Models", o inclusive ambos; los cambios en ellos se vuelven problemáticos ya que el código es difícil de leer, entender y todavía más complicado de modificar.

Algunas estrategias para lidiar con estas situaciones que se pueden ir introduciendo poco a poco son las que menciono a continuación.

## Los modelos a dieta

Podemos ir trabajando con los modelos para liberarlos de la carga de trabajo poco a poco. Ninguna de las estrategias aquí mostradas son un todo a nada.

### Scopes

Desde que Rails introdujo "Scopes" en la versión 3 del framework es una de las funcionalidades más utilizadas y también más abusadas en Rails.

```ruby
scope :active -> { where(status: :active) }
```

No es raro abrir un modelo de "ActiveRecord" y entrarse con toda una sección de definiciones de "Scopes", algunas muy simples, otras más complejas pero que generalmente en los controladores para poder ejecutar una consulta se utilizan encadenadas.

```ruby
scope :active -> { where(status: :active) }
scope :with_orders -> { includes(:orders) }
scope :ordered -> { order(created_at: :desc) }

@products = Product.
  active.
  with_orders.
  ordered.
  where(color: :red)
```

Hay quien dice que hacer esto hace más legible el código, es posible, pero no hace que sea simple de modificar y de mantener.

Desde hace tiempo prefiero hacer uso de "QueryObjects" cuando los "Querys" o "Scopes" se comienzan a poner complejos y más cuando hay condicionales que dicen si se tiene que aplicar o no restricciones.

```ruby
class ProductQuery
  def self.execute(scope: Product, *params)
    scope = scope.where(status: :active) 
    …
  end
  # more complex logic
end

@products = ProductQuery.execute(
  Product, ordered: true, with_orders: true
)
```

Esta clase encapsula  consultas complejas donde ademas podemos aplicar de forma condicional restricciones, uniones, ordenado y cualquier otras operación que se requiera. El resultado sigue siendo un *ActiveRecord::Relation* el cual podemos seguir modificando fuera del "QueyObject".

El uso es bastante simple además de que ofrece la oportunidad de que podamos escribir pruebas fuera del contexto del controlador o de los modelos.

### Concerns

Los "Concerns" es otra herramienta que se ha utilizado para crear modelos o controladores que son compuestos por módulos reutilizables. Es una manera de mover código hacia módulos específicos para cierta funcionalidad.

```ruby
class Product < ApplicationRecord
  include Flaggable
  include Taggable
  include Conflictable
  include Measurable
  include Sanitizable
  include Searchable
  include Permisionable
end

Product.methods(false).count #=> 161
```

Los "Concerns" son útiles hasta cierto punto. El problema viene cuando tenemos muchos módulo que agregan funcionalidad, que dependen entre sí, que dependen del orden en que se que carguen y que a final de cuentas nuestro modelo o controlador termina con una cantidad absurda de métodos. Peor aún cuando hay conflictos entre los módulos.

La estrategia para este problema es algo que llamo "Actions". Consiste en tener pequeñas clases que ejecuten acciones sobre los modelos sin agregar complejidad al modelo tal cual. Por ejemplo, la acción de recibir desde el controlador un campo de texto con etiquetas o "tags" separadas por coma y que el modelo tenga que expandirlas a un "Array" de Postgresql  puede se un "Action" que se llamada desde el mismo controlador.

```ruby
class ProductTagging
  def self.tag(product, tags)
    …
    product 
  end
  # more methods related to tagging
end

@product = ProductTagging.tag(
  @product, “landscape, light, reflection”
)
```

Dentro del controlador las llamadas pueden ser compuestas, es decir, tener llamada a más un "Action" que modifique o haga alguna operación con el modelo. De esta forma un "Action" puede tener pruebas fuera del contexto del controlador o del modelo.

### Presenters

Creo que esta estrategia es bastante conocida ya por muchos. Es una forma de eliminar de los modelos código que tiene que ver en como se muestra la información de un modelo en una vista de Rails o en la serialización de un objeto JSON o en el cuerpo de un correo electrónico.

```ruby
class ProductPresenter < SimpleDelegator
  def formatted_price
    …
  end
end

@presenter = ProductPresenter.new(@product)
<%= @presenter.formatted_price %>
```

## Controladores delgados

El primer paso para lograr esto es aplicar lo que aprendimos al poner a los modelos a dieta. ¿Pero qué pasa cuando la lógica de los controladores es compleja?

Es común que muchos de nuestros controladores iniciaron algo parecido a el siguiente bloque de código.

```ruby
class ProductsController < ApplicationController
  def create
    if @product.valid?
      return redirect_to :products
    end

    return render :new
  end
end
```

Pero con el tiempo el controlador se fue complicando inevitablemente. Ahora nuestro controlador tiene cientos de líneas de código que son díficil de comprender o modificar.

```ruby
class ProductsController < ApplicationController
# Many before_action
# Many helper_method
# Many queries
end
```

Mi estrategia en estos caso es utilizar "Use Cases". Sí, leíste bien, "Use Cases". Es una forma de mover lógica del controlador a clases especialidas para realizar alguna operación compleja en un controlador y que de alguna forma tiene una semenjanza con la deficinición de "Use Cases" funcionales que el Product Manager crea para describir cómo debe funcionar.

```ruby
class ProductRegistrator
  def register(*params)
   # complex logic and calculations
…
    @product
  end
end
```

En este ejemplo el crear un nuevo producto tiene muchas condiciones y lógica de negocio. Puede hacer uso de "Actions" o "Query Objects" para completar la operación de registrar un producto.

```ruby
class ProductsController < ApplicationController
  def create
    product_registrator = 
      ProductRegistrator.new(product_params)

    @product = product_registrator.register
…
  end
end
```

Al remover la lógica compleja el controlador queda nuevamente simple, pero ahora hay una o quizás varias clases especializadas que saben cómo registrar un producto y lo mejor es que es posible utilizar esas clases fuera del contexto del controlador, quizás en un "Background Job".

Esta estrategia también puede ser útil para refactorizar lógica del controlador donde podamos mantener la lógica original y escribir nueva funcionalidad que podamos activar con una bandera en el sistema.

Hay varias "Gems" o librerías que ofrecen algo similar aquí descrito, por ejemplo estan los "[Interactors](https://github.com/collectiveidea/interactor){:target="_blank"}" ya sea utilizar una de ellas o la solución simple que aquí describo ayuda a desacoplar la lógica funcional de la aplicación del framework de Rails.

## Palabras finales

Estos son únicamente algunos consejos simples de como ir moldenado el código de una aplicación grande y compleja. Lo que me gusta en lo personal es que no me obliga a hacer un cambios radical sobre Rails y que me permite ir ajustando poco a poco la aplicación sin tener que entrar en el espiral de reescribir todo.

Al introducir las ideas aquí descritas nos vamos a encontrar con algunos efectos en el código de nuestra aplicación. Primero, vamos a tener más clases pequeñas con funcionalidad específica y que pueden probarse automáticamente sin tener demasiado contexto del framework de Rails.

Segundo, en el caso de los modelos prácticamente eliminamos los "Callbacks" que pueden ser complejos de depurar cuando hay problemas y que son un tanto oscuros y lo mismo puede llegar a pasar con los "Before Action" en los controladores.

Tercero, sí es verdad que vamos a tener más clase, pero van a ser clases pequeñas y que deben de tener una intención clara. Esto nos lleva a expandir la organización de nuestro código.

```ruby
- app
  - models
  - controllers
  - views
  - presenters
  - queries
  - actions
  - use_cases
```

Lo aquí propuesto en el post son acciones simples que podemos comenzar a incluir en nuestro código, sin embargo, no son las únicas estrategias que podemos utilizar. Hay que tener en cuenta que cualquier estrategia que adoptemos siempre va a tener sus "Pros" y "Cons".
