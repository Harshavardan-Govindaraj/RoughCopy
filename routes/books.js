var express = require('express');
var router = express.Router();
var dbConn = require('../lib/db');

const session = require('express-session');
// display books page
router.get('/', function (req, res, next) {

    dbConn.query('SELECT * FROM food', function (err, rows) {
        let flag = req.session.flag;
        if (err) {
            req.flash('error', err);
            // render to views/books/index.ejs

            res.render('books', { data: '', flag: '' });
        } else {
            // render to views/books/index.ejs
            res.render('books', { data: rows, flag: flag });
        }
    });
});

// display add book page
router.get('/add', function (req, res, next) {
    // render to add.ejs
    res.render('books/add', {
        name: '',
        author: ''
    })
})
router.get('/login', function (req, res, next) {
    // render to add.ejs
    res.render('books/login')
})
// router.get('/userRegistration', function (req, res, next) {
//     // render to add.ejs
//     res.render('books/userRegistration')
// })
router.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));
router.post('/login', function (req, res, next) {
    let email = req.body.email;
    let password = req.body.password;

    dbConn.query(`SELECT * FROM login WHERE email = '${email}' AND password='${password}'`, function (err, rows, fields) {
        if (err) throw err
        if (rows.length <= 0) {
            req.flash('error', 'No user found')
            res.redirect('/books/login')
        }
        else {
            // router.use(function (req, res, next) {
            //     res.locals.currentUser = row[0].flag;////
            //     next()
            // })
            req.session.flag = rows[0].flag;
            res.redirect('/books/display');
        }
    })
})
router.get('/contactdetail', function (req, res, next) {
    // render to add.ejs
    res.render('books/contactdetail')
})
router.get('/display', function (req, res, next) {
    // render to add.ejs
    res.render('books/display')
})
router.get('/ur', function (req, res, next) {
    // render to add.ejs
    res.render('books/ur')
})
router.get('/register', function (req, res, next) {
    // render to add.ejs
    res.render('books/register')
})
router.get('/about', function (req, res, next) {
    // render to add.ejs
    res.render('books/about')
})

// add a new book
router.post('/add', function (req, res, next) {

    let name = req.body.myname1;
    let email = req.body.myemail;
    let phone_no = req.body.myphone;
    let address = req.body.myadd;
    let city = req.body.city;
    let category = req.body.myfood;
    let quanity = req.body.quantity;
    let preparation_date = req.body.fooddate1;
    let issue_date = req.body.fooddate2;
    let expiry_date = req.body.fooddate3;
    let details = req.body.note;
    let errors = false;
    console.log(name);
    // if (nanameme.length === 0) {
    //     errors = true;

    //     // set flash message
    //     req.flash('error', "Please enter all deatils");
    //     // render to add.ejs with flash message
    //     res.render('books/add', {
    //         name: name,
    //         author: email
    //     })
    // }

    // if no error
    if (!errors) {

        var form_data = {
            name: name,
            email: email,
            phone_no: phone_no,
            address: address,
            city: city,
            category: category,
            quanity: quanity,
            preparation_date: preparation_date,
            issue_date: issue_date,
            expiry_date: expiry_date,
            details: details
        }

        // insert query
        dbConn.query('INSERT INTO food SET ?', form_data, function (err, result) {
            //if(err) throw err
            if (err) {
                req.flash('error', err)

                // render to add.ejs
                res.render('books/add', {
                    name: form_data.name,
                    author: form_data.email
                })
            } else {
                req.flash('success', 'food successfully added');
                res.redirect('/books');

            }
        })
    }
})
router.post('/userRegistration', function (req, res, next) {

    let name = req.body.name;
    let email = req.body.email;
    let password = req.body.password;
    let city = req.body.city;
    let errors = false;

    if (!errors) {

        var form_data = {
            name: name,
            email: email,
            password: password,
            city: city,

        }

        // insert query
        dbConn.query('INSERT INTO login SET ?', form_data, function (err, result) {
            //if(err) throw err
            if (err) {
                req.flash('error', err)

                // render to add.ejs
                res.render('books/ur')
            } else {
                req.flash('success', 'food successfully added');
                res.redirect('/books/login');
            }
        })
    }
})
// router.post('/login', function (req, res, next) {
//     let email = req.params.email;
//     let password = req.params.password;
//     dbConn.query('SELECT * FROM login WHERE email = "' + email + '"', function (err, rows, fields) {
//         if (err) throw err
//         if (rows.length <= 0) {
//             req.flash('error', 'No user found')
//             res.redirect('/')
//         }
//         else {
//             if (password != row[0].password) {
//                 req.flash('error', 'wrong password')
//                 res.redirect('/')
//             }
//             res.render('/books/display');
//         }
//     })
// })
//-----------------------------------------------------------------------------------------------
// display edit book page
router.get('/edit/(:name)', function (req, res, next) {

    let name = req.params.name;

    dbConn.query('SELECT * FROM food WHERE name = "' + name + '"', function (err, rows, fields) {
        if (err) throw err

        // if user not found
        if (rows.length <= 0) {
            req.flash('error', 'Book not found with name = "' + name + '"')
            res.redirect('/books')
        }
        // if book found
        else {
            // render to edit.ejs
            res.render('books/edit', {
                title: 'Edit Book',
                name: rows[0].name,
                email: rows[0].email,
                phone_no: rows[0].phone_no,
                address: rows[0].address,
                category: rows[0].category,
                quanity: rows[0].quanity,
                preparation_date: rows[0].preparation_date,
                issue_date: rows[0].issue_date,
                expiry_date: rows[0].expiry_date,
                details: rows[0].details
                //

            })
        }
    })
})

// update book data
router.post('/update/:name', function (req, res, next) {
    let name = req.params.name;
    let email = req.params.email;
    let phone_no = req.params.phone_no;
    let address = req.params.address;
    let category = req.params.category;
    let quanity = req.params.quanity;
    let preparation_date = req.params.preparation_date;
    let issue_date = req.params.issue_date;
    let expiry_date = req.params.expiry_date;
    let details = req.params.details;

    let errors = false;

    if (name.length === 0) {
        errors = true;

        // set flash message
        req.flash('error', "Please enter details");
        // render to add.ejs with flash message
        res.render('books/edit', {
            name: name,
            email: email,
            phone_no: phone_no,
            address: address,
            category: category,
            quanity: quanity,
            preparation_date: preparation_date,
            issue_date: issue_date,
            expiry_date: expiry_date,
            details: details
            // id: req.params.id,
            // name: name,
            // author: author
        })
    }

    // if no error
    if (!errors) {

        var form_data = {
            name: name,
            email: email,
            phone_no: phone_no,
            address: address,
            category: category,
            quanity: quanity,
            preparation_date: preparation_date,
            issue_date: issue_date,
            expiry_date: expiry_date,
            details: details
        }
        // update query
        dbConn.query('UPDATE food SET ? WHERE name = "' + name + '"', form_data, function (err, result) {
            //if(err) throw err
            if (err) {
                // set flash message
                req.flash('error', err)
                // render to edit.ejs
                res.render('books/edit', {

                    name: form_data.name,
                    author: form_data.email
                })
            } else {
                req.flash('success', 'food successfully updated');
                res.redirect('/books');
            }
        })
    }
})

// delete book
router.get('/delete/(:name)', function (req, res, next) {

    let name = req.params.name;

    dbConn.query('DELETE FROM food WHERE name = "' + name + '"', function (err, result) {
        //if(err) throw err
        if (err) {
            // set flash message
            req.flash('error', err)
            // redirect to books page
            res.redirect('/books')
        } else {
            // set flash message
            req.flash('success', 'Food successfully deleted!  ')
            // redirect to books page
            res.redirect('/books')
        }
    })
})

module.exports = router;