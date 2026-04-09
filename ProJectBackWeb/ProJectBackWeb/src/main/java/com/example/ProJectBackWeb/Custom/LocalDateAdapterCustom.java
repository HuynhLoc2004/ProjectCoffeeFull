package com.example.ProJectBackWeb.Custom;

import com.google.gson.*;
import java.lang.reflect.Type;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;

public class LocalDateAdapterCustom implements JsonSerializer<LocalDate>, JsonDeserializer<LocalDate> {

    private static final DateTimeFormatter F =
            DateTimeFormatter.ofPattern("dd/MM/yyyy");

    @Override
    public JsonElement serialize(
            LocalDate src, Type typeOfSrc, JsonSerializationContext ctx
    ) {
        return src == null ? JsonNull.INSTANCE : new JsonPrimitive(src.format(F));
    }

    @Override
    public LocalDate deserialize(
            JsonElement json, Type typeOfT, JsonDeserializationContext ctx
    ) {
        return json == null || json.isJsonNull()
                ? null
                : LocalDate.parse(json.getAsString(), F);
    }
}
