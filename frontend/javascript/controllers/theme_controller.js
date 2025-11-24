import { Controller } from "@hotwired/stimulus";

export default class extends Controller {
  static values = { dark: Boolean, default: false }
  static targets = ["light", "dark"]

  connect() {
    this.loadUserPreference();
    this.updateUI()
  }

  toggle() {
    const isDark = document.documentElement.classList.toggle("dark");
    this.saveUserPreference(isDark);

    this.darkValue = !this.darkValue

    this.updateUI()
  }

  loadUserPreference() {
    const saved = localStorage.getItem("theme");
    if (saved === "dark" || (!saved && window.matchMedia("(prefers-color-scheme: dark)").matches)) {
      document.documentElement.classList.add("dark");
      this.darkValue = true
    } else {
      document.documentElement.classList.remove("dark");
      this.darkValue = false
    }
  }

  saveUserPreference(isDark) {
    localStorage.setItem("theme", isDark ? "dark" : "light");
  }

  updateUI() {
    if (this.darkValue) {
      this.lightTarget.classList.add("hidden")
      this.darkTarget.classList.remove("hidden")
    } else {
      this.lightTarget.classList.remove("hidden")
      this.darkTarget.classList.add("hidden")
    }
  }
}
