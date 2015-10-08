service.$inject = ['$window'];


function service($window) {
    return {
        init: ($scope, game) => {
            this.$scope = $scope;
            this.game = game;
            this.game.config.baseUrl = $window.location.pathname;
            $scope.$on('$destroy', () => {
                this.game.arrays = null;
                this.game.destroy();
                this.game = null;
                this.$scope = null;
            });

            game.arrays = {};

        }
        , event: (name, ...data) => {
            if (this.game.events[name]) {
                this.game.events[name].dispatch(...data)
            } else {
                console.warn(`(${name}) event is not registered`);
            }
        }
    }
}

export default service;