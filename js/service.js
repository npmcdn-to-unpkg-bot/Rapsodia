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
           
    this.getUser = function(){
        return this.user;
    };

    this.setUser = function(user){
        this.user = user;
        $window.localStorage.setItem('sesion.user', JSON.stringify(user));
        return this;
    };

    this.destroy = function destroy(){
        this.setUser(null);
    };
 }]);

app.service('auth',['$http', 'sesion', '$location', 
  function($http, sesion, $location) {
    
    this.isLoggedIn = function isLoggedIn(){
      return sesion.getUser() !== null;
    };

    this.isProfesor = function isProfesor(){
        return sesion.getUser().tipoUsuarioidTipoUsuario.nombreTU == "Profesor";
    };

    this.isAlumnoAyudante = function isAlumnoAyudante(){
        return  sesion.getUser().tipoUsuarioidTipoUsuario.nombreTU == "Alumno" ||  sesion.getUser().tipoUsuarioidTipoUsuario.nombreTU == "Ayudante";
    };

 }]);