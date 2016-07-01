app.config(function($routeProvider){
	$routeProvider
	.when("/", {
		resolve: {
			"check": function($location,$rootScope){
				if( $rootScope.auth.isLoggedIn()){
					if($rootScope.auth.isProfesor()){
						$location.path('/home/profesor');
					}else if($rootScope.auth.isAlumnoAyudante()){
						$location.path('/home/alumno');
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
					}
				}
			}	
		},
		templateUrl: "views/alumno/editarAlum.html",
		controller: "editarAlumCtrl"
		
	})
	.when("/home/profesor", {
		resolve: {
			"check": function($location,$rootScope){
				if( !$rootScope.auth.isLoggedIn()){
					$location.path('/');
				}else{
					if($rootScope.auth.isAlumnoAyudante()){
						$location.path('/home/alumno');
					}
				}
			}	
		},
		templateUrl: "views/profesor/homeProfe.html",
		controller: "homeCtrlProfe"
		
	})
	.when("/home/profesor/info", {
		resolve: {
			"check": function($location,$rootScope){
				if( !$rootScope.auth.isLoggedIn()){
					$location.path('/');
				}else{
					if($rootScope.auth.isAlumnoAyudante()){
						$location.path('/home/alumno');
					}
				}
			}	
		},

		templateUrl: "views/profesor/infoProfesor.html",
		controller: "homeCtrlProfe"

	})
	.when("/home/profesor/editar", {
		resolve: {
			"check": function($location,$rootScope){
				if( !$rootScope.auth.isLoggedIn()){
					$location.path('/');
				}else{
					if($rootScope.auth.isAlumnoAyudante()){
						$location.path('/home/alumno');
					}
				}
			}	
		},

		templateUrl: "views/profesor/editarProfe.html",
		controller: "editarProfeCtrl"

	})
	.when("/home/profesor/crear", {
		resolve: {
			"check": function($location,$rootScope){
				if( !$rootScope.auth.isLoggedIn()){
					$location.path('/');
				}else{
					if($rootScope.auth.isAlumnoAyudante()){
						$location.path('/home/alumno');
					}
				}
			}	
		},

		templateUrl: "views/profesor/crearUsuarioProfe.html",
		controller: "crearProfeCtrl"

	})
	.when("/home/profesor/ver", {

		resolve: {
			"check": function($location,$rootScope){
				if( !$rootScope.auth.isLoggedIn()){
					$location.path('/');
				}else{
					if($rootScope.auth.isAlumnoAyudante()){
						$location.path('/home/alumno');
					}
				}
			}	
		},

		templateUrl: "views/profesor/cuentas.html",
		controller: "cuentasCtrlProfe"

	})
	.when("/home/profesor/info/:emailU", {

		resolve: {
			"check": function($location,$rootScope){
				if( !$rootScope.auth.isLoggedIn()){
					$location.path('/');
				}else{
					if($rootScope.auth.isAlumnoAyudante()){
						$location.path('/home/alumno');
					}
				}
			}	
		},

		templateUrl: "views/profesor/seleccionado.html",
		controller: "infoCtrlProfe"

	})
	.when("/home/profesor/editar/:emailU", {
		resolve: {
			"check": function($location,$rootScope){
				if( !$rootScope.auth.isLoggedIn()){
					$location.path('/');
				}else{
					if($rootScope.auth.isAlumnoAyudante()){
						$location.path('/home/alumno');
					}
				}
			}	
		},

		templateUrl: "views/profesor/editarP.html",
		controller: "editarPCtrl"

	})
	.otherwise({
		redirectTo: "/"
	});
});
