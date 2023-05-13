---
layout: post
title: Uso de modelos LLM para generar código
date: 2023-05-13 12:00:00 -0600
published: Mayo 13, 2023
categories: desarrollo
description: Desde el año pasado y en especial este 2023, el uso de herramientas de inteligencia artificial (IA) para escribir y sugerir código ha ganado una popularidad significativa.  Los desarrolladores y no desarrolladores recurren a estas herramientas basadas en IA para obtener ayuda con la generación de código, documentación y solución de errores.
keywords: llm, openai, chatgpt, copilot, code generation
image: /images/modelos-llm-codigo/modelo-llm-codigo.jpg
lang: es_MX
---

Desde el año pasado y en especial este 2023, el uso de herramientas de inteligencia artificial (IA) para escribir y sugerir código ha ganado una popularidad significativa. 

Los desarrolladores y no desarrolladores recurren a estas herramientas basadas en IA para obtener ayuda con la generación de código, documentación y solución de errores.

Herramientas como [Copilot](https://github.com/features/preview/copilot-x){:target="_blank"} y otras comerciales, además de la Open Source como [TabbyML](https://github.com/TabbyML/tabby){:target="_blank"} y [Turbopilot](https://github.com/ravenscroftj/turbopilot){:target="_blank"} tienen la  idea de aprovechar la IA para agilizar los procesos de creación de código de forma prometedora.

Entiendo el atractivo de este tipo de herramientas que se integran en el editor de código, sin embargo, a mí no me parece tan atractivo insertar un bloque de código a "ciegas" que puede que funcione o no, sin más contexto sobre el código de que la sugerencia "parece ser" lo que necesito.

Si la intención primordial es automatizar tareas repetitivas, ofrecer sugerencias sobre lo que parece ser que necesito y en general acelerar el proceso de desarrollo, actualmente tengo esto mismo - sin el hype - con snippets creados por mí y generadores de código que entienden mi lenguaje de programación y framework y que además generan código bajo mi estilo personal.

Otro tipo de herramientas que no son exclusivas para el desarrollo de software, pero que se han comenzado a utilizar para esto son los chats, en especial el ChatGPT de [OpenAI](https://openai.com/){:target="_blank"}.

La integración con los editores de código es opcional en este caso. La mejora sustancial con las otras herramientas, desde mi punto de vista, es que agregamos texto como contexto sobre lo que necesitamos ayuda, además de poder agregar ejemplos de código, por ejemplo la firma de un método.

Además de generar la sugerencia de código, esta viene acompañada de una explicación, que más allá de código, esta última puede ser lo más relevante para aprender.

Sin embargo, no todo es "color de rosa" con esta herramienta. En la mayoría de los casos es necesario iterar sobre la misma idea múltiples ocasiones, ya que aunque responde con un texto donde se percibe confianza y seguridad en lo que nos está describiendo, me he encontrado que está tremendamente equivocado.

En mi caso, que trabajo principalmente sobre Ruby y Ruby on Rails, me ha ofrecido sugerencia donde hace uso de gemas (librerías) inexistentes, algunas parecen ser librerías de Python.

Me ha generado código donde hace uso de métodos inexistentes en las librerías estándar de Ruby. O ha generado como respuesta a solicitudes sobre Ruby con código de Python formateado para que parezca Ruby.

Otro punto importante para mí que siempre trabajo sobre las últimas versiones de las librerías y herramientas es que ChatGPT solo tiene conocimiento, la versión libre, de Ruby 3.0.0 y Rails 6.1.4, del 2020 y 2021, respectivamente.

Buscando otra forma de sacarle provecho, en lugar de pedirle código, opté por pedirle que documentara a partir de la firma de métodos y de definiciones de clases. Siempre fui explícito en que el formato de la documentación tenía que ser el de RDoc de Ruby; sin embargo, el 100% de los casos la documentación la escribe con el formato de documentación de Javascript. 

Una tarea más que busqué comprobar si la podía hacer bien o no fue la de escribir los archivos de tipado de Ruby, RBS; sin embargo, nuevamente me di cuenta de que es algo fuera de su conocimiento.

Después de varios meses sigo haciendo uso de forma esporádica de ChatGPT, en su lugar he cambiado a otra herramienta llamada [Phind](https://www.phind.com){:target="_blank"} que se parece más a un buscador que a un chat de IA. Phind usa el internet, en especial los blogs y documentación técnica en conjunto con un LLM para ofrecer respuestas. 

Puedo configurar como quiero que sea la respuesta, larga y con varias opciones o simple y directa a lo que parece resolver mi duda. Además, agrega referencias a los blogs o sitios web de donde extrajo la respuesta para que si así lo deseo poder ir al sitio y conocer más del contexto.

Lo mejor de todo es que parece tener información actualizada y no mezcla las respuestas de Ruby con otros lenguajes de programación.

Por último, es innegable la ayuda que herramientas de IA pueden proporcionar como asistencia y automatización, pero es importante recordar que escribir código sigue siendo una actividad que requiere experiencia, conocimientos y creatividad humana. De momento la comprensión contextual de nuestros proyectos y las habilidades de resolución de problemas que poseemos es lo más importante que ofrecemos en nuestro trabajo. La IA solo es una herramienta más que sin lo anterior carece de valor.
