export class validacion {

//evalua la fortaleza de la contraseña
    evaluarSeguridadContrasena(contrasena: string): string {
        let seguridad = 0;

        if (contrasena.length >= 8) {
            seguridad += 15;
        }

        if (/[a-z]/.test(contrasena) && /[A-Z]/.test(contrasena)) {
            seguridad += 25;
        }

        if (/\d/.test(contrasena)) {
            seguridad += 25;
        }

        if (/[!@#$%^&*()_+{}\[\]:;<>,.?~\-]/.test(contrasena)) {
            seguridad += 25;
        }

        if (seguridad < 50) {
            return 'Débil';
        } else if (seguridad < 75) {
            return 'Moderada';
        } else {
            return 'Fuerte';
        }
    }



}