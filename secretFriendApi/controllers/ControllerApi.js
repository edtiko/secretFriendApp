var model = require('../models/friend');
const fs = require('fs');
var Friend = model.Friend;
var styles = `<style> h1 {
    animation-duration: 3s;
    animation-name: slidein;
  }
  body {
    background-size:     cover;    
    background-position: center center;  
}
  canvas {
    position: absolute;
    top: 0;
    left: 0;
  }
  @keyframes slidein {
    from {
      margin-left: 100%;
      width: 300%
    }
    to {
      margin-left: 0%;
      width: 100%;
    }
  } </style>`;

var scriptjs = `<script> 
  var canvas = document.getElementById('snow');
  var ctx = canvas.getContext('2d');
  
  var w = canvas.width = window.innerWidth;
  var h = canvas.height = window.innerHeight;
  
  var num = 60;
  var tamaño = 40;
  var elementos = [];
  
  inicio();
  nevada();
  
  window.addEventListener("resize", function() {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
  });
  
  function inicio() {
    for (var i = 0; i < num; i++) {
      elementos[i] = {
        x: Math.ceil(Math.random() * w),
        y: Math.ceil(Math.random() * h),
        toX: Math.random() * 10 - 5,
        toY: Math.random() * 5 + 1,
        tamaño: Math.random() * tamaño
      }
    }
  }
  
  function nevada() {
    window.requestAnimationFrame(nevada); 
    ctx.clearRect(0, 0, w, h);
    for (var i = 0; i < num; i++) {
      var e = elementos[i];
      ctx.beginPath();
      cristal(e.x, e.y, e.tamaño);
      ctx.fill();
      ctx.stroke();
      e.x = e.x + e.toX;
      e.y = e.y + e.toY;
      if (e.x > w) { e.x = 0;}
      if (e.x < 0) { e.x = w;}
      if (e.y > h) { e.y = 0;}
    }
    //timer = setTimeout(nevada,10);
  }
  
  function cristal(cx, cy, long) {
    ctx.fillStyle = "white";
    ctx.lineWidth = long / 20;
    ctx.arc(cx, cy, long / 15, 0, 2 * Math.PI);
    for (i = 0; i < 6; i++) {
      ctx.strokeStyle = "white";
      ctx.moveTo(cx, cy);
      ctx.lineTo(cx + long / 2 * Math.sin(i * 60 / 180 * Math.PI),
                 cy + long / 2 * Math.cos(i * 60 / 180 * Math.PI));
    }
  } </script>`;


//Simple version, without validation or sanitation
exports.test = function (req, res) {
    fs.readFile(
        './controllers/secretFriend.jpg', 'base64',
        (err, base64Image) => {
            // 2. Create a data URL
            const dataUrl = `data:image/jpeg;base64, ${base64Image}`
            var html = `<html>` + styles +
                `<body background="${dataUrl}" style="background-repeat: no-repeat"></br></br></br></br>
            <h1 style="color:white; padding-left: 50px;">Tú amigo secreto es</br> Camilo Salazar.</h1>
            <canvas id='snow'></canvas> `
                + scriptjs +
                `</body>
            </html> `;

            res.send(html);
        }
    );
};

exports.get_list_friend = function (req, res, next) {
    Friend.find(function (err, friend_list) {
        if (err) return next(err);
        res.send(friend_list);
    })
};

exports.get_list_secret_friend = function (req, res, next) {
    Friend.find({ idFriend: null }, function (err, secret_list) {
        if (err) return next(err);
        res.send(secret_list);
    })
};

exports.create_friend = function (req, res, next) {
    var friend = new Friend(
        {
            id: req.body.id,
            name: req.body.name,
            image: req.body.image,
            idFriend: null
        }
    );
    console.log(req.body.name);
    friend.save(function (err) {
        if (err) {
            return next(err);
        }
        res.send('Friend Created successfully')
    })
};

exports.get_friend = function (req, res, next) {
    Friend.findById(req.params.id, function (err, product) {
        if (err) return next(err);
        res.send(product);
    })
};

exports.get_secret_friend = function (req, res, next) {
    Friend.find(function (err, friend_list) {
        if (err) return next(err);
        var selected = [];
        var friends = [];
        for (i = 0; i < friend_list.length; i++) {
            if (friend_list[i].idFriend != null) {
                selected[i] = friend_list[i].idFriend;
            }
        }
        console.log(selected);
        fs.readFile(
            './controllers/secretFriend.jpg', 'base64',
            (err, base64Image) => {
                const dataUrl = `data:image/jpeg;base64, ${base64Image}`

                Friend.findOne({ id: req.params.id, idFriend: { $ne: null } }, function (error_existe, existe) {
                    if (existe != null) {
                        Friend.findOne({ id: existe.idFriend }, function (e, fe) {
                            msg = 'Ya tienes amigo secreto, es ' + fe.name;
                            var html = `<html>` + styles +
                                `<body background="${dataUrl}" style="background-repeat: no-repeat"></br></br></br></br>
                    <h1 style="color:white; padding-left: 50px;">`+ msg + `.</h1>
                    <canvas id='snow'></canvas>`
                                + scriptjs +
                                `</body>
                    </html> `;
                            res.send(html);
                        });
                    } else {
                        Friend.find({ id: { $ne: req.params.id }},
                            function (err, result) {
                                if (result != null) {
                                    var a = [];
                                    var frien = [];
                                    for (i = 0; i < result.length; i++) {
                                        a[i] = result[i].id;
                                    }
                                    var randomValue =  a[Math.floor(a.length * Math.random())];
                                    
                                    console.log(randomValue);
                                    if(selected.length > 0){
                                      for(i=0; i< a.length; i++){
                                        var is = false;
                                        for(j=0; j< selected.length; j++){
                                            if(a[i]==selected[j]){
                                             is = true;
                                            }
                                        }
                                        if(!is){
                                            frien.push(a[i]);
                                        }
                                      }
                                     randomValue = frien[Math.floor(frien.length * Math.random())];
                                    }
                                  
                                    Friend.findOneAndUpdate({ id: req.params.id }, { idFriend: randomValue }, function (err, friend) {
                                      Friend.findOne({id:randomValue},function(e, r){
                                        msg = 'Tú amigo secreto es ' + r.name;
                                        var html = `<html>` + styles +
                                            `<body background="${dataUrl}" style="background-repeat: no-repeat"></br></br></br></br>
                        <h1 style="color:white; padding-left: 50px;">`+ msg + `.</h1>
                        <canvas id='snow'></canvas>`
                                            + scriptjs +
                                            `</body>
                        </html> `;
                                        res.send(html);
                                      });
                                        
                                    });

                                } else {
                                    msg = 'Ya no hay amigos secretos disponibles.';
                                    var html = `<html>` + styles +
                                        `<body background="${dataUrl}" style="background-repeat: no-repeat"></br></br></br></br>
                                <h1 style="color:white; padding-left: 50px;">`+ msg + `.</h1>
                                <canvas id='snow'></canvas>`
                                        + scriptjs +
                                        `</body>
                                </html> `;
                                    res.send(html);
                                }
                            }
                        );
                    }
                });
            });

    });
};

exports.friend_delete = function (req, res, next) {
    Friend.findOneAndDelete({ id: req.params.id }, function (err) {
        if (err) return next(err);
        res.send('Deleted successfully!');
    })
};