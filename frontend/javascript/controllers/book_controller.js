import { Controller } from "@hotwired/stimulus";

export default class extends Controller {
  static targets = ["page", "paginator", "wrapper"];

  connect() {
    this.totalPages = this.pageTargets.length;
    this.goPage(0)

    document.addEventListener("keyup", (event) => {
      const keys = { 37 : "prev", 39 : "next" };

      if(!keys[event.keyCode]) {
        return false;
      }

      this[keys[event.keyCode]]();
    }, false);

    this.element.addEventListener("mouseup", (event) => {
      const pos = event.clientX;
      const elementRect = this.element.getBoundingClientRect()
      const halfScreen = this.element.clientWidth / 2;

      if((pos - elementRect.x) > halfScreen) {
        this.next();
      } else {
        this.prev();
      }
    }, false);
  }

  goPage(page) {
    this.currentPage = page;
    this.paginatorTarget.innerHTML = `${this.currentPage + 1} de ${this.totalPages}`;
    this.wrapperTarget.style.transform = "translate3d( "+ (page*100*-1) +"%,0,0)";
  }

  next() {
    if (this.currentPage + 1 > this.totalPages - 1) {
      return false;
    }

    this.goPage(++this.currentPage);
  }

  prev() {
    if (this.currentPage - 1 < 0) {
      return false;
    }

    this.goPage(--this.currentPage);
  }
}
