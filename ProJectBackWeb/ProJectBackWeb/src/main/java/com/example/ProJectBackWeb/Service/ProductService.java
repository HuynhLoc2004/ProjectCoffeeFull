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
import com.google.gson.reflect.TypeToken;
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
    private static final String ADMIN_PRODUCTS_CACHE_KEY = "products:v2";
    private static final Set<String> PUBLIC_CATEGORIES = Set.of("coffee", "milk-tea", "cake", "americano");
    private static final int MAX_PAGE_SIZE = 50;
    private static final int MAX_PAGE_NUMBER = 10_000;
    private static final int MAX_SEARCH_SIZE = 20;
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
        int safePage = Math.clamp(page, 0, MAX_PAGE_NUMBER);
        int safeLimit = Math.clamp(limit, 1, MAX_PAGE_SIZE);
        Pageable pageable = PageRequest.of(safePage, safeLimit, Sort.by("id").descending());
        Page<ProductEntity> productEntities = this.productRepository.findAll(pageable);
        return productEntities.getContent().stream().map(item -> {
            item.setImg( item.getImg());
            return item;
        }).collect(Collectors.toList());
    }

    public List<ProductEntity> getProductbyCategory(String category) {
        String safeCategory = normalizeCategory(category);
        String value = redisTemplate.opsForValue().get("productsby:" + safeCategory);
        if (value == null) {
            List<ProductEntity> productEntities = this.productRepository.findByCategoryAndActiveTrueOrderByIdDesc(safeCategory);
            productEntities = productEntities.stream().map(item -> {
                item.setImg( item.getImg());
                return item;
            }).collect(Collectors.toList());
            redisTemplate.opsForValue().set("productsby:" + safeCategory, gson.toJson(productEntities), 5, TimeUnit.MINUTES);
            return productEntities;
        }

        return gson.fromJson(value, new TypeToken<List<ProductEntity>>() {}.getType());

    }

    public List<ProductEntity> getPublicProducts() {
        String cacheKey = "products:public:all";
        String value = redisTemplate.opsForValue().get(cacheKey);
        if (value != null) {
            return gson.fromJson(value, new TypeToken<List<ProductEntity>>() {}.getType());
        }
        List<ProductEntity> products = this.productRepository.findByActiveTrueOrderByIdDesc();
        redisTemplate.opsForValue().set(cacheKey, gson.toJson(products), 5, TimeUnit.MINUTES);
        return products;
    }

    public List<ProductEntity> getTopProductbyCategory(int size, String category) {
        int safeSize = Math.clamp(size, 1, MAX_PAGE_SIZE);
        String safeCategory = normalizeCategory(category);
        String cacheKey = "products:top:" + safeCategory + ":" + safeSize;
        String value = redisTemplate.opsForValue().get(cacheKey);
        if (value == null) {
            List<ProductEntity> productEntities = this.productRepository.findByCategoryAndActiveTrue(
                    safeCategory,
                    PageRequest.of(0, safeSize, Sort.by("id").descending())
            );
            productEntities = productEntities.stream().map(item -> {
                item.setImg( item.getImg());
                return item;
            }).collect(Collectors.toList());
            redisTemplate.opsForValue().set(cacheKey, gson.toJson(productEntities), 5, TimeUnit.MINUTES);
            return productEntities;
        }
        return gson.fromJson(value, new TypeToken<List<ProductEntity>>() {}.getType());
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
        int safeTop = Math.clamp(top, 1, MAX_SEARCH_SIZE);
        String normalizedSearch = normalizeSearch(searchname);
        String cacheKey = "products:search:" + normalizedSearch + ":" + safeTop;
        String value = redisTemplate.opsForValue().get(cacheKey);
        if (value == null) {
            List<ProductEntity> productEntities = this.productRepository
                    .findByNameContainingIgnoreCaseAndActiveTrueOrderByIdDesc(
                            normalizedSearch,
                            PageRequest.of(0, safeTop)
                    );
            productEntities = productEntities.stream().map((item) -> {
                item.setImg(item.getImg());
                return item;
            }).collect(Collectors.toList());
            redisTemplate.opsForValue().set(cacheKey, gson.toJson(productEntities), 5, TimeUnit.MINUTES);
            return productEntities;
        } else {
            return gson.fromJson(value, new TypeToken<List<ProductEntity>>() {}.getType());
        }
    }

    private String normalizeCategory(String category) {
        String normalized = category == null ? "" : category.trim().toLowerCase(Locale.ROOT);
        if (!PUBLIC_CATEGORIES.contains(normalized)) {
            throw new Appexception(HttpStatusEnum.BAD_REQUEST.getCode(), "Danh mục sản phẩm không hợp lệ");
        }
        return normalized;
    }

    private String normalizeSearch(String searchName) {
        String normalized = searchName == null ? "" : searchName.trim().toLowerCase(Locale.ROOT);
        if (normalized.isBlank() || normalized.length() > 100) {
            throw new Appexception(HttpStatusEnum.BAD_REQUEST.getCode(), "Từ khóa tìm kiếm phải từ 1 đến 100 ký tự");
        }
        return normalized;
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
        String products = this.redisTemplate.opsForValue().get(ADMIN_PRODUCTS_CACHE_KEY);
        if (products == null) {
            List<ProductEntity> productEntities = this.productRepository.get_products();
            List<ProductDTO> productDTOS = toProductDtos(productEntities);
            this.redisTemplate.opsForValue().set(ADMIN_PRODUCTS_CACHE_KEY, this.objectMapper.writeValueAsString(productDTOS), 5, TimeUnit.MINUTES);
            return productDTOS;
        }

        return this.objectMapper.readValue(products, new TypeReference<List<ProductDTO>>() {
        });
    }

    private List<ProductDTO> toProductDtos(List<ProductEntity> productEntities) {
        return productEntities.stream().map(item -> {
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
            productEntity.setCode(productRequest.getCode());
        }
        productEntity.setPrice(productRequest
                .getPrice());
        if(productRequest.getName() != null){
            productEntity.setName(productRequest.getName());
        }
        this.redisTemplate.delete(ADMIN_PRODUCTS_CACHE_KEY);
        this.redisTemplate.delete("products:public:all");
        this.redisTemplate.delete("productsby:" + productEntity.getCategory());
        return (long) productEntity.getId();
    }

    @Transactional
    public void deleteProductById(Long productId){
      ProductEntity productEntity  =  this.productRepository.findById(productId.intValue()).orElseThrow(()->{
          throw new Appexception(HttpStatusEnum.NOT_FOUND.getCode(),  "not found product");
      });
      productEntity.setActive(false);
      this.redisTemplate.delete(ADMIN_PRODUCTS_CACHE_KEY);
      this.redisTemplate.delete("products:public:all");
      this.redisTemplate.delete("productId" + productEntity.getId());
      this.redisTemplate.delete("productsby:" + productEntity.getCategory());

    }
}
