import { application } from "./application"

import MenuController from "./menu_controller"
application.register("menu", MenuController)

import BookController from "./book_controller"
application.register("book", BookController)
