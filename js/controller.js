var app = angular.module("mainApp", ["ngRoute", "ngCookies", "ngMaterial", "ngMessages", "dataGrid", "pagination", "ngFileUpload"]);

app.run(function($rootScope, auth, sesion,cookieFactory){
	$rootScope.auth = auth;
    $rootScope.sesion = sesion;
});
app.controller("snCtrl", function($rootScope, $scope, $location, $mdToast, $timeout, $mdSidenav){
	console.log("Controlador sideNav");
	//Funciones alumno / ayudante

	$scope.perfilAA = function(){
		console.log("Ver perfil alumno");
		$location.path("/home/alumno/info");
	}

	//Funciones profesor

	$scope.perfilP = function(){
		console.log("Ver perfil profesor");
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

	$scope.closeSide = function(sideId) {
      $mdSidenav(sideId).close()
        .then(function () {
          $log.debug("close RIGHT is done");
        });
    }

	$scope.toggleLeft = buildDelayedToggler('left');

	function debounce(func, wait, context) {
      var timer;

      return function debounced() {
        var context = $scope,
            args = Array.prototype.slice.call(arguments);
        $timeout.cancel(timer);
        timer = $timeout(function() {
          timer = undefined;
          func.apply(context, args);
        }, wait || 10);
      };
    }

    function buildDelayedToggler(navID) {
      return debounce(function() {
        $mdSidenav(navID)
          .toggle()
          .then(function () {
            $log.debug("toggle " + navID + " is done");
          });
      }, 200);
    }

    function buildToggler(navID) {
      return function() {
        $mdSidenav(navID)
          .toggle()
          .then(function () {
            $log.debug("toggle " + navID + " is done");
          });
      }
    }
});
app.controller("tbCtrl", function($rootScope, $scope, $location, $http, restFactory, $mdToast, $mdSidenav, $log, $timeout){

	//Funciones usuario
	$scope.close = function(){
		console.log("Cerrar sesión");
		$rootScope.sesion.destroy();
		$location.path("/");
	}

	$scope.editP = function(){
		console.log("Editar perfil");
		$location.path("/home/alumno/editar");
	}

	//Funciones profesor

	$scope.editProfe = function(){
		console.log("Función editar perfil");
		$location.path("/home/profesor/editar");
	}

	//Funciones sideNav
	$scope.toggleLeft = buildDelayedToggler('left');

	function debounce(func, wait, context) {
      var timer;

      return function debounced() {
        var context = $scope,
            args = Array.prototype.slice.call(arguments);
        $timeout.cancel(timer);
        timer = $timeout(function() {
          timer = undefined;
          func.apply(context, args);
        }, wait || 10);
      };
    }

    function buildDelayedToggler(navID) {
      return debounce(function() {
        $mdSidenav(navID)
          .toggle()
          .then(function () {
            $log.debug("toggle " + navID + " is done");
          });
      }, 200);
    }

    function buildToggler(navID) {
      return function() {
        $mdSidenav(navID)
          .toggle()
          .then(function () {
            $log.debug("toggle " + navID + " is done");
          });
      }
    }
});
app.controller("loginCtrl", function($rootScope, $scope, $location, $http, restFactory, $mdToast){
	console.log("Controlador login");
	$scope.username = "";
	$scope.password = "";

	$scope.toastPosition = {
	    bottom: true,
	    top: false,
	    left: false,
	    right: true,
	    center: true
  	};

	$scope.getToastPosition = function() {
	    return Object.keys($scope.toastPosition)
	      .filter(function(pos) { return $scope.toastPosition[pos]; })
	      .join(' ');
	};

	$scope.showSimpleToast = function(message) {
	    $mdToast.show(
	      $mdToast.simple()
	        .content(message)
	        .action("ok")
	        .highlightAction(true)
	        .highlightClass("md-accent")
	        .position($scope.getToastPosition())
	        .hideDelay(3000)
	    );
	};
	
	$scope.loginF = function(){
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
					                $rootScope.sesion.setUser(user);
					             	$location.path(resultado);
					             });
	                    	
	                    }else{
	                    	if(resultado == 'e'){
	                    		console.log("Cuenta Eliminada");
	                    		$scope.showSimpleToast("Cuenta Eliminada");
	                    	}else if(resultado == 'c'){
	                    		console.log("Cuenta cerrada");
	                    		$scope.showSimpleToast("Cuenta Cerrada");
	                    	}else{
	                    		console.log("Contraseña incorrecta");
	                    		$scope.showSimpleToast("E-mail o contraseña incorrecta");
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
app.controller("olvidoCtrl", function($rootScope, $scope, $routeParams, $location, $http, restFactory, $mdToast){

	$scope.email = "";
	$scope.respuesta = "";
	$scope.usuario = {};
	$scope.sh = true;

	$scope.toastPosition = {
	    bottom: true,
	    top: false,
	    left: false,
	    right: true,
	    center: true
  	};

	  $scope.getToastPosition = function() {
	    return Object.keys($scope.toastPosition)
	      .filter(function(pos) { return $scope.toastPosition[pos]; })
	      .join(' ');
	  };

	  $scope.showSimpleToast = function(message) {
	    $mdToast.show(
	      $mdToast.simple()
	        .content(message)
	        .action("ok")
	        .highlightAction(true)
	        .highlightClass("md-accent")
	        .position($scope.getToastPosition())
	        .hideDelay(3000)
	    );
	  };

	$scope.back = function(){
		$location.path("/");
	}

	$scope.next = function(){
		restFactory.getUserByEmail($scope.email)
			.success(function (response) {
				console.log("Recuperar");
				if(response){
					console.log("Entra la if");
					if(response.estadoidEstado.nombreE == "Cerrada"){
						console.log("Cuenta cerrada");
						$scope.showSimpleToast("Cuenta Cerrada");
					}else if(response.estadoidEstado.nombreE == "Eliminada"){
						console.log("Cuenta eliminada");
						$scope.showSimpleToast("Cuenta Eliminada");
					}else{
						$scope.usuario = response;
						console.log($scope.usuario);
						$scope.sh = false;
						$scope.log = false;
						$scope.mensaje = "";
					}

				}else{
					console.log("Usuario no encontrado");
					$scope.showSimpleToast("Cuenta inexistente");
				}	
			});
	}

	$scope.send = function(){
		if($scope.usuario.respuestaU == $scope.respuesta){
			console.log("Respuesta iguales");
			//Se procede a enviar el mail
			restFactory.sendEmail($scope.usuario.emailU, "r")
			.success(function () {
					console.log("E-mail enviado");
					$scope.showSimpleToast("Recuperación efectuada");
					$location.path("/");			
			});
		}
		else{
			console.log("Respuesta distintas");
			$scope.showSimpleToast("Respuesta incorrecta");
		}
	}
});
app.controller("homeCtrlAlum", function($rootScope, $scope, $location, $http){
	console.log("Ctrl Alum");
	$scope.usuario = $rootScope.sesion.getUser();
	console.log($scope.usuario);

    $scope.editP = function(){
		console.log("Editar perfil");
		$location.path("/home/alumno/editar");
	}

	$scope.back = function(){
		console.log(" volver ");
		$location.path("/home/alumno");
	}
});
app.controller("editarAlumCtrl", function($rootScope, $scope, $location, $http, restFactory, $mdDialog, $mdToast, Upload){
	console.log("Controlador alumno editar");
	$scope.usuario = $rootScope.sesion.getUser();
	$scope.pass = "";
	$scope.passC = "";
	$scope.fotoP = "";
	$scope.apodo = $scope.usuario.apodoU;
	//$scope.fileName = $scope.usuario.fotoPerfilU;
	$scope.toastPosition = {
	    bottom: true,
	    top: false,
	    left: false,
	    right: true,
	    center: true
  	};

	$scope.getToastPosition = function() {
	    return Object.keys($scope.toastPosition)
	      .filter(function(pos) { return $scope.toastPosition[pos]; })
	      .join(' ');
	};

	$scope.showSimpleToast = function(message) {
	    $mdToast.show(
	      $mdToast.simple()
	        .content(message)
	        .action("ok")
	        .highlightAction(true)
	        .highlightClass("md-accent")
	        .position($scope.getToastPosition())
	        .hideDelay(3000)
	    );
	};

	$scope.showAlert = function(contenido) {
		$mdDialog.show(
		      $mdDialog.alert()
		        .parent(angular.element(document.querySelector('#popupContainer')))
		        .clickOutsideToClose(true)
		        .title('Información')
		        .textContent(contenido)
		        .ariaLabel('Alert Dialog Demo')
		        .ok('Entendido!')
		    );
	};

	$scope.editarP = function(){
		console.log("Función editar");
		var file = $scope.file;
			if((($scope.pass == undefined && $scope.passC == undefined) || ($scope.pass == "" && $scope.passC == "")) && $scope.apodo == $scope.usuario.apodoU && file == undefined ){
				$scope.showAlert("No existen campos a modificar.");
				return "";
			}
			if(( $scope.pass != undefined && $scope.passC != undefined) || ($scope.pass != "" && $scope.passC != "")){
				if($scope.pass != $scope.passC){
					$scope.showAlert("Contraseñas ingresadas no coinciden.");
					return "";
					}
				if($scope.pass == $scope.usuario.contrasenaU){
					$scope.showAlert("Contraseña ingresada es igual a la actual.");
					return "";
				}
			}

			var confirm = $mdDialog.confirm()
					          .title('Desea actualizar su perfil?')
					          .textContent('Su perfil será actualizado')
					          .ariaLabel('Lucky day')
					          .ok('Actualizar')
					          .cancel('Cancelar');

	          $mdDialog.show(confirm).then(function() {
			    	console.log("confirmado");
			    if(($scope.apodo != "" || $scope.apodo != undefined || $scope.apodo != null) && $scope.apodo != $scope.usuario.apodoU){
					console.log($scope.apodo);
					$scope.usuario.apodoU = $scope.apodo;
					console.log("Nuevo apodo: "+$scope.usuario.apodoU);
				}	
				
				if(($scope.pass == undefined && $scope.passC == undefined) || ($scope.pass == "" && $scope.passC == "")){
					
				}else{
					console.log("entra al else");
					$scope.usuario.contrasenaU = $scope.pass;
					console.log("Nueva contraseña: "+$scope.pass);
					console.log("Nueva contraseñaC: "+$scope.passC);
				}
				if(file != undefined){
					console.log(file);
					console.log(file.name);
					$scope.usuario.fotoPerfilU = "img/"+file.name;
				}
				
				if(file != undefined){
					Upload.upload({
				            url: 'server.php',
				            data: {file: file, 'username': $scope.usuario.rutU}
				        }).then(function (resp) {
				            console.log('Success ' + resp.config.data.file.name + 'uploaded. Response: ' + resp.data);
				            restFactory.editarUsuario($scope.usuario)
									.success(function(response){
										if(response.message == "true"){
											console.log("Edición efectuada");
											restFactory.getUserByEmail($scope.usuario.emailU)
								               .success(function (response){
								                console.log(response);
								                var user = response;
								                $rootScope.sesion.setUser(user);
								                $scope.showSimpleToast("Edición efectuada");
								                restFactory.sendEmail($scope.usuario.emailU, "e");
								             });
										}
								});
				        });
				}else{
					restFactory.editarUsuario($scope.usuario)
						.success(function(response){
							if(response.message == "true"){
								console.log("Edición efectuada");
								restFactory.getUserByEmail($scope.usuario.emailU)
					               .success(function (response){
					                console.log(response);
					                var user = response;
					                $rootScope.sesion.setUser(user);
					                $scope.showSimpleToast("Edición efectuada");
					                restFactory.sendEmail($scope.usuario.emailU, "e");
					             });
							}
					});
				}	
				$location.path("/home/alumno/info");					
			    	return "";
			    }, function() {
			    	console.log("cancelado");
			    	return "";
			    });
	}

	$scope.cerrarC = function(){
		var motivo = $scope.motivoC;
			var confirm = $mdDialog.confirm()
	          .title('Desea cerrar su cuenta?')
	          .textContent('Su cuenta será cerrada')
	          .ariaLabel('Lucky day')
	          .ok('Cerrar')
	          .cancel('Cancelar');

	          $mdDialog.show(confirm).then(function() {
			    	console.log("confirmado");
			    	restFactory.cerrarEliminar($scope.usuario.rutU, motivo, "c")
							.success(function(response){
								if(response.message == "true"){
									restFactory.sendEmail($scope.usuario.emailU, "c");
									$rootScope.sesion.destroy();
									$scope.showSimpleToast("Borrando cuenta, se le enviará un correo electrónico");
									$location.path("/");				
								}
						});
			    	return "";
			    }, function() {
			    	console.log("cancelado");
			    	return "";
			    });
	}

	$scope.cancelar = function(){
		console.log("Función cancelar");
		$location.path("/home/alumno");
	}
});
app.controller("homeCtrlProfe", function($rootScope, $scope, $location, $http){
	console.log("Ctrl Profe");
	$scope.usuario = $rootScope.sesion.getUser();

	$scope.editP = function(){
		console.log("Función editar perfil");
		$location.path("/home/profesor/editar");
	}

	$scope.back = function(){
		console.log("Función volver atras");
		$location.path("/home/profesor");
	}
});
app.controller("editarProfeCtrl", function($rootScope, $scope, $location, $http, fileUpload, restFactory, $mdDialog, $mdMedia, $mdToast, Upload){

	console.log("Controlador profesor editar");
	$scope.usuario = $rootScope.sesion.getUser();
	$scope.pass = "";
	$scope.passC = "";
	$scope.fotoP = "";
	$scope.apodo = $scope.usuario.apodoU;

	$scope.toastPosition = {
	    bottom: true,
	    top: false,
	    left: false,
	    right: true,
	    center: true
  	};

	$scope.getToastPosition = function() {
	    return Object.keys($scope.toastPosition)
	      .filter(function(pos) { return $scope.toastPosition[pos]; })
	      .join(' ');
	};

	$scope.showSimpleToast = function(message) {
	    $mdToast.show(
	      $mdToast.simple()
	        .content(message)
	        .action("ok")
	        .highlightAction(true)
	        .highlightClass("md-accent")
	        .position($scope.getToastPosition())
	        .hideDelay(3000)
	    );
	};

	$scope.showAlert = function(contenido) {
		$mdDialog.show(
		      $mdDialog.alert()
		        .parent(angular.element(document.querySelector('#popupContainer')))
		        .clickOutsideToClose(true)
		        .title('Información')
		        .textContent(contenido)
		        .ariaLabel('Alert Dialog Demo')
		        .ok('Entendido!')
		    );
	};

	$scope.editarP = function(){
		console.log("Función editar");
		var file = $scope.file;
			if((($scope.pass == undefined && $scope.passC == undefined) || ($scope.pass == "" && $scope.passC == "")) && $scope.apodo == $scope.usuario.apodoU && file == undefined ){
				$scope.showAlert("No existen campos a modificar.");
				return "";
			}
			if(( $scope.pass != undefined && $scope.passC != undefined) || ($scope.pass != "" && $scope.passC != "")){
				if($scope.pass != $scope.passC){
					$scope.showAlert("Contraseñas ingresadas no coinciden.");
					return "";
					}
				if($scope.pass == $scope.usuario.contrasenaU){
					$scope.showAlert("Contraseña ingresada es igual a la actual.");
					return "";
				}
			}

	    		var confirm = $mdDialog.confirm()
			          .title('Desea actualizar su perfil?')
			          .textContent('Su perfil será actualizado')
			          .ariaLabel('Lucky day')
			          .ok('Actualizar')
			          .cancel('Cancelar');

			    $mdDialog.show(confirm).then(function() {
			    	console.log("confirmado");
			    	if(($scope.apodo != "" || $scope.apodo != undefined || $scope.apodo != null) && $scope.apodo != $scope.usuario.apodoU){
					console.log($scope.apodo);
					$scope.usuario.apodoU = $scope.apodo;
					console.log("Nuevo apodo: "+$scope.usuario.apodoU);
				}
				
				if(($scope.pass == undefined && $scope.passC == undefined) || ($scope.pass == "" && $scope.passC == "")){
					console.log($scope.pass);
					console.log("no hacer nada");
					
				}else{
					console.log("entra al else");
					$scope.usuario.contrasenaU = $scope.pass;
					console.log("Nueva contraseña: "+$scope.pass);
					console.log("Nueva contraseñaC: "+$scope.passC);
				}
				if(file != undefined){
					console.log(file);
					console.log(file.name);
					$scope.usuario.fotoPerfilU = "img/"+file.name;

				}

				//
					if(file != undefined){
					Upload.upload({
				            url: 'server.php',
				            data: {file: file, 'username': $scope.usuario.rutU}
				        }).then(function (resp) {
				            console.log('Success ' + resp.config.data.file.name + 'uploaded. Response: ' + resp.data);
				            restFactory.editarUsuario($scope.usuario)
									.success(function(response){
										if(response.message == "true"){
											console.log("Edición efectuada");
											restFactory.getUserByEmail($scope.usuario.emailU)
								               .success(function (response){
								                console.log(response);
								                var user = response;
								                $rootScope.sesion.setUser(user);
								                $scope.showSimpleToast("Edición efectuada");
								                restFactory.sendEmail($scope.usuario.emailU, "e");
								             });
										}
								});
				        });
				}else{
					restFactory.editarUsuario($scope.usuario)
						.success(function(response){
							if(response.message == "true"){
								console.log("Edición efectuada");
								restFactory.getUserByEmail($scope.usuario.emailU)
					               .success(function (response){
					                console.log(response);
					                var user = response;
					                $rootScope.sesion.setUser(user);
					                $scope.showSimpleToast("Edición efectuada");
					                restFactory.sendEmail($scope.usuario.emailU, "e");
					             });
							}
					});
				}	
				 $location.path("/home/profesor/info");
				//

					return "";
			    }, function() {
			    	console.log("cancelado");
			    	return "";
			    });			
	}

	$scope.cerrarC = function(){
		var motivo = $scope.motivoC;
	    		var confirm = $mdDialog.confirm()
			          .title('Desea cerrar su cuenta?')
			          .textContent('La cuenta será cerrada')
			          .ariaLabel('Lucky day')
			          .ok('Cerrar')
			          .cancel('Cancelar');

			    $mdDialog.show(confirm).then(function() {
			    	console.log("confirmado");
			    	restFactory.cerrarEliminar($scope.usuario.rutU, motivo, "c")
			    		.success(function(response){
								if(response.message == "true"){
									restFactory.sendEmail($scope.usuario.emailU, "c");
									$scope.showSimpleToast("Borrando cuenta, se le enviará un correo electrónico");
									$rootScope.sesion.destroy();
									$location.path("/");				
								}
						});
			    	return "";
			    }, function() {
			    	console.log("cancelado");
			    	return "";
			    });				
	}

	$scope.eliminarC = function(){
		console.log("entra  al afuncioón eleiminar");
		var motivo = $scope.motivoE;
			var confirm = $mdDialog.confirm()
			          .title('Desea eliminar su cuenta?')
			          .textContent('La cuenta será eliminada')
			          .ariaLabel('Lucky day')
			          .ok('Eliminar')
			          .cancel('Cancelar');

			    $mdDialog.show(confirm).then(function() {
			    	console.log("confirmado");

			    	restFactory.cerrarEliminar($scope.usuario.rutU, motivo, "e")
			    		.success(function(response){
								if(response.message == "true"){
									restFactory.sendEmail($scope.usuario.emailU, "d");
									$scope.showSimpleToast("Eliminando cuenta, se le enviará un correo electrónico");
									$rootScope.sesion.destroy();
									$location.path("/");				
								}
						});
			    	return "";
			    }, function() {
			    	console.log("cancelado");
			    	return "";
			    });	
			
	}
	

	$scope.cancelar = function(){
		console.log("Función cancelar");
		$location.path("/home/profesor");
	}
});
app.controller("crearProfeCtrl", function($rootScope, $scope, $location, $http, restFactory, $mdDialog, $mdToast){

	console.log("Controlador profesor crear");
	$scope.newUsuario = {};
	$scope.passC = "";
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

	$scope.nombreTU = "";

	$scope.toastPosition = {
	    bottom: true,
	    top: false,
	    left: false,
	    right: true,
	    center: true
  	};

	$scope.getToastPosition = function() {
	    return Object.keys($scope.toastPosition)
	      .filter(function(pos) { return $scope.toastPosition[pos]; })
	      .join(' ');
	};

	$scope.showSimpleToast = function(message) {
	    $mdToast.show(
	      $mdToast.simple()
	        .content(message)
	        .action("ok")
	        .highlightAction(true)
	        .highlightClass("md-accent")
	        .position($scope.getToastPosition())
	        .hideDelay(3000)
	    );
	};

	$scope.showAlert = function(contenido) {
		$mdDialog.show(
		      $mdDialog.alert()
		        .parent(angular.element(document.querySelector('#popupContainer')))
		        .clickOutsideToClose(true)
		        .title('Información')
		        .textContent(contenido)
		        .ariaLabel('Alert Dialog Demo')
		        .ok('Entendido!')
		    );
	};

	$scope.crearU = function(){

		if($scope.newUsuario.contrasenaU != $scope.passC){
			$scope.showAlert("Contraseñas ingresadas no coinciden.");
			return "";
		}
		else{
			$scope.newUsuario.fotoPerfilU = "img/estandar.jpg";
			console.log("NUEVO USUARIO");
			console.log($scope.newUsuario);
			console.log($scope.tipoSelected);
			console.log($scope.estadoSelected);
			$scope.newUsuario.estadoidEstado.idEstado = 1;
			$scope.newUsuario.estadoidEstado.nombreE = "Abierta";
			$scope.newUsuario.tipoUsuarioidTipoUsuario.idTipoUsuario = $scope.tipoSelected.idTipoUsuario;
			$scope.newUsuario.tipoUsuarioidTipoUsuario.nombreTU = $scope.tipoSelected.nombreTU;
			restFactory.crearUsuario($scope.newUsuario)
						.success(function(response){
							if(response.message == "true"){
								console.log("Creación efectuada");
								$scope.showSimpleToast("Usuario creado, se le notificará por e-mail esta situación");
								restFactory.sendEmail($scope.newUsuario.emailU, "n");
								$location.path("/home/profesor/info/"+$scope.newUsuario.emailU);

							}else if(response.message == "r"){
								console.log("Rut existente");
								$scope.showAlert("El rut ingresado se encuentra registrado.");
								return "";

							}else if(response.message == "e"){
								console.log("Email existente");
								$scope.showAlert("El e-mail ingresado se encuentra registrado.");
								return "";
							}else{
								//false
								console.log("Usuario existente");
								$scope.showAlert("Rut y e-mail ingresados se encuentran registrados.");
								return "";
							}
					});

		}
	}
	
	$scope.cancelar = function(){
		console.log("Función cancelar");
		$location.path("/home/profesor");
	}
});
app.controller("cuentasCtrlProfe", function($rootScope, $scope, $location, $http, restFactory){
	console.log("Controlador profesor cuentas");
		$scope.gridOptions = {
            data: [],
            urlSync: false
    };

	restFactory.getAllUsers()
		.success(function (response){
		console.log(response);
		$scope.gridOptions.data = response;
	});

	$scope.usuario = $rootScope.sesion.getUser();	

	$scope.sendEdicion = function(emailU){
		console.log("Función send Edición");
		$location.path("/home/profesor/info/"+emailU);
	}
});
app.controller("infoCtrlProfe", function($rootScope, $scope, $location, $http, $routeParams, restFactory){
	console.log("Controlador profesor home");

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

	$scope.editP = function(){
		console.log("Función editar perfil");
		$location.path("/home/profesor/editar/"+$scope.emailUSelected);
	}
});
app.controller("editarPCtrl", function($rootScope, $scope, $location, $http, fileUpload, $routeParams, restFactory, $mdDialog, $mdToast){

	console.log("Controlador profesor editar selected");
	$scope.userSelected = {};
	$scope.tiposUsuario = {};
	$scope.estados = {};
	$scope.tipoSelected = {};
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

		//Obteniendo tipos de usuarios
		restFactory.tipoUsuarios()
			.success(function (response){
			 console.log(response);
			 $scope.tiposUsuario = response;
			 var i;
			 for (i = 0; i < response.length; i++) { 
				    if(response[i].idTipoUsuario == $scope.userSelected.tipoUsuarioidTipoUsuario.idTipoUsuario){
				    	$scope.tipoSelected = response[i];
				    	break;
				    }
				}	

		});
	});
	
	$scope.toastPosition = {
	    bottom: true,
	    top: false,
	    left: false,
	    right: true,
	    center: true
  	};

	$scope.getToastPosition = function() {
	    return Object.keys($scope.toastPosition)
	      .filter(function(pos) { return $scope.toastPosition[pos]; })
	      .join(' ');
	};

	$scope.showSimpleToast = function(message) {
	    $mdToast.show(
	      $mdToast.simple()
	        .content(message)
	        .action("ok")
	        .highlightAction(true)
	        .highlightClass("md-accent")
	        .position($scope.getToastPosition())
	        .hideDelay(3000)
	    );
	};

	$scope.showAlert = function(contenido) {

		$mdDialog.show(
		      $mdDialog.alert()
		        .parent(angular.element(document.querySelector('#popupContainer')))
		        .clickOutsideToClose(true)
		        .title('Información')
		        .textContent(contenido)
		        .ariaLabel('Alert Dialog Demo')
		        .ok('Entendido!')
		    );
	};

	$scope.editar = function(){
		console.log("Función editar");
			if((($scope.pass == undefined && $scope.passC == undefined) || ($scope.pass == "" && $scope.passC == "")) && $scope.apodo == $scope.userSelected.apodoU && $scope.tipoSelected.idTipoUsuario == $scope.userSelected.tipoUsuarioidTipoUsuario.idTipoUsuario){
				$scope.showAlert("No existen campos a modificar.");
				return "";
			}
			if(( $scope.pass != undefined && $scope.passC != undefined) || ($scope.pass != "" && $scope.passC != "")){
				if($scope.pass != $scope.passC){
					$scope.showAlert("Contraseñas ingresadas no coinciden.");
					return "";
					}
				if($scope.pass == $scope.userSelected.contrasenaU){
					$scope.showAlert("Contraseña ingresada es igual a la actual.");
					return "";
				}
			}

			var confirm = $mdDialog.confirm()
	          .title('Desea actualizar el perfil?')
	          .textContent('El perfil del usuario será actualizado')
	          .ariaLabel('Lucky day')
	          .ok('Actualizar')
	          .cancel('Cancelar');
			    $mdDialog.show(confirm).then(function() {
			      console.log("confirmado");
			      	if(($scope.apodo != "" || $scope.apodo != undefined || $scope.apodo != null) && $scope.apodo != $scope.userSelected.apodoU){
					console.log($scope.apodo);
					$scope.userSelected.apodoU = $scope.apodo;
					console.log("Nuevo apodo: "+$scope.userSelected.apodoU);
					}
				
				if(($scope.pass == undefined && $scope.passC == undefined) || ($scope.pass == "" && $scope.passC == "")){
					console.log($scope.pass);
					console.log("no hacer nada");
					
				}else{
					console.log("entra al else");
					$scope.userSelected.contrasenaU = $scope.pass;
					console.log("Nueva contraseña: "+$scope.pass);
					console.log("Nueva contraseñaC: "+$scope.passC);
				}

				if($scope.tipoSelected.idTipoUsuario != $scope.userSelected.tipoUsuarioidTipoUsuario.idTipoUsuario){
					$scope.userSelected.tipoUsuarioidTipoUsuario.idTipoUsuario = $scope.tipoSelected.idTipoUsuario;
					$scope.userSelected.tipoUsuarioidTipoUsuario.nombreTU = $scope.tipoSelected.nombreTU;
				}

				restFactory.editarUsuario($scope.userSelected)
						.success(function(response){
							if(response.message == "true"){
								console.log("Edición efectuada");
								$scope.showSimpleToast("Edición efectuada");
								restFactory.sendEmail($scope.userSelected.emailU, "e");
							    $location.path("/home/profesor/info/"+$scope.userSelected.emailU);
							}
					});
			      return "";
			    }, function() {
			    	console.log("cancelado");
			    	return "";
			     
			    });
	}

	$scope.cerrarC = function(){
		var motivo = $scope.motivoC;

		var confirm = $mdDialog.confirm()
          .title('Desea cerrar la cuenta?')
          .textContent('La cuenta del usuario será cerrada')
          .ariaLabel('Lucky day')
          .ok('Cerrar')
          .cancel('Cancelar');
		    $mdDialog.show(confirm).then(function() {
		      console.log("confirmado");
		      restFactory.cerrarEliminar($scope.userSelected.rutU, motivo, "c")
							.success(function(response){
								if(response.message == "true"){
									$scope.showSimpleToast("Borrando cuenta, se le enviará un correo electrónico");
									restFactory.sendEmail($scope.userSelected.emailU, "c");
									$location.path("/home/profesor/ver");				
								}
						});
		      return "";
		    }, function() {
		    	console.log("cancelado");
		      return "";
		    });
	}

	$scope.eliminarC = function(){
		console.log("entra a la función eliminar");
		var motivo = $scope.motivoE;

		var confirm = $mdDialog.confirm()
          .title('Desea eliminar la cuenta?')
          .textContent('La cuenta del usuario será eliminada')
          .ariaLabel('Lucky day')
          .ok('Eliminar')
          .cancel('Cancelar');
		    $mdDialog.show(confirm).then(function() {
		      console.log("confirmado");
		      restFactory.cerrarEliminar($scope.userSelected.rutU, motivo, "e")
							.success(function(response){
								if(response.message == "true"){
									$scope.showSimpleToast("Eliminando cuenta, se le enviará un correo electrónico");
									restFactory.sendEmail($scope.userSelected.emailU, "d");
									$location.path("/home/profesor/ver");				
								}
						});
		      return "";
		    }, function() {
		    	console.log("cancelado");
		      return "";
		    });
	}
	
	$scope.cancelar = function(){
		console.log("Función cancelar");
		$location.path("/home/profesor");
	}
});