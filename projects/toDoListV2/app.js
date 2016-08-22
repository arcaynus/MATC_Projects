/**
 * Created by franciscomorales on 7/22/16.
 */
(function(){
    angular.module('toDoApp', [
        /* listed imported modules here */
        'ui.router',
        'ngAnimate',
        'ngStorage',
        'toaster'
    ])
        .config(myAppConfig);

    function myAppConfig($urlRouterProvider) {
        $urlRouterProvider.otherwise('/main');
    }

})();