const express = require("express");
const axios = require("axios");
const router = express.Router();

/*
@desc compute fee
@route POST /compute-transaction-fee
*/
const URL = process.env.URL;

router.post("/", async (req, res) => {
    const { ID,
        Amount,
        Currency,
        CurrencyCountry,
        Customer, PaymentEntity } = req.body;

    // fetch saved fee configuration spec
    const configResponse = await axios.get(URL + "feeConfig");
    const { data } = await configResponse;
    const feeConfig = Object.values(data);

    //  get applicable fee spec
    const matchedConfig = []

    for (const config of feeConfig) {
        const { entity, entityProp, locale, currency: cur } = config;
        // console.log("config ", config);
        console.log(`entity= ${entity}; type= ${PaymentEntity.Type}`);
        console.log(`entityProp= ${entityProp}; brand= ${PaymentEntity.Brand}`);

        const feeLocale = PaymentEntity.Country === CurrencyCountry ? "LOCL" : "INTL";
        if (
            (entity === PaymentEntity.Type || entity === "*") &&
            (entityProp === PaymentEntity.Brand || entityProp === "*") &&
            (Currency === cur)
        ) {
            matchedConfig.push(config);
        }
    }
    // console.log("matched config ", matchedConfig)
// return http 400 error when no fee configuration match
    if (matchedConfig.length === 0) {
        return res.status(400).json({
            message: "No fee configuration for transaction"
        })
    }

    console.log("matched Config ", matchedConfig)
    const { type, value, id } = getAptConfig(matchedConfig);

    const AppliedFeeValue = computeFee(type, value, Amount);

    // calculate charge amount based on who bears fee
    const ChargeAmount = Customer.BearsFee ? Amount + AppliedFeeValue : Amount;

    // calculate settlement amount
    const SettlementAmount = ChargeAmount - AppliedFeeValue;

    res.status(200).json({
        AppliedFeeID: id,
        AppliedFeeValue,
        ChargeAmount,
        SettlementAmount
    })
})

// compute fee
const computeFee = (type, value, amount) => {
    let AppliedFeeValue;

    switch (type) {
        case "PERC":
            AppliedFeeValue = (value / 100) * amount;
            console.log("value ", value)
            console.log("amount ", amount)
            break;
        case "FLAT_PERC":
            // get flat and perc value
            let valueArr = value.split(":");
            const flat = parseFloat(valueArr[0])
            const perc = parseFloat(valueArr[1])
            AppliedFeeValue = flat + ((perc / 100) * amount)
            break;
        default:
            AppliedFeeValue = value
    }
    return Math.round(AppliedFeeValue);
}



// get most apt fee configuration
function getAptConfig(feeConfig) {
    let countMap = new Map();
    for (const spec of feeConfig) {
        let specStr = Object.values(spec).join();
        // console.log(Object.values(spec).join())
        let count = (specStr.match(/\*/g) || []).length;
        countMap.set(count, spec);
    }
    return countMap.get(Math.min(...countMap.keys()))
}



module.exports = router;