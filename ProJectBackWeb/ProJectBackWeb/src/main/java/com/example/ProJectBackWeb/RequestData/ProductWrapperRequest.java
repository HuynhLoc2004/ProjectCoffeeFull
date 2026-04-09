package com.example.ProJectBackWeb.RequestData;

import jakarta.validation.Valid;

import java.util.List;

public class ProductWrapperRequest {
    @Valid
    private List<ProductRequest> formProducts;

    public List<ProductRequest> getFormProducts() {
        return formProducts;
    }

    public void setFormProducts(List<ProductRequest> formProducts) {
        this.formProducts = formProducts;
    }
}