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

	cookieFactory.checkStatus = function(){
		var rutasPrivadas = ["/","/home/alumno"];
	        if(cookieFactory.in_array($location.path(),rutasPrivadas) && !cookieFactory.getEstadoSesion())
	        {
	            $location.path("/");
	        }
	        //en el caso de que intente acceder al login y ya haya iniciado sesión lo mandamos a la home
	        if(cookieFactory.in_array("/",rutasPrivadas) && cookieFactory.getEstadoSesion())
	        {
	        	$location.path("/home/alumno");
	        }
	};


	cookieFactory.in_array = function(needle, haystack){
		var key = '';
            for(key in haystack)
            {
                if(haystack[key] == needle)
                {
                    return true;
                }
            }
            return false;
	};

	return cookieFactory;
}]);

app.factory("restFactory", ["$http", function($http){

	var restFactory = {};

	restFactory.login = function(datos){
		return $http.post("http://localhost:8080/RAPSO-web/webresources/usuario/login", datos);
	};

	restFactory.getUserByEmail = function(email){
		return $http.get("http://localhost:8080/RAPSO-web/webresources/usuario/getUserByEmail/"+email);
	};

	restFactory.recuperar = function(email){
		return $http.post("http://localhost:8080/RAPSO-web/webresources/usuario/recuperar/"+email);
	};

	restFactory.editarUsuario = function(usuario){
		return $http.post("http://localhost:8080/RAPSO-web/webresources/usuario/editarUsuario", usuario);
	};

	restFactory.cerrarEliminar = function(idUsuario, motivo, tipo){
		return $http.post("http://localhost:8080/RAPSO-web/webresources/usuario/cerrarEliminar/"+idUsuario+"/"+motivo+"/"+tipo);
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