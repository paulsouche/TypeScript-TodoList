var todos = [
    {
        id : 1,
        description : "Préparer la prez Typescript",
        memo : 'Types, outils, meme',
        priority : 1,
        updated_at : Date.now()
    },
    {
        id : 2,
        description : "Finaliser l'appli",
        memo : 'ng Tailor, browser sync, Typescript',
        priority : 2,
        updated_at : Date.now()
    }
];

var id = 3;


/*
 * GET todos listing.
 */
exports.findAll = function(req, res){
    res.json(200, todos);
};

/*
 * GET todo by identifier.
 */
exports.findById = function(req, res){
    var id = req.params.id;

    for(var i = 0; i < todos.length; i++){
        if(todos[i].id == id){
            return res.json(200, todos[i]);
        }
    }

    return res.json(404, "Not found");
};

/*
 * Create a todo.
 */
exports.addTodo = function(req, res){
    var todo = req.body;
    todo.updated_at = Date.now();
    todo.id = id++;
    todos.push(todo);
    return res.json(201,todo);
};

/*
 * Update a todo by is identifier.
 */
exports.updateTodo = function(req, res){
    var todo = req.body;
    var id = todo.id;

    for(var i = 0; i < todos.length; i++){
        if(todos[i].id === id){
            todos.splice(i, 1);
            todos.push(todo);
            return res.json(200);
        }
    }

    return res.json(304, "Not modified");
};

/*
 * GET users listing.
 */
exports.deleteTodo = function(req, res){
    var id = req.params.id;
    for(var i = 0; i < todos.length; i++){
        if(todos[i].id == id){
            todos.splice(i, 1);
            return res.json(200);
        }
    }
    
    return res.json(304, "Not modified");
};