const Users = require("../models/user");
const PaketWisata = require("../models/paketWisata");
const { ObjectId } = require("mongodb");
var similarity = require( 'compute-cosine-similarity' );


function createDict(item, user){
    var dict = [];
    for (var i=0; i<item.length; i++){
        var newDict = {};
        newDict[item[i].id] = []
        for (var j=0; j<user.length; j++){
            reviewExist = item[i].reviews.some(el => el.userId == user[j].id);
            if(reviewExist){
                for (var k=0; k<item[i].reviews.length; k++){
                    if (item[i].reviews[k].userId == user[j].id){
                        newDict[item[i].id].push(item[i].reviews[k].rating);
                    }
                }
            } else{
                newDict[item[i].id].push(0);
            } 
        }
        dict.push(newDict)
    }
    return dict;
}

function getCosineSim(ratings){
    var dict = {};
    for (var i=0; i<ratings.length; i++){
        key = Object.keys(ratings[i])[0]
        dict[key] = {};
        for (var j=0; j<ratings.length; j++){
            key2 = Object.keys(ratings[j])[0]

            if (i==j){
                dict[key][key2] = 1;
            } else {
                dict[key][key2] = similarity(ratings[i][key], ratings[j][key2]);
            }
        }
    }
    return dict;
}

function predictRating(idUser, cosineSim, item){
    var dict={}
    var dot_product = 0;
    for (var i=0; i<item.length; i++){
        reviewExist = item[i].reviews.some(el => el.userId == idUser);
        //console.log("AAA")
        if(!reviewExist){
            currentTarget = item[i];
            for (var j=0; j<item.length; j++){
                if (item[j].reviews.some(el => el.userId == idUser)){
                    currentItem = item[j];
                    for (var k=0; k<currentItem.reviews.length; k++){
                        if(currentItem.reviews[k].userId == idUser){
                            currentRating = currentItem.reviews[k].rating;
                            dot_product += currentRating * cosineSim[currentTarget.id][currentItem.id];
                            //console.log(currentRating, cosineSim[currentTarget.id][currentItem.id])
                            //console.log(currentTarget.id, currentItem.id)
                            //console.log(dot_product)
                        }
                    }
                }
            }
            dict[currentTarget.id] = dot_product;
        }
        dot_product = 0;
    }
    return dict;
}

const getRecPaket = async (username) => {
    currentUser = await Users.findOne(
        { username: username }
    );

    idUser = currentUser.id;
    console.log(idUser);
    PaketWisataReviewed = await PaketWisata.find({"reviews.userId": ObjectId(idUser)});

    if(PaketWisataReviewed.length < 1){
        return await PaketWisata.find().sort("-hits");
    } else {
        AllPaketWisata = await PaketWisata.find();
        AllUsers = await Users.find();
        ratings = createDict(AllPaketWisata, AllUsers);        
        console.log(ratings);

        cosineSim = getCosineSim(ratings);
        console.log(cosineSim);

        ratingPrediction = predictRating(idUser, cosineSim, AllPaketWisata);
        console.log(ratingPrediction);
        return ratingPrediction;
    }
};

module.exports = {
    getRecPaket
}