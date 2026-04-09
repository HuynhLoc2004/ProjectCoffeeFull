package com.example.ProJectBackWeb.Service;
import com.cloudinary.Cloudinary;
import com.example.ProJectBackWeb.DTO.ProductDTO;
import com.example.ProJectBackWeb.EntityModel.ProductEntity;
import com.example.ProJectBackWeb.EntityModel.SizeEntity;
import com.example.ProJectBackWeb.EntityModel.ToppingEntity;
import com.example.ProJectBackWeb.EnumStatus.HttpStatusEnum;
import com.example.ProJectBackWeb.Exception.Appexception;
import com.example.ProJectBackWeb.Mapper.MapperObject;
import com.example.ProJectBackWeb.Reponsitory.ProductRepository;
import com.example.ProJectBackWeb.Reponsitory.SizeRepository;
import com.example.ProJectBackWeb.Reponsitory.ToppingRepository;
import com.example.ProJectBackWeb.RequestData.ProductRequest;
import com.example.ProJectBackWeb.RequestData.ProductRquest;
import com.example.ProJectBackWeb.RequestData.ProductWrapperRequest;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.gson.Gson;
import jakarta.transaction.Transactional;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.*;
import java.util.concurrent.TimeUnit;
import java.util.stream.Collectors;

@Service
@Slf4j
public class ProductService {
    private final ProductRepository productRepository;
    private final MapperObject mapperObject;
    private final RedisTemplate<String, String> redisTemplate;
    private final SizeRepository sizeRepository;
    private final ToppingRepository toppingRepository;
    private final Gson gson;
    private final ObjectMapper objectMapper;
    private final Cloudinary cloudinary;
    public ProductService(ProductRepository productRepository, MapperObject mapperObject, RedisTemplate<String, String> redisTemplate, SizeRepository sizeRepository, ToppingRepository toppingRepository, Gson gson, ObjectMapper objectMapper, Cloudinary cloudinary) {
        this.productRepository = productRepository;
        this.mapperObject = mapperObject;
        this.redisTemplate = redisTemplate;
        this.sizeRepository = sizeRepository;
        this.toppingRepository = toppingRepository;
        this.gson = gson;
        this.objectMapper = objectMapper;
        this.cloudinary = cloudinary;
    }

    @Transactional
    public ProductEntity Createproduct(ProductRquest productRquest) {
        List<SizeEntity> sizeEntityList = sizeRepository.FindBysize(List.of("S", "M", "L"));
        if (productRepository.existsByCode(productRquest.getCode())) {
            throw new Appexception(HttpStatusEnum.BAD_REQUEST.getCode(), "Product existed", productRquest);
        }
        ProductEntity productEntity = mapperObject.toProductEntity(productRquest);
        productEntity.setSizeEntitySet(sizeEntityList);
        return productRepository.save(productEntity);
    }

    @Transactional
    public List<ProductEntity> CreateProducts(List<ProductRquest> productRquestList) {
        List<SizeEntity> sizeEntityList = sizeRepository.FindBysize(List.of("S", "M", "L"));
        List<ToppingEntity> toppingEntities = this.toppingRepository.findAll();
        productRquestList.forEach(item -> {
            if (!productRepository.existsByCode(item.getCode())) {
                ProductEntity productEntity = mapperObject.toProductEntity(item);
                if (item.getCategory().equalsIgnoreCase("cake")) {
                    productRepository.save(productEntity);
                } else {
                    productEntity = mapperObject.toProductEntity(item);
                    productEntity.setSizeEntitySet(sizeEntityList);
                    productEntity.setToppingEntities(toppingEntities);
                    productRepository.save(productEntity);
                }

            } else {
                throw new Appexception(HttpStatusEnum.BAD_REQUEST.getCode(), "Product existed", item);
            }
        });
        List<ProductEntity> productEntities = productRquestList.stream().map(item -> {
            ProductEntity productEntity = new ProductEntity();
            productEntity = mapperObject.toProductEntity(item);
            productEntity.setSizeEntitySet(sizeEntityList);
            return productEntity;
        }).collect(Collectors.toList());

        return productEntities;
    }

    public List<ProductEntity> getTopProducts(int page, int limit) {
        Pageable pageable = PageRequest.of(page, limit, Sort.by("id").descending());
        Page<ProductEntity> productEntities = this.productRepository.findAll(pageable);
        return productEntities.getContent().stream().map(item -> {
            item.setImg( item.getImg());
            return item;
        }).collect(Collectors.toList());
    }

    public List<ProductEntity> getProductbyCategory(String category) {
        String value = redisTemplate.opsForValue().get("productsby" + category);
        if (value == null) {
            List<ProductEntity> productEntities = this.productRepository.findProductByCategory(category);
            productEntities = productEntities.stream().map(item -> {
                item.setImg( item.getImg());
                return item;
            }).collect(Collectors.toList());
            redisTemplate.opsForValue().set("productsby" + category, gson.toJson(productEntities), 5, TimeUnit.MINUTES);
            return productEntities;
        }

        return gson.fromJson(value, List.class);

    }

    public List<ProductEntity> getTopProductbyCategory(int size, String category) {
        String value = redisTemplate.opsForValue().get("ListproductsBy" + category);
        if (value == null) {
            List<ProductEntity> productEntities = this.productRepository.findTopProductbyCategory(size, category);
            productEntities = productEntities.stream().map(item -> {
                item.setImg( item.getImg());
                return item;
            }).collect(Collectors.toList());
            redisTemplate.opsForValue().set("ListproductsBy" + category, gson.toJson(productEntities), 5, TimeUnit.MINUTES);
            return productEntities;
        }
        return gson.fromJson(value, List.class);
    }


    public ProductEntity getProductBycategoryById(int id) {
        String productJson = this.redisTemplate.opsForValue().get("productId" + id);
        if (productJson == null) {
            ProductEntity productEntity = this.productRepository.FindProductByid(id);
            productEntity.getToppingEntities();
            productEntity.setImg( productEntity.getImg());
            this.redisTemplate.opsForValue().set("productId" + id, this.gson.toJson(productEntity), 5, TimeUnit.MINUTES);
            return productEntity;
        }
        return this.gson.fromJson(productJson, ProductEntity.class);
    }

    public List<ProductEntity> getTopProductBySearch(int top, String searchname) {
        String value = redisTemplate.opsForValue().get("TOPPRODUCTBYSEARCH_" + searchname);
        if (value == null) {
            List<ProductEntity> productEntities = this.productRepository.findTopProductBySearchName(top, searchname , true);
            productEntities = productEntities.stream().map((item) -> {
                item.setImg(item.getImg());
                return item;
            }).collect(Collectors.toList());
            redisTemplate.opsForValue().set("TOPPRODUCTBYSEARCH_" + searchname, gson.toJson(productEntities), 5, TimeUnit.MINUTES);
            return productEntities;
        } else {
            return gson.fromJson(value, List.class);
        }
    }


    private String downloadImgProduct(MultipartFile fileimg) throws IOException {
        String randomName = UUID.randomUUID().toString();

        Map<String , Object> params  = new HashMap<>();
        params.put("folder" , "uploads");
        params.put("use_filename" , true);
        params.put("unique_filename", false);
        params.put("public_id" , randomName);

        Map uploadResult = this.cloudinary.uploader().upload(fileimg.getBytes() , params);
        return uploadResult.get("secure_url").toString();
    }

    @Transactional
    @PreAuthorize("hasRole('ADMIN')")
    public Long Createproduct(ProductWrapperRequest productWrapperRequest) {
        List<SizeEntity> sizeEntityList = sizeRepository.FindBysize(List.of("S", "M", "L"));
        List<ToppingEntity> toppingEntities = this.toppingRepository.findAll();
        productWrapperRequest.getFormProducts().forEach(item -> {
            if (!productRepository.existsByCode(item.getCode())) {
                ProductEntity productEntity = mapperObject.toProductEntity(item);
                if (item.getCategory().equalsIgnoreCase("cake")) {

                    try {
                        productEntity.setImg(this.downloadImgProduct(item.getImgUpload()));
                        productRepository.save(productEntity);
                    } catch (IOException e) {
                        throw new RuntimeException(e);
                    }
                } else {
                    productEntity.setSizeEntitySet(sizeEntityList);
                    productEntity.setToppingEntities(toppingEntities);
                    try {
                        productEntity.setImg(this.downloadImgProduct(item.getImgUpload()));
                        productRepository.save(productEntity);
                    } catch (IOException e) {
                        throw new RuntimeException(e);
                    }
                }

            } else {
                throw new Appexception(HttpStatusEnum.BAD_REQUEST.getCode(), "Product existed", item.getCode());
            }
        });
        return (long) productWrapperRequest.getFormProducts().size();
    }

    @PreAuthorize("hasRole('ADMIN')")
    public List<ProductDTO> getProducts() throws JsonProcessingException {
        String products = this.redisTemplate.opsForValue().get("products");
        if (products == null) {
            List<ProductEntity> productEntities = this.productRepository.get_products();
            List<ProductDTO> productDTOS = productEntities.stream().map(item -> {
                ProductDTO productDTO = new ProductDTO();
                productDTO.setName(item.getName());
                productDTO.setId(item.getId());
                productDTO.setCode(item.getCode());
                productDTO.setPrice(item.getPrice().longValue());
                productDTO.setPriceSale(item.getSale() != null ? Long.valueOf(item.getSale()) : null);
                productDTO.setCategory(item.getCategory());
                productDTO.setActive(item.isActive());
                productDTO.setPicture( item.getImg());
                return productDTO;
            }).collect(Collectors.toList());
            this.redisTemplate.opsForValue().set("products", this.objectMapper.writeValueAsString(productEntities), 5, TimeUnit.MINUTES);
            return productDTOS;
        }

        List<ProductEntity> productEntities = this.objectMapper.readValue(products, new TypeReference<List<ProductEntity>>() {
        });
        List<ProductDTO> productDTOS = productEntities.stream().map(item -> {
            ProductDTO productDTO = new ProductDTO();
            productDTO.setName(item.getName());
            productDTO.setCode(item.getCode());
            productDTO.setId(item.getId());
            productDTO.setActive(item.isActive());
            productDTO.setPrice(item.getPrice().longValue());
            productDTO.setPriceSale(item.getSale() != null ? Long.valueOf(item.getSale()) : null);
            productDTO.setCategory(item.getCategory());
            productDTO.setPicture( item.getImg());
            return productDTO;
        }).collect(Collectors.toList());
        return productDTOS;
    }


    @PreAuthorize("hasRole('ADMIN')")
    @Transactional
    public Long updateProductByCode(ProductRequest productRequest, String code) throws IOException {
        ProductEntity productEntity = this.productRepository.findProductByCode(code).orElseThrow(()->{
            throw new Appexception(HttpStatusEnum.NOT_FOUND.getCode(),  "not found product by code");
        });

        if (productRequest.getImgUpload() != null) {
            String urlimg = this.downloadImgProduct(productRequest.getImgUpload());
            productEntity.setImg(urlimg);
        }
            productEntity.setSale(productRequest.getSale());
        if (productRequest.getCategory() != null) {
            productEntity.setCategory(productRequest.getCategory());
        }
        if (productRequest.getCode() != null) {
            productEntity.setCode(productEntity.getCode());
        }
        productEntity.setPrice(productRequest
                .getPrice());
        if(productRequest.getName() != null){
            productEntity.setName(productRequest.getName());
        }
        this.redisTemplate.delete("products");
        this.redisTemplate.delete("productsby"+productEntity.getCategory());
        this.redisTemplate.delete("ListproductsBy" + productEntity.getCategory());
        this.redisTemplate.delete("productsby"+productEntity.getCategory());
        return (long) productEntity.getId();
    }

    @Transactional
    public void deleteProductById(Long productId){
      ProductEntity productEntity  =  this.productRepository.findById(productId.intValue()).orElseThrow(()->{
          throw new Appexception(HttpStatusEnum.NOT_FOUND.getCode(),  "not found product");
      });
      productEntity.setActive(false);
      this.redisTemplate.delete("products");
      this.redisTemplate.delete("productId" + productEntity.getId());
      this.redisTemplate.delete("productsby"+productEntity.getCategory());
      this.redisTemplate.delete("ListproductsBy" + productEntity.getCategory());

    }
}
