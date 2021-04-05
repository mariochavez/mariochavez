
import "index.scss"


// Import all javascript files from src/_components
const componentsContext = require.context("bridgetownComponents", true, /.js$/)
componentsContext.keys().forEach(componentsContext)

const images = require.context("../images", true);
const imagePath = (name) => images(name, true);
