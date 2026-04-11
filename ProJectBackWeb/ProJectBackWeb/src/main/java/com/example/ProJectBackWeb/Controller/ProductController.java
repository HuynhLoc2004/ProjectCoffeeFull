package com.example.ProJectBackWeb.Controller;

import com.example.ProJectBackWeb.DTO.ProductDTO;
import com.example.ProJectBackWeb.EntityModel.ProductEntity;
import com.example.ProJectBackWeb.EnumStatus.HttpStatusEnum;
import com.example.ProJectBackWeb.RequestData.ProductRequest;
import com.example.ProJectBackWeb.RequestData.ProductRquest;
import com.example.ProJectBackWeb.RequestData.ProductWrapperRequest;
import com.example.ProJectBackWeb.ResponseData.ResponseData;
import com.example.ProJectBackWeb.Service.ProductService;
import com.fasterxml.jackson.core.JsonProcessingException;
import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import okhttp3.Response;
import org.springframework.data.repository.query.Param;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.lang.reflect.Array;
import java.util.ArrayList;
import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/product")
public class ProductController {
    private final ProductService productService;

    public ProductController(ProductService productService) {
        this.productService = productService;
    }
       @PostMapping("/create")
       public ResponseData<Integer> createProduct(@RequestBody @Valid ProductRquest productRquest){
         this.productService.Createproduct(productRquest);
            return new ResponseData<>(HttpStatusEnum.CREATED.getCode() , "Create product successfully " , 1);
       }
       @PostMapping("/createProducts")
        public ResponseData<Integer> createProducts(@RequestBody List<ProductRquest> productRquestList){
         this.productService.CreateProducts(productRquestList);
            return new ResponseData<>(HttpStatusEnum.CREATED.getCode(), "Create products list succcesfully "  , 1);
        }


        @GetMapping("/getTopProductsPage")
        public ResponseData<List<ProductEntity>> getTopProducts(@RequestParam(defaultValue = "page") int page ,
                                                                @RequestParam(defaultValue = "size") int size){
            return new ResponseData<>(HttpStatusEnum.OK.getCode(), "get "+ size + " products" , this.productService.getTopProducts(page,size));
        }
        @GetMapping("/getProducts")
        public ResponseData<List<ProductEntity>> getProducts(@RequestParam(defaultValue = "category") String category){
            return new ResponseData<>(HttpStatusEnum.OK.getCode(), HttpStatusEnum.OK.getMessage() , this.productService.getProductbyCategory(category));
        }

        @GetMapping("/getTopProductByCategory")
        public ResponseData<List<ProductEntity>> getTopProductsBycategory(@RequestParam(defaultValue = "size") int size , @RequestParam(defaultValue = "category") String category){
                return new ResponseData<>(HttpStatusEnum.OK.getCode(), HttpStatusEnum.OK.getMessage() , this.productService.getTopProductbyCategory(size , category));
        }
        @GetMapping("/getTOpProductbySearch")
        public ResponseData<List<ProductEntity>> getopProductbySearch(@RequestParam(defaultValue = "top") int top ,@RequestParam(defaultValue = "searchname") String searchname){
            return  new ResponseData<>(HttpStatusEnum.OK.getCode(), HttpStatusEnum.OK.getMessage() , this.productService.getTopProductBySearch(top , searchname));
        }
        @GetMapping("/getProductById")
        public ResponseData<ProductEntity> getProductByid(@RequestParam(defaultValue = "id") int id) {
            return new ResponseData<>(HttpStatusEnum.OK.getCode(), "get product succesfully" , this.productService.getProductBycategoryById(id));
        }

    @PostMapping("/CreateProducts")
    public ResponseData<Long> create_product(@ModelAttribute  ProductWrapperRequest productWrapperRequest){
        return new ResponseData<>(HttpStatusEnum.OK.getCode(), "create products successfully" , this.productService.Createproduct(productWrapperRequest));
    }
    @GetMapping("/get-products")
    public ResponseData<List<ProductDTO>> getProducts() throws JsonProcessingException {
        return new ResponseData<>(HttpStatusEnum.OK.getCode() , "get products successfully "  , this.productService.getProducts());
    }
    @PutMapping("/update-product")
    public ResponseData<Long> updateProductByCode(@ModelAttribute ProductRequest productRequest,@RequestParam("code") String code) throws IOException {

        return new ResponseData<>(HttpStatusEnum.OK.getCode(), "update product by code succesfully" ,this.productService.updateProductByCode(productRequest , code));
    }

    @DeleteMapping("/delete-product")
    public ResponseData<Boolean> deleteProductById(@RequestParam("productId") Long productId){
        this.productService.deleteProductById(productId);
        return new ResponseData<>(HttpStatusEnum.NO_CONTENT.getCode(),  "delete product successfully"  );
    }

}
