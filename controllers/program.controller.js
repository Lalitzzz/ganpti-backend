const db = require("../config/db");



//create programs 
exports.createProgram = (req,res) => {
    const {title,description,price, location, event_date } = req.body;


    const sql = `INSERT INTO programs(title,description,price, location, event_date)
    VALUES (?, ?, ?, ?, ?)`;

    db.query(sql, [title, description, price, location, event_date], (err) => {
        if(err) return res.status(500).json(err);
        res.json({message:"Program Created Successfully"});
    });
};

//read programs 
exports.getPrograms = (req, res) => {
    db.query("SELECT * FROM programs", (err, data) => {
        if(err) return res.status(500).json(err)
        res.json(data);
    });
};

//update programs
exports.updateProgram = (req,res) => {
    const {id} = req.params;
    const {title, description, price, location, event_date} = req.body;

    const sql = `
       UPDATE programs 
       SET title=?, description=?, price=?, location=?, event_date=?
       WHERE id =?
    `;

    db.query(sql, [title, description, price, location, event_date,id] , (err) =>{
        if(err) return res.status(500).json(err);

        res.json({message:"Program Updated Successfully"});
    });
};


//Delete programs
exports.deleteProgram = (req,res) => {
    const {id} = req.params;

    db.query("Delete From programs WHERE id = ? ", [id] , (err) => {
        if(err) return res.status(500).json(err);

        res.json({message: "program Deleted successfully"});
    });
};