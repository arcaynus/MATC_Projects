/**
 * Created by franciscomorales on 7/22/16.
 */
(function(){
    angular.module('toDoApp', [
        /* listed imported modules here */
        'ui.router',
        'ngAnimate'
    ])
        .config(myAppConfig);

    function myAppConfig($urlRouterProvider) {
        $urlRouterProvider.otherwise('/main');
    }

})();