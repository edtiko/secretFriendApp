var model = require('../models/friend');
var Friend = model.Friend;

//Simple version, without validation or sanitation
exports.test = function (req, res) {
    res.send('Greetings from the Test controller!');
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
    var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    Friend.findOne({ id: req.params.id, idFriend: { $ne: null } }, function (error_existe, existe) {
        if (existe != null) {
            res.send("Ya tienes amigo secreto!");
        } else {
            Friend.count({ idFriend: null }, function (err, count) {
                if (err) return next(err);
                var r = Math.floor(Math.random() * count);
                Friend.findOne({ idFriend: null, id: { $ne: req.params.id } }).limit(1).skip(r).exec(
                    function (err, result) {
                        if(result != null){
                        Friend.findOneAndUpdate({ id: req.params.id }, { idFriend: result.id }, function (err, friend) {
                            if (err) return next(err);
                        });
                        res.send("Tú amigo secreto es:"+result.name);
                    }else{
                        res.send("Ya no hay amigos secretos disponibles, lo siento!");
                    }
                    }
                );

            });
        }
    });
};

exports.friend_delete = function (req, res, next) {
    Friend.findOneAndDelete({ id: req.params.id }, function (err) {
        if (err) return next(err);
        res.send('Deleted successfully!');
    })
};