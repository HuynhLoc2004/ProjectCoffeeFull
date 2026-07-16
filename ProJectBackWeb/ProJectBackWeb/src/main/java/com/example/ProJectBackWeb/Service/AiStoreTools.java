package com.example.ProJectBackWeb.Service;

import com.example.ProJectBackWeb.EntityModel.ProductEntity;
import com.example.ProJectBackWeb.EnumStatus.OrderStatus;
import com.example.ProJectBackWeb.Reponsitory.OrderDetailsRepository;
import com.example.ProJectBackWeb.Reponsitory.ProductRepository;
import org.springframework.ai.tool.annotation.Tool;
import org.springframework.ai.tool.annotation.ToolParam;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Service
@Transactional(readOnly = true)
public class AiStoreTools {
    private final ProductRepository productRepository;
    private final OrderDetailsRepository orderDetailsRepository;

    @Value("${store.owner:Huỳnh Tấn Lộc}") private String owner;
    @Value("${store.phone:0977958350}") private String phone;
    @Value("${store.address:08 Nguyễn Thị Nhu, Tân Thạnh Đông, Củ Chi, TP. Hồ Chí Minh}") private String address;

    public AiStoreTools(ProductRepository productRepository, OrderDetailsRepository orderDetailsRepository) {
        this.productRepository = productRepository;
        this.orderDetailsRepository = orderDetailsRepository;
    }

    @Tool(description = "Lấy số lượng món đang mở bán và số lượng theo từng danh mục. Dùng khi khách hỏi menu có bao nhiêu sản phẩm hoặc bao nhiêu món cà phê, trà sữa, bánh.")
    public MenuSummary getMenuSummary() {
        List<ProductEntity> products = productRepository.findByActiveTrueOrderByIdDesc();
        Map<String, Long> byCategory = new LinkedHashMap<>();
        products.forEach(product -> byCategory.merge(product.getCategory(), 1L, Long::sum));
        return new MenuSummary(products.size(), byCategory,
                "Đây là số món đang mở bán, không phải số lượng tồn kho.");
    }

    @Tool(description = "Tìm tối đa 8 món đang mở bán theo tên và trả giá hiện tại. Dùng để kiểm tra quán có món khách nhắc tới hay không và tư vấn giá chính xác.")
    public List<ProductInfo> searchProducts(
            @ToolParam(description = "Tên hoặc một phần tên món bằng tiếng Việt, ví dụ bạc xỉu, trà sữa") String keyword) {
        if (keyword == null || keyword.isBlank()) return List.of();
        return productRepository
                .findByNameContainingIgnoreCaseAndActiveTrueOrderByIdDesc(keyword.trim(), PageRequest.of(0, 8))
                .stream().map(this::toProductInfo).toList();
    }

    @Tool(description = "Lấy danh sách món bán chạy chính xác dựa trên tổng số lượng trong các đơn đã thanh toán PAID. Dùng khi khách hỏi món bán chạy, phổ biến hoặc được mua nhiều nhất.")
    public List<BestSellerInfo> getBestSellingProducts(
            @ToolParam(description = "Số món muốn lấy, từ 1 đến 10") int limit) {
        int safeLimit = Math.max(1, Math.min(limit, 10));
        return orderDetailsRepository
                .findBestSellingProducts(OrderStatus.PAID.toString(), PageRequest.of(0, safeLimit))
                .stream()
                .map(row -> new BestSellerInfo((String) row[0], ((Number) row[1]).longValue()))
                .toList();
    }

    @Tool(description = "Lấy thông tin chính thức của The Coffee Chill gồm chủ cửa hàng, số điện thoại, địa chỉ và giờ mở cửa.")
    public StoreInfo getStoreInfo() {
        return new StoreInfo("The Coffee Chill", owner, phone, address, "07:00 - 22:00, Thứ 2 đến Chủ Nhật");
    }

    private ProductInfo toProductInfo(ProductEntity product) {
        double currentPrice = product.getSale() == null ? product.getPrice() : product.getSale();
        return new ProductInfo(product.getId(), product.getName(), product.getCategory(), currentPrice,
                product.getSale() != null, product.isActive());
    }

    public record MenuSummary(int activeProductCount, Map<String, Long> countByCategory, String note) {}
    public record ProductInfo(int id, String name, String category, double currentPrice, boolean onSale, boolean available) {}
    public record BestSellerInfo(String productName, long paidQuantity) {}
    public record StoreInfo(String storeName, String owner, String phone, String address, String openingHours) {}
}
