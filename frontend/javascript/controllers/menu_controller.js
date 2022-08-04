import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["submenu", "closed", "opened"];

  toggle(event) {
    event.preventDefault();

    this.submenuTarget.classList.toggle("hidden");
    this.closedTarget.classList.toggle("hidden");
    this.openedTarget.classList.toggle("hidden");
  }
}
