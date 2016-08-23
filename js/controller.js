var app = angular.module("mainApp", ["ngRoute", "ngCookies", "ngMaterial", "ngMessages", "dataGrid", "pagination", "ngFileUpload"]);

app.run(function($rootScope, auth, sesion){
	$rootScope.auth = auth;
    $rootScope.sesion = sesion;
});

app.controller("snCtrl", function($rootScope, $scope, $location, $mdToast, $timeout, $mdSidenav){
	//Funciones alumno / ayudante
	$scope.perfilAA = function(){
		$location.path("/home/alumno/info");
	}

	$scope.verProfeAsociado = function(){
		$location.path("/home/alumno/verAsociadosP");
	}

	//Funciones administrador
	$scope.perfilPA = function(){
		$location.path("/home/administrador/perfil");
	}

	$scope.crearA = function(){
		$location.path("/home/administrador/crear");
	}

	$scope.verA = function(){
		$location.path("/home/administrador/ver");
	}

	$scope.verCuentasP = function(){
		$location.path("/home/administrador/cuentasP");
	}

	$scope.closeSide = function(sideId) {
      $mdSidenav(sideId).close()
        .then(function () {
          $log.debug("close RIGHT is done");
        });
    }

	//Funciones profesor
	$scope.perfilP = function(){
		$location.path("/home/profesor/perfil");
	}

	$scope.ver = function(){
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
		$rootScope.sesion.destroy();
		$rootScope.sesion.destroyUserToEdit();
		$location.path("/");
	}

	$scope.editP = function(){
		$location.path("/home/alumno/editar");
	}

	//Funciones profesor
	$scope.editProfe = function(){
		$location.path("/home/profesor/editarP");
	}

	//Funciones administrador
	$scope.editAdmin = function(){
		$location.path("/home/administrador/editarA");
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
/*Inicio Login controllers*/
app.controller("loginCtrl", function($rootScope, $scope, $location, $http, restFactory, $mdToast){
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
		if($scope.username != "" && $scope.password != ""){
			restFactory.login($scope.username, $scope.password)
	                .success(function (response) {
	                    var resultado = response.message;
	                    if(resultado != "false" &&  resultado != "i"){
	                    	restFactory.getUserByEmail($scope.username)	                    	
					               .success(function (response) {
					                $rootScope.sesion.setUser(response);
					             	$location.path(resultado);
					             });
	                    }else{
	                    	if(resultado == 'i'){
	                    		$scope.showSimpleToast("E-mail o contraseña incorrecta");
	                    	}else{
	                    		$scope.showSimpleToast("Cuenta inexistente");
	                    	}
	                    }
	               	});
		}
	}

	$scope.forgetPass = function(){
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
				if(response){
					if(response.estadoidEstado.nombreE == "Cerrada"){
						$scope.showSimpleToast("Cuenta Cerrada");
					}else{
						$scope.usuario = response;
						$scope.sh = false;
					}
				}else{
					$scope.showSimpleToast("Cuenta inexistente");
				}	
			});
	}

	$scope.send = function(){
		if($scope.usuario.respuestaU == $scope.respuesta){
			restFactory.sendEmail($scope.usuario.emailU, "r");
					$scope.showSimpleToast("Realizando recuperación, se le enviará un correo electrónico");
					$location.path("/");
		}
		else{
			$scope.showSimpleToast("Respuesta incorrecta");
		}
	}
});
/*Fin Login controllers*/

/*Inicio Alumno controllers*/
app.controller("homeCtrlAlum", function($rootScope, $scope, $location, $http){
	$scope.usuario = $rootScope.sesion.getUser();

    $scope.editP = function(){
		$location.path("/home/alumno/editar");
	}

	$scope.back = function(){
		$location.path("/home/alumno");
	}
});
app.controller("editarAlumCtrl", function($rootScope, $scope, $location, $http, restFactory, $mdDialog, $mdToast, Upload){
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
		        .clickOutsideToClose(true)
		        .title('Información')
		        .textContent(contenido)
		        .ariaLabel('Alert Dialog Demo')
		        .ok('Entendido!')
		    );
	};

	$scope.editarP = function(){
		var file = $scope.file;
			if((($scope.pass == undefined && $scope.passC == undefined) || ($scope.pass == "" && $scope.passC == "")) && $scope.apodo == $scope.usuario.apodoU && file == undefined ){
				$scope.showAlert("No existen campos a modificar.");
				return "";
			}
			if(( $scope.pass != undefined && $scope.passC != undefined) && ($scope.pass != "" && $scope.passC != "")){
				if($scope.pass != $scope.passC){
					$scope.showAlert("Contraseñas ingresadas no coinciden.");
					return "";
					}
				if($scope.pass == $scope.usuario.contrasenaU){
					$scope.showAlert("Contraseña ingresada es igual a la actual.");
					return "";
				}
				if($scope.pass.length < 3 ||  $scope.passC.length < 3){
					$scope.showAlert("Contraseña ingresada debe poseer como mínimo 3 caracteres.");
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
			    if(($scope.apodo != "" || $scope.apodo != undefined || $scope.apodo != null) && $scope.apodo != $scope.usuario.apodoU){
					$scope.usuario.apodoU = $scope.apodo;
				}	
				
				if($scope.pass != undefined && $scope.passC != undefined && $scope.pass != "" && $scope.passC != "" && $scope.pass != null && $scope.passC != null){
					$scope.usuario.contrasenaU = $scope.pass;
				}
				if(file != undefined){
					$scope.usuario.fotoPerfilU = "img/"+file.name;
						Upload.upload({
				            url: 'server.php',
				            data: {file: file, 'username': $scope.usuario.rutU}
				        });
				}
				
					restFactory.editarUsuario($scope.usuario)
						.success(function(response){
							if(response){
								var user = response;
								$rootScope.sesion.setUser(user);
								$scope.showSimpleToast("Edición efectuada, se le notificará por correo electrónico");
								 $location.path("/home/alumno/info");
							}else{
								$scope.showAlert("Error al realizar la edición intente más tarde.");
							}
					});
								
			    }, function() {
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
			    	restFactory.cerrar($scope.usuario.rutU, motivo)
							.success(function(response){
								if(response.message == "true"){
									$rootScope.sesion.destroy();
									$scope.showSimpleToast("Cerrando cuenta, se le enviará un correo electrónico");
									$location.path("/");				
								}else{
									$scope.showAlert("Error al realizar el cierre de la cuenta intente más tarde.");
								}
						});
			    	return "";
			    }, function() {
			    	return "";
			    });
	}

	$scope.activarC = function(){
			var confirm = $mdDialog.confirm()
	          .title('Desea activar su cuenta?')
	          .textContent('Su cuenta será activada')
	          .ariaLabel('Lucky day')
	          .ok('Activar')
	          .cancel('Cancelar');

	          $mdDialog.show(confirm).then(function() {
			    	restFactory.activar($scope.usuario.rutU)
							.success(function(response){
								if(response){
									$rootScope.sesion.setUser(response);
									$scope.showSimpleToast("Cuenta activa, se le enviará un correo electrónico");
									$location.path("/home/alumno");				
								}else{
									$scope.showAlert("Error al realizar la activación de la cuenta intente más tarde.");
								}
						});
			    	return "";
			    }, function() {
			    	return "";
			    });
	}

	$scope.cancelar = function(){
		$location.path("/home/alumno/info");
	}

	$scope.back = function(){
		$location.path("/home/alumno/info");
	}
});
app.controller("cuentasPAlumCtrl", function($rootScope, $scope, $location, $http, restFactory){
	$scope.usuario = $rootScope.sesion.getUser();	

	$scope.gridOptions = {
            data: [],
            urlSync: false
    };

	restFactory.getPByAA($scope.usuario.idUsuario)
		.success(function (response){
		$scope.gridOptions.data = response;
	});

	
	$scope.sendEdicion = function(item){
		$rootScope.sesion.setUserToEdit(item);
		$location.path("/home/alumno/verAsociadosAA");
	}

	$scope.back = function(){
		$location.path("/home/alumno");
	}
});
app.controller("cuentasAACtrl", function($rootScope, $scope, $location, $http, restFactory){
	$scope.usuario = $rootScope.sesion.getUser();	
	$scope.profesor = $rootScope.sesion.getUserToEdit();
	$scope.profe = $scope.profesor.nombreU +" "+$scope.profesor.apellidoU;
	$scope.gridOptions = {
            data: [],
            urlSync: false
    };

	restFactory.getPAA($scope.profesor.idUsuario)
		.success(function (response){
			$scope.gridOptions.data = response;
	});

	
	$scope.sendEdicion = function(item){
		$rootScope.sesion.setUserAux(item);
		$location.path("/home/alumno/verAA");
	}

	$scope.back = function(){
		$location.path("/home/alumno/verAsociadosP");
	}
});
app.controller("verAACtrl", function($rootScope, $scope, $location, $http, restFactory){
	$scope.usuario = $rootScope.sesion.getUserAux();	

	$scope.back = function(){
		$location.path("/home/alumno/verAsociadosAA");
	}
});
/*Fin Alumno controllers*/

/*Inicio Profesor controllers*/
app.controller("homeCtrlProfe", function($rootScope, $scope, $location, $http){
	$scope.usuario = $rootScope.sesion.getUser();
	$scope.editP = function(){
		$location.path("/home/profesor/editarP");
	}

	$scope.back = function(){
		$location.path("/home/profesor");
	}
});
app.controller("editarProfeCtrl", function($rootScope, $scope, $location, $http, fileUpload, restFactory, $mdDialog, $mdMedia, $mdToast, Upload, $window){

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
		        .clickOutsideToClose(true)
		        .title('Información')
		        .textContent(contenido)
		        .ariaLabel('Alert Dialog Demo')
		        .ok('Entendido!')
		    );
	};

	$scope.back = function(){
		 $location.path("/home/profesor/perfil");
	}

	$scope.editarP = function(){
		var file = $scope.file;
			if((($scope.pass == undefined && $scope.passC == undefined) || ($scope.pass == "" && $scope.passC == "")) && $scope.apodo == $scope.usuario.apodoU && file == undefined ){
				$scope.showAlert("No existen campos a modificar.");
				return "";
			}
			if(( $scope.pass != undefined && $scope.passC != undefined) && ($scope.pass != "" && $scope.passC != "")){
				if($scope.pass != $scope.passC){
					$scope.showAlert("Contraseñas ingresadas no coinciden.");
					return "";
					}
				if($scope.pass == $scope.usuario.contrasenaU){
					$scope.showAlert("Contraseña ingresada es igual a la actual.");
					return "";
				}
				if($scope.pass.length < 3 ||  $scope.passC.length < 3){
					$scope.showAlert("Contraseña ingresada debe poseer como mínimo 3 caracteres.");
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
			    
			    if(($scope.apodo != "" || $scope.apodo != undefined || $scope.apodo != null) && $scope.apodo != $scope.usuario.apodoU){				
						$scope.usuario.apodoU = $scope.apodo;
				}
				
				if($scope.pass != undefined && $scope.passC != undefined && $scope.pass != "" && $scope.passC != "" && $scope.pass != null && $scope.passC != null){
					$scope.usuario.contrasenaU = $scope.pass;
				}

				if(file != undefined){
					$scope.usuario.fotoPerfilU = "img/"+file.name;
					Upload.upload({
				            url: 'server.php',
				            data: {file: file, 'username': $scope.usuario.rutU}
				        });
				}

					restFactory.editarUsuario($scope.usuario)
						.success(function(response){
							if(response){
								var user = response;
								$rootScope.sesion.setUser(user);
								$scope.showSimpleToast("Edición efectuada, se le enviará un correo electrónico");
								$location.path("/home/profesor/perfil");
							}else{
								$scope.showAlert("Error al realizar la edición intente más tarde.");
							}	
						
					});
					return "";
			    }, function() {
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
			    	restFactory.cerrar($scope.usuario.rutU, motivo)
			    		.success(function(response){
								if(response.message == "true"){
									$scope.showSimpleToast("Cerrando cuenta, se le enviará un correo electrónico");
									$rootScope.sesion.destroy();
									$location.path("/");				
								}else{
									$scope.showAlert("Error al realizar el cierre de la cuenta intente más tarde.");
								}
						});
			    	return "";
			    }, function() {
			    	return "";
			    });				
	}

	$scope.activarC = function(){
			var confirm = $mdDialog.confirm()
	          .title('Desea activar su cuenta?')
	          .textContent('Su cuenta será activada')
	          .ariaLabel('Lucky day')
	          .ok('Activar')
	          .cancel('Cancelar');

	          $mdDialog.show(confirm).then(function() {
			    	restFactory.activar($scope.usuario.rutU)
							.success(function(response){
								if(response){
									$rootScope.sesion.setUser(response);
									$scope.showSimpleToast("Cuenta activa, se le enviará un correo electrónico");
									$location.path("/home/profesor");					
								}else{
									$scope.showAlert("Error al realizar la activación de la cuenta intente más tarde.");
								}
						});
			    	return "";
			    }, function() {
			    	return "";
			    });
	}
	
	$scope.cancelar = function(){
		$location.path("/home/profesor/perfil");
	}
});
app.controller("cuentasCtrlProfe", function($rootScope, $scope, $location, $http, restFactory, $mdDialog, $mdToast){
	$scope.opciones = {};
	$scope.opcionSelected = {};
	$scope.tiposUsuario = {};
	$scope.tipoSelected = {};
	$scope.alumnos = {};
	$scope.ayudantes = {};
	$scope.profesor = $rootScope.sesion.getUser();
	$scope.profe = $scope.profesor.nombreU +" "+ $scope.profesor.apellidoU;
	$scope.gridOptions = {
            data: [],
            urlSync: false
    };

	restFactory.getPAA($scope.profesor.idUsuario)
		.success(function (response){
		$scope.gridOptions.data = response;
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

	$scope.back = function(){
		 $location.path("/home/profesor");
	}

	$scope.showAlert = function(contenido) {

		$mdDialog.show(
		      $mdDialog.alert()
		        .clickOutsideToClose(true)
		        .title('Información')
		        .textContent(contenido)
		        .ariaLabel('Alert Dialog Demo')
		        .ok('Entendido!')
		    );
	};
	restFactory.getTUCustom()
		.success(function (response){
	     $scope.tiposUsuario = response;
		 $scope.tipoSelected = $scope.tiposUsuario[0];
		 //Obtener alumnos
		restFactory.getAllE("Alumno")
			.success(function (response){
		     $scope.alumnos = response;

			restFactory.getAllE("Ayudante")
				.success(function (response){
			     $scope.ayudantes = response;

			     if($scope.tiposUsuario[0].nombreTU == "Alumno"){
					$scope.opciones = $scope.alumnos;
				}else{
					$scope.opciones = $scope.ayudantes;
				}
			});
		});
	});
		
	$scope.change = function(){
		if($scope.tipoSelected.nombreTU == "Alumno"){
			$scope.opciones = $scope.alumnos;
			$scope.opcionSelected = {};
		}else if($scope.tipoSelected.nombreTU == "Ayudante"){
			$scope.opciones = $scope.ayudantes;
			$scope.opcionSelected = {};
		}
	}

	$scope.asociarC = function(){
		restFactory.asociar($scope.profesor.rutU, $scope.opcionSelected.rutU).success(function(response){
				if(response.message == "e"){
					$scope.showAlert("Usuario ya se encuentra asociado.");
				}else if(response.message == "true"){
					restFactory.sendEmail($scope.opcionSelected.emailU, "aso");
					$scope.showSimpleToast("Usuario asociado, se le enviará un correo electrónico");

					restFactory.getPAA($scope.profesor.idUsuario)
						.success(function (response){
						$scope.gridOptions.data = response;
					});
				}else{
					$scope.showAlert("Error al asociar el usuario con el profesor. Intente más tarde.");
				}
		});
	}

	$scope.sendToDes = function(item){
		$rootScope.sesion.setUserToEdit(item);
		$location.path("/home/profesor/info");
	}	
});
app.controller("infoCtrlProfe", function($rootScope, $scope, $location, $http, restFactory, $mdDialog, $mdToast){

	$scope.usuario = $rootScope.sesion.getUserToEdit();

	$scope.back = function(){
		$rootScope.sesion.destroyUserToEdit();
		$location.path("/home/profesor/ver");
	}

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
		        .clickOutsideToClose(true)
		        .title('Información')
		        .textContent(contenido)
		        .ariaLabel('Alert Dialog Demo')
		        .ok('Entendido!')
		    );
	};

	$scope.desligarC = function(){

		var confirm = $mdDialog.confirm()
	          .title('Desea desligar el usuario?')
	          .textContent('El usuario será desligado del profesor')
	          .ariaLabel('Lucky day')
	          .ok('Desligar')
	          .cancel('Cancelar');
			    $mdDialog.show(confirm).then(function() {
				    restFactory.desligar($rootScope.sesion.getUser().rutU, $scope.usuario.rutU).success(function(response){
						if(response.message == "true"){
							$scope.showSimpleToast("Usuario desligado, se le enviará un correo electrónico");
							$location.path("/home/profesor/ver");
						}else{
							$scope.showAlert("Error al desligar el usuario del profesor. Intente más tarde.");
						}
					});		
			      	return "";
			    }, function() {	
			    	return "";
			     
			    });

	}
});
/*Inicio Profesor controllers*/

/*Inicio Administrador controllers*/
app.controller("homeCtrlAdmin", function($rootScope, $scope, $location, $http){
	$scope.usuario = $rootScope.sesion.getUser();
	$scope.editP = function(){
		$location.path("/home/administrador/editarA");
	}

	$scope.back = function(){
		$location.path("/home/administrador");
	}
});
app.controller("editarAdminCtrl", function($rootScope, $scope, $location, $http, fileUpload, restFactory, $mdDialog, $mdMedia, $mdToast, Upload){

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
		        .clickOutsideToClose(true)
		        .title('Información')
		        .textContent(contenido)
		        .ariaLabel('Alert Dialog Demo')
		        .ok('Entendido!')
		    );
	};

	$scope.back = function(){
		$location.path("/home/administrador/perfil");
	}

	$scope.editarP = function(){
		var file = $scope.file;
			if((($scope.pass == undefined && $scope.passC == undefined) || ($scope.pass == "" && $scope.passC == "")) && $scope.apodo == $scope.usuario.apodoU && file == undefined ){
				$scope.showAlert("No existen campos a modificar.");
				return "";
			}
			if(($scope.pass != undefined && $scope.passC != undefined) && ($scope.pass != "" && $scope.passC != "")){
				if($scope.pass != $scope.passC){
					$scope.showAlert("Contraseñas ingresadas no coinciden.");
					return "";
					}
				if($scope.pass == $scope.usuario.contrasenaU){
					$scope.showAlert("Contraseña ingresada es igual a la actual.");
					return "";
				}

				if($scope.pass.length < 3 || $scope.usuario.contrasenaU.length < 3){
					$scope.showAlert("Contraseña ingresada debe poseer como mínimo 3 caracteres.");
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
			    
			    if(($scope.apodo != "" || $scope.apodo != undefined || $scope.apodo != null) && $scope.apodo != $scope.usuario.apodoU){				
					$scope.usuario.apodoU = $scope.apodo;	
				}
				
				if($scope.pass != undefined && $scope.passC != undefined && $scope.pass != "" && $scope.passC != "" && $scope.pass != null && $scope.passC != null){
					$scope.usuario.contrasenaU = $scope.pass;
				}

				if(file != undefined){
					$scope.usuario.fotoPerfilU = "img/"+file.name;
					Upload.upload({
				            url: 'server.php',
				            data: {file: file, 'username': $scope.usuario.rutU}
				        });
				}
					restFactory.editarUsuario($scope.usuario)
						.success(function(response){
							if(response){
								$rootScope.sesion.setUser(response);
								$scope.showSimpleToast("Edición efectuada, se le enviará un correo electrónico");
								$location.path("/home/administrador/perfil");
							}else{
								$scope.showAlert("Error al realizar la edición intente más tarde.");
							}	
					});
					return "";
			    }, function() {
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
			    	restFactory.cerrar($scope.usuario.rutU, motivo)
			    		.success(function(response){
								if(response.message == "true"){
									$scope.showSimpleToast("Cerrando cuenta, se le enviará un correo electrónico");
									$rootScope.sesion.destroy();
									$location.path("/");				
								}else{
									$scope.showAlert("Error al realizar el cierre de la cuenta intente más tarde.");
								}
						});
			    	return "";
			    }, function() {
			    	return "";
			    });				
	}
	$scope.eliminarC = function(){
			var confirm = $mdDialog.confirm()
			          .title('Desea eliminar su cuenta?')
			          .textContent('La cuenta será eliminada')
			          .ariaLabel('Lucky day')
			          .ok('Eliminar')
			          .cancel('Cancelar');

			    $mdDialog.show(confirm).then(function() {
			    	restFactory.eliminar($scope.usuario.rutU)
			    		.success(function(response){
								if(response.message == "true"){
									$scope.showSimpleToast("Eliminando cuenta, se le enviará un correo electrónico");
									$rootScope.sesion.destroy();
									$location.path("/");				
								}else{
									$scope.showAlert("Error al realizar la eliminación de la cuenta intente más tarde.");
								}
						});
			    	return "";
			    }, function() {
			    	return "";
			    });	
	}
	$scope.activarC = function(){
			var confirm = $mdDialog.confirm()
	          .title('Desea activar su cuenta?')
	          .textContent('Su cuenta será activada')
	          .ariaLabel('Lucky day')
	          .ok('Activar')
	          .cancel('Cancelar');

	          $mdDialog.show(confirm).then(function() {
			    	restFactory.activar($scope.usuario.rutU)
							.success(function(response){
								if(response){
									$rootScope.sesion.setUser(response);
									$scope.showSimpleToast("Cuenta activa, se le enviará un correo electrónico");
									$location.path("/home/administrador");		
													
								}else{
									$scope.showAlert("Error al realizar la activación de la cuenta intente más tarde.");
								}
						});
			    	return "";
			    }, function() {
			    	return "";
			    });
	}	
	$scope.cancelar = function(){
		$location.path("/home/administrador/perfil");
	}
});
app.controller("crearAdminCtrl", function($rootScope, $scope, $location, $http, restFactory, $mdDialog, $mdToast){
	$scope.newUsuario = {};
	$scope.passC = "";
	$scope.tiposUsuario = {};
	$scope.tipoSelected = {};
	$scope.newUsuario.estadoidEstado = new Object();
	$scope.newUsuario.tipoUsuarioidTipoUsuario = new Object();
	//Obteniendo tipos de usuarios
	restFactory.tipoUsuarios()
		.success(function (response){
	     $scope.tiposUsuario = response;
		 $scope.tipoSelected = $scope.tiposUsuario[0];
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
		}else if($scope.newUsuario.contrasenaU.length < 3){
			$scope.showAlert("La contraseña debe poseer como mínimo 3 caracteres.");
			return "";
		}else{
			$scope.newUsuario.fotoPerfilU = "img/estandar.jpg";
			$scope.newUsuario.estadoidEstado.idEstado = 1;
			$scope.newUsuario.estadoidEstado.nombreE = "Abierta";
			$scope.newUsuario.tipoUsuarioidTipoUsuario.idTipoUsuario = $scope.tipoSelected.idTipoUsuario;
			$scope.newUsuario.tipoUsuarioidTipoUsuario.nombreTU = $scope.tipoSelected.nombreTU;
			restFactory.crearUsuario($scope.newUsuario)
						.success(function(response){
							if(response.message == "t"){
								$scope.showSimpleToast("Usuario creado, se le notificará por correo electrónico esta situación");
								restFactory.getUserByEmail($scope.newUsuario.emailU)
									.success(function (response){
										$rootScope.sesion.setUserToEdit(response);
										$location.path("/home/administrador/info");
								});
							}else if(response.message == "f"){
								$scope.showAlert("Error al crear el usuario intente más tarde.");
								return "";
							}else if(response.message == "r"){
								$scope.showAlert("El rut ingresado se encuentra registrado.");
								return "";

							}else if(response.message == "e"){
								$scope.showAlert("El e-mail ingresado se encuentra registrado.");
								return "";
							}else{
								$scope.showAlert("Rut y e-mail ingresados se encuentran registrados.");
								return "";
							}
					});
		}
	}
	
	$scope.back = function(){
		$location.path("/home/administrador");
	}
});
app.controller("cuentasCtrlAdmin", function($rootScope, $scope, $location, $http, restFactory){
	$scope.gridOptions = {
            data: [],
            urlSync: false
    };

	restFactory.getAllUsers()
		.success(function (response){
		$scope.gridOptions.data = response;
	});

	$scope.usuario = $rootScope.sesion.getUser();	

	$scope.sendEdicion = function(item){
		$rootScope.sesion.setUserToEdit(item);
		$location.path("/home/administrador/info");
	}

	$scope.back = function(){
		$location.path("/home/administrador");
	}
});
app.controller("infoCtrlAdmin", function($rootScope, $scope, $location, $http, restFactory, $mdDialog, $mdToast){

	$scope.userSelected = $rootScope.sesion.getUserToEdit();

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
		        .clickOutsideToClose(true)
		        .title('Información')
		        .textContent(contenido)
		        .ariaLabel('Alert Dialog Demo')
		        .ok('Entendido!')
		    );
	};

	$scope.back = function(){
		$rootScope.sesion.destroyUserToEdit();
		$location.path("/home/administrador/ver");
	}

	$scope.editP = function(){
		$location.path("/home/administrador/editar");
	}

	$scope.activarC = function(){
			var confirm = $mdDialog.confirm()
	          .title('Desea activar la cuenta?')
	          .textContent('La cuenta del usuario será activada')
	          .ariaLabel('Lucky day')
	          .ok('Activar')
	          .cancel('Cancelar');

	          $mdDialog.show(confirm).then(function() {
			    	restFactory.activar($scope.userSelected.rutU)
							.success(function(response){
								if(response){
									$rootScope.sesion.setUserToEdit(response);
									$scope.showSimpleToast("Cuenta activada, se le enviará un correo electrónico");
									$scope.userSelected = $rootScope.sesion.getUserToEdit();	
									$location.path("/home/administrador/info");					
								}else{
									$scope.showAlert("Error al realizar la activación de la cuenta intente más tarde.");
								}
						});
			    	return "";
			    }, function() {
			    	return "";
			    });
	}
});
app.controller("editarSelectedAdmin", function($rootScope, $scope, $location, $http, restFactory, $mdDialog, $mdToast){
	$scope.userSelected = $rootScope.sesion.getUserToEdit();
	$scope.pass = "";
	$scope.passC = "";
	$scope.fotoP = "";
	$scope.apodo = $scope.userSelected.apodoU;

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
		        .clickOutsideToClose(true)
		        .title('Información')
		        .textContent(contenido)
		        .ariaLabel('Alert Dialog Demo')
		        .ok('Entendido!')
		    );
	};

	$scope.editar = function(){
			if((($scope.pass == undefined && $scope.passC == undefined) || ($scope.pass == "" && $scope.passC == "")) && $scope.apodo == $scope.userSelected.apodoU){
				$scope.showAlert("No existen campos a modificar.");
				return "";
			}
			if(( $scope.pass != undefined && $scope.passC != undefined) && ($scope.pass != "" && $scope.passC != "")){
				if($scope.pass != $scope.passC){
					$scope.showAlert("Contraseñas ingresadas no coinciden.");
					return "";
					}
				if($scope.pass == $scope.userSelected.contrasenaU){
					$scope.showAlert("Contraseña ingresada es igual a la actual.");
					return "";
				}
				if($scope.pass.length < 3 || $scope.userSelected.contrasenaU < 3){
					$scope.showAlert("Contraseña ingresada debe poseer mínimo 3 caracteres.");
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
			    if(($scope.apodo != "" || $scope.apodo != undefined || $scope.apodo != null) && $scope.apodo != $scope.userSelected.apodoU){
					$scope.userSelected.apodoU = $scope.apodo;
				}
				
				if($scope.pass != undefined && $scope.passC != undefined && $scope.pass != "" && $scope.passC != "" && $scope.pass != null && $scope.passC != null){
					$scope.userSelected.contrasenaU = $scope.pass;
				}
				restFactory.editarUsuario($scope.userSelected)
						.success(function(response){
							if(response){
								if($scope.userSelected.idUsuario == $rootScope.sesion.getUser().idUsuario){;
									$scope.showSimpleToast("Edición efectuada, se le enviará un correo electrónico");
									$rootScope.sesion.setUserToEdit(response);
									$rootScope.sesion.setUser(response);
									$location.path("/home/administrador/info");
								}else{
									$scope.showSimpleToast("Edición efectuada, se le enviará un correo electrónico");
									$rootScope.sesion.setUserToEdit(response);
									$location.path("/home/administrador/info");
								}				
							
							}else{
								$scope.showAlert("Error al realizar la edición intente más tarde.");
							}
							
					});
					
			      return "";
			    }, function() {
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
			    	restFactory.cerrar($scope.userSelected.rutU, motivo)
							.success(function(response){
								if(response.message == "true"){
									if($scope.userSelected.idUsuario == $rootScope.sesion.getUser().idUsuario){
										$rootScope.sesion.destroyUserToEdit();
										$rootScope.sesion.destroy();
										$scope.showSimpleToast("Cerrando cuenta, se le enviará un correo electrónico");
										$location.path("/");
									}else{
										$rootScope.sesion.destroyUserToEdit();
										$scope.showSimpleToast("Cerrando cuenta, se le enviará un correo electrónico");
										$location.path("/home/administrador/ver");
									}				
								}else{
									$scope.showAlert("Error al realizar el cierre de la cuenta intente más tarde.");
								}
						});
			    	return "";
			    }, function() {
			    	return "";
			    });
	}

	$scope.eliminarC = function(){
		var confirm1 = $mdDialog.confirm()
          .title('Desea eliminar la cuenta?')
          .textContent('La cuenta del usuario será eliminada')
          .ariaLabel('Lucky day')
          .ok('Eliminar')
          .cancel('Cancelar');
		    $mdDialog.show(confirm1).then(function() {
		    
		      restFactory.eliminar($scope.userSelected.rutU)
							.success(function(response){
								if(response.message == "t"){

									if($scope.userSelected.idUsuario == $rootScope.sesion.getUser().idUsuario){
										$rootScope.sesion.destroyUserToEdit();
										$rootScope.sesion.destroy();
										$scope.showSimpleToast("Eliminando cuenta, se le enviará un correo electrónico");
										$location.path("/");
									}else{
										$rootScope.sesion.destroyUserToEdit();
										$scope.showSimpleToast("Eliminando cuenta, se le enviará un correo electrónico");
										$location.path("/home/administrador/ver");	
									}							
								}else{
									$scope.showAlert("Error al realizar la eliminación de la cuenta intente más tarde.");
								}
						});
					
		      return "";
		    }, function() {
		      return "";
		    });
	}


	$scope.back = function(){
		$location.path("/home/administrador/info");
	}

	$scope.cancelar = function(){
		$rootScope.sesion.destroyUserToEdit();
		$location.path("/home/administrador/ver");
	}
});
app.controller("cuentasPAdminCtrl", function($rootScope, $scope, $location, $http, restFactory){
	$scope.gridOptions = {
            data: [],
            urlSync: false
    };

	restFactory.getAllE("Profesor")
		.success(function (response){
		$scope.gridOptions.data = response;
	});

	$scope.usuario = $rootScope.sesion.getUser();	

	$scope.sendEdicion = function(item){
		$rootScope.sesion.setUserToEdit(item);
		$location.path("/home/administrador/verAsociadosP");
	}

	$scope.back = function(){
		$location.path("/home/administrador");
	}
});
app.controller("asociadosPAdminCtrl", function($rootScope, $scope, $location, $http, restFactory, $mdDialog, $mdToast){
	$scope.opciones = {};
	$scope.opcionSelected = {};
	$scope.tiposUsuario = {};
	$scope.tipoSelected = {};
	$scope.alumnos = {};
	$scope.ayudantes = {};
	$scope.profesor = $rootScope.sesion.getUserToEdit();
	$scope.profe = $scope.profesor.nombreU +" "+ $scope.profesor.apellidoU;
	$scope.gridOptions = {
        data: [],
        urlSync: false
    };

	restFactory.getPAA($scope.profesor.idUsuario)
		.success(function (response){
		$scope.gridOptions.data = response;
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
		        .clickOutsideToClose(true)
		        .title('Información')
		        .textContent(contenido)
		        .ariaLabel('Alert Dialog Demo')
		        .ok('Entendido!')
		    );
	};
	restFactory.getTUCustom()
		.success(function (response){
	     $scope.tiposUsuario = response;
		 $scope.tipoSelected = $scope.tiposUsuario[0];
		 //Obtener alumnos
		restFactory.getAllE("Alumno")
			.success(function (response){
		     $scope.alumnos = response;

			restFactory.getAllE("Ayudante")
				.success(function (response){
			     $scope.ayudantes = response;

			     if($scope.tiposUsuario[0].nombreTU == "Alumno"){
					$scope.opciones = $scope.alumnos;
				}else{
					$scope.opciones = $scope.ayudantes;
				}
			});
		});
	});
		
	$scope.change = function(){
		if($scope.tipoSelected.nombreTU == "Alumno"){
			$scope.opciones = $scope.alumnos;
			$scope.opcionSelected = {};
		}else if($scope.tipoSelected.nombreTU == "Ayudante"){
			$scope.opciones = $scope.ayudantes;
			$scope.opcionSelected = {};
		}
	}

	$scope.asociarC = function(){
		restFactory.asociar($scope.profesor.rutU, $scope.opcionSelected.rutU).success(function(response){
				if(response.message == "e"){
					$scope.showAlert("Usuario ya se encuentra asociado.");
				}else if(response.message == "true"){
					$scope.showSimpleToast("Usuario asociado, se le enviará un correo electrónico");

					restFactory.getPAA($scope.profesor.idUsuario)
						.success(function (response){
						$scope.gridOptions.data = response;
					});
	

				}else{
					$scope.showAlert("Error al asociar el usuario con el profesor. Intente más tarde.");
				}
		});
	}

	$scope.sendToDes = function(item){
		$rootScope.sesion.setUserAux(item);
		$location.path("/home/administrador/verDesligar");
	}

	$scope.back = function(){
		$location.path("/home/administrador/cuentasP");
	}
});
app.controller("desligarAdminCtrl", function($rootScope, $scope, $location, $http, restFactory, $mdDialog, $mdToast){
	$scope.usuario = $rootScope.sesion.getUserAux();
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
		        .clickOutsideToClose(true)
		        .title('Información')
		        .textContent(contenido)
		        .ariaLabel('Alert Dialog Demo')
		        .ok('Entendido!')
		    );
	};
	
	$scope.desligarC = function(){

		var confirm = $mdDialog.confirm()
	          .title('Desea desligar el usuario?')
	          .textContent('El usuario será desligado del profesor')
	          .ariaLabel('Lucky day')
	          .ok('Desligar')
	          .cancel('Cancelar');
			    $mdDialog.show(confirm).then(function() {
				    restFactory.desligar($rootScope.sesion.getUserToEdit().rutU, $scope.usuario.rutU).success(function(response){
						if(response.message == "true"){
							$scope.showSimpleToast("Usuario desligado, se le enviará un correo electrónico");
							$location.path("/home/administrador/verAsociadosP");
						}else{
							$scope.showAlert("Error al desligar el usuario del profesor. Intente más tarde.");
						}
					});		
			      	return "";
			    }, function() {	
			    	return "";
			     
			    });

	}
	$scope.back = function(){
		$rootScope.sesion.destroyUserAux();
		$location.path("/home/administrador/verAsociadosP");
	}
});
/*Fin Administrador controllers*/