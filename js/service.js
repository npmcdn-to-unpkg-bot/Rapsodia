app.service('fileUpload', ['$http', function ($http) {
    this.uploadFileToUrl = function(file, uploadUrl){
        var fd = new FormData();
        fd.append('file', file);
        $http.post(uploadUrl, fd, {
            transformRequest: angular.identity,
            headers: {'Content-Type': undefined}
        })
        .success(function(){
            console.log("Imagen guardada");
        })
        .error(function(){
            console.log("Error al guardar la imagen");
        });
    }
}]);

app.service('sesion',['$window',function($window) {

    this.user = JSON.parse($window.localStorage.getItem('sesion.user'));
    this.userToEdit  = JSON.parse($window.localStorage.getItem('sesion.userToEdit'));
    this.userAux  = JSON.parse($window.localStorage.getItem('sesion.userAux'));        

    this.getUser = function(){
        return this.user;
    };

    this.getUserToEdit = function(){
        return this.userToEdit;
    };

    this.getUserAux = function(){
        return this.userAux;
    };

    this.setUser = function(user){
        this.user = user;
        $window.localStorage.setItem('sesion.user', JSON.stringify(user));
        return this;
    };

    this.setUserToEdit = function(user1){
        this.userToEdit = user1;
        $window.localStorage.setItem('sesion.userToEdit', JSON.stringify(user1));
        return this;
    };

    this.setUserAux = function(user2){
        this.userAux = user2;
        $window.localStorage.setItem('sesion.userAux', JSON.stringify(user2));
        return this;
    };

    this.destroy = function destroy(){
        this.setUser(null);
    };

    this.destroyUserToEdit = function destroyUserToEdit(){
        this.setUserToEdit(null);
    };

    this.destroyUserAux = function destroyUserAux(){
        this.setUserAux(null);
    };
 }]);

app.service('auth',['$http', 'sesion', '$location', function($http, sesion, $location) {
    
    this.isLoggedIn = function isLoggedIn(){
      return sesion.getUser() !== null;
    };

    this.isProfesor = function isProfesor(){
        return sesion.getUser().tipoUsuarioidTipoUsuario.nombreTU == 'Profesor';
    };

    this.isAdmin = function isAdmin(){
        return sesion.getUser().rutU == '18486956-k';
    }

     this.isAdminE = function isAdminE(){
        return sesion.getUserToEdit().rutU == '18486956-k';
    }

    this.isAdministrador = function isAdministrador(){
        return sesion.getUser().tipoUsuarioidTipoUsuario.nombreTU == 'Administrador';
    }

    this.isAlumnoAyudante = function isAlumnoAyudante(){
        return  sesion.getUser().tipoUsuarioidTipoUsuario.nombreTU == 'Alumno' ||  sesion.getUser().tipoUsuarioidTipoUsuario.nombreTU == 'Ayudante';
    };

    this.isCerrada = function isCerrada(){
        return  sesion.getUser().estadoidEstado.nombreE == 'Cerrada';
    };

    this.isAbierta = function isAbierta(){
        return  sesion.getUser().estadoidEstado.nombreE == 'Abierta';
    };

    this.isUserToEdit = function isUserToEdit(){
         return sesion.getUserToEdit() !== null;
    }

    this.isUserAux = function isUserAux(){
         return sesion.getUserAux() !== null;
    }
 }]);