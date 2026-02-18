const { runParser } = require('../services/parser');
const Product = require('../models/Product');
const User = require('../models/User');

exports.addProduct = async (req, res) => {
   try{
      const { url, telegramId, username } = req.body;
      const data = await runParser(url);
      const product = await Product.findOneAndUpdate(
         { fullNameOfProduct: data.fullNameOfProduct },
         { ...data, url, lastParsed: new Date() },
         { upsert: true, new: true }
      )
      console.log(telegramId, username);
      
      // await User.findOneAndUpdate(
      //    { telegramId },
      //    {
      //       username,
      //       $addToSet: { savedProducts: product._id }
      //    },
      //    { upsert: true }
      // );
      res.status(200).json(product);


   } catch(err){
      res.status(500).json({err: err.message})
      console.log(err);
      
   }

   
}

// async function getUserProducts(userId){
//    const user = await User.findOne({ talegramId: userId }).populate('savedProducts');
//    return user ? user.savedProducts : [];
// }

// async function removeProduct(userId, productId){
//    await User.findOneAndUpdate(
//       {telegramId: userId},
//       { $pull: { savedProducts: productId}}
//    )
// }

