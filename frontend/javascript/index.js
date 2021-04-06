import { Application } from "stimulus"
import { definitionsFromContext } from "stimulus/webpack-helpers"

import "index.scss"


// Import all javascript files from src/_components
const componentsContext = require.context("bridgetownComponents", true, /.js$/)
componentsContext.keys().forEach(componentsContext)

const images = require.context("../images", true);
const imagePath = (name) => images(name, true);
const application = Application.start()
const context = require.context("./controllers", true, /.js$/)
application.load(definitionsFromContext(context))
