var Funds = document.getElementById("score");
var Score = 0;

function changeFunds(fundsIn) {
    var fundsElem = document.getElementById("score");
    fundsElem.innerText = Number.parseInt(fundsElem.innerText) + fundsIn;
}

function getFunds() {
    var fundsElem = document.getElementById("score");
    return (Number.parseInt(fundsElem.innerText));
}
var gridObjects = {
    Home: 1,
    Grass: 2,
    ZombiesWall: 3,
    LawnRemover: 4
};

function drawGrid(gridArrIn) {
    // delete old grid from screen
    document.getElementById("Map").innerHTML = "";
    for (var i = 0; i < gridArrIn.length; i++) {
        // draw new grid
        if (gridArrIn[i] == gridObjects.Home) document.getElementById("Map").innerHTML += "<div class='house'></div>"
        else if (gridArrIn[i] == gridObjects.Grass) document.getElementById("Map").innerHTML += "<div class='grass'></div>"
        else if (gridArrIn[i] == gridObjects.ZombiesWall) document.getElementById("Map").innerHTML += "<div class='Zombies'></div>";
        else if (gridArrIn[i] == gridObjects.LawnRemover) document.getElementById("Map").innerHTML += "<div class='LawnRemover'></div>";
    }
}
var lane = { // refers to top position of each lane
    LANE1: 120,
    LANE2: 197,
    LANE3: 274,
    LANE4: 351,
    LANE5: 428,
    LANE6: 505,
    LANE7: 582
};
var CardCost = {
    peashooter1: 100,
    peashooter2: 175,
    peashooter3: 200,
    sun: 50
}
var ShootingSpeed = {
    slow: 1500,
    average: 900,
    fast: 750
}

function getLane(position) {
    if (position < lane.LANE2) return lane.LANE1;
    if (position < lane.LANE3) return lane.LANE2
    if (position < lane.LANE4) return lane.LANE3
    if (position < lane.LANE5) return lane.LANE4
    if (position < lane.LANE6) return lane.LANE5
    if (position < lane.LANE7) return lane.LANE6
    else return lane.LANE7
}
function getTractorLane(position) {
    if (position < lane.LANE2) return 0;
    if (position < lane.LANE3) return 1;
    if (position < lane.LANE4) return 2;
    if (position < lane.LANE5) return 3;
    if (position < lane.LANE6) return 4;
    if (position < lane.LANE7) return 5;
    else return 6;
}

function Peashooter(peashotterDiv, positionIn, shottingSpeed, grassIn) {
    this.gridObject = peashotterDiv;
    this.lane = getLane(positionIn.top);
    this.grass = grassIn;
    this.position = {
        t: positionIn.top
        , l: positionIn.left
    };
    this.shootPic = "<img class='peashooterActive1' src='./images/PB00.gif' >";
    this.shootInterval;
    this.attacking = false;
    this.startShooting = function (zombie) {
        if (this.attacking) return; //************??
        this.attacking = true;
        var that = this;
        var count = 0;
        this.shootInterval = setInterval(function () {
            that.gridObject.append(that.shootPic); // add a shot
            that.gridObject.children().last().css({
                left: 60
                , top: 10 // match the output
            });
            var deleted = 0; // flag for collision with monster
            $(that.gridObject).children().last().animate({
                left: $("#Map").width() - that.position.l - $(".Zombies").width() // until end of map
            }, {
                duration: 3000
                , complete: function () {
                    if (!deleted) // delete first shot if no hits
                        $(that.gridObject).children().eq(0).remove();
                }
                , step: function (now, fx) {
                    if (that.position.l + now >= $("#" + zombie).position().left)
                    //&&
                    //that.lane == 193) //getLane($("#ZombiesSoldier2").position().left) ) 
                    {
                        $(fx.elem).stop();
                        $(fx.elem).remove();
                        deleted = 1;
                        const index = Zombie.ZombiesArr.indexOf(zombie);
                        objectsZombies[index].blood--;
                        if (objectsZombies[index].blood == 0) { // decrease zombie health here / need to loop on all shooters and remove thier children
                            Score += objectsZombies[index].ZombieKillBounty;
                            $(that.gridObject).children().stop(true).remove();
                            that.stopShooting();
                            pShooters.forEach(function (shooter) {
                                if (shooter.lane == that.lane) {
                                    $(shooter.gridObject).children().stop(true).remove();
                                    shooter.stopShooting();
                                }
                            });
                            clearInterval(objectsZombies[index].ZombieTimer);
                            objectsZombies[index].ZombiesRemove(zombie);
                        }
                    }
                }
            });
            // get end of map position
        }, shottingSpeed)
    }; // shotting speed
    this.stopShooting = function () {
        clearInterval(this.shootInterval);
        this.attacking = false;
    };
    this.getProjectilePosition = function () {
        return $(that.gridObject).children().last().position();
    };
    this.deleteObject = function () {
        this.stopShooting();
        $(this.gridObject).children().remove();
        $(this.gridObject).remove();
        pShooters.splice(pShooters.indexOf(this), 1);
    }
}
Peashooter.cost = 100;

function Sun(sunDiv, positionIn, grassIn) {
    this.gridObject = sunDiv;
    this.lane = getLane(positionIn.top);
    this.grass = grassIn;
    this.position = {
        t: positionIn.top
        , l: positionIn.left
    };
    this.addSunInterval = setInterval(function () { // add 50 sun every fixed time 
        if(getFunds() <400)
        changeFunds(Sun.cost);
    }, 10000);
    this.destroySun = function () { // stop adding sun
        clearInterval(this.addSunInterval);
    }
    this.deleteObject = function () {
        $(this.gridObject).remove();
        this.destroySun();
        suns.splice(suns.indexOf(this), 1);
    }
}
Sun.cost = 50;
var pShooters = [];
var suns = [];
var levelOneGrid = [
    1, 4, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 3
    , 1, 4, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 3
    , 1, 4, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 3
    , 1, 4, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 3
    , 1, 4, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 3
    , 1, 4, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 3
    , 1, 4, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 3
]
$(function () {
    $(".draggable").draggable({
        revert: false
        , helper: "clone"
        , snap: ".grass"
        , snapMode: "inner"
        , snapTolerance: 37.5
        , drag: function (event, ui) {
            if ($(ui.helper).hasClass('peashooter')) {
                $(ui.helper).css({
                    "background-image": "url(./images/PShootMove2.gif)"
                })
            }
            else if ($(ui.helper).hasClass('peashooter2')) {
                $(ui.helper).css("background-image", "url(./images/Cards/snow-pea.gif)")
            }
            else if ($(ui.helper).hasClass('peashooter3')) {
                $(ui.helper).css("background-image", "url(./images/Cards/pea-shooter2.gif)")
            }
            else if ($(ui.helper).hasClass('sunflower')) {
                $(ui.helper).css("background-image", "url(./images/SunFlower.gif)")
            }
        }
    });
    $(".grass").droppable({
        accepts: ".draggable"
        , drop: function (event, ui) {
            var draggedClone = $(ui.helper).clone();
            var enoughFunds = false;
            if (draggedClone.hasClass('peashooter') && getFunds() >= CardCost.peashooter1) {
                enoughFunds = true;
                changeFunds(-CardCost.peashooter1);
                
                draggedClone.css({
                    "background-image": "url(./images/PShootMove2.gif)"
                    , "background-color": "transparent"
                });
                pShooters[pShooters.length] = new Peashooter(draggedClone, $(this).position(), ShootingSpeed.slow, $(this));
                // pShooters[pShooters.length - 1].startShooting();
            }
            else if (draggedClone.hasClass('peashooter2') && getFunds() >= CardCost.peashooter2) {
                enoughFunds = true;
                changeFunds(-CardCost.peashooter2);
                
                draggedClone.css({
                    "background-image": "url(./images/Cards/snow-pea.gif)"
                });
                pShooters[pShooters.length] = new Peashooter(draggedClone, $(this).position(), ShootingSpeed.average, $(this));
                //  pShooters[pShooters.length - 1].startShooting();
            }
            else if (draggedClone.hasClass('peashooter3') && getFunds() >= CardCost.peashooter3) {
                enoughFunds = true;
                changeFunds(-CardCost.peashooter3);
                draggedClone.css({
                    "background-image": "url(./images/Cards/pea-shooter2.gif)"
                });
                pShooters[pShooters.length] = new Peashooter(draggedClone, $(this).position(), ShootingSpeed.fast, $(this));
                // pShooters[pShooters.length - 1].startShooting();
            }
            else if (draggedClone.hasClass('sunflower') && getFunds() >= CardCost.sun) {
                enoughFunds = true;
                /*
                                enoughFunds = true;
                                changeFunds(-CardCost.peashooter1);
                                draggedClone.css({
                                    "background-image": "url(./images/PShootMove2.gif)"
                                    , "background-color": "transparent"
                                });
                                pShooters[pShooters.length] = new Peashooter(draggedClone, $(this).position(), ShootingSpeed.slow,$(this));
                                // pShooters[pShooters.length - 1].startShooting();
                            }
                            else if (draggedClone.hasClass('peashooter2') && getFunds() >= CardCost.peashooter2) {
                                enoughFunds = true;
                                changeFunds(-CardCost.peashooter2);
                                draggedClone.css({
                                    "background-image": "url(./images/Cards/snow-pea.gif)"
                                });
                                pShooters[pShooters.length] = new Peashooter(draggedClone, $(this).position(), ShootingSpeed.average,$(this));
                                //  pShooters[pShooters.length - 1].startShooting();
                            }
                            else if (draggedClone.hasClass('peashooter3') && getFunds() >= CardCost.peashooter3) {
                                enoughFunds = true;
                                changeFunds(-CardCost.peashooter3);
                                draggedClone.css({
                                    "background-image": "url(./images/Cards/pea-shooter2.gif)"
                                });
                                pShooters[pShooters.length] = new Peashooter(draggedClone, $(this).position(), ShootingSpeed.fast,$(this));
                                // pShooters[pShooters.length - 1].startShooting();
                            }
                            else if (draggedClone.hasClass('sunflower') && getFunds() >= CardCost.sun) {
                                enoughFunds = true;
                */
                changeFunds(-CardCost.sun);
                suns[suns.length] = new Sun(draggedClone, $(this).position(),$(this) );
            }
            if (enoughFunds) {
                $(this).append(draggedClone);
                $(this).droppable("disable");
            }
        }
    });
})
var int1 = setInterval(function () {
    Zombie.ZombiesArr.forEach(function (zombie) {
        var zombieLane = getLane($("#" + zombie).position().top);
        var zombieLeft = $("#" + zombie).position().left;
        pShooters.forEach(function (pShooter) {
            if (pShooter.lane == zombieLane) pShooter.startShooting(zombie);
            if (pShooter.position.l + 50 > zombieLeft && pShooter.lane == zombieLane) {
                pShooter.grass.droppable("enable");
                pShooter.deleteObject();
            }
        });
        suns.forEach(function (sun) {
            if (sun.position.l + 50 > zombieLeft && sun.lane == zombieLane){
             sun.grass.droppable("enable");
             sun.deleteObject();
            }
        });
    })
}, 200);





var myElement;
var timer1;
var x = 10;

function Shooting(s) {
    s.append("<img class='peashooterActive1' src='./images/PB00.gif' >");
}
drawGrid(levelOneGrid);
//*************************************************************ZOMBIES***************************************************************************//
//crating an array holding the numbers of the zombies created
//zombies class
function Zombie(blood, walkSpeed, zombieStyle, bountyIn) {
    this.blood = blood;
    this.walkSpeed = walkSpeed;
    this.zombieStyle = zombieStyle;
    this.ZombieTimer;
    this.ZombieLeftMovement = "-=10";
    this.ZombieKillBounty = bountyIn;
    //Array of Zombies allowable top positions
     this.AllowableZombieTop = ['120px', '197px', '274px', '351px', '428px', '505px', '582px']; //margintop+marginbottom+zombie height
}
Zombie.ZombiesArr = []; //stor zombies ids only
Zombie.ZombieClasses = ['ZombiesSoldier1'];
Zombie.ZombieCount = 0;
//function o return random indexs for AllowableZombieTop Array
Zombie.prototype.randomZombiePos = function () {
    return this.AllowableZombieTop[Math.floor(Math.random() * this.AllowableZombieTop.length)];
};
//zombies creation function
Zombie.prototype.ZombiesCreation = function () {
    var ZombiesObj = document.createElement("div");
    ZombiesObj.style.left = "1225px"; //#Map width-zombie width pic
    ZombiesObj.style.top = this.randomZombiePos();
    ZombiesObj.classList.add(this.zombieStyle);
    ZombiesObj.setAttribute("id", "ZombiesSoldier" + Zombie.ZombieCount);
    document.getElementById("Map").appendChild(ZombiesObj);
    Zombie.ZombiesArr.push(ZombiesObj.id);
    this.ZombiesMovement(ZombiesObj.id);
};
var HouseLoss = -60;
//creating a functiom to move the zombie till a condition is met
Zombie.prototype.ZombiesMovement = function (_ZombiesObjID) {
    //timer for zombie movement;
    var that = this;
    that.ZombieTimer = setInterval(function () {
        $("#" + _ZombiesObjID).css("left", that.ZombieLeftMovement);
        if ((Zombie.ZombiesArr.includes(_ZombiesObjID)) && ($("#" + _ZombiesObjID).position().left <= HouseLoss)) {
        var x=$("#" + _ZombiesObjID).position().top;
        var index = Zombie.ZombiesArr.indexOf(_ZombiesObjID);
        clearInterval(objectsZombies[index].ZombieTimer);
        objectsZombies[index].ZombiesRemove(_ZombiesObjID);
        LawnRemoverMover(x);
        }
    }, that.walkSpeed);
    
};
//creating a function to remove the zombie if a condition is met
Zombie.prototype.ZombiesRemove = function (_ZombiesObjID) {
    var bg_img = $("#" + _ZombiesObjID).css("background-image");
    //console.log(bg_img);
    if (bg_img.includes("Zombie1/0Zombie1.gif")) $("#" + _ZombiesObjID).css({
        "background-image": "url(./images/Zombie/ZombieDie.gif)"
    });
    else if (bg_img.includes("Zombie2/0Zombie2.gif")) $("#" + _ZombiesObjID).css({
        "background-image": "url(./images/Zombie2/ZombieHead.gif)"
    });
    else if (bg_img.includes("Zombie3/0Zombie3.gif")) $("#" + _ZombiesObjID).css({
        "background-image": "url(./images/Zombie2/ZombieHead.gif)"
    });
    else if (bg_img.includes("Zombie4/0Zombie4.gif")) $("#" + _ZombiesObjID).css({
        "background-image": "url(./images/Zombie4/FlagZombieLostHead.gif)"
    });
    else if (bg_img.includes("Zombie5/0Zombie5.gif")) $("#" + _ZombiesObjID).css({
        "background-image": "url(./images/Zombie2/ZombieHead.gif)"
    });
    var zombieIdIndex = Zombie.ZombiesArr.indexOf(_ZombiesObjID)
    Zombie.ZombiesArr.splice(zombieIdIndex, 1);
    objectsZombies.splice(zombieIdIndex, 1);
    if(zombieNumber==0&&objectsZombies.length==0)GameWon();
    setTimeout(function () {
        $("#" + _ZombiesObjID).remove();

    }, 2000)
};
//function to return random Zombies solider Class 
function randomZombiesoliderClass() {
    return Zombie.ZombieClasses[Math.floor(Math.random() * Zombie.ZombieClasses.length)];
};
var ZombiesClassNO = 2;
//function to push new zombie Solider class  after period of time 
function PushZombiesoliderClass() {
    Zombie.ZombieClasses.push('ZombiesSoldier' + ZombiesClassNO)
    ZombiesClassNO++;
};
//function to return the health of the created zombie
function ZombieObjHealth(ZombieObjClass) {
    if (ZombieObjClass == 'ZombiesSoldier1') return 9;
    else if (ZombieObjClass == 'ZombiesSoldier2') return 11;
    else if (ZombieObjClass == 'ZombiesSoldier3') return 13;
    else if (ZombieObjClass == 'ZombiesSoldier4') return 15;
    else if (ZombieObjClass == 'ZombiesSoldier5') return 17;
};
//function to return the speed of the created zombie
function ZombieObjSpeed(ZombieObjClass) {
    if (ZombieObjClass == 'ZombiesSoldier1') return 400;
    else if (ZombieObjClass == 'ZombiesSoldier2') return 400;
    else if (ZombieObjClass == 'ZombiesSoldier3') return 400;
    else if (ZombieObjClass == 'ZombiesSoldier4') return 400;
    else if (ZombieObjClass == 'ZombiesSoldier5') return 400;
};

function ZombieObjBounty(ZombieObjClass) {
    if (ZombieObjClass == 'ZombiesSoldier1') return 0;
    else if (ZombieObjClass == 'ZombiesSoldier2') return 0;
    else if (ZombieObjClass == 'ZombiesSoldier3') return 0;
    else if (ZombieObjClass == 'ZombiesSoldier4') return 0;
    else if (ZombieObjClass == 'ZombiesSoldier5') return 0;
};
//////////////start the game for zombies ////////////////////////////////////////
var Timer = 0; //Timer To  push new Zombie Class
var Time = {
    twentyseconds: 4,
    fortySeconds: 8,
    sixtySeconds: 12,
    eightySeconds: 16,
    TwoMinutes: 30
};
var objectsZombies = [];
var flag = 1;
var zombieNumber;
function ZombieStart() {
    var ZombieObjClass = randomZombiesoliderClass();
    var ZombieHealth = ZombieObjHealth(ZombieObjClass);
    var ZombieSpeed = ZombieObjSpeed(ZombieObjClass);
    var ZombieBounty = ZombieObjBounty(ZombieObjClass);
    var ZombiesTimer;

    if(Timer<Time.eightySeconds)ZombiesTimer = 5000;
    else if (Timer < Time.TwoMinutes) ZombiesTimer = 3000;
    else ZombiesTimer = 500;
    var ZombieObj = new Zombie(ZombieHealth, ZombieSpeed, ZombieObjClass, ZombieBounty);
    objectsZombies.push(ZombieObj); //push object in the array
    if (flag == 1) ZombieObj.ZombiesCreation();
    Timer++;
    if (Timer == Time.twentyseconds || Timer == Time.fortySeconds || Timer == Time.sixtySeconds || Timer == Time.eightySeconds) {
        PushZombiesoliderClass();
    };
    Zombie.ZombieCount++;
     zombieNumber = 1000 - Zombie.ZombieCount;
    document.getElementById("ZombieCount").innerHTML = 'Zombie = ' + zombieNumber;

    if (zombieNumber > 0 && flag == 1) {
        setTimeout(ZombieStart, ZombiesTimer);
    };
};
// this function to give concstant increase in the score
var FixedSunTimer;
function FixedScoreValue(){
        if(getFunds() ==400)clearTimeout(FixedSunTimer);
        else changeFunds(Sun.cost);
        FixedSunTimer=setTimeout(FixedScoreValue,5000);
};
//var TructorIndex=[];
function LawnRemoverMover(ZombieTop) {
//    if (TructorIndex.includes(ZombieTop)) {
//        GameOver();
//        return 0;
//    };
//    TructorIndex.push(ZombieTop);
    var TractorLane = getTractorLane(ZombieTop);
  //  console.log($(".LawnRemover").eq(TractorLane).position().left);
    if($(".LawnRemover").eq(TractorLane).position().left<1000){
    var TractorTimer=setInterval(function () {
        $(".LawnRemover").eq(TractorLane).css({
            "left": "+=10px"
        });
        var indexArray = [];
        for (var i = 0; i < objectsZombies.length; i++) {
            if ($("#" + Zombie.ZombiesArr[i]).position().top == ZombieTop) {
                if (($(".LawnRemover").eq(TractorLane).position().left + 50)<=($("#" + Zombie.ZombiesArr[i]).position().left) <= ($(".LawnRemover").eq(TractorLane).position().left + 75)) {
                    indexArray.push(i);
                }
            }
        };
        for (var i = indexArray.length-1; i >= 0; i--) {
            clearInterval(objectsZombies[indexArray[i]].ZombieTimer);
            objectsZombies[indexArray[i]].ZombiesRemove(Zombie.ZombiesArr[indexArray[i]]);
        }
    if($(".LawnRemover").eq(TractorLane).position().left>1300){
        clearInterval(TractorTimer);
        //document.getElementsByClassName("LawnRemover")[TractorLane].style.display = "none";
    }
    }, 1);
}
    else GameOver();
};

function GameWon() {
    $("#dialogWon").dialog({
        width: 500,
        show: {
            effect: "explode",
            duration: 1000
        },
    });
    clearInterval(FixedSunTimer);
}
function GameOver() {
    $("#dialog").dialog({
        width: 800,
        show: {
            effect: "blind",
            duration: 1000
        },
    });
    $("#dialog").show();
    for (var i = 0; i < objectsZombies.length; i++) {
        clearInterval(objectsZombies[i].ZombieTimer);
        flag = 0;
    };
    pShooters.forEach(function (shooter) {
        $(shooter.gridObject).children().stop(true).remove();
        shooter.stopShooting();
    });
    clearInterval(int1);
    clearInterval(FixedSunTimer);
};
$("#dialog").hide();
$("#dialogWon").hide();
ZombieStart();
 FixedScoreValue();