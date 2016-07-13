app.factory("cookieFactory", ["$cookieStore", "$location", "$http", function($cookieStore, $location){

	var cookieFactory = {};

	cookieFactory.putUser = function(user){
		$cookieStore.put("user", user);
	};

	cookieFactory.getUser = function(){
		cookieFactory.user = $cookieStore.get("user");
		return cookieFactory.user;
	};

	cookieFactory.removeUser = function(){
		$cookieStore.remove("user");
	};

	cookieFactory.putEstadoSesion = function(estado){
		$cookieStore.put("estadoS", estado);
	}

	cookieFactory.getEstadoSesion = function(){
		cookieFactory.estadoSesion = $cookieStore.get("estadoS");
		return cookieFactory.estadoSesion;
	};

	cookieFactory.removeEstadoSesion = function(){
		$cookieStore.remove("estadoS");
	};

	return cookieFactory;
}]);

app.factory("restFactory", ["$http", function($http){

	var restFactory = {};

	restFactory.login = function(email, pass){
		return $http.post("http://localhost:8080/RAPSO-web/webresources/usuario/login/"+email+"/"+pass);
	};

	restFactory.getUserByEmail = function(email){
		return $http.get("http://localhost:8080/RAPSO-web/webresources/usuario/getUserByEmail/"+email);
	};

	restFactory.sendEmail = function(email, op){
		return $http.post("http://localhost:8080/RAPSO-web/webresources/usuario/sendEmail/"+email+"/"+op);
	};

	restFactory.editarUsuario = function(usuario){
		return $http.post("http://localhost:8080/RAPSO-web/webresources/usuario/editarUsuario", usuario);
	};

	restFactory.cerrarEliminar = function(rutU, motivo, op){
		return $http.post("http://localhost:8080/RAPSO-web/webresources/usuario/cerrarEliminar/"+rutU+"/"+motivo+"/"+op);
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
	
	return restFactory;
}]);
