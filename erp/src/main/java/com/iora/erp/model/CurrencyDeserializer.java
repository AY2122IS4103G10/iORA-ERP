package com.iora.erp.model;

import java.io.IOException;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.DeserializationContext;
import com.fasterxml.jackson.databind.KeyDeserializer;

public class CurrencyDeserializer extends KeyDeserializer {
    @Override
    public Currency deserializeKey(
            String key,
            DeserializationContext ctxt) throws IOException,
            JsonProcessingException {
        return new Currency(key);
    }
}
