var app = angular.module("mainApp", ["ngRoute", "ngCookies"]);

app.run(function($rootScope, cookieFactory)
{
    $rootScope.$on('$routeChangeStart', function(){
        //cookieFactory.checkStatus();
    })
});

app.controller("loginCtrl", function($scope, $location, $http, cookieFactory, restFactory){
	console.log("Controlador login");
	$scope.username = "";
	$scope.password = "";
	$scope.log = false;
	$scope.mensaje = "";
	
	$scope.login = function(){
		console.log("Función login");
		if($scope.username != "" && $scope.password != ""){
			restFactory.login({emailU: $scope.username, contrasenaU: $scope.password})
	                .success(function (response) {
	                	console.log("Nombre de usuario: "+ $scope.username);
	                	console.log("Contraseña: "+$scope.password);
	                    console.log("Respuesta desde java login");
	                    console.log(response);
	                    var resultado = response.message;

	                    //Verificando el retorno desde java
	                    if(resultado != "false" && resultado != "e" && resultado != "c"){
	                    	restFactory.getUserByEmail($scope.username)	                    	
					               .success(function (response) {
					                console.log(response);
					                var user = response;
					                //guardando en la cookie el usuario logeado
					                cookieFactory.putUser(user);
					                cookieFactory.putEstadoSesion(true);
					             	$location.path(resultado);
					             });
	                    	
	                    }else{
	                    	if(resultado == 'e'){
	                    		console.log("Cuenta Eliminada");
	                    		$scope.log = true;
	                    		$scope.mensaje = "Cuenta eliminada";
	                    		$location.path("/");
	                    	}else if(resultado == 'c'){
	                    		console.log("Cuenta cerrada");
	                    		$scope.log = true;
	                    		$scope.mensaje = "Cuenta cerrada";
	                    		$location.path("/");
	                    	}
	                    }
	                    
	                });
		}
	}

	$scope.forgetPass = function(){
		console.log("Función olvidó contraseña");
		$location.path("/login/olvidoC");
	}
});
app.controller("olvidoCtrl", function($scope, $routeParams, $location, $http, restFactory){

	$scope.email = "";
	$scope.mensaje = "";
	$scope.respuesta = "";
	$scope.usuario = {};
	$scope.log = false;
	$scope.sh = true;

	$scope.back = function(){
		$location.path("/");
	}

	$scope.next = function(){
		restFactory.getUserByEmail($scope.email)
			.success(function (response) {
				if(response){
					if(response.estadoidEstado.nombreE == "Cerrada"){
						console.log("Cuenta cerrada");
						$scope.log = true;
						$scope.mensaje = "Cuenta cerrada";
					}else if(response.estadoidEstado.nombreE == "Eliminada"){
						console.log("Cuenta eliminada");
						$scope.log = true;
						$scope.mensaje = "Cuenta eliminada";
					}else{
						$scope.usuario = response;
						console.log($scope.usuario);
						$scope.sh = false;
						$scope.log = false;
						$scope.mensaje = "";
					}

				}else{
					console.log("Usuario no encontrado");
					$scope.log = true;
					$scope.mensaje = "Cuenta inexistente"
				}	

			console.log("holax");
				
			});
	}

	$scope.send = function(){
		if($scope.usuario.respuestaU == $scope.respuesta){
			console.log("Respuesta iguales");
			//Se procede a enviar el mail
			restFactory.recuperar($scope.usuario.emailU)
			.success(function (response) {
				if(response.message == "true"){
					console.log("E-mail enviado");
					$location.path("/");
				}else{
					console.log("Error al enviar email");
					$scope.log = true;
					$scope.mensaje = "Error en la recuperación de su contraseña, intente más tarde";
				}
				
			});
		}
		else{
			console.log("Respuesta distintas");
			$scope.log = true;
			$scope.mensaje = "Respuesta inválida";
		}
	}
});
app.controller("homeCtrlAlum", function($scope, $location, $http, cookieFactory){
	console.log("Controlador alumno home");
	$scope.usuario = cookieFactory.getUser();

	$scope.close = function(){
		console.log("Función cerrar sesión");
		cookieFactory.removeUser();
		cookieFactory.removeEstadoSesion();
		$location.path("/");
	}

	$scope.editP = function(){
		console.log("Función editar perfil");
		$location.path("/home/alumno/editar");
	}

	$scope.info = function(){
		console.log("Función ver info");
		$location.path("/home/alumno/info");
	}
	$scope.back = function(){
		console.log("Función volver ");
		$location.path("/home/alumno");
	}
});
app.controller("editarAlumCtrl", function($scope, $location, cookieFactory, fileUpload, $http, restFactory){
	console.log("Controlador alumno editar");
	$scope.usuario = cookieFactory.getUser();
	$scope.pass = "";
	$scope.passC = "";
	$scope.fotoP = "";
	$scope.apodo = $scope.usuario.apodoU;
	
	$scope.editar = function(){
		console.log("Función editar");
		var file = $scope.myFile;
		console.log(file);
			//Verificando que los valores entregados tengan un campo y no sean nulos
			if($scope.apodo != "" || $scope.pass != "" || $scope.passC != "" || file != undefined){
				if($scope.apodo != ""){
					$scope.usuario.apodoU = $scope.apodo;
					console.log("Nuevo apodo: "+$scope.usuario.apodoU);
				}
				if($scope.pass != "" && $scope.passC != "" ){
					if($scope.pass == $scope.passC && $scope.pass != $scope.usuario.contraseñaU){
						$scope.usuario.contrasenaU = $scope.pass;
						console.log("Nueva contraseña: "+$scope.pass);
						console.log("Nueva contraseñaC: "+$scope.passC);
					}
				}
				if(file != undefined){
					console.log("File is ");
					console.dir(file);
					$scope.usuario.fotoPerfilU = "img/"+file.name;
					var uploadUrl = "server.php";
					fileUpload.uploadFileToUrl(file, uploadUrl);
				}

					restFactory.editarUsuario($scope.usuario)
						.success(function(response){
							if(response.message == "true"){
								console.log("Edición efectuada");
								console.log("Actualizando usuario en la cookie");
								restFactory.getUserByEmail($scope.usuario.emailU)
					               .success(function (response){
					                console.log(response);
					                var user = response;
					                //Guardando en la cookie el usuario logeado
					                cookieFactory.removeUser();
					                cookieFactory.putUser(user);
					                $scope.usuario = cookieFactory.getUser();
					                $location.path("/home/alumno/info");
					             });
							}
					});
			}
			else{
				console.log("al menos uno de los campos debe ser modificado");
			}	
	}

	$scope.cerrarC = function(){
		var motivo = $scope.motivoC;
		if(motivo != ""){
			restFactory.cerrarEliminar($scope.usuario.idUsuario, motivo, "c")
							.success(function(response){
								if(response.message == "true"){
									cookieFactory.removeUser();
									cookieFactory.removeEstadoSesion();
									$location.path("/");				
								}
						});
		}else{
			console.log("Debe ingresar el motivo");
		}

	}

	$scope.cancelar = function(){
		console.log("Función cancelar");
		$location.path("/home/alumno");
	}

	$scope.close = function(){
		console.log("Función cerrar sesión");
		cookieFactory.removeUser();
		cookieFactory.removeEstadoSesion();
		$location.path("/");
	}

	$scope.editP = function(){
		console.log("Función editar perfil");
		$location.path("/home/alumno/editar");
	}

	$scope.info = function(){
		console.log("Función ver info");
		$location.path("/home/alumno/info");
	}
});
app.controller("homeCtrlProfe", function($scope, $location, $http, cookieFactory){
	console.log("Controlador profesor home");
	$scope.usuario = cookieFactory.getUser();

	$scope.close = function(){
		console.log("Función cerrar sesión");
		cookieFactory.removeUser();
		cookieFactory.removeEstadoSesion();
		$location.path("/");
	}

	$scope.editP = function(){
		console.log("Función editar perfil");
		$location.path("/home/profesor/editar");
	}

	$scope.info = function(){
		console.log("Función ver info");
		$location.path("/home/profesor/info");
	}

	$scope.crear = function(){
		console.log("Función crear usuario");
		$location.path("/home/profesor/crear");
	}

	$scope.ver = function(){
		console.log("Función ver usuarios del sistema");
		$location.path("/home/profesor/ver");
	}

	$scope.back = function(){
		console.log("Función ver usuarios del sistema");
		$location.path("/home/profesor");
	}
});
app.controller("editarProfeCtrl", function($scope, $location, $http, cookieFactory, fileUpload, restFactory){

	console.log("Controlador profesor editar");
	$scope.usuario = cookieFactory.getUser();
	$scope.pass = "";
	$scope.passC = "";
	$scope.fotoP = "";
	$scope.apodo = $scope.usuario.apodoU;

	$scope.editar = function(){
		console.log("Función editar");
		var file = $scope.myFile;
		console.log(file);
			//Verificando que los valores entregados tengan un campo y no sean nulos
			if($scope.apodo != "" || $scope.pass != "" || $scope.passC != "" || file != undefined){
				if($scope.apodo != ""){
					$scope.usuario.apodoU = $scope.apodo;
					console.log("Nuevo apodo: "+$scope.usuario.apodoU);
				}
				if($scope.pass != "" && $scope.passC != "" ){
					if($scope.pass == $scope.passC && $scope.pass != $scope.usuario.contraseñaU){
						$scope.usuario.contrasenaU = $scope.pass;
						console.log("Nueva contraseña: "+$scope.pass);
						console.log("Nueva contraseñaC: "+$scope.passC);
					}
				}
				if(file != undefined){
					console.log("File is ");
					console.dir(file);
					$scope.usuario.fotoPerfilU = "img/"+file.name;
					var uploadUrl = "server.php";
					fileUpload.uploadFileToUrl(file, uploadUrl);
				}
					$http.post("http://localhost:8080/RAPSO-web/webresources/usuario/editarUsuario", $scope.usuario)
						.success(function(response){
							if(response.message == "true"){
								console.log("Edición efectuada");
								console.log("Actualizando usuario en la cookie");
								$http.get("http://localhost:8080/RAPSO-web/webresources/usuario/getUserByEmail/"+$scope.usuario.emailU)
					               .success(function (response){
					                console.log(response);
					                var user = response;
					                //guardando en la cookie el usuario logeado
					                cookieFactory.removeUser();
					                cookieFactory.putUser(user);
					                $scope.usuario = cookieFactory.getUser();
					                $location.path("/home/profesor/info");
					             });
							}
					});
			}
			else{
				console.log("al menos uno de los campos debe ser modificado");
			}	
	}


	$scope.cerrarC = function(){
		var motivo = $scope.motivoC;
		if(motivo != ""){
			$http.post("http://localhost:8080/RAPSO-web/webresources/usuario/cerrarEliminar/"+$scope.usuario.idUsuario+"/"+motivo+"/"+"c")
							.success(function(response){
								if(response.message == "true"){
									cookieFactory.removeUser();
									cookieFactory.removeEstadoSesion();
									$location.path("/");				
								}
						});
		}else{
			console.log("Debe ingresar el motivo");
		}

	}

	$scope.eliminarC = function(){
		console.log("entra  al afuncioón eleiminar");
		var motivo = $scope.motivoE;
		if(motivo != ""){
			$http.post("http://localhost:8080/RAPSO-web/webresources/usuario/cerrarEliminar/"+$scope.usuario.idUsuario+"/"+motivo+"/"+"e")
							.success(function(response){
								if(response.message == "true"){
									cookieFactory.removeUser();
									cookieFactory.removeEstadoSesion();
									$location.path("/");				
								}
						});
		}else{
			console.log("Debe ingresar el motivo");
		}

	}
	
	$scope.close = function(){
		console.log("Función cerrar sesión");
		cookieFactory.removeUser();
		cookieFactory.removeEstadoSesion();
		$location.path("/");
	}

	$scope.editP = function(){
		console.log("Función editar perfil");
		$location.path("/home/profesor/editar");
	}

	$scope.info = function(){
		console.log("Función ver info");
		$location.path("/home/profesor/info");
	}

	$scope.crear = function(){
		console.log("Función crear usuario");
		$location.path("/home/profesor/crear");
	}

	$scope.ver = function(){
		console.log("Función ver usuarios del sistema");
		$location.path("/home/profesor/ver");
	}

	$scope.cancelar = function(){
		console.log("Función cancelar");
		$location.path("/home/profesor");
	}
});
app.controller("crearProfeCtrl", function($scope, $location, $http, cookieFactory, restFactory){

	console.log("Controlador profesor crear");
	$scope.usuario = cookieFactory.getUser();

	$scope.newUsuario = {};
	$scope.passC = "";
	$scope.log = false;
	$scope.message = "";
	$scope.tiposUsuario = {};
	$scope.estados = {};
	$scope.tipoSelected = {};
	$scope.estadoSelected = {};
	$scope.newUsuario.estadoidEstado = new Object();
	$scope.newUsuario.tipoUsuarioidTipoUsuario = new Object();
	//Obteniendo tipos de usuarios
	restFactory.tipoUsuarios()
		.success(function (response){
		 console.log(response);
		 $scope.tiposUsuario = response;
		 $scope.tipoSelected = response[0];
	});

	$scope.crearU = function(){

		if($scope.newUsuario.contrasenaU != $scope.passC){
			$scope.log = true;
			$scope.message = "Contraseñas no coinciden";
		}else{
			$scope.log = false;
			$scope.message = "";
			$scope.newUsuario.fotoPerfilU = "img/estandar.jpg";
			console.log("NUEVO USUARIO");
			console.log($scope.newUsuario);
			console.log($scope.tipoSelected);
			console.log($scope.estadoSelected);
			$scope.newUsuario.estadoidEstado.idEstado = 1;
			$scope.newUsuario.estadoidEstado.nombreE = "Abierta";
			$scope.newUsuario.tipoUsuarioidTipoUsuario.idTipoUsuario = $scope.tipoSelected.idTipoUsuario;
			$scope.newUsuario.tipoUsuarioidTipoUsuario.nombreTU = $scope.tipoSelected.nombreTU;
			//$scope.newUsuario.idUsuario = ""+$scope.tipoSelected.idTipoUsuario+""+$scope.estadoSelected.idEstado+"";
			//console.log("idUsuario: "+$scope.newUsuario.idUsuario);
			restFactory.crearUsuario($scope.newUsuario)
						.success(function(response){
							if(response.message == "true"){
								console.log("Creación efectuada");
								$location.path("/home/profesor/info/"+$scope.newUsuario.emailU);

							}else if(response.message == "r"){
								console.log("Rut existente");
								$scope.log = true;
								$scope.message = "Rut registrado";

							}else if(response.message == "e"){
								console.log("Email existente");
								$scope.log = true;
								$scope.message = "Email registrado";

							}else{
								//false
								console.log("Usuario existente");
								$scope.log = true;
								$scope.message = "Usuario existente";
							}
					});

		}
	}
	
	$scope.cancelar = function(){
		console.log("Función cancelar");
		$location.path("/home/profesor");
	}

	$scope.close = function(){
		console.log("Función cerrar sesión");
		cookieFactory.removeUser();
		cookieFactory.removeEstadoSesion();
		$location.path("/");
	}

	$scope.editP = function(){
		console.log("Función editar perfil");
		$location.path("/home/profesor/editar");
	}

	$scope.info = function(){
		console.log("Función ver info");
		$location.path("/home/profesor/info");
	}

	$scope.crear = function(){
		console.log("Función crear usuario");
		$location.path("/home/profesor/crear");
	}

	$scope.ver = function(){
		console.log("Función ver usuarios del sistema");
		$location.path("/home/profesor/ver");
	}
});
app.controller("cuentasCtrlProfe", function($scope, $location, $http, cookieFactory, restFactory){
	console.log("Controlador profesor cuentas");
	$scope.usuario = cookieFactory.getUser();

	$scope.usuarios = {};

	restFactory.getAllUsers()
		.success(function (response){
		console.log(response);
		$scope.usuarios = response;
	});

	$scope.sendEdicion = function(emailU){
		console.log("Función send Edición");
		$location.path("/home/profesor/info/"+emailU);
	}

	$scope.close = function(){
		console.log("Función cerrar sesión");
		cookieFactory.removeUser();
		cookieFactory.removeEstadoSesion();
		$location.path("/");
	}

	$scope.editP = function(){
		console.log("Función editar perfil");
		$location.path("/home/profesor/editar");
	}

	$scope.info = function(){
		console.log("Función ver info");
		$location.path("/home/profesor/info");
	}

	$scope.crear = function(){
		console.log("Función crear usuario");
		$location.path("/home/profesor/crear");
	}

	$scope.ver = function(){
		console.log("Función ver usuarios del sistema");
		$location.path("/home/profesor/ver");
	}
});
app.controller("infoCtrlProfe", function($scope, $location, $http, cookieFactory, $routeParams, restFactory){
	console.log("Controlador profesor home");
	$scope.usuario = cookieFactory.getUser();

	$scope.emailUSelected = $routeParams.emailU;

	$scope.userSelected = {};

	restFactory.getUserByEmail($scope.emailUSelected)
		.success(function (response){
		console.log("Función get por email");
		console.log(response);
		$scope.userSelected = response;
	});

	$scope.back = function(){
		console.log("Función volver atrás");
		$location.path("/home/profesor/ver");
	}

	$scope.close = function(){
		console.log("Función cerrar sesión");
		cookieFactory.removeUser();
		cookieFactory.removeEstadoSesion();
		$location.path("/");
	}

	$scope.editP = function(){
		console.log("Función editar perfil");
		$location.path("/home/profesor/editar/"+$scope.emailUSelected);
	}

	$scope.info = function(){
		console.log("Función ver info");
		$location.path("/home/profesor/info");
	}

	$scope.crear = function(){
		console.log("Función crear usuario");
		$location.path("/home/profesor/crear");
	}

	$scope.ver = function(){
		console.log("Función ver usuarios del sistema");
		$location.path("/home/profesor/ver");
	}
});
app.controller("editarPCtrl", function($scope, $location, $http, cookieFactory, fileUpload, $routeParams, restFactory){

	console.log("Controlador profesor editar selected");
	$scope.usuario = cookieFactory.getUser();
	$scope.userSelected = {};
	$scope.tiposUsuario = {};
	$scope.estados = {};
	$scope.tipoSelected = {};
	$scope.estadoSelected = {};
	$scope.pass = "";
	$scope.passC = "";
	$scope.fotoP = "";
	$scope.email = $routeParams.emailU;
	$scope.apodo = "";
	
	restFactory.getUserByEmail($scope.email)
		.success(function (response){
		console.log("Email: "+$scope.email);
		console.log("Función get por email");
		console.log(response);
		$scope.userSelected = response;
		$scope.apodo = $scope.userSelected.apodoU;
		$scope.tipoSelected = $scope.userSelected.tipoUsuarioidTipoUsuario;
	});

		//Obteniendo tipos de usuarios
		restFactory.tipoUsuarios()
			.success(function (response){
			 console.log(response);
			 $scope.tiposUsuario = response;
		});

	$scope.editar = function(){
		console.log("Función editar");
			//Verificando que los valores entregados tengan un campo y no sean nulos
			if($scope.apodo != "" || $scope.pass != "" || $scope.passC != ""){
				if($scope.apodo != ""){
					$scope.userSelected.apodoU = $scope.apodo;
					console.log("Nuevo apodo: "+$scope.userSelected.apodoU);
				}
				if($scope.pass != "" && $scope.passC != "" ){
					if($scope.pass == $scope.passC && $scope.pass != $scope.userSelected.contraseñaU){
						$scope.userSelected.contrasenaU = $scope.pass;
						console.log("Nueva contraseña: "+$scope.pass);
						console.log("Nueva contraseñaC: "+$scope.passC);
					}
				}
				if($scope.tipoSelected.idTipoUsuario != $scope.userSelected.tipoUsuarioidTipoUsuario.idTipoUsuario){
					$scope.userSelected.tipoUsuarioidTipoUsuario.idTipoUsuario = $scope.tipoSelected.idTipoUsuario;
					$scope.userSelected.tipoUsuarioidTipoUsuario.nombreTU = $scope.tipoSelected.nombreTU;
				}
					restFactory.editarUsuario($scope.userSelected)
						.success(function(response){
							if(response.message == "true"){
								console.log("Edición efectuada");
							    $location.path("/home/profesor/info/"+$scope.userSelected.emailU);
							}
					});
			}
			else{
				console.log("al menos uno de los campos debe ser modificado");
			}	
	}


	$scope.cerrarC = function(){
		var motivo = $scope.motivoC;
		if(motivo != ""){
			restFactory.cerrarEliminar($scope.userSelected.idUsuario, motivo, "c")
							.success(function(response){
								if(response.message == "true"){
									$location.path("/home/profesor/ver");				
								}
						});
		}else{
			console.log("Debe ingresar el motivo");
		}

	}

	$scope.eliminarC = function(){
		console.log("entra a la función eliminar");
		var motivo = $scope.motivoE;
		if(motivo != ""){
			restFactory.cerrarEliminar($scope.userSelected.idUsuario, motivo, "e")
							.success(function(response){
								if(response.message == "true"){
									$location.path("/home/profesor/ver");				
								}
						});
		}else{
			console.log("Debe ingresar el motivo");
		}
	}
	
	$scope.close = function(){
		console.log("Función cerrar sesión");
		cookieFactory.removeUser();
		cookieFactory.removeEstadoSesion();
		$location.path("/");
	}

	$scope.editP = function(){
		console.log("Función editar perfil");
		$location.path("/home/profesor/editar");
	}

	$scope.info = function(){
		console.log("Función ver info");
		$location.path("/home/profesor/info");
	}

	$scope.crear = function(){
		console.log("Función crear usuario");
		$location.path("/home/profesor/crear");
	}

	$scope.ver = function(){
		console.log("Función ver usuarios del sistema");
		$location.path("/home/profesor/ver");
	}

	$scope.cancelar = function(){
		console.log("Función cancelar");
		$location.path("/home/profesor");
	}
});