class FeeConfig {
    constructor(id, currency, locale, entity, entityProp, type, value) {
        this.id = id;
        this.currency = currency;
        this.locale = locale;
        this.entity = entity;
        this.entityProp = entityProp;
        this.type = type;
        this.value = value;
    }
}

module.exports = FeeConfig;