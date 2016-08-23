app.config(function($routeProvider){
	$routeProvider
	.when("/", {
		resolve: {
			"check": function($location,$rootScope){
				if($rootScope.auth.isLoggedIn()){
					if($rootScope.auth.isProfesor()){
						$location.path('/home/profesor');
					}else if($rootScope.auth.isAlumnoAyudante()){
						$location.path('/home/alumno');
					}else if($rootScope.auth.isAdministrador()){
						$location.path('/home/administrador');
					}
				}
			}	
		},
		templateUrl: "login.html",
		controller: "loginCtrl"
	})
	.when("/login/olvidoC", {
		resolve: {
			"check": function($location,$rootScope){
				if( $rootScope.auth.isLoggedIn()){
					if($rootScope.auth.isProfesor()){
						$location.path('/home/profesor');
					}else if($rootScope.auth.isAlumnoAyudante()){
						$location.path('/home/alumno');
					}else if($rootScope.auth.isAdministrador()){
						$location.path('/home/administrador');
					}
				}
			}	
		},

		templateUrl: "olvidoC.html",
		controller: "olvidoCtrl"
		
	})
	.when("/home/alumno", {
		resolve: {
			"check": function($location,$rootScope){
				if( !$rootScope.auth.isLoggedIn()){
					$location.path('/');
				}else{
					if($rootScope.auth.isProfesor()){
						$location.path('/home/profesor');
					}else if($rootScope.auth.isAdministrador()){
						$location.path('/home/administrador');
					}
				}
			}	
		},
		templateUrl: "views/alumno/homeAlumno.html",
		controller: "homeCtrlAlum"
		
	})
	.when("/home/alumno/info", {
		resolve: {
			"check": function($location,$rootScope){
				if( !$rootScope.auth.isLoggedIn()){
					$location.path('/');
				}else{
					if($rootScope.auth.isProfesor()){
						$location.path('/home/profesor');
					}else if($rootScope.auth.isAdministrador()){
						$location.path('/home/administrador');
					}
				}
			}	
		},
		templateUrl: "views/alumno/infoAlum.html",
		controller: "homeCtrlAlum"

	})
	.when("/home/alumno/editar", {
		resolve: {
			"check": function($location,$rootScope){
				if( !$rootScope.auth.isLoggedIn()){
					$location.path('/');
				}else{
					if($rootScope.auth.isProfesor()){
						$location.path('/home/profesor');
					}else if($rootScope.auth.isAdministrador()){
						$location.path('/home/administrador');
					}
				}
			}	
		},
		templateUrl: "views/alumno/editarAlum.html",
		controller: "editarAlumCtrl"
		
	})
	.when("/home/alumno/activar", {
		resolve: {
			"check": function($location,$rootScope){
				if( !$rootScope.auth.isLoggedIn()){
					$location.path('/');
				}else{
					if($rootScope.auth.isProfesor()){
						$location.path('/home/profesor');
					}else if($rootScope.auth.isAdministrador()){
						$location.path('/home/administrador');
					}else if($rootScope.auth.isAlumnoAyudante() && $rootScope.auth.isAbierta()){
						$location.path('/home/administrador');
					}
				}
			}	
		},
		templateUrl: "views/alumno/activarAlum.html",
		controller: "editarAlumCtrl"
		
	})
	.when("/home/alumno/verAsociadosP", {
		resolve: {
			"check": function($location,$rootScope){
				if( !$rootScope.auth.isLoggedIn()){
					$location.path('/');
				}else{
					if($rootScope.auth.isProfesor()){
						$location.path('/home/profesor');
					}else if($rootScope.auth.isAdministrador()){
						$location.path('/home/administrador');
					}
				}
			}	
		},
		templateUrl: "views/alumno/verProfeAsociado.html",
		controller: "cuentasPAlumCtrl"
		
	})
	.when("/home/alumno/verAsociadosAA", {
		resolve: {
			"check": function($location,$rootScope){
				if( !$rootScope.auth.isLoggedIn()){
					$location.path('/');
				}else{
					if($rootScope.auth.isProfesor()){
						$location.path('/home/profesor');
					}else if($rootScope.auth.isAdministrador()){
						$location.path('/home/administrador');
					}else if($rootScope.auth.isAlumnoAyudante() && !$rootScope.auth.isUserToEdit()){
						$location.path('/home/administrador');
					}
				}
			}	
		},
		templateUrl: "views/alumno/verAA.html",
		controller: "cuentasAACtrl"
		
	})
	.when("/home/alumno/verAA", {
		resolve: {
			"check": function($location,$rootScope){
				if( !$rootScope.auth.isLoggedIn()){
					$location.path('/');
				}else{
					if($rootScope.auth.isProfesor()){
						$location.path('/home/profesor');
					}else if($rootScope.auth.isAdministrador()){
						$location.path('/home/administrador');
					}else if($rootScope.auth.isAlumnoAyudante() && !$rootScope.auth.isUserAux()){
						$location.path('/home/administrador');
					}
				}
			}	
		},
		templateUrl: "views/alumno/uSelected.html",
		controller: "verAACtrl"
		
	})
	.when("/home/profesor", {
		resolve: {
			"check": function($location,$rootScope){
				if(!$rootScope.auth.isLoggedIn()){
					$location.path('/');
				}else{
					if($rootScope.auth.isAlumnoAyudante()){
						$location.path('/home/alumno');
					}else if($rootScope.auth.isAdministrador()){
						$location.path('/home/administrador');
					}
				}
			}	
		},
		templateUrl: "views/profesor/homeProfe.html",
		controller: "homeCtrlProfe"
		
	})
	.when("/home/profesor/perfil", {
		resolve: {
			"check": function($location,$rootScope){
				if( !$rootScope.auth.isLoggedIn()){
					$location.path('/');
				}else{
					if($rootScope.auth.isAlumnoAyudante()){
						$location.path('/home/alumno');
					}else if($rootScope.auth.isAdministrador()){
						$location.path('/home/administrador');
					}
				}
			}	
		},

		templateUrl: "views/profesor/infoProfesor.html",
		controller: "homeCtrlProfe"

	})
	.when("/home/profesor/editarP", {
		resolve: {
			"check": function($location,$rootScope){
				if( !$rootScope.auth.isLoggedIn()){
					$location.path('/');
				}else{
					if($rootScope.auth.isAlumnoAyudante()){
						$location.path('/home/alumno');
					}else if($rootScope.auth.isAdministrador()){
						$location.path('/home/administrador');
					}
				}
			}	
		},

		templateUrl: "views/profesor/editarProfe.html",
		controller: "editarProfeCtrl"

	})
	.when("/home/profesor/ver", {

		resolve: {
			"check": function($location,$rootScope){
				if( !$rootScope.auth.isLoggedIn()){
					$location.path('/');
				}else{
					if($rootScope.auth.isAlumnoAyudante()){
						$location.path('/home/alumno');
					}else if($rootScope.auth.isAdministrador()){
						$location.path('/home/administrador');
					}
				}
			}	
		},

		templateUrl: "views/profesor/cuentas.html",
		controller: "cuentasCtrlProfe"

	})
	.when("/home/profesor/info", {

		resolve: {
			"check": function($location,$rootScope){
				if( !$rootScope.auth.isLoggedIn()){
					$location.path('/');
				}else{
					if($rootScope.auth.isAlumnoAyudante()){
						$location.path('/home/alumno');
					}else if($rootScope.auth.isAdministrador()){
						$location.path('/home/administrador');
					}else if($rootScope.auth.isProfesor() && !$rootScope.auth.isUserToEdit()){
						$location.path('/home/administrador');
					}
				}
			}	
		},

		templateUrl: "views/profesor/seleccionado.html",
		controller: "infoCtrlProfe"

	})
	.when("/home/profesor/activar", {
		resolve: {
			"check": function($location,$rootScope){
				if( !$rootScope.auth.isLoggedIn()){
					$location.path('/');
				}else{
					if($rootScope.auth.isAlumnoAyudante()){
						$location.path('/home/alumno');
					}else if($rootScope.auth.isAdministrador()){
						$location.path('/home/administrador');
					}else if($rootScope.auth.isProfesor() && $rootScope.auth.isAbierta()){
						$location.path('/home/administrador');
					}
				}
			}	
		},
		templateUrl: "views/profesor/activarProfe.html",
		controller: "editarProfeCtrl"
		
	})
	.when("/home/administrador", {
		resolve: {
			"check": function($location,$rootScope){
				if( !$rootScope.auth.isLoggedIn()){
					$location.path('/');
				}else{
					if($rootScope.auth.isAlumnoAyudante()){
						$location.path('/home/alumno');
					}else if($rootScope.auth.isProfesor()){
						$location.path('/home/profesor');
					}
				}
			}	
		},
		templateUrl: "views/administrador/homeAdmin.html",
		controller: "homeCtrlAdmin"
		
	})
	.when("/home/administrador/perfil", {
		resolve: {
			"check": function($location,$rootScope){
				if( !$rootScope.auth.isLoggedIn()){
					$location.path('/');
				}else{
					if($rootScope.auth.isAlumnoAyudante()){
						$location.path('/home/alumno');
					}else if($rootScope.auth.isProfesor()){
						$location.path('/home/profesor');
					}
				}
			}	
		},

		templateUrl: "views/administrador/infoAdmin.html",
		controller: "homeCtrlAdmin"

	})
	.when("/home/administrador/editarA", {
		resolve: {
			"check": function($location,$rootScope){
				if( !$rootScope.auth.isLoggedIn()){
					$location.path('/');
				}else{
					if($rootScope.auth.isAlumnoAyudante()){
						$location.path('/home/alumno');
					}else if($rootScope.auth.isProfesor()){
						$location.path('/home/profesor');
					}
				}
			}	
		},

		templateUrl: "views/administrador/editarAdmin.html",
		controller: "editarAdminCtrl"

	})
	.when("/home/administrador/crear", {
		resolve: {
			"check": function($location,$rootScope){
				if( !$rootScope.auth.isLoggedIn()){
					$location.path('/');
				}else{
					if($rootScope.auth.isAlumnoAyudante()){
						$location.path('/home/alumno');
					}else if($rootScope.auth.isProfesor()){
						$location.path('/home/profesor');
					}
				}
			}	
		},

		templateUrl: "views/administrador/crearUsuarioAdmin.html",
		controller: "crearAdminCtrl"

	})
	.when("/home/administrador/ver", {

		resolve: {
			"check": function($location,$rootScope){
				if( !$rootScope.auth.isLoggedIn()){
					$location.path('/');
				}else{
					if($rootScope.auth.isAlumnoAyudante()){
						$location.path('/home/alumno');
					}else if($rootScope.auth.isProfesor()){
						$location.path('/home/profesor');
					}
				}
			}	
		},

		templateUrl: "views/administrador/cuentas.html",
		controller: "cuentasCtrlAdmin"

	})
	.when("/home/administrador/info", {

		resolve: {
			"check": function($location,$rootScope){
				if( !$rootScope.auth.isLoggedIn()){
					$location.path('/');
				}else{
					if($rootScope.auth.isAlumnoAyudante()){
						$location.path('/home/alumno');
					}else if($rootScope.auth.isProfesor()){
						$location.path('/home/profesor');
					}else if($rootScope.auth.isAdministrador() && !$rootScope.auth.isUserToEdit()){
						$location.path('/home/administrador');
					}

				}
			}	
		},

		templateUrl: "views/administrador/seleccionado.html",
		controller: "infoCtrlAdmin"

	})
	.when("/home/administrador/editar", {
		resolve: {
			"check": function($location,$rootScope){
				if( !$rootScope.auth.isLoggedIn()){
					$location.path('/');
				}else{
					if($rootScope.auth.isAlumnoAyudante()){
						$location.path('/home/alumno');
					}else if($rootScope.auth.isProfesor()){
						$location.path('/home/profesor');
					}else if($rootScope.auth.isAdministrador() && !$rootScope.auth.isUserToEdit()){
						$location.path('/home/administrador');
					}
				}
			}	
		},

		templateUrl: "views/administrador/editSelect.html",
		controller: "editarSelectedAdmin"

	})
	.when("/home/administrador/activar", {
		resolve: {
			"check": function($location,$rootScope){
				if( !$rootScope.auth.isLoggedIn()){
					$location.path('/');
				}else{
					if($rootScope.auth.isAlumnoAyudante()){
						$location.path('/home/alumno');
					}else if($rootScope.auth.isProfesor()){
						$location.path('/home/profesor');
					}else if($rootScope.auth.isAdministrador() && $rootScope.auth.isAbierta()){
						$location.path('/home/administrador');
					}
				}
			}	
		},
		templateUrl: "views/administrador/activarAdmin.html",
		controller: "editarAdminCtrl"
		
	})
	.when("/home/administrador/cuentasP", {
		resolve: {
			"check": function($location,$rootScope){
				if( !$rootScope.auth.isLoggedIn()){
					$location.path('/');
				}else{
					if($rootScope.auth.isAlumnoAyudante()){
						$location.path('/home/alumno');
					}else if($rootScope.auth.isProfesor()){
						$location.path('/home/profesor');
					}
				}
			}	
		},
		templateUrl: "views/administrador/cuentasPAdmin.html",
		controller: "cuentasPAdminCtrl"
		
	})
	.when("/home/administrador/verAsociadosP", {
		resolve: {
			"check": function($location,$rootScope){
				if( !$rootScope.auth.isLoggedIn()){
					$location.path('/');
				}else{
					if($rootScope.auth.isAlumnoAyudante()){
						$location.path('/home/alumno');
					}else if($rootScope.auth.isProfesor()){
						$location.path('/home/profesor');
					}else if($rootScope.auth.isAdministrador() && !$rootScope.auth.isUserToEdit()){
						$location.path('/home/administrador');
					}
				}
			}	
		},
		templateUrl: "views/administrador/verAsociadosP.html",
		controller: "asociadosPAdminCtrl"
		
	})
	.when("/home/administrador/verDesligar", {
		resolve: {
			"check": function($location,$rootScope){
				if( !$rootScope.auth.isLoggedIn()){
					$location.path('/');
				}else{
					if($rootScope.auth.isAlumnoAyudante()){
						$location.path('/home/alumno');
					}else if($rootScope.auth.isProfesor()){
						$location.path('/home/profesor');
					}else if($rootScope.auth.isAdministrador() && !$rootScope.auth.isUserAux()){
						$location.path('/home/administrador');
					}
				}
			}	
		},
		templateUrl: "views/administrador/verDesligar.html",
		controller: "desligarAdminCtrl"
		
	})
	.otherwise({
		redirectTo: "/"
	});
});
