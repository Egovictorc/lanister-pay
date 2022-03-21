const FeeConfig = require("../services/Fee");

// {FEE-ID} {FEE-CURRENCY} {FEE-LOCALE} {FEE-ENTITY}({ENTITY-PROPERTY}) : APPLY {FEE-TYPE} {FEE-VALUE}
// FEE configuration spec sample
const feeConfig = "LNPY1221 NGN * *(*) : APPLY PERC 1.4\nLPY1222 NGN INTL CREDIT-CARD(VISA) : APPLY PERC 5.0\nLNPY1223 NGN LOCL CREDIT-CARD(*) : APPLY PERC 5.0";
const feeConfig1 = "LNPY1221 NGN * *(*) : APPLY PERC 1.4";
const feeConfig2 = "LPY1222 NGN INTL CREDIT-CARD(VISA) : APPLY PERC 5.0";
const feeConfig3 = "LNPY1223 NGN LOCL CREDIT-CARD(*) : APPLY PERC 5.0";

const parseFeeConfig = (req, res, next) => {
    const { FeeConfigurationSpec: feeConfig } = req.body;
    let feeSpec = {};
    try {
        // extract various fee specs
        const feeConfigArr = feeConfig.split("\n");
        for (const spec of feeConfigArr) {
            // remove illegal characters from config specs
            let trimmedConfig = trimConfig(spec);

            const config = trimmedConfig.split(" ");

            const configObj = new FeeConfig(config[0], config[1], config[2], config[3], config[4], config[5], config[6]);
            feeSpec[configObj.id] = configObj
            // console.log("aptConfig ", aptConfig);
            // feeSpec.push(configObj)
        }
        req.feeConfig = feeSpec;

        next();
    } catch (error) {
        const statusCode = error.statusCode ? error.statusCode : 500;
        res.status(statusCode).json({
            message: "error parsing fee configuration spec " + error.message
        })
    }
}

// remove illegal characters from config specs
function trimConfig(config) {
    return config.replace(" : ", " ").replace("(", " ").replace(")", "").replace(" APPLY", "")
}

// get most apt fee configuration
function getAptConfig(feeConfig) {
    const feeConfigArr = feeConfig.split("\n")
    let countMap = new Map();
    for (const spec of feeConfigArr) {
        let count = (spec.match(/\*/g) || []).length;
        countMap.set(count, spec);
    }
    return countMap.get(Math.min(...countMap.keys()))
}

module.exports = {
    parseFeeConfig
}