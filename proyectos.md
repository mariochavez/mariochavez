---
layout: orio
title: "Mario Alberto Chávez : Proyectos"
description: Blog personal de Mario Alberto Chávez. Temas de desarrollo de software y fotografia.
image: mariochavez.jpg
keywords: development, photography, desarrollo, software, fotografia
---

<div id="portfolio-grid" class="isotope-grid isotope-not-spaced style-column-2 portfolio-container"  data-ratio="4:3">
  {% for post in site.posts %}
    {% if post.categories[0] == "proyectos" %}
      <div class="isotope-item portfolio-item {{ post.categories[0] }}">
        <div class="portfolio-item-inner item-inner">
          <div class="portfolio-media do-anim-modern">
            <a href="{{ post.url }}" class="thumb-hover overlay-color-custom text-light no-scale">
              <span class="overlay" style="{{ 'background:' | color }};"></span>
               <img class="lazy" src="#"
                data-src="{{ "/assets/img/" | relative_url }}640-{{ post.image }}"
                data-srcset="{{ post.image | srcset_small }}" sizes="(max-width: 1200px) 100vw, 1200px" width="1100" height="950" alt="orio-project-custom-12" />
              <div class="overlay-caption bottom align-left caption-light">
                <span class="caption-sub portfolio-category">{{ post.categories[0] }}</span>
                <h4 class="caption-name portfolio-name"><strong>{{ post.title }}</strong></h4>
              </div>
            </a>
          </div>
        </div>
      </div>
    {% endif %}
  {% endfor %}
</div>
