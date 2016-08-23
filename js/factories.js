app.factory("restFactory", ["$http", function($http){

	var restFactory = {};

	restFactory.login = function(email, pass){
		return $http.post("http://localhost:8080/RAPSO-web/webresources/usuario/login/"+email+"/"+pass);
	};

	restFactory.getUserByEmail = function(email){
		return $http.get("http://localhost:8080/RAPSO-web/webresources/usuario/getUserByEmail/"+email);
	};

	restFactory.sendEmail = function(email, op){
		return $http.post("http://localhost:8080/RAPSO-web/webresources/usuario/recuperar/"+email+"/"+op);
	};

	restFactory.editarUsuario = function(usuario){
		return $http.post("http://localhost:8080/RAPSO-web/webresources/usuario/editarUsuario", usuario);
	};

	restFactory.activar = function(rutU){
		return $http.post("http://localhost:8080/RAPSO-web/webresources/usuario/activarC/"+rutU);
	};

	restFactory.cerrar = function(rutU, motivo){
		return $http.post("http://localhost:8080/RAPSO-web/webresources/usuario/cerrarC/"+rutU+"/"+motivo);
	};

	restFactory.eliminar = function(rutU){
		return $http.post("http://localhost:8080/RAPSO-web/webresources/usuario/eliminarC/"+rutU);
	};

	restFactory.tipoUsuarios = function(){
		return $http.get("http://localhost:8080/RAPSO-web/webresources/usuario/tipoUsuarios");
	};

	restFactory.crearUsuario = function(usuario){
		return $http.post("http://localhost:8080/RAPSO-web/webresources/usuario/crearUsuario", usuario);
	};

	restFactory.getAllUsers = function(){
		return $http.get("http://localhost:8080/RAPSO-web/webresources/usuario/getAllUsers");
	};
	
	restFactory.getPAA = function(idP){
		return $http.get("http://localhost:8080/RAPSO-web/webresources/usuario/getPAlum/"+idP);
	};

	restFactory.getAllE = function(tipo){
		return $http.get("http://localhost:8080/RAPSO-web/webresources/usuario/getAllE/"+tipo);
	};

	restFactory.asociar = function(rutP, rutA){
		return $http.post("http://localhost:8080/RAPSO-web/webresources/usuario/asociar/"+rutP+"/"+rutA);
	};

	restFactory.getTUCustom = function(){
		return $http.get("http://localhost:8080/RAPSO-web/webresources/usuario/getTUCustom");
	};

	restFactory.desligar = function(rutP, rutA){
		return $http.post("http://localhost:8080/RAPSO-web/webresources/usuario/desligar/"+rutP+"/"+rutA);
	};

	restFactory.getPByAA = function(idAA){
		return $http.get("http://localhost:8080/RAPSO-web/webresources/usuario/getPByAlum/"+idAA);
	};

	return restFactory;
}]);
