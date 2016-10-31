document.addEventListener("DOMContentLoaded", function(){
    var mouse = {
        click : false,
        move : false,
        pos : {
            x : 0,
            y : 0
        },
        pos_prev : false
    };
    
    var canvas = document.getElementById("drawing");
    var context = canvas.getContext("2d");
    var width = window.innerWidth;
    var height = window.innerHeight;
    var socket = io.connect();

    canvas.width = width;
    canvas.height = height;
    context.strokeStyle = '#20C20E';

    canvas.onmousedown = function(e){
        mouse.click = true;
    };

    canvas.onmouseup = function(e){
        mouse.click = false;  
    };

    canvas.onmousemove = function(e){
        mouse.pos.x = e.clientX / width;
        mouse.pos.y = e.clientY /height;
        mouse.move = true;
    }

    socket.on('draw_line', function(data){
        var line = data.line;
        console.log(line);
        context.beginPath();
        context.lineWidth = 2;
        context.moveTo(line[0].x * width, line[0].y * height);
        context.lineTo(line[1].x * width, line[1].y * height);
        context.stroke();
    });
    
    socket.on('clear', function(){
        context.clearRect(0, 0, canvas.width, canvas.height);
    });

    function mainLoop(){
        if(mouse.click && mouse.move && mouse.pos_prev){
            socket.emit('draw_line', { line : [ mouse.pos, mouse.pos_prev ] });
            mouse.move = false;
        }
        
        document.body.onkeyup = function(e){
            if(e.keyCode == 32){
                socket.emit('clear');
            }
        }
        
        mouse.pos_prev = { x : mouse.pos.x, y : mouse.pos.y};
        setTimeout(mainLoop, 25);
    }

    mainLoop();
});