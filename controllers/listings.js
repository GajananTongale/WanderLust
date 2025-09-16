const Listing = require("../models/listing");


module.exports.index = async (req, res) => {
    const allListings = await Listing.find({})
    // console.log("All Listings : ",allListings)
    res.render("listings/index.ejs", {allListings})
};

module.exports.renderNewform = (req, res) => {
    res.render("listings/new.ejs")
};

module.exports.showListing = async (req, res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id).populate({path:"reviews",populate:{path:"author"}}).populate("owner");
    console.log(listing.title)
    if(!listing){
        req.flash("error", "Listing You requested does not exist");
        return res.redirect(`/listings`)
    }
    res.render("listings/show.ejs", {listing})
};


module.exports.newListing = async (req, res) => {
    // let{title,description,images,price,country,location} = req.body;
    //await Listing.insertOne({title,description,images,price,country,location});
    //res.redirect("/listings")

    //let listing = req.body.listing;
    let url = req.file.path;
    let filename = req.file.filename;
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = {url,filename};
    await newListing.save();
    console.log(newListing);
    req.flash("success", "new Listing Created");
    res.redirect("/listings")
};


module.exports.renderEditForm = async (req, res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id)
    if(!listing){
        req.flash("error", "Listing You requested does not exist");
        res.redirect(`/listings`)
    }
    let original = listing.image.url;
    original = original.replace("/upload", "/upload/w_250,h_300,c_fill");
    res.render("listings/edit.ejs", {listing,original})
};



module.exports.updateListing = async (req, res) => {
    let {id} = req.params;
    let listing = await Listing.findByIdAndUpdate(id, {...req.body.listing});

    if(typeof req.file !==undefined){
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image = {url,filename};
        await listing.save();
    }
    req.flash("success", "Listing Updated");
    res.redirect("/listings")
};

module.exports.destroyListing = async (req, res) => {
    let {id} = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing Deleted");
    res.redirect("/listings")
};