var app = angular.module("mainApp", ["ngRoute", "ngCookies", "ngMaterial", "ngMessages", "dataGrid", "pagination", "ngFileUpload"]);

app.run(function($rootScope, auth, sesion,cookieFactory){
	$rootScope.auth = auth;
    $rootScope.sesion = sesion;
});
app.controller("snCtrl", function($rootScope, $scope, $location, $mdToast, $timeout, $mdSidenav){
	//Funciones alumno / ayudante
	$scope.perfilAA = function(){
		$location.path("/home/alumno/info");
	}

	//Funciones profesor
	$scope.perfilP = function(){
		$location.path("/home/profesor/perfil");
	}

	$scope.crear = function(){
		$location.path("/home/profesor/crear");
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
	                    if(resultado != "false" && resultado != "e" && resultado != "c" && resultado != "i"){
	                    	restFactory.getUserByEmail($scope.username)	                    	
					               .success(function (response) {
					                var user = response;
					                $rootScope.sesion.setUser(user);
					             	$location.path(resultado);
					             });
	                    	
	                    }else{
	                    	if(resultado == 'e'){
	                    		$scope.showSimpleToast("Cuenta Eliminada");
	                    	}else if(resultado == 'c'){
	                    		$scope.showSimpleToast("Cuenta Cerrada");
	                    	}else if(resultado == 'i'){
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
					}else if(response.estadoidEstado.nombreE == "Eliminada"){
						$scope.showSimpleToast("Cuenta Eliminada");
					}else{
						$scope.usuario = response;
						$scope.sh = false;
						$scope.log = false;
						$scope.mensaje = "";
					}

				}else{
					$scope.showSimpleToast("Cuenta inexistente");
				}	
			});
	}

	$scope.send = function(){
		if($scope.usuario.respuestaU == $scope.respuesta){
			restFactory.sendEmail($scope.usuario.emailU, "r")
			.success(function () {
					$scope.showSimpleToast("Realizando recuperación, se le enviará un correo electrónico");
					$location.path("/");			
			});
		}
		else{
			$scope.showSimpleToast("Respuesta incorrecta");
		}
	}
});
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
		var redire;
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
			    if(($scope.apodo != "" || $scope.apodo != undefined || $scope.apodo != null) && $scope.apodo != $scope.usuario.apodoU){
					$scope.usuario.apodoU = $scope.apodo;
				}	
				
				if(($scope.pass == undefined && $scope.passC == undefined) || ($scope.pass == "" && $scope.passC == "")){
					
				}else{
					$scope.usuario.contrasenaU = $scope.pass;
				}
				if(file != undefined){
					$scope.usuario.fotoPerfilU = "img/"+file.name;
				}
				
				if(file != undefined){
					Upload.upload({
				            url: 'server.php',
				            data: {file: file, 'username': $scope.usuario.rutU}
				        }).then(function (resp) {
				            //console.log('Success ' + resp.config.data.file.name + 'uploaded. Response: ' + resp.data);
				            restFactory.editarUsuario($scope.usuario)
									.success(function(response){
										if(response){
											var user = response;
											$rootScope.sesion.setUser(user);
											$scope.showSimpleToast("Edición efectuada, se le notificará por correo electrónico");
											 restFactory.sendEmail($scope.usuario.emailU, "e");
											 $location.path("/home/alumno/info");
										}else{
											$scope.showAlert("Error al realizar la edición intente más tarde.");
										}
								});
				        });
				}else{
					restFactory.editarUsuario($scope.usuario)
						.success(function(response){
							if(response){
								var user = response;
								$rootScope.sesion.setUser(user);
								$scope.showSimpleToast("Edición efectuada, se le notificará por correo electrónico");
								 restFactory.sendEmail($scope.usuario.emailU, "e");
								 $location.path("/home/alumno/info");
							}else{
								$scope.showAlert("Error al realizar la edición intente más tarde.");
							}
					});
				}
								
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
			    	restFactory.cerrarEliminar($scope.usuario.rutU, motivo, "c")
							.success(function(response){
								if(response.message == "true"){
									restFactory.sendEmail($scope.usuario.emailU, "c");
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

	$scope.cancelar = function(){
		$location.path("/home/alumno");
	}
});
app.controller("homeCtrlProfe", function($rootScope, $scope, $location, $http){
	$scope.usuario = $rootScope.sesion.getUser();
	$scope.editP = function(){
		$location.path("/home/profesor/editarP");
	}

	$scope.back = function(){
		$location.path("/home/profesor");
	}
});
app.controller("editarProfeCtrl", function($rootScope, $scope, $location, $http, fileUpload, restFactory, $mdDialog, $mdMedia, $mdToast, Upload){

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
		var file = $scope.file;
		var redire;
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
			    
			    	if(($scope.apodo != "" || $scope.apodo != undefined || $scope.apodo != null) && $scope.apodo != $scope.usuario.apodoU){				
						$scope.usuario.apodoU = $scope.apodo;
					
				}
				
				if(($scope.pass == undefined && $scope.passC == undefined) || ($scope.pass == "" && $scope.passC == "")){
					
				}else{
					$scope.usuario.contrasenaU = $scope.pass;
				}
				if(file != undefined){
					$scope.usuario.fotoPerfilU = "img/"+file.name;
				}

				
					if(file != undefined){
					Upload.upload({
				            url: 'server.php',
				            data: {file: file, 'username': $scope.usuario.rutU}
				        }).then(function (resp) {
				            //console.log('Success ' + resp.config.data.file.name + 'uploaded. Response: ' + resp.data);
				            restFactory.editarUsuario($scope.usuario)
									.success(function(response){
										if(response){
											var user = response;
								                $rootScope.sesion.setUser(user);
								                $scope.showSimpleToast("Edición efectuada, se le enviará un correo electrónico");
								                restFactory.sendEmail($scope.usuario.emailU, "e");
								                $location.path("/home/profesor/perfil");
										}else{
											$scope.showAlert("Error al realizar la edición intente más tarde.");
										}
								});
				        });
				}else{
					restFactory.editarUsuario($scope.usuario)
						.success(function(response){
							if(response){
								var user = response;
								$rootScope.sesion.setUser(user);
								$scope.showSimpleToast("Edición efectuada, se le enviará un correo electrónico");
								restFactory.sendEmail($scope.usuario.emailU, "e");
								$location.path("/home/profesor/perfil");
							}else{
								$scope.showAlert("Error al realizar la edición intente más tarde.");
							}	
						
					});
				}
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
			    	restFactory.cerrarEliminar($scope.usuario.rutU, motivo, "c")
			    		.success(function(response){
								if(response.message == "true"){
									restFactory.sendEmail($scope.usuario.emailU, "c");
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
		var motivo = $scope.motivoE;
			var confirm = $mdDialog.confirm()
			          .title('Desea eliminar su cuenta?')
			          .textContent('La cuenta será eliminada')
			          .ariaLabel('Lucky day')
			          .ok('Eliminar')
			          .cancel('Cancelar');

			    $mdDialog.show(confirm).then(function() {
			    	restFactory.cerrarEliminar($scope.usuario.rutU, motivo, "e")
			    		.success(function(response){
								if(response.message == "true"){
									restFactory.sendEmail($scope.usuario.emailU, "d");
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
	
	$scope.cancelar = function(){
		$location.path("/home/profesor");
	}
});
app.controller("crearProfeCtrl", function($rootScope, $scope, $location, $http, restFactory, $mdDialog, $mdToast){
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
		}
		else{
			$scope.newUsuario.fotoPerfilU = "img/estandar.jpg";
			$scope.newUsuario.estadoidEstado.idEstado = 1;
			$scope.newUsuario.estadoidEstado.nombreE = "Abierta";
			$scope.newUsuario.tipoUsuarioidTipoUsuario.idTipoUsuario = $scope.tipoSelected.idTipoUsuario;
			$scope.newUsuario.tipoUsuarioidTipoUsuario.nombreTU = $scope.tipoSelected.nombreTU;
			restFactory.crearUsuario($scope.newUsuario)
						.success(function(response){
							if(response.message == "t"){
								$scope.showSimpleToast("Usuario creado, se le notificará por correo electrónico esta situación");
								restFactory.sendEmail($scope.newUsuario.emailU, "n");
								restFactory.getUserByEmail($scope.newUsuario.emailU)
									.success(function (response){
										$rootScope.sesion.setUserToEdit(response);
										$location.path("/home/profesor/info");
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
	
	$scope.cancelar = function(){
		$location.path("/home/profesor");
	}
});
app.controller("cuentasCtrlProfe", function($rootScope, $scope, $location, $http, restFactory){
	$scope.gridOptions = {
            data: [],
            urlSync: false
    };

	restFactory.getAllUsers()
		.success(function (response){
		$scope.gridOptions.data = response;
	});

	$scope.usuario = $rootScope.sesion.getUser();	

	$scope.sendEdicion = function(emailU){
		restFactory.getUserByEmail(emailU)
			.success(function (response){
				$scope.userSelected = response;
				$rootScope.sesion.setUserToEdit($scope.userSelected);
				$location.path("/home/profesor/info");
		});
		
	}
});
app.controller("infoCtrlProfe", function($rootScope, $scope, $location, $http, restFactory){

	$scope.userSelected = $rootScope.sesion.getUserToEdit();

	$scope.back = function(){
		$rootScope.sesion.destroyUserToEdit();
		$location.path("/home/profesor/ver");
	}

	$scope.editP = function(){
		$location.path("/home/profesor/editar");
	}
});
app.controller("editarSelected", function($rootScope, $scope, $location, $http, restFactory, $mdDialog, $mdToast){
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
			      	if(($scope.apodo != "" || $scope.apodo != undefined || $scope.apodo != null) && $scope.apodo != $scope.userSelected.apodoU){
					$scope.userSelected.apodoU = $scope.apodo;
					}
				
				if(($scope.pass == undefined && $scope.passC == undefined) || ($scope.pass == "" && $scope.passC == "")){

				}else{
					$scope.userSelected.contrasenaU = $scope.pass;
				}
				restFactory.editarUsuario($scope.userSelected)
						.success(function(response){
							if(response){
								$scope.showSimpleToast("Edición efectuada, se le enviará un correo electrónico");
								restFactory.sendEmail(response.emailU, "e");
								if(response.rutU == '18486956-k'){
									$rootScope.sesion.setUser(response);
								}
								$rootScope.sesion.setUserToEdit(response);
								$location.path("/home/profesor/info");
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
	          .textContent('Su cuenta será cerrada')
	          .ariaLabel('Lucky day')
	          .ok('Cerrar')
	          .cancel('Cancelar');

	          $mdDialog.show(confirm).then(function() {
			    	restFactory.cerrarEliminar($scope.userSelected.rutU, motivo, "c")
							.success(function(response){
								if(response.message == "true"){
									restFactory.sendEmail($scope.userSelected.emailU, "c");
									$rootScope.sesion.destroyUserToEdit();
									$scope.showSimpleToast("Cerrando cuenta, se le enviará un correo electrónico");
									$location.path("/home/profesor/ver");				
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
		var x = $scope.motivoE;
		var confirm1 = $mdDialog.confirm()
          .title('Desea eliminar la cuenta?')
          .textContent('La cuenta del usuario será eliminada')
          .ariaLabel('Lucky day')
          .ok('Eliminar')
          .cancel('Cancelar');
		    $mdDialog.show(confirm1).then(function() {
		    
		      restFactory.cerrarEliminar($scope.userSelected.rutU, x, "e")
							.success(function(response){
								if(response.message == "true"){
									$scope.showSimpleToast("Eliminando cuenta, se le enviará un correo electrónico");
									$rootScope.sesion.destroyUserToEdit();
									restFactory.sendEmail($scope.userSelected.emailU, "d");
									$location.path("/home/profesor/ver");				
								}else{
									$scope.showAlert("Error al realizar la eliminación de la cuenta intente más tarde.");
								}
						});
					
		      return "";
		    }, function() {
		      return "";
		    });
	}

	$scope.cancelar = function(){
		$rootScope.sesion.destroyUserToEdit();
		$location.path("/home/profesor/ver");
	}
});