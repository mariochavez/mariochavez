---
# Feel free to add content and custom Front Matter to this file.
# To modify the layout, see https://jekyllrb.com/docs/themes/#overriding-theme-defaults

layout: orio
title: "Mario Alberto Chávez : Fotografía"
description: Blog personal de Mario Alberto Chávez. Temas de desarrollo de software y fotografía.
image: mariochavez.jpg
keywords: development, photography, desarrollo, software, fotografia
---

<div id="portfolio-grid" class="isotope-grid isotope-spaced style-column-3 portfolio-container" data-ratio="4:3">
  {% for post in site.posts %}
    {% if post.categories[0] == "fotografía" %}
      <div class="isotope-item portfolio-item {{ post.categories[0] }}">
        <div class="portfolio-item-inner item-inner">
          <div class="portfolio-media do-anim-modern">
          <a href="{{ post.url }}" class="thumb-hover no-overlay scale">
               <img class="lazy" src="#"
                data-src="{{ "/assets/img/" | relative_url }}640-{{ post.image }}"
                data-srcset="{{ post.image | srcset_small }}" sizes="(max-width: 1200px) 100vw, 1200px" width="1100" height="950" alt="orio-project-custom-12" />
          </a>
          </div>
          <div class="portfolio-info do-anim">
            <span class="portfolio-category">{{ post.categories[0] }}</span>
            <h4 class="portfolio-name"><a href="{{ post.url }}"><strong>{{ post.title }}</strong></a></h4>
          </div>
        </div>
      </div>
    {% endif %}
  {% endfor %}
</div>
