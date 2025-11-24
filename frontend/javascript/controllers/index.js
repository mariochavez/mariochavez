import { application } from "./application"

import ThemeController from "./theme_controller"
application.register("theme", ThemeController)

import MenuController from "./menu_controller"
application.register("menu", MenuController)
