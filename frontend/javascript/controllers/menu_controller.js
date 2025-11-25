import { Controller } from "@hotwired/stimulus";

export default class extends Controller {
  static values = { open: Boolean, default: false }
  static targets = ["menu", "overlay"]

  toggle() {
    this.openValue = !this.openValue

    this.overlayTarget.dataset.open = this.openValue
    this.menuTarget.dataset.open = this.openValue

    const body = document.querySelector("body")
    if (this.openValue) {
      body.classList.add("overflow-hidden", "touch-none")
    } else {
      body.classList.remove("overflow-hidden", "touch-none")
    }
  }
}
