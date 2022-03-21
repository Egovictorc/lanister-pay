const express  = require("express");
const axios = require("axios");
const { parseFeeConfig } = require("../middlewares/feeMiddleware");
const router = express.Router();


const URL = process.env.URL;

/*
@desc save fee confug
@route POST /api/fees
*/

router.post("/", parseFeeConfig, async (req, res) => {
    const { feeConfig } = req;
    await axios.post(URL+"feeConfig", feeConfig)
    res.status(200).json({
        "status": "ok"
    })
 
})

/*
@desc get fee config
@route GET /api/fees/id
*/
router.get("/", async (req, res) => {
    const configResponse = await axios.get(URL+"feeConfig")
    const config = configResponse.data;

    res.status(200).json(config)
})

router.get("/:id", (req, res) => {

})

/*
@desc update a fee
@route update /api/fees/:id
*/

router.put("/:id", (req, res) => {

})

module.exports = router;