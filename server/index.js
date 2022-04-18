const express = require('express');
const app = express();
const cors = require('cors');

// const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');

const pool = require("./db");
const port = 5000;

// middleware
app.use(fileUpload());
app.use(express.urlencoded({
    extended: true,
    limit: '10mb'
}));
app.use(cors());
app.use(express.json())

// ADD new User
app.post("/add-user", async (req, res) => {
    try{
        const {firstName, secondName, email, password, username, dateBirth, dateCreated, dateModified, passphrase} = req.body;

        let profilePicture = null;
        try {
            profilePicture = req.files.profilePicture.data;   
        } catch (error) {
            profilePicture = null;
        }

        const user = await (await pool).query('insert into users(first_name, last_name, email, password, username, profile_pic, date_birth, date_created, date_modified, passphrase) values(?,?,?,?,?,?,?,?,?,?) returning *', [firstName, secondName, email, password, username, profilePicture, dateBirth, dateCreated, dateModified, passphrase]);
        res.status(200).json(user[0]);
        
    }catch(err){
        console.log(err);
    }
})

// Get user by username
app.get("/get-user-username/:username", async (req, res) => {
    try{
        const {username} = req.params;
        const user = await (await pool).query('select * from users where username = ?', [username]);

        if (user[0])
            res.status(200).json(user[0]);
        else
            res.status(200).json(null);
    }catch (err){
        console.log(err);
    }
})

// Get user by email
app.get("/get-user-email/:email", async (req, res) => {
    try{
        const {email} = req.params;
        const user = await (await pool).query('select * from users where email = ?', [email]);

        if (user[0])
            res.status(200).json(user[0]);
        else
            res.status(200).json(null);
    }catch(err){
        console.log(err);
    }
})

// Posts
app.post('/add-post', async (req, res) => {
    try {
        const {title, postText, ingredients, instructions, category, date, user_id} = req.body;
        // const images = req.body
        const {images} = req.files

        const post = await (await pool).query('insert into posts(user_id, post_text, likes, date_created, category, title) values(?,?,?,?,?,?) returning *', [user_id, postText, 0, date, category, title]);
        const post_id = await post[0].post_id;
        // console.log(await post[0].post_id)

        for (var i = 0; i < images.length; i++) {
            const image = await (await pool).query('insert into images(post_id, image_blob) values(?, ?)', [post_id, images[i].data])
        }
// 
        const postIngredients = await(await pool).query('insert into ingredients(post_id, ingredient) values(?,?)', [post_id, ingredients]) 
        const postInstructions = await(await pool).query('insert into instructions(post_id, instruction) values(?,?)', [post_id, instructions])
        res.status(200).json('done');
    } catch (error) {
       console.error(error); 
    }
})

app.get("/get-post-by-user_id/:user_id/:pageNo/:category/:term", async (req, res) => {
    try {
        const {user_id, pageNo, category} = req.params;
        const start = (pageNo - 1) * 10;
        let {term} = req.params;

        term = (term === "null")?"":term;

        let allPosts = null;
        if (category === "All") allPosts = await (await pool).query('select * from posts where user_id = ? and title like ? order by date_created desc limit ?, 10', [user_id, `%${term}%`, start]);
        else allPosts = await (await pool).query('select * from posts where user_id = ? and category = ? order title like ? by date_created desc limit ?, 10', [user_id, `%${term}%`, category, start]);

        const postData = []

        for (var i=0; i<allPosts.length; i++) {
            let post_id = allPosts[i].post_id
            let tempData = {
                images : await (await pool).query('select * from images where post_id = ?', [post_id]),
                ingredients : await (await pool).query('select * from ingredients where post_id = ?', [post_id]), 
                instructions : await (await pool).query('select * from instructions where post_id = ?', [post_id]),
                comments : await (await pool).query('select username,first_name,profile_pic,comment_text from users, comments where post_id = ? and comments.user_id in (select user_id from comments where post_id = ?) and comments.user_id = users.user_id  order by comments.date_created desc', [post_id, post_id]),
                noOfLikes : await (await pool).query('select count(*) as likes from post_likes where post_id = ?', [post_id]),
                userData : await (await pool).query('select first_name, username from users where user_id = ?', [user_id]),
                isPostLiked : await (await pool).query('select * from post_likes where post_id = ? and user_id = ?', [post_id, user_id]),
                TotalLikes : await (await pool).query('select count(*) as count from posts where user_id = ?', [user_id]),
                TotalPost : await (await pool).query('select count(*) as count from posts')
            }
            
            postData.push(tempData);
        }
        res.status(200).json({
            posts : allPosts,
            postData : postData,
        })
        
    } catch (error) {
        console.error(error);    
    }
})

app.get("/get-all-posts/:request_user_id/:pageNo/:category/:term", async (req, res) => {
    try {
        const {request_user_id, pageNo, category} = req.params
        const start = (pageNo - 1) * 10;
        let {term} = req.params;

        term = (term === "null")?"":term;

        // console.log({request_user_id, pageNo, category, term})

        let allpost = null;
        if (category === "All") allPosts = await (await pool).query('select * from posts where title like ? order by date_created desc limit ?,10', [`%${term}%`, start]);
        else allPosts = await (await pool).query('select * from posts where category = ? and title like ? order by date_created desc limit ?,10', [category, `%${term}%`, start]);

        const postData = []

        for (let i = 0; i < allPosts.length; i++) {
            let post_id = allPosts[i].post_id;
            let user_id = allPosts[i].user_id;

            let tempData = {
                images : await (await pool).query('select * from images where post_id = ?', [post_id]),
                ingredients : await (await pool).query('select * from ingredients where post_id = ?', [post_id]), 
                instructions : await (await pool).query('select * from instructions where post_id = ?', [post_id]),
                comments : await (await pool).query('select username,first_name,profile_pic,comment_text from users, comments where post_id = ? and comments.user_id in (select user_id from comments where post_id = ?) and comments.user_id = users.user_id order by comments.date_created desc', [post_id, post_id]),
                userData : await (await pool).query('select first_name, username, profile_pic from users where user_id = ?', [user_id]),
                noOfLikes : await (await pool).query('select count(*) as likes from post_likes where post_id = ?', [post_id]),
                isPostLiked : await (await pool).query('select * from post_likes where post_id = ? and user_id = ?', [post_id, request_user_id]),
                TotalPost : await (await pool).query('select count(*) as count from posts')
            }
            postData.push(tempData);
        }

        res.status(200).json({
            posts: allPosts,
            postData: postData
        })
    } catch (error) {
        console.log(error);
    }
})

app.post("/increment-like/", async (req, res) => {
    try {
        const {post_id, request, user_id} = req.body;
        // console.log(req.body);
        let update = null;
        if (request == 1)
            update = await (await pool).query('insert into post_likes(post_id, user_id) values(?, ?)', [post_id, user_id])
        else
            update = await (await pool).query('delete from post_likes where post_id = ? and user_id = ?', [post_id, user_id])

        res.status(200).json("done");
    } catch (error) {
        console.error(error);
    }
})

app.post("/add-comment", async (req, res) => {
    try {
        const {comment, user_id, post_id, dateCreated} = req.body;

        const addedData = await (await pool).query('insert into comments(post_id,user_id,comment_text,date_created) values(?,?,?,?)', [post_id, user_id, comment, dateCreated])
        res.status(200).json("done");
    } catch (error) {
       console.error(error); 
    }
})

app.post("/change-password", async (req, res) => {
    try {
        const {user_id, password} = req.body;

        const updated = await (await pool).query('update users set password = ? where user_id = ?', [password, user_id]);
        res.status(200).json("done");
    } catch (error) {
        console.log(error);   
    }
})

app.post("/change-passphrase", async (req, res) => {
    try {
        const {user_id, passphrase} = req.body;

        const updated = await (await pool).query('update users set passphrase = ? where user_id = ?', [passphrase, user_id]);
        res.status(200).json("done");
    } catch (error) {
        console.log(error);   
    }
})

app.get("/get-all-categories", async (req, res) => {
    try {
        const cats = await (await pool).query('select distinct(category) from posts');
        res.status(200).json(cats);
    } catch (error) {
        console.error(error);
    }
})

app.get("/get-post-category", async (req, res) => {
    try {
        const cats = await (await pool).query('select * from categories');
        res.status(200).json(cats);
    } catch (error) {
        console.log(error)
    }
})

app.listen(port, () => {
    console.log(`server has started on ${port}`)
})
