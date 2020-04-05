app.controller("mainContr", function($scope) {
  $scope.curr_tab = "home";
  $scope.setTab = function(tab) {
    $scope.curr_tab = tab;
  };
  $scope.getActive = function(pos) {
    if($scope.curr_tab == pos) {
      return 'active'
    }
    return '';
  };

})
