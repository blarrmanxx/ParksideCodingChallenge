app.controller("compContr", function($scope, $http, $location, $anchorScroll) {
  $scope.compArray = [];
  $scope.currcomp = {};
  $scope.iscomp = false;
  $scope.addComp = function(loc,tn1,tn2) {
    var t1={teamname:tn1,members:[]};
    var t2={teamname:tn2,members:[]};
    $http.get("https://challenge.parkside-interactive.com/api/robots")
    .then(function(response) {
      robot_ids = [];
      t1.members=getRobots(response.data,robot_ids);
      t2.members=getRobots(response.data,robot_ids);
      $scope.compArray.push({location:loc, team1:t1, team2:t2});
    });
  };
  $scope.startComp = function($index) {
    //start competition
    var comp_winner = [];
    var danceoffs = {"danceoffs": []};
    var i;
    for(i=0; i<5; i++) {
      win = Math.floor(Math.random() * 2);
      comp_winner.push(win);
      var opponents = [$scope.compArray[$index].team1.members[i].id,$scope.compArray[$index].team2.members[i].id];
      danceoffs["danceoffs"].push({"winner":opponents[win], "opponents":opponents});
    }
    //post to api
    $http.post("https://challenge.parkside-interactive.com/api/danceoffs", JSON.stringify(danceoffs)).then(function (response) {
      console.log(response);
    }, function (response) {
      console.log("Error while posting.");
    });

    //change view
    $scope.currcomp = $scope.compArray[$index];
    $scope.currcomp.winners = comp_winner;
    $scope.compArray.splice($index,1);
    $scope.iscomp = true;
    $location.hash('currcomp');
    $anchorScroll();
  };
})

function addRandRobot(total_robots, robots, my_robot_ids) {
  var rand = Math.floor(Math.random() * total_robots.length);
  while(my_robot_ids.includes(total_robots[rand].id) || total_robots[rand].outOfOrder==true) {
    rand = Math.floor(Math.random() * total_robots.length);
  }
  my_robot_ids.push(total_robots[rand].id);
  robots.push(total_robots[rand]);
  return total_robots[rand].experience;
}

function removeRandRobot(robots, my_robot_ids) {
  var rand = Math.floor(Math.random() * robots.length);
  var id = robots[rand].id;
  var exp = robots[rand].experience;
  my_robot_ids.splice(my_robot_ids.indexOf(id),1);
  robots.splice(rand,1);
  return exp;
}

function getRobots(total_robots, robots_ids) {
  var i;
  var robots = [];
  total_exp = 0;
  //randomly assign robots team1
  for(i=0; i<5; i++) {
    var exp = addRandRobot(total_robots, robots, robot_ids);
    total_exp += exp;
    //remove and add a new robot if experience is to big
    while(total_exp > 50) {
      exp = removeRandRobot(robots, robot_ids);
      total_exp = total_exp - exp;
      exp = addRandRobot(total_robots, robots, robot_ids);
      total_exp = total_exp + exp;
    }
  }
  return robots;
}
