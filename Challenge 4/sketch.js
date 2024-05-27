document.addEventListener("DOMContentLoaded", function() {
    var spaceship = document.getElementById("spaceship");
    var maze = document.getElementById("maze");
    var goal = document.querySelector(".goal");
    var walls = document.querySelectorAll(".wall");
    
    var mazeWidth = maze.offsetWidth;
    var mazeHeight = maze.offsetHeight;
    var spaceshipSize = spaceship.offsetWidth;
    
    function handleOrientation(event) {
        var x = event.gamma;  
        var y = event.beta;   
        
        
        var newX = (mazeWidth - spaceshipSize) * (x + 90) / 180;
        var newY = (mazeHeight - spaceshipSize) * (y + 90) / 180;
        
        
        if (newX >= 0 && newX <= (mazeWidth - spaceshipSize)) {
            spaceship.style.left = newX + "px";
        }
        if (newY >= 0 && newY <= (mazeHeight - spaceshipSize)) {
            spaceship.style.top = newY + "px";
        }
        
        
        walls.forEach(function(wall) {
            if (isColliding(spaceship, wall)) {
                
                spaceship.style.left = "190px"; 
                spaceship.style.top = "190px"; 
            }
        });
        
        
        if (isColliding(spaceship, goal)) {
            alert("Congratulations! You've found the alien artifact!");
        }
    }
    
    window.addEventListener("deviceorientation", handleOrientation, true);
    
    
    function isColliding(elem1, elem2) {
        var rect1 = elem1.getBoundingClientRect();
        var rect2 = elem2.getBoundingClientRect();
        return !(
            rect1.top > rect2.bottom ||
            rect1.bottom < rect2.top ||
            rect1.left > rect2.right ||
            rect1.right < rect2.left
        );
    }
});
