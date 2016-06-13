app.config(function($routeProvider){
	$routeProvider
	.when("/", {
		templateUrl: "login.html",
		controller: "loginCtrl"
	})
	.when("/login/olvidoC", {

		templateUrl: "olvidoC.html",
		controller: "olvidoCtrl"
		
	})
	.when("/home/alumno", {
		templateUrl: "homeAlum.html",
		controller: "homeCtrlAlum"
		
	})
	.when("/home/alumno/info", {

		templateUrl: "infoAlum.html",
		controller: "homeCtrlAlum"

	})
	.when("/home/alumno/editar", {
		templateUrl: "editarAlum.html",
		controller: "editarAlumCtrl"
		
	})
	.when("/home/profesor", {
		templateUrl: "homeProfe.html",
		controller: "homeCtrlProfe"
		
	})
	.when("/home/profesor/info", {

		templateUrl: "infoProfesor.html",
		controller: "homeCtrlProfe"

	})
	.when("/home/profesor/editar", {

		templateUrl: "editarProfe.html",
		controller: "editarProfeCtrl"

	})
	.when("/home/profesor/crear", {

		templateUrl: "crearUsuarioProfe.html",
		controller: "crearProfeCtrl"

	})
	.when("/home/profesor/ver", {

		templateUrl: "cuentas.html",
		controller: "cuentasCtrlProfe"

	})
	.when("/home/profesor/info/:emailU", {

		templateUrl: "selected.html",
		controller: "infoCtrlProfe"

	})
	.when("/home/profesor/editar/:emailU", {

		templateUrl: "editP.html",
		controller: "editarPCtrl"

	})
	.otherwise({
		redirectTo: "/"
	});
});
