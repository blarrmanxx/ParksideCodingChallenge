app.controller("leadContr", function($scope, $http) {
  $scope.robot_results = [];
  $scope.order_by = "-wins";
  $scope.orderBy = function(id) {
    $scope.order_by = id;
  }
  $http.get("https://challenge.parkside-interactive.com/api/danceoffs/").then(function(response) {
    var danceoffs = response.data;
    var result_per_id = new Map();
    var i;
    for(i=0; i<danceoffs.length; i++) {
      var winner = danceoffs[i].winner;
      var loser = danceoffs[i].loser;
      if(result_per_id.has(winner)) {
        result_per_id.set(winner, {w:result_per_id.get(winner).w+1,l:result_per_id.get(winner).l});
      }
      else {
        result_per_id.set(winner, {w:1,l:0});
      }
      if(result_per_id.has(loser)) {
        result_per_id.set(loser, {w:result_per_id.get(loser).w,l:result_per_id.get(loser).l+1});
      }
      else {
        result_per_id.set(loser, {w:0,l:1});
      }
    }

    //put the results in an array of objects with {id:_,wins:_,losses:_}
    for(let entry of result_per_id) {
      $http.get("https://challenge.parkside-interactive.com/api/robots/"+entry[0]).then(function(response) {
        var robot = {rob:response.data, wins:entry[1].w, losses:entry[1].l};
        $scope.robot_results.push(robot);
      });
    }
  });
})
