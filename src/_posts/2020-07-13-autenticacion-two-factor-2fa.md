---
layout: post
title: "Autenticación Two-Factor (2FA)"
date: 2020-07-13 00:01:00 -0600
published: Julio 13, 2020
categories: desarrollo
description: La seguridad es un factor importante en toda aplicación hoy en día, es algo que como desarrolladores de aplicaciones no debemos de dejar a la ligera. Es nuestra responsabilidad asegurar la información y la confianza de nuestros usuarios.
image: /images/autenticacion/password-security.jpg
keywords: development, rails, rack, otp, seguridad, 2fa, protección
lang: es_MX
---
# Autenticación Two-Factor (2FA)

El publicar una aplicación en Internet automáticamente vuelve la cuestión de seguridad un tema importante como el agregar nuevas características o solucionar errores en la misma.

Aunque Ruby on Rails  por omisión configura toda nueva aplicación con ciertos parámetros que básicos de seguridad hay detalles que nosotros como desarrolladores o administradores de una aplicación debemos de tomar.

El el post de hace unas semanas [Proteger tu aplicación de ataques en Internet](https://mariochavez.io/desarrollo/2020/06/15/seguridad-ruby-aplicacion.html){:target="_blank"} platiqué de acciones que podemos configurar para proteger una aplicación de posibles ataques, el la mayoría automatizados.

Ahora en este post quiero hablar de el tema de cómo proteger a nuestros usuarios del robo de contraseñas o de un tipo de ataque llamado *phising* diseñado con la misma idea de robar credenciales.

## Two-Factor (2FA) contraseñas de un sólo uso

En muchas de las aplicaciones modernas que se preocupan por la seguridad de sus usuarios agregan un nivel más a la protección de contraseñas. Aplicaciones de correo electrónico, de información financiera o bancos entre muchas otras cuentan como una opción más de protección las contraseñas de un sólo uso.

Este tipo de seguridad se conoce como autenticación *Two-Factor* e implica que el usuario aparte de su contraseña para iniciar una sesión necesita generar un código temporal de un sólo uso con una aplicación de su teléfono. La aplicación registra un código secreto que utiliza para generar los códigos temporales que el usuario necesita.

Aplicaciones como Google Authenticator o [Authy](https://authy.com/){:target="_blank"} se utilizan para generar ese código temporal.

Otra forma de implementar las contraseñas de un sólo uso es con el envío del código temporal a través de SMS al teléfono del usuario como segundo paso después de introducir su contraseña.

## Rails y OTP

Implementar OTP en una aplicación de Ruby on Rails es relativamente sencillo gracias a la gema [rtop](https://github.com/mdp/rotp){:target="_blank"} que hace todo el trabajo de implementar los [RFC 4226](http://tools.ietf.org/html/rfc4226){:target="_blank"} y [RFC 6238](http://tools.ietf.org/html/rfc6238){:target="_blank"} para contraseñas de un sólo uso por contador o por tiempo.

Realmente utilizando *rtop* lo complicado es diseñar un flujo que sea amigable para el usuario no técnico dónde se le lleve por el proceso de activar su cuenta para que este protegida por 2FA. Además, hay que darle la posibilidad al usuario de poder tener acceso a la misma en caso de que su dispositivo móvil se haya dañado o extraviado; esto generalmente sucede con un grupo de códigos de recuperación que el usuario recibe al momento de activar su cuenta para 2FA.

### La aplicación

Para el contenido de este post cree una aplicación de Ruby on Rails con la implementación de OTP y sus flujos. Donde la lógica de controladores y vistas están dentro de un *namespace* llamado ***Otp*** con la finalidad de que sea sencilla su reutilización en otras aplicaciones.

Para el sistema de autenticación vía correo electrónico y contraseña no utilicé ninguna de las librerías populares, en su lugar utilicé un generador que desarrollé hace algunos años y que genera lo básico para poder registrarse e iniciar y cerrar sesión utilizando la funcionalidad de [has_secure_password](http://api.rubyonrails.org/classes/ActiveModel/SecurePassword/ClassMethods.html#method-i-has_secure_password){:target="_blank"} de Rails. El motivo de esta decisión es eliminar la complejidad de las librerías conocidas del foco de la implementación de OTP. El código del generador está disponible en su [repositorio](https://github.com/mariochavez/mac_generators/){:target="_blank"}.

El repositorio del código de esta aplicación está disponible en el [repositorio](https://github.com/mariochavez/rails-two-factor-otp){:target="_blank"}. El post no va a mostrar en detalle el código por lo que va a ser necesario hacer referencia en el repositorio.

La aplicación de Rails de creó como se muestra a continuación. Se desactivaron algunos *frameworks* de Ruby on Rails que no son útiles para los objetivos de esta aplicación. Adicionalmente se instaló Webpack y Stimulus, siendo el último utilizado en varias partes de la aplicación que veremos un poco más adelante.

Finalmente con el generador que mencioné anteriormente generamos modelos, vistas y controladores para poder realizar registro y autenticación vía correo electrónico. Por omisión en lugar de crear el modelo ***User***, al que estamos acostumbrados, se crea el modelo ***Identity***.

```ruby
$ rail new otp_security -d postgresql --skip-action-mailer --skip-action-mailbox --skip-action-text --skip-active-storage --skip-action-cable --skip-sprockets
$ cd otp_security
$ bin/rails webpacker:install
$ bin/rails webpacker:install:stimulus
$ yarn add bulma
$ bin/rails g authentication:email
```

### Activar 2FA

Activar 2FA para un usuario implica el explicarle al usuario en qué consiste y cómo va a cambiar su experiencia al iniciar sesión y llevarlo de la mano en el proceso.

El proceso tipo "*wizard*" se inicia con el controlador `Otp::ConfigureController` en donde inicialmente con la ayuda de *rtop* se genera un código secreto y único por cada usuario.

```ruby
def new
  @otp_secret = generate_otp_secret
  @qr_code = generate_qr_code_url(@otp_secret, current_identity.email)
end
```

El "*wizard*" informativo es manejado por el controlador de Stimulus `wizard_controller.js`.

```javascript
import { Controller } from "stimulus";

export default class extends Controller {
  static targets = ["slide"];

  connect() {
    this.showSlide(1);
  }

  disconnect() {
    this.showSlide(1);
  }

  next(event) {
    event.stopPropagation();
    event.preventDefault();

    this.showSlide(this.index + 1);
  }

  back(event) {
    if (this.index !== 1) {
      event.stopPropagation();
      event.preventDefault();

      this.showSlide(this.index - 1);
    }
  }

  showSlide(index) {
    this.index = index;
    this.slideTargets.forEach((element) => {
      let idx = parseInt(element.getAttribute("data-wizard-index"));
      element.classList.toggle("wizard--current", index === idx);
    });
  }
}
```

Al final del "*wizard*" al usuario se le presenta un código QR que debe de escanear utilizando una aplicación de autenticación 2FA compatible con Google Authenticator como [Authy](https://authy.com/){:target="_blank"}. Después de escanear y registrar la autenticación en la aplicación móvil el usuario tiene que introducir el código generado para verificar que todo se encuentra listo para habilitar 2FA para el usuario.

El código del usuario se recibe en el controlador `Otp::ConfigureController` donde una vez que ha sido verificado se guarda el secreto único del usuario, se guarda el *timestamp* del último código que verificó el usuario y se generan 10 código de recuperación en caso de el usuario pierda o se le dañe su dispositivo y que no quede bloqueado.

```ruby
def create
  otp_secret = params[:otp_secret]
  otp_code = params[:otp_code]

  last_otp_at = verify_otp_code(otp_secret, otp_code, nil)

  if last_otp_at.present?
    @recovery_codes = generate_recovery_codes
    current_identity.tap do |identity|
      identity.last_otp_at = Time.at(last_otp_at).utc.to_datetime
      identity.otp_secret_key = otp_secret
      identity.recovery_codes = @recovery_codes.join(" ")
      identity.save
    end

    redirect_to otp_complete_path, notice: "2AF enabled succesfully"
  else
    render json: {error: "Verification code is invalid"}, status: :unprocessable_entity
  end
end
```

El código único y secreto así como los código de recuperación son secretos sensibles de los cuales tenemos que prevenir que caigan en manos no confiables. Es por este motivo que esos atributos se guardan cifrados en la base de datos con la ayuda de la gema [attr_encrypted](https://github.com/attr-encrypted/attr_encrypted){:target="_blank"}. La llave de cifrado se guarda en las credenciales de Rails.

```ruby
class Identity < ActiveRecord::Base
  has_secure_password validations: true

  attr_encrypted :otp_secret_key, :recovery_codes, key: Base64.decode64(Rails.application.credentials.encryption[:otp_secret_key])

  validates :email, presence: true, uniqueness: true
  validates :password_confirmation, presence: true, if: ->(r) { r.password.present? }
end
```

La llave de cifrado se genera en una consola de Ruby con el siguiente comando `Base64.encode64(SecureRandom.random_bytes(32))`.

Una vez que se validó el código y se guardó la información secreta, al usuario se le muestran sus códigos de recuperación, los cuales van a ser visibles esta única ocasión y se le muestra al usuario opciones para copiar los códigos al "*clipboard*" o imprimirlos o descargarlos en un archivo. Es responsabilidad del usuario guardarlo y mantenerlos seguros. El controlador `Otp::CompleteController` se encarga de esta parte.

```ruby
def show
  current_identity.update_column(:otp_enabled_at, Time.zone.now)
  @recovery_codes = current_identity.recovery_codes.split(" ")
end
```

La lógica para copiar, imprimir o descargar los códigos de recuperación está implementada en los controladores de Stimulus `clipboard_controller.js`, `print_controller.js` y `download_controller.js`.

<div class="gallery">
  <figure>
    <img src="{{ '/images/autenticacion/login-with-otp.gif' }}" loading="lazy" />
  </figure>
</div>

### Nuevo inicio de sesión

Con 2FA activado para un usuario su flujo de inicio de sesión cambia. Ahora el usuario después de ingresar sus credenciales, se le pedirá que ingrese el código temporal que se genera en su aplicación de autenticación en el móvil.

El código se valida y si es correcto entonces se guarda la última ocasión que el usuario validó un código correcto, esto con el fin de evitar que el código se pueda reutilizar en la ventana de 30 segundos que es cuando se genera un nuevo código.

Si el código no es válido, entonces el usuario no va a poder iniciar sesión.

```ruby
def create
  code = params[:code]&.strip
  verified = false

  if present_code?(code)
    last_otp_at = verify_otp_code(current_identity.otp_secret_key, code, current_identity.last_otp_at)

    if last_otp_at.present?
      current_identity.update(last_otp_at: Time.at(last_otp_at).utc.to_datetime)
      verified = true

    else
      verified_code, recovery_codes = verify_recovery_code(current_identity.recovery_codes, code)
      if verified_code.present?
        current_identity.update(recovery_codes: recovery_codes.join(" "))
        verified = true
      end
    end

    if verified
      warden.session(:identity)["otp_verified"] = true
      return redirect_to root_path, notice: t(".logged_in")
    end
  end

  render json: {error: "Verification code is invalid"}, status: :unprocessable_entity
end
```

En caso de que el usuario haya perdido acceso a la aplicación móvil que genera los códigos temporales este puede hacer uso de uno de los 10 códigos de recuperación en lugar del código temporal. Al hacer uso del código de recuperación y que sea válido, este se elimina impidiendo que se pueda volver a utilizar y se le permite el inicio de sesión al usuario.

Esta código se encuentra en el controlador `Otp::VerifyController`.

<div class="gallery">
  <figure>
    <img src="{{ '/images/autenticacion/login-with-recovery-code.gif' }}" loading="lazy" />
  </figure>
</div>

### Deshabilitar 2FA

Aunque no es lo recomendable, el usuario que ha iniciado puede deshabilitar la necesidad de autenticación 2FA al iniciar sesión. Esto puede ser necesario en el caso de que el usuario cambie de dispositivo móvil por lo que es necesario deshabilitar 2FA y volver a habilitarlo con el nuevo dispositivo.

En el controlador `Otp::DisableController` se realiza la desactivación de 2FA dónde se elimina la información como secretos, códigos de recuperación y otros datos adicionales que en conjunto deshabilitan 2FA.

```ruby
def destroy
  current_identity.tap do |identity|
    identity.last_otp_at = nil
    identity.otp_secret_key = nil
    identity.recovery_codes = nil
    identity.otp_enabled_at = nil
    identity.save
  end

  redirect_to root_path, notice: "2FA disabled succesfully"
end
```

<div class="gallery">
  <figure>
    <img src="{{ '/images/autenticacion/disable-otp.gif' }}" loading="lazy" />
  </figure>
</div>

### Detalles finales de la aplicación

El módulo `Otp::Base` incluye la lógica común entre los controladores relacionados en el proceso de 2FA.

En el proyecto disponible en el repositorio mencionado al inicio del post se incluyen también algunas pruebas de sistema, es decir pruebas dónde se automatiza el navegador para simular la interacción del usuario. Las pruebas tienen comentarios que explican qué operaciones son las que se están realizando para verificar los escenarios de 2FA.

## Conclusiones

La seguridad es un factor importante en toda aplicación hoy en día, es algo que como desarrolladores de aplicaciones no debemos de dejar a la ligera. Es nuestra responsabilidad asegurar la información y la confianza de nuestros usuarios.

Estoy seguro que al revisar a detalle el código de la aplicación de ejemplo veremos que es sencillo implementar un nivel más de seguridad en nuestras aplicaciones y que el código está pensado en que pueda ser reutilizado.
