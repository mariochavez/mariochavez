---
layout: post
title: Neovim y LunarVim para trabajar con Rails
date: 2022-08-05 00:00:00 -0600
published: Agosto 05, 2022
categories: desarrollo
description: Cómo configurar Neovim y Lunarvim para trabajar con proyectos de Ruby on Rails
keywords: rails, ruby, vim, neovim, desarrollo, solargraph, standardrb
image: /images/neovim.jpg
lang: es_MX
---

# Neovim y LunarVim para trabajar con Rails

Desde hace más de 15 años he utilizado, primero Vim, luego [Neovim](https://neovim.io){:target="_blank"} para desarrollar software. Mi tendencia es tratar de personalizar solamente lo suficiente para trabajar cómodamente con el código.

En los últimos años, estuve haciendo uso de Vim con [Spacevim](https://spacevim.org){:target="_blank"}, pero para ser sincero nunca hice uso al 100% de todo lo que ofrecía Spacevim. El año pasado vi un tweet sobre Neovim y algo llamado [Lunarvim](https://www.lunarvim.org/#opinionated){:target="_blank"} y me pareció interesante, en particular el soporte que Neovim presentaba para los Language Servers.

Así que tomé la decisión de borrar mi configuración de Vim de años y comenzar desde cero con Neovim.

Instalar Neovim es relativamente fácil, normalmente implica ejecutar un par de comando o descargar un binario. En MacOS es un comando con [Homebrew](https://brew.sh){:target="_blank"}.

brew install neovim

Una vez que está instalado Neovim, el siguiente paso es instalar Lunarvim, nuevamente un comando en la terminal y se instala en un par de minutos, recomiendo la versión estable.

```bash
bash <(curl -s https://raw.githubusercontent.com/lunarvim/lunarvim/master/utils/installer/install.sh)
```

Durante la instalación va a preguntar si deseamos instalar las dependencias de Javascript, Python y Rust, hay que responder que sí. 

LunarVim crear un directorio en `~/.config/lvim` donde se encuentra el archivo de configuración de Neovim y Lunarvim `config.lua`

Aquí está mi archivo de configuración [config.lua](https://gist.github.com/mariochavez/f2547d0b51353eacf203cf1a00fce3e8){:target="_blank"}

En ese archivo es donde podemos configurar como deseamos que el editor se comporte y agregar plugins necesarios. Mi configuración es muy básica, solamente hice los siguientes cambios.

Deshabilité que autoformatee mi código al guardar.

```lua
lvim.format_on_save = false
```

No mostrar los mensajes de error al lado del código

```lua
lvim.lsp.diagnostics.virtual_text = false
```

Mostrar una línea en la columna 120  y que la numeración de las líneas fuese relativa a donde se encuentra el cursor.

```lua
vim.opt["colorcolumn"] = "120"
vim.opt["relativenumber"] = true
```

Cambié el leader a que sea una coma.

```lua
lvim.leader = ","
```

Agregué [Spectre](https://github.com/nvim-pack/nvim-spectre){:target="_blank"}, un plugin para buscar y reemplazar texto en el proyecto, al menú

```lua
lvim.builtin.which_key.mappings["S"] = { "<cmd>lua require('spectre').open()<CR>", "Spectre" }
```

Modifiqué la búsqueda de archivos para que solo muestre archivos que estén bajo el control de git.

```lua
lvim.builtin.which_key.mappings["f"] = { "<cmd>Telescope git_files<CR>", "Find File" }
```

Modifiqué el comportamiento para que al guardar un archivo borre espacios en blanco al final de las líneas.

```lua
vim.cmd([[
  au FocusLost * :wa
  autocmd FileType ruby,javascript,css,ts autocmd BufWritePre * :%s/\s\+$//e
  autocmd FileType ruby,javascript,css,ts autocmd BufWritePre * :%s/\t/  /e
  match ErrorMsg '\s\+$'
]])
```

Agregué los siguientes plugins: [tpope/vim-fugitive](https://github.com/tpope/vim-fugitive){:target="_blank"}, [tpope/vim-rails](https://github.com/tpope/vim-rails){:target="_blank"}, [EdenEast/nightfox.nvim](https://github.com/EdenEast/nightfox.nvim){:target="_blank"}, [windwp/nvim-spectre](https://github.com/nvim-pack/nvim-spectre){:target="_blank"}, principalmente.

Configuré la indentación para Ruby.

```lua
lvim.autocommands.custom_groups = {
  { "BufWinEnter", "*.lua", "setlocal ts=8 sw=8" },
  { "BufWinEnter", "*.rb", "setlocal ts=2 sw=2" },
}
```

Agregué los shortcuts **,wv** y **,wh** para dividir la pantalla verticalmente y horizontalmente.

```lua
lvim.builtin.which_key.mappings["w"] = {
  name = "Splits",
  w = { "<C-w>v<C-w>l", "Vertical" },
  h = { "<C-w>new<C-w>l", "Horizontal" },
}
```

Finalmente, activé el soporte para Tailwind.

```lua
require("lvim.lsp.manager").setup("tailwindcss")
```

Dentro de Neovim hay que instalar los Language Server para que ayuden a autocompletar y ofrecer diagnóstico ayuda en el código. En mi caso instalé los siguientes:

```lua
:LspInstall ruby javascript tailwindcss solargraph
```

Para el caso de [Solargraph](https://solargraph.org){:target="_blank"} que ayuda a autocompletar en Ruby, también configuré [StandardRb](https://github.com/testdouble/standardrb){:target="_blank"} para diagnóstico y formateo. La configuración de StandardRb requirió de un par de pasos manuales. Hay que navegar al directorio donde se instaló el Language Server de Solargraph y ejecutar la siguiente línea:

```bash
cd ~/.local/share/nvim/lsp_servers/solargraph
gem install solargraph-standardrb solargraph-rails standardrb --install-dir .
```

Luego en el directorio donde está el binario reemplace el contenido de Solargraph con el siguiente código para activar StandardRb.

```bash
cd ~/.local/share/nvim/lsp_servers/solargraph/bin
```

Aquí existe un ejecutable Solargraph, hay que abrirlo con el editor, borrar el contenido y reemplazarlos con el siguiente código.

```ruby
#!/usr/bin/env ruby
# frozen_string_literal: true

# Solargraph has plugins for linting, but not for formatting. So do a bit of
# dirty monkeypatching of the formatter[1] until/when they add plugin support
# for formatting. There aren't great hooks, as this wasn't designed to be
# extended, so much of #process had to be copied verbatium
# 1: https://github.com/castwide/solargraph/blob/940b28932626e236871c10293da5e0f5eacf94c0/lib/solargraph/language_server/message/text_document/formatting.rb

# ENV["BUNDLE_GEMFILE"] ||= File.expand_path("../Gemfile", __dir__)
# require "bundler/setup"

require "solargraph"
require "standard"

class Solargraph::LanguageServer::Message::TextDocument::Formatting
  def process
    file_uri = params["textDocument"]["uri"]
    config = config_for(file_uri)
    original = host.read_text(file_uri)
    args = cli_args(file_uri, config)

    # require_rubocop(config['version'])
    # options, paths = RuboCop::Options.new.parse(args)
    std = Standard::BuildsConfig.new.call(args)
    options = std.rubocop_options
    options[:stdin] = original
    corrections = redirect_stdout do
      RuboCop::Runner.new(options, std.rubocop_config_store).run(std.paths)
    end
    result = options[:stdin]

    log_corrections(corrections)

    format original, result
  rescue RuboCop::ValidationError, RuboCop::ConfigNotFoundError => e
    set_error(Solargraph::LanguageServer::ErrorCodes::INTERNAL_ERROR, "[#{e.class}] #{e.message}")
  end

  def formatter_class(_config)
    Standard::Formatter
  end
end

Solargraph::Shell.start(ARGV)
```

Después de esto solo queda en cada proyecto de Ruby on Rails agregar dos archivos, uno para indicar la configuración de Solargraph y otro para la configuración de StandardRb.

```yaml
# .solargraph.yml
plugins:
  - solargraph-standardrb
  - solargraph-rails
reporters:
  - standardrb
```

```yaml
# .standard.yml
plugins:
  - solargraph-standardrb
  - solargraph-rails
reporters:
  - standardrb
```
