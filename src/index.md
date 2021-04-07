---
# Feel free to add content and custom Front Matter to this file.

layout: home
image: /images/mariochavez.jpg
lang: es_MX
pagination:
  enabled: true
---

{% for post in paginator.documents %}
  <article class="p-8 border border-gray-100 lg:p-16">
    <a href="{{"/" | append: post.categories[0]}}" class="pb-1 text-xs font-bold leading-normal uppercase border-b-4 border-gray-200 md:text-sm transition-all hover:text-red-500">{{post.categories[0]}}</a>
    <a href="{{post.url}}" class="hover:text-red-500 transition-colors">
      <h2 class="mt-8 font-serif text-3xl font-bold md:text-4xl">{{post.title}}</h2>
    </a>
    <p class="mt-4 font-serif italic text-gray-400 text-md md:text-lg">Publicado en {{post.published}}</p>

    <a href="{{post.url}}">
      <figure class="mt-8 aspect-h-3 aspect-w-4">
        <img src="{{ post.image }}" loading="lazy" />
        <div class="absolute top-0 bottom-0 left-0 right-0 bg-white opacity-0 hover:opacity-10 transition-all ease-in-out duration-150"></div>
      </figure>
    </a>
    <p class="mt-8 font-serif text-lg">{{post.description}}</p>
    <a href="{{post.url}}" class="block mt-4 font-serif text-gray-400 hover:underline hover:text-red-500">Continuar leyendo...</a>
  </article>
{% endfor %}
