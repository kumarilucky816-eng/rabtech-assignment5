const BASE_URL = "https://fakestoreapi.com";

async function fetchProducts() {
  const res = await fetch(BASE_URL + "/products");
  if (!res.ok) throw new Error("Products load nahi ho paye");
  return await res.json();
}

async function fetchCategories() {
  const res = await fetch(BASE_URL + "/products/categories");
  if (!res.ok) throw new Error("Categories load nahi ho paayi");
  return await res.json();
}