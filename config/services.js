const Post = require("../models/Post");
const User = require("../models/User");

//POST METHOD
async function createcontact(req, res) {
    const userId = req.user._id;
    const { first_name, last_name, number } = req.body;

    const newContact = new Post({
        text,
        userId,
    });

    newContact
        .save()
        .then((post) => {
            console.log("New post Saved");
        })
        .catch((err) => console.log(err));
}

// GET METHOD
async function getcontacts(req, res) {
    const data = await Contact.find().catch((err) => console.error(err));
    return data;
}

// GET CONTACTS FROM ID
async function getcontactsByUser(req) {
    const userID = req.user._id;
    const data = await Contact.find({ userId: userID }).catch((err) =>
        console.error(err)
    );
    return data;
}

// Delete Method
async function deletecontact(req, res) {
    Contact.findByIdAndRemove(req.params.id)
        .then((data) => console.log(data))
        .catch((err) => console.error(err));
    res.redirect("/viewall");
}

// Update
async function getcontact(req) {
    const contactId = req.params.id;
    const data = await Contact.findById(contactId).catch((err) =>
        console.error(err)
    );
    return data;
}

module.exports = {
    createcontact,
    getcontacts,
    deletecontact,
    getcontactsByUser,
    getcontact,
};
