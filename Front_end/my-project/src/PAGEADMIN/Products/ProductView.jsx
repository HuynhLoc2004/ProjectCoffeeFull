import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { data, useNavigate } from "react-router-dom";
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  Filter,
  X,
  Upload,
  DollarSign,
  Tag,
  Package,
  Image as ImageIcon,
  Type,
  Layers,
  PlusCircle,
  MinusCircle,
  Camera,
  FileImage,
} from "lucide-react";
import axiosClient from "../../AxiosClient";
import { toast } from "react-toastify";

const initialProducts = [
  {
    id: 1,
    name: "Americano Đá",
    category: "americano",
    price: "45.000đ",
    priceSale: "35.000đ",
    code: "AM-001",
    picture:
      "https://images.unsplash.com/photo-1551033406-611cf9a28f67?q=80&w=200&auto=format&fit=crop",
  },
  {
    id: 2,
    name: "Espresso Đặc Biệt",
    category: "coffee",
    price: "55.000đ",
    priceSale: "45.000đ",
    code: "CO-002",
    picture:
      "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?q=80&w=200&auto=format&fit=crop",
  },
];

const ProductView = () => {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("add");
  const [editingProductId, setEditingProductId] = useState(null);
  const navigate = useNavigate();
  const [formProducts, setFormProducts] = useState([
    {
      name: "",
      price: "",
      priceSale: "",
      picture: null,
      code: "",
      category: "",
    },
  ]);

  const openAddModal = () => {
    setModalMode("add");
    setEditingProductId(null);
    setFormProducts([
      {
        name: "",
        price: "",
        priceSale: "",
        picture: null,
        code: "",
        category: "",
      },
    ]);
    setIsModalOpen(true);
  };

  const openEditModal = (product) => {
    setModalMode("edit");
    setEditingProductId(product.id);
    setFormProducts([
      {
        name: product.name,
        price: product.price,
        priceSale: product.priceSale,
        picture: product.picture,
        code: product.code,
        category: product.category,
      },
    ]);
    setIsModalOpen(true);
  };

  const handleFormChange = (index, field, value) => {
    const newFormProducts = [...formProducts];
    newFormProducts[index][field] = value;
    setFormProducts(newFormProducts);
  };

  const handleImageChange = (index, e) => {
    const file = e.target.files[0];
    if (file) {
      const newFormProducts = [...formProducts];
      newFormProducts[index].picture = file;
      setFormProducts(newFormProducts);
    }
  };

  const addMoreProductRow = () => {
    setFormProducts([
      ...formProducts,
      {
        name: "",
        price: "",
        priceSale: "",
        picture: null,
        code: "",
        category: "",
      },
    ]);
  };

  const removeProductRow = (index) => {
    if (formProducts.length > 1) {
      setFormProducts(formProducts.filter((_, i) => i !== index));
    }
  };

  const deleteProduct = (productId) => {
    axiosClient
      .delete(`/product/delete-product?productId=${productId}`, {
        withCredentials: true,
      })
      .then((res) => {
        if (res.data.statusCode === 404) {
          toast.error("Không tìm thấy sản phẩm này trong hệ thống!");
        } else {
          toast.success("Xóa sản phẩm thành công!");
          fetchProducts();
        }
      })
      .catch((err) => {
        console.error("Lỗi khi xóa sản phẩm:", err);
        toast.error("Xóa sản phẩm không thành công. Vui lòng thử lại!");
      });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Submitting products:", formProducts);
    setIsModalOpen(false);
  };

  const handleUpdateProduct = () => {
    const product = formProducts[0];
    const formdata = new FormData();
    formdata.append("id", editingProductId);
    formdata.append("name", product.name);
    formdata.append("price", product.price != "" ? Number(product.price) : 0.0);
    formdata.append(
      "sale",
      product.priceSale ? Number(product.priceSale) : 0.0,
    );
    formdata.append("category", product.category);

    if (product.picture instanceof File) {
      formdata.append("imgUpload", product.picture);
    } else if (typeof product.picture === "string") {
      formdata.append("img", product.picture);
    }

    axiosClient
      .put(`/product/update-product?code=${product.code}`, formdata, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      })
      .then((res) => {
        setIsModalOpen(false);
        fetchProducts();
      })
      .catch((err) => {
        console.log("Update failed:", err);
      });
  };

  const fetchProducts = () => {
    axiosClient
      .get("/product/get-products", {
        withCredentials: true,
      })
      .then((res) => {
        setProducts(res.data.result);
      })
      .catch((err) => {
        console.log("không call được api");
      });
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleCreateProducts = () => {
    const formdata = new FormData();
    formProducts.forEach((item, index) => {
      formdata.append(`formProducts[${index}].name`, item.name);
      formdata.append(
        `formProducts[${index}].price`,
        item.price ? Number(item.price) : 0.0,
      );
      formdata.append(
        `formProducts[${index}].priceSale`,
        item.priceSale != "" ? Number(item.priceSale) : 0.0,
      );
      formdata.append(`formProducts[${index}].picture`, item.picture);
      formdata.append(`formProducts[${index}].code`, item.code);
      formdata.append(`formProducts[${index}].category`, item.category);
    });
    axiosClient
      .post(`/product/CreateProducts`, formdata, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      })
      .then((res) => {
        console.log(res.data.result);
        setIsModalOpen(false);
        fetchProducts();
      })
      .catch((err) => {
        console.log(err);
      });
  };
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="space-y-6 relative"
    >
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-neutral-500 bg-clip-text text-transparent">
            Quản lý Sản phẩm
          </h1>
          <p className="text-neutral-500 mt-1 italic">
            Tùy chỉnh danh mục hàng hóa của bạn một cách mượt mà.
          </p>
        </div>
        <button
          onClick={openAddModal}
          className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-orange-600 text-white font-bold shadow-lg shadow-orange-600/20 hover:bg-orange-500 hover:scale-[1.02] active:scale-[0.98] transition-all group"
        >
          <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
          Thêm sản phẩm
        </button>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 flex items-center gap-3 px-4 py-3 rounded-2xl bg-neutral-900/50 border border-neutral-800 focus-within:border-orange-500/50 transition-all backdrop-blur-sm">
          <Search className="w-5 h-5 text-neutral-500" />
          <input
            type="text"
            placeholder="Tìm kiếm sản phẩm theo tên hoặc mã..."
            className="bg-transparent border-none outline-none text-sm w-full text-neutral-200"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white hover:bg-neutral-800 transition-all">
          <Filter className="w-4 h-4" />
          Bộ lọc
        </button>
      </div>

      {/* Product Table */}
      <div className="rounded-3xl bg-neutral-900 border border-neutral-800 overflow-hidden shadow-2xl shadow-black/50 backdrop-blur-md">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-neutral-800 bg-white/[0.02]">
                <th className="px-6 py-5 font-semibold text-neutral-400 text-sm">
                  Sản phẩm
                </th>
                <th className="px-6 py-5 font-semibold text-neutral-400 text-sm">
                  Mã SP
                </th>
                <th className="px-6 py-5 font-semibold text-neutral-400 text-sm">
                  Danh mục
                </th>
                <th className="px-6 py-5 font-semibold text-neutral-400 text-sm">
                  Giá gốc
                </th>
                <th className="px-6 py-5 font-semibold text-neutral-400 text-sm">
                  Giá Sale
                </th>
                <th className="px-6 py-5 font-semibold text-neutral-400 text-sm text-center">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800/50">
              <AnimatePresence mode="popLayout">
                {products
                  .filter(
                    (p) =>
                      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                      p.code.toLowerCase().includes(searchTerm.toLowerCase()),
                  )
                  .map((product) => (
                    <motion.tr
                      key={product.id || product.code}
                      layout
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0, x: -20 }}
                      className={`group transition-colors border-b border-neutral-800/50 last:border-0 ${
                        product.active === false 
                        ? "bg-black/20 opacity-40 grayscale pointer-events-none select-none" 
                        : "hover:bg-white/[0.01]"
                      }`}
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <div className="relative">
                            <div className="w-14 h-14 rounded-2xl overflow-hidden border border-neutral-800 shadow-inner group-hover:scale-105 transition-transform">
                              <img
                                src={product.picture}
                                alt={product.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            {product.active === false && (
                              <div className="absolute inset-0 bg-black/60 flex items-center justify-center rounded-2xl">
                                <X className="w-6 h-6 text-red-500/50" />
                              </div>
                            )}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <p className="font-bold text-sm text-neutral-200">
                                {product.name}
                              </p>
                              {product.active === false && (
                                <span className="px-1.5 py-0.5 rounded bg-red-500/10 text-[8px] font-black text-red-500 border border-red-500/20 uppercase tracking-tighter">
                                  Ngừng kinh doanh
                                </span>
                              )}
                            </div>
                            <p className="text-[10px] text-neutral-500 uppercase tracking-widest">
                              ID: {product.id || "N/A"}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-xs font-mono text-neutral-400 bg-neutral-800/50 px-2 py-1 rounded">
                          {product.code}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-3 py-1 rounded-full bg-orange-500/10 text-[10px] font-bold text-orange-500 border border-orange-500/20">
                          {product.category}
                        </span>
                      </td>
                      <td
                        className={`px-6 py-4 text-sm text-neutral-400 ${product.priceSale ? "line-through decoration-neutral-600" : ""}`}
                      >
                        {product.price}
                      </td>
                      <td className="px-6 py-4 font-black text-sm text-emerald-500">
                        {product.priceSale || "Không sale"}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => product.active !== false && openEditModal(product)}
                            disabled={product.active === false}
                            className={`p-2.5 rounded-xl transition-all ${
                              product.active === false 
                              ? "text-neutral-700 cursor-not-allowed" 
                              : "hover:bg-orange-500/20 hover:text-orange-400 text-neutral-500 hover:scale-110"
                            }`}
                            title={product.active === false ? "Sản phẩm đã ngừng kinh doanh" : "Chỉnh sửa"}
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => product.active !== false && deleteProduct(product.id)}
                            disabled={product.active === false}
                            className={`p-2.5 rounded-xl transition-all ${
                              product.active === false 
                              ? "text-neutral-700 cursor-not-allowed" 
                              : "hover:bg-red-500/20 hover:text-red-400 text-neutral-500 hover:scale-110"
                            }`}
                            title={product.active === false ? "Sản phẩm đã ngừng kinh doanh" : "Xóa"}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </div>

      {/* Product Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-4xl max-h-[90vh] overflow-hidden bg-neutral-900 border border-neutral-800 rounded-[32px] shadow-2xl flex flex-col"
            >
              <div className="p-6 border-b border-neutral-800 flex items-center justify-between bg-white/[0.02]">
                <div>
                  <h2 className="text-2xl font-bold">
                    {modalMode === "add"
                      ? "Thêm sản phẩm mới"
                      : "Chỉnh sửa sản phẩm"}
                  </h2>
                  <p className="text-neutral-500 text-sm">
                    Điền đầy đủ thông tin để cập nhật hệ thống.
                  </p>
                </div>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-3 hover:bg-neutral-800 rounded-2xl transition-all text-neutral-400 hover:text-white"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar">
                <form
                  id="product-form"
                  onSubmit={handleSubmit}
                  className="space-y-10"
                >
                  <AnimatePresence mode="popLayout">
                    {formProducts.map((form, index) => (
                      <motion.div
                        key={index}
                        layout
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="relative p-6 rounded-3xl bg-neutral-800/30 border border-neutral-700/50 space-y-6"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="px-3 py-1 rounded-lg bg-orange-600/20 text-orange-500 text-[10px] font-bold uppercase tracking-wider">
                            Sản phẩm #{index + 1}
                          </span>
                          {modalMode === "add" && formProducts.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeProductRow(index)}
                              className="flex items-center gap-1 text-red-400 hover:text-red-300 text-xs font-medium transition-colors"
                            >
                              <MinusCircle className="w-4 h-4" />
                              Xóa dòng này
                            </button>
                          )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {/* Product Name */}
                          <div className="space-y-2">
                            <label className="text-xs font-semibold text-neutral-400 ml-1">
                              Tên sản phẩm
                            </label>
                            <div className="relative flex items-center">
                              <Type className="absolute left-4 w-4 h-4 text-neutral-500" />
                              <input
                                required
                                type="text"
                                placeholder="VD: Americano Đá"
                                className="w-full pl-11 pr-4 py-3 rounded-xl bg-neutral-900 border border-neutral-700 focus:border-orange-500 outline-none transition-all text-sm"
                                value={form.name}
                                onChange={(e) =>
                                  handleFormChange(
                                    index,
                                    "name",
                                    e.target.value,
                                  )
                                }
                              />
                            </div>
                          </div>

                          {/* Product Code */}
                          <div className="space-y-2">
                            <label className="text-xs font-semibold text-neutral-400 ml-1">
                              Mã sản phẩm
                            </label>
                            <div className="relative flex items-center">
                              <Package className="absolute left-4 w-4 h-4 text-neutral-500" />
                              <input
                                required
                                type="text"
                                placeholder="VD: AM-001"
                                className="w-full pl-11 pr-4 py-3 rounded-xl bg-neutral-900 border border-neutral-700 focus:border-orange-500 outline-none transition-all text-sm"
                                value={form.code}
                                onChange={(e) =>
                                  handleFormChange(
                                    index,
                                    "code",
                                    e.target.value,
                                  )
                                }
                              />
                            </div>
                          </div>

                          {/* Category */}
                          <div className="space-y-2">
                            <label className="text-xs font-semibold text-neutral-400 ml-1">
                              Danh mục
                            </label>
                            <div className="relative flex items-center">
                              <Layers className="absolute left-4 w-4 h-4 text-neutral-500" />
                              <select
                                className="w-full pl-11 pr-4 py-3 rounded-xl bg-neutral-900 border border-neutral-700 focus:border-orange-500 outline-none transition-all text-sm appearance-none cursor-pointer"
                                value={form.category}
                                onChange={(e) =>
                                  handleFormChange(
                                    index,
                                    "category",
                                    e.target.value,
                                  )
                                }
                              >
                                <option value="">Chọn danh mục</option>
                                <option value="americano">americano</option>
                                <option value="coffee">coffee</option>
                                <option value="milk-tea">milk-tea</option>
                                <option value="cake">cake</option>
                              </select>
                              <Filter className="absolute right-4 w-4 h-4 text-neutral-500 pointer-events-none" />
                            </div>
                          </div>

                          {/* Image Selector (No Preview) */}
                          <div className="space-y-2">
                            <label className="text-xs font-semibold text-neutral-400 ml-1">
                              Hình ảnh
                            </label>
                            <div
                              onClick={() =>
                                document
                                  .getElementById(`file-input-${index}`)
                                  .click()
                              }
                              className="w-full px-4 py-3 rounded-xl bg-neutral-900 border border-neutral-700 hover:border-orange-500/50 transition-all cursor-pointer flex items-center justify-between group"
                            >
                              <div className="flex items-center gap-3 overflow-hidden">
                                <Camera className="w-5 h-5 text-neutral-500 group-hover:text-orange-500 flex-shrink-0" />
                                <span className="text-sm text-neutral-400 truncate">
                                  {form.picture
                                    ? typeof form.picture === "string"
                                      ? "Sử dụng ảnh hiện tại"
                                      : form.picture.name
                                    : "Chọn ảnh từ thư viện"}
                                </span>
                              </div>
                              <Upload className="w-4 h-4 text-neutral-600 flex-shrink-0" />
                              <input
                                id={`file-input-${index}`}
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(e) => handleImageChange(index, e)}
                              />
                            </div>
                          </div>

                          {/* Price */}
                          <div className="space-y-2">
                            <label className="text-xs font-semibold text-neutral-400 ml-1">
                              Giá gốc
                            </label>
                            <div className="relative flex items-center">
                              <DollarSign className="absolute left-4 w-4 h-4 text-neutral-500" />
                              <input
                                required
                                type="text"
                                placeholder="0"
                                className="w-full pl-11 pr-4 py-3 rounded-xl bg-neutral-900 border border-neutral-700 focus:border-orange-500 outline-none transition-all text-sm"
                                value={form.price}
                                onChange={(e) =>
                                  handleFormChange(
                                    index,
                                    "price",
                                    e.target.value,
                                  )
                                }
                              />
                            </div>
                          </div>

                          {/* Sale Price */}
                          <div className="space-y-2">
                            <label className="text-xs font-semibold text-neutral-400 ml-1">
                              Giá Sale
                            </label>
                            <div className="relative flex items-center">
                              <Tag className="absolute left-4 w-4 h-4 text-neutral-500" />
                              <input
                                type="text"
                                placeholder="0"
                                className="w-full pl-11 pr-4 py-3 rounded-xl bg-neutral-900 border border-neutral-700 focus:border-orange-500 outline-none transition-all text-sm"
                                value={form.priceSale}
                                onChange={(e) =>
                                  handleFormChange(
                                    index,
                                    "priceSale",
                                    e.target.value,
                                  )
                                }
                              />
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>

                  {modalMode === "add" && (
                    <motion.button
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      type="button"
                      onClick={addMoreProductRow}
                      className="w-full py-4 border-2 border-dashed border-neutral-700 rounded-3xl text-neutral-500 hover:text-orange-500 hover:border-orange-500/50 hover:bg-orange-500/5 transition-all flex items-center justify-center gap-2 font-bold text-sm"
                    >
                      <PlusCircle className="w-5 h-5" />
                      Thêm sản phẩm khác
                    </motion.button>
                  )}
                </form>
              </div>

              <div className="p-6 border-t border-neutral-800 bg-white/[0.02] flex items-center justify-end gap-4">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="px-6 py-3 rounded-2xl bg-neutral-800 text-neutral-400 font-bold hover:bg-neutral-700 transition-all text-sm"
                >
                  Hủy bỏ
                </button>
                {modalMode === "add" ? (
                  <button
                    form="product-form"
                    type="submit"
                    className="px-8 py-3 rounded-2xl bg-orange-600 text-white font-bold shadow-lg shadow-orange-600/20 hover:bg-orange-500 hover:scale-[1.02] active:scale-[0.98] transition-all text-sm"
                    onClick={handleCreateProducts}
                  >
                    Xác nhận thêm ({formProducts.length})
                  </button>
                ) : (
                  <button
                    type="button"
                    className="px-8 py-3 rounded-2xl bg-blue-600 text-white font-bold shadow-lg shadow-blue-600/20 hover:bg-blue-500 hover:scale-[1.02] active:scale-[0.98] transition-all text-sm"
                    onClick={handleUpdateProduct}
                  >
                    Lưu thay đổi
                  </button>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <style
        dangerouslySetInnerHTML={{
          __html: `
                .custom-scrollbar::-webkit-scrollbar {
                    width: 6px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #262626;
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: #404040;
                }
            `,
        }}
      />
    </motion.div>
  );
};

export default ProductView;
